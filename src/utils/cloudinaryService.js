// Cloudinary service for image uploads
const CLOUDINARY_CLOUD_NAME = 'di2nqcugo';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const cloudinaryService = {
  uploadImage: async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  },

  uploadMultipleImages: async (files) => {
    const results = await Promise.all(
      files.map(file => file ? cloudinaryService.uploadImage(file) : null)
    );
    return results;
  }
};