import mongoose, { Schema, model, models } from "mongoose";

export interface IMetrics {
  searches: number;
}

const MetricsSchema = new Schema<IMetrics>({
  searches: { type: Number, required: true, default: 0 },
});

export const Metrics = models.Metrics || model<IMetrics>("Metrics", MetricsSchema);
