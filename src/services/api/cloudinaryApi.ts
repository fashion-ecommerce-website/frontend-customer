/**
 * Cloudinary Upload API
 * Upload images directly to Cloudinary using unsigned upload preset
 */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

/**
 * Upload a single image to Cloudinary
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudinary');
  }

  const data: CloudinaryUploadResponse = await response.json();
  return data.secure_url;
}

/**
 * Upload multiple images to Cloudinary
 */
export async function uploadMultipleToCloudinary(files: File[]): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadToCloudinary(file));
  return Promise.all(uploadPromises);
}

export const cloudinaryApi = {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
};

export default cloudinaryApi;
