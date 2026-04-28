import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMetrics extends Document {
  searches: number;
}

const MetricsSchema: Schema = new Schema<IMetrics>({
  searches: { type: Number, default: 0 },
});

export const Metrics: Model<IMetrics> =
  mongoose.models.Metrics || mongoose.model<IMetrics>("Metrics", MetricsSchema);
