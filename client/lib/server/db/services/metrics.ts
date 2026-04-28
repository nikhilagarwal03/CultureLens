
import { Metrics } from "../models/metrics";
import { connectToDatabase } from "../mongoose";


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
    searches: doc?.searches || 0,
  };
}
