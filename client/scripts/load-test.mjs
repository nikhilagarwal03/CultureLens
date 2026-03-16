import autocannon from "autocannon";

const baseUrl = process.env.LOAD_TEST_BASE_URL || "http://127.0.0.1:3000";

const scenarios = [
  {
    name: "health",
    path: "/api/health",
    method: "GET",
    duration: 20,
    connections: 1,
    overallRate: 2,
    forwardedFor: "10.40.0.10",
    threshold: {
      p95: 2500,
      errorRate: 0.01,
    },
  },
  {
    name: "languages",
    path: "/api/languages",
    method: "GET",
    duration: 20,
    connections: 1,
    overallRate: 2,
    forwardedFor: "10.40.0.20",
    threshold: {
      p95: 500,
      errorRate: 0.01,
    },
  },
  {
    name: "trending",
    path: "/api/trending",
    method: "GET",
    duration: 20,
    connections: 1,
    overallRate: 4,
    forwardedFor: "10.40.0.30",
    threshold: {
      p95: 1200,
      errorRate: 0.03,
    },
  },
];

function runScenario(scenario) {
  return new Promise((resolve, reject) => {
    const req = autocannon({
      url: `${baseUrl}${scenario.path}`,
      method: scenario.method,
      duration: scenario.duration,
      connections: scenario.connections,
      overallRate: scenario.overallRate,
      headers:
        scenario.method === "POST"
          ? {
              "Content-Type": "application/json",
              "x-forwarded-for": scenario.forwardedFor,
            }
          : {
              "x-forwarded-for": scenario.forwardedFor,
            },
      body: scenario.body ? JSON.stringify(scenario.body) : undefined,
      timeout: 20,
      setupClient: (client) => {
        client.on("response", (statusCode) => {
          if (statusCode >= 500) {
            client.emit("reqError", new Error(`Server error: ${statusCode}`));
          }
        });
      },
    });

    req.on("done", (result) => resolve(result));
    req.on("error", reject);
  });
}

function summarize(name, result) {
  const p95Candidates = [result.latency.p95, result.latency.p97_5, result.latency.p90, result.latency.average];
  const p95 = p95Candidates.find((value) => typeof value === "number" && Number.isFinite(value));
  const total = result.requests.total || 1;
  const errors = result.errors + result.timeouts + result.non2xx;
  const errorRate = errors / total;

  return {
    name,
    p95: p95 ?? Number.POSITIVE_INFINITY,
    errorRate,
    requestsPerSec: result.requests.average,
    throughputKbSec: result.throughput.average / 1024,
  };
}

function printSummary(summary, threshold) {
  const p95Pass = summary.p95 <= threshold.p95;
  const errPass = summary.errorRate <= threshold.errorRate;

  console.log(`\n[load] ${summary.name}`);
  console.log(`  p95 latency: ${summary.p95} ms (target <= ${threshold.p95})`);
  console.log(
    `  error rate: ${(summary.errorRate * 100).toFixed(2)}% (target <= ${(threshold.errorRate * 100).toFixed(2)}%)`
  );
  console.log(`  req/s: ${summary.requestsPerSec.toFixed(2)}`);
  console.log(`  throughput: ${summary.throughputKbSec.toFixed(2)} KB/s`);

  return p95Pass && errPass;
}

async function main() {
  console.log(`[load] Running scenarios against ${baseUrl}`);
  console.log("[load] Ensure the app is running first (for example: npm run dev).\n");

  try {
    const health = await fetch(`${baseUrl}/api/health`);
    if (!health.ok) {
      throw new Error(`Preflight /api/health returned ${health.status}`);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[load] Preflight failed: ${msg}`);
    console.error("[load] Start the app first, then rerun npm run perf:load.");
    process.exit(1);
  }

  const results = [];
  for (const scenario of scenarios) {
    // Run sequentially for stable local measurements and clearer bottleneck isolation.
    const result = await runScenario(scenario);
    const summary = summarize(scenario.name, result);
    const pass = printSummary(summary, scenario.threshold);
    results.push({ scenario: scenario.name, pass });
  }

  const failed = results.filter((entry) => !entry.pass);
  if (failed.length > 0) {
    console.error(`\n[load] Failed thresholds for: ${failed.map((f) => f.scenario).join(", ")}`);
    process.exitCode = 1;
    return;
  }

  console.log("\n[load] All thresholds passed.");
}

main().catch((error) => {
  console.error("[load] Run failed:", error?.message || error);
  process.exit(1);
});
