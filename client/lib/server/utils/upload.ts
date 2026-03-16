import { ApiError } from "@/lib/server/api/errors";

const DEFAULT_MAX_SIZE_MB = Number(process.env.MAX_IMAGE_UPLOAD_MB ?? 5);
const DEFAULT_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type ParsedImageUpload = {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  bytes: Uint8Array;
};

export async function parseImageUpload(params: {
  formData: FormData;
  fieldName?: string;
  maxSizeMb?: number;
  allowedMimeTypes?: readonly string[];
}): Promise<ParsedImageUpload> {
  const fieldName = params.fieldName ?? "image";
  const maxSizeMb = params.maxSizeMb ?? DEFAULT_MAX_SIZE_MB;
  const allowedMimeTypes = params.allowedMimeTypes ?? DEFAULT_ALLOWED_MIME_TYPES;

  const file = params.formData.get(fieldName);
  if (!(file instanceof File)) {
    throw new ApiError(400, "INVALID_UPLOAD", `Missing file field: ${fieldName}`);
  }

  if (!allowedMimeTypes.includes(file.type)) {
    throw new ApiError(
      415,
      "UNSUPPORTED_MEDIA_TYPE",
      `Unsupported file type: ${file.type}`
    );
  }

  const maxBytes = maxSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new ApiError(
      413,
      "UPLOAD_TOO_LARGE",
      `Image exceeds ${maxSizeMb}MB limit`
    );
  }

  const buffer = await file.arrayBuffer();

  return {
    fileName: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
    bytes: new Uint8Array(buffer),
  };
}
