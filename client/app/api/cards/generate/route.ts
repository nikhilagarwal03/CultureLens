import { connectToDatabase } from "@/lib/server/db/mongoose";
import { SavedCardModel } from "@/lib/server/db/models/saved-card";
import { withApiHandler } from "@/lib/server/api/handler";
import { successResponse } from "@/lib/server/api/response";
import { parseJsonBody, requireNonEmptyString, optionalString } from "@/lib/server/api/validation";

type GenerateCardBody = {
  title?: string;
  reference?: string;
  culturalImpact?: string;
  localAnalogy?: string;
  language?: string;
};

function slugBase(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || "culture-card";
}

function generateSlug(base: string): string {
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

export const POST = withApiHandler(
  async (request, context) => {
    const body = await parseJsonBody<GenerateCardBody>(request);
    const title = requireNonEmptyString(body.title, "title");
    const reference = requireNonEmptyString(body.reference, "reference");
    const culturalImpact = requireNonEmptyString(body.culturalImpact, "culturalImpact");
    const localAnalogy = requireNonEmptyString(body.localAnalogy, "localAnalogy");
    const language = optionalString(body.language) ?? "en";

    await connectToDatabase();

    const base = slugBase(title);
    let shareSlug = "";

    for (let i = 0; i < 6; i += 1) {
      const candidate = generateSlug(base);
      const exists = await SavedCardModel.exists({ shareSlug: candidate });
      if (!exists) {
        shareSlug = candidate;
        break;
      }
    }

    if (!shareSlug) {
      throw new Error("Could not allocate unique share slug");
    }

    const card = await SavedCardModel.create({
      title,
      reference,
      culturalImpact,
      localAnalogy,
      language,
      shareSlug,
    });

    return successResponse(
      {
        id: String(card._id),
        shareSlug: card.shareSlug,
        shareUrl: `/cards/${card.shareSlug}`,
        title: card.title,
        reference: card.reference,
        culturalImpact: card.culturalImpact,
        localAnalogy: card.localAnalogy,
        language: card.language,
        createdAt: card.createdAt,
      },
      201,
      { requestId: context.requestId }
    );
  },
  { routeName: "cards/generate", enableLogging: true }
);
