import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

if (!MONGODB_URI || !MONGODB_DB_NAME) {
  console.error("Missing MONGODB_URI or MONGODB_DB_NAME in environment.");
  process.exit(1);
}

const searchHistorySchema = new mongoose.Schema(
  {
    queryText: { type: String, required: true, trim: true },
    userCountry: { type: String, trim: true },
    userLanguage: { type: String, trim: true },
    reference: { type: String, required: true },
    originCulture: { type: String, required: true },
    localAnalogy: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);
searchHistorySchema.index({ createdAt: -1 });

const savedCardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    reference: { type: String, required: true },
    culturalImpact: { type: String, required: true },
    localAnalogy: { type: String, required: true },
    language: { type: String, required: true, default: "en" },
    shareSlug: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true, versionKey: false }
);
savedCardSchema.index({ shareSlug: 1 }, { unique: true });

const SearchHistory =
  mongoose.models.SearchHistory || mongoose.model("SearchHistory", searchHistorySchema);
const SavedCard =
  mongoose.models.SavedCard || mongoose.model("SavedCard", savedCardSchema);

async function run() {
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });

  await Promise.all([SearchHistory.syncIndexes(), SavedCard.syncIndexes()]);

  console.log("Database indexes synced for SearchHistory and SavedCard.");
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error("db:init failed", error);
  await mongoose.disconnect();
  process.exit(1);
});
