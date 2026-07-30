/** Default Cloudinary library shelves — mirrors server MEDIA_FOLDERS. */
export const MEDIA_FOLDERS = [
  "covers",
  "gallery",
  "books",
  "travel",
  "profile",
  "videos",
];

export function formatBytes(bytes) {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function isImageMedia(item) {
  return item?.resourceType === "image" || /\.(jpe?g|png|webp|gif)$/i.test(item?.url || "");
}

export function isVideoMedia(item) {
  return item?.resourceType === "video";
}

export function isPdfMedia(item) {
  return (
    item?.resourceType === "raw" ||
    item?.format === "pdf" ||
    /\.pdf$/i.test(item?.url || "")
  );
}

export function mediaLabel(item) {
  return item?.title || item?.publicId?.split("/").pop() || "Untitled";
}
