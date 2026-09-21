import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export function validateImageUpload(mimetype: string, size: number) {
  const allowed = ['image/jpeg','image/png','image/webp','image/jpg'];
  if (!allowed.includes(mimetype)) throw new Error('Only JPG/PNG/WEBP allowed');
  if (size > 5 * 1024 * 1024) throw new Error('Max 5MB');
  return true;
}

// Client direct unsigned upload helper
export const CLOUDINARY_UPLOAD_PRESET = 'offside_payments';
