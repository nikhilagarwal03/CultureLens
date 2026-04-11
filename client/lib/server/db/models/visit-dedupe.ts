import { Schema, model, models } from "mongoose";

export interface IVisitDedupe {
  key: string;
  createdAt: Date;
  expiresAt: Date;
}

const VisitDedupeSchema = new Schema<IVisitDedupe>({
  key: { type: String, required: true, unique: true, index: true },
  createdAt: { type: Date, required: true, default: () => new Date() },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

export const VisitDedupe =
  models.VisitDedupe || model<IVisitDedupe>("VisitDedupe", VisitDedupeSchema);