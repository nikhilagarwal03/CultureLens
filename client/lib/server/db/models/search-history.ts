import { Model, Schema, model, models } from "mongoose";

export type SearchHistoryDocument = {
  queryText: string;
  userCountry?: string;
  userLanguage?: string;
  reference: string;
  originCulture: string;
  localAnalogy: string;
  createdAt: Date;
  updatedAt: Date;
};

const SearchHistorySchema = new Schema<SearchHistoryDocument>(
  {
    queryText: { type: String, required: true, trim: true },
    userCountry: { type: String, trim: true },
    userLanguage: { type: String, trim: true },
    reference: { type: String, required: true },
    originCulture: { type: String, required: true },
    localAnalogy: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

SearchHistorySchema.index({ createdAt: -1 });
SearchHistorySchema.index({ reference: 1, createdAt: -1 });
SearchHistorySchema.index({ userCountry: 1, createdAt: -1 });
SearchHistorySchema.index({ userLanguage: 1, createdAt: -1 });

export const SearchHistoryModel: Model<SearchHistoryDocument> =
  (models.SearchHistory as Model<SearchHistoryDocument>) ||
  model<SearchHistoryDocument>("SearchHistory", SearchHistorySchema);
