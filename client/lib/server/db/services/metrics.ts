
import { Metrics } from "../models/metrics";
import { VisitDedupe } from "../models/visit-dedupe";
import { connectToDatabase } from "../mongoose";


export async function incrementVisits() {
  await connectToDatabase();
  await Metrics.findOneAndUpdate(
    {},
    { $inc: { visits: 1 } },
    { upsert: true, returnDocument: "after" }
  );
}

export async function shouldCountVisitByKey(
  dedupeKey: string,
  ttlSeconds: number
): Promise<boolean> {
  await connectToDatabase();

  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
  const result = await VisitDedupe.updateOne(
    { key: dedupeKey },
    {
      $setOnInsert: {
        key: dedupeKey,
        createdAt: new Date(),
        expiresAt,
      },
    },
    { upsert: true }
  );

  return result.upsertedCount === 1;
}


export async function incrementSearches() {
  await connectToDatabase();
  await Metrics.findOneAndUpdate(
    {},
    { $inc: { searches: 1 } },
    { upsert: true, returnDocument: "after" }
  );
}

export async function getMetrics() {
  await connectToDatabase();
  const doc = await Metrics.findOne({});
  return {
    visits: doc?.visits || 0,
    searches: doc?.searches || 0,
  };
}
