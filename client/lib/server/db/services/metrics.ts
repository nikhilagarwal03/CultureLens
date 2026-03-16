import { Metrics } from "../models/metrics";


export async function incrementVisits() {
  await Metrics.findOneAndUpdate(
    {},
    { $inc: { visits: 1 } },
    { upsert: true, returnDocument: "after" }
  );
}


export async function incrementSearches() {
  await Metrics.findOneAndUpdate(
    {},
    { $inc: { searches: 1 } },
    { upsert: true, returnDocument: "after" }
  );
}

export async function getMetrics() {
  const doc = await Metrics.findOne({});
  return {
    visits: doc?.visits || 0,
    searches: doc?.searches || 0,
  };
}
