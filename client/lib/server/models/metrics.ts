import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMetrics extends Document {
  visits: number;
  searches: number;
}

const MetricsSchema: Schema = new Schema<IMetrics>({
  visits: { type: Number, default: 0 },
  searches: { type: Number, default: 0 },
});

export const Metrics: Model<IMetrics> =
  mongoose.models.Metrics || mongoose.model<IMetrics>("Metrics", MetricsSchema);
