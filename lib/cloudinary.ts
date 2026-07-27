import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export function getCloudinaryPublicId(url: string): string | null {
  try {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    const name = filename.split(".")[0];
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return name;
    const subDirs = parts.slice(uploadIndex + 2, -1).join("/");
    return subDirs ? `${subDirs}/${name}` : name;
  } catch {
    return null;
  }
}

export function getOptimizedUrl(
  publicId: string,
  options?: { width?: number; height?: number; quality?: number }
): string {
  const transformations: string[] = [];
  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  transformations.push("c_fill", "f_auto", `q_${options?.quality || "auto"}`);

  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${transformations.join(",")}/${publicId}`;
}

export function getThumbnailUrl(
  publicId: string,
  width = 400,
  height = 300
): string {
  return getOptimizedUrl(publicId, { width, height, quality: 80 });
}
