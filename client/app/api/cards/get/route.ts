import { connectToDatabase } from "@/lib/server/db/mongoose";
import { SavedCardModel } from "@/lib/server/db/models/saved-card";
import { withApiHandler } from "@/lib/server/api/handler";
import { successResponse } from "@/lib/server/api/response";
import { ApiError } from "@/lib/server/api/errors";

export const GET = withApiHandler(
  async (request, context) => {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      throw new ApiError(400, "VALIDATION_ERROR", "'slug' query param is required.");
    }

    await connectToDatabase();

    const card = await SavedCardModel.findOne(
      { shareSlug: slug },
      {
        title: 1,
        reference: 1,
        culturalImpact: 1,
        localAnalogy: 1,
        language: 1,
        shareSlug: 1,
        createdAt: 1,
      }
    ).lean();
    if (!card) {
      throw new ApiError(404, "NOT_FOUND", "Card not found.");
    }

    return successResponse(
      {
        id: String(card._id),
        shareSlug: card.shareSlug,
        title: card.title,
        reference: card.reference,
        culturalImpact: card.culturalImpact,
        localAnalogy: card.localAnalogy,
        language: card.language,
        createdAt: card.createdAt,
      },
      200,
      { requestId: context.requestId }
    );
  },
  { routeName: "cards/get", enableLogging: true }
);
