export type TrendDetectionInput = {
  totalCount: number;
  recentCount: number;
  previousCount: number;
  latestAt: Date;
};

export type TrendDetectionOutput = {
  trendScore: number;
  trendLabel: "rising" | "stable" | "cooling";
  momentum: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function detectTrendSignal(input: TrendDetectionInput): TrendDetectionOutput {
  const safePrevious = Math.max(1, input.previousCount);
  const momentumRaw = (input.recentCount - input.previousCount) / safePrevious;
  const momentum = Number(momentumRaw.toFixed(2));

  const frequencyComponent = Math.log1p(input.totalCount) * 25;
  const momentumComponent = momentum * 35;

  const ageHours = (Date.now() - input.latestAt.getTime()) / (1000 * 60 * 60);
  const recencyBoost = clamp(24 - ageHours, 0, 24) * 1.2;

  const trendScore = Number(clamp(frequencyComponent + momentumComponent + recencyBoost, 0, 100).toFixed(2));

  let trendLabel: TrendDetectionOutput["trendLabel"] = "stable";
  if (momentum >= 0.4) trendLabel = "rising";
  else if (momentum <= -0.2) trendLabel = "cooling";

  return {
    trendScore,
    trendLabel,
    momentum,
  };
}
