import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (filePath: string) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'tippool/avatars',
            transformation: [{ width: 200, height: 200, crop: 'fill' }]
        });
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Error al subir imagen a la nube');
    }
};

export default cloudinary;
