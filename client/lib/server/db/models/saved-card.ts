import { Model, Schema, model, models } from "mongoose";

export type SavedCardDocument = {
  title: string;
  reference: string;
  culturalImpact: string;
  localAnalogy: string;
  language: string;
  shareSlug: string;
  createdAt: Date;
  updatedAt: Date;
};

const SavedCardSchema = new Schema<SavedCardDocument>(
  {
    title: { type: String, required: true, trim: true },
    reference: { type: String, required: true },
    culturalImpact: { type: String, required: true },
    localAnalogy: { type: String, required: true },
    language: { type: String, required: true, default: "en" },
    shareSlug: { type: String, required: true, unique: true, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

SavedCardSchema.index({ shareSlug: 1 }, { unique: true });

export const SavedCardModel: Model<SavedCardDocument> =
  (models.SavedCard as Model<SavedCardDocument>) ||
  model<SavedCardDocument>("SavedCard", SavedCardSchema);
