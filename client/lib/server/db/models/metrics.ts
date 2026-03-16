import mongoose, { Schema, model, models } from "mongoose";

export interface IMetrics {
  visits: number;
  searches: number;
}

const MetricsSchema = new Schema<IMetrics>({
  visits: { type: Number, required: true, default: 0 },
  searches: { type: Number, required: true, default: 0 },
});

export const Metrics = models.Metrics || model<IMetrics>("Metrics", MetricsSchema);
