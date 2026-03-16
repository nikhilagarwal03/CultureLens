import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const apiKey = process.env.LINGO_API_KEY;
const engineId = process.env.LINGO_ENGINE_ID;
const apiUrl = "https://api.lingo.dev";

function fail(message) {
  console.error(`\n[lingo:check] ${message}`);
  process.exit(1);
}

if (!apiKey || !apiKey.trim()) {
  fail("Missing LINGO_API_KEY in .env.local");
}

if (!engineId || !engineId.trim()) {
  fail("Missing LINGO_ENGINE_ID in .env.local");
}

async function run() {
  console.log("\n[lingo:check] Verifying Lingo.dev configuration...");

  const localizeResponse = await fetch(`${apiUrl}/process/localize`, {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...(engineId ? { engineId } : {}),
      sourceLocale: "en",
      targetLocale: "hi",
      data: { sample: "Hello from CultureLens" },
    }),
  });

  const raw = await localizeResponse.text();

  if (!localizeResponse.ok) {
    fail(`Localization failed (${localizeResponse.status}): ${raw.slice(0, 700)}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    fail(`Localization returned non-JSON: ${raw.slice(0, 700)}`);
  }

  const translated = parsed?.data?.sample;
  if (!translated || typeof translated !== "string") {
    fail(`Unexpected localization response shape: ${raw.slice(0, 700)}`);
  }

  console.log("[lingo:check] Success.");
  console.log(`[lingo:check] Sample translation: ${translated}`);
}

run().catch((error) => {
  if (error instanceof Error) {
    const detail = error.stack || error.message || "Unknown Error";
    fail(`Lingo check failed:\n${detail}`);
  }

  try {
    fail(`Lingo check failed with non-Error payload:\n${JSON.stringify(error, null, 2)}`);
  } catch {
    fail("Unknown error while validating Lingo setup.");
  }
});
