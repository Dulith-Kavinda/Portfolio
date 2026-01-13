// Optional: Firebase Storage utilities for image uploads
// Uncomment and use when you want to add image upload functionality

import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import app from './firebase';

const storage = getStorage(app);

/**
 * Upload an image file to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {string} folder - The folder path in storage (e.g., 'posts', 'homeData')
 * @returns {Promise<string>} - The download URL of the uploaded image
 */
export async function uploadImage(file, folder = 'images') {
    try {
        if (!file) {
            throw new Error('No file provided');
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            throw new Error('Invalid file type. Please upload an image file.');
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new Error('File size too large. Maximum size is 5MB.');
        }

        // Create unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = file.name.split('.').pop();
        const filename = `${timestamp}_${randomString}.${extension}`;

        // Create storage reference
        const storageRef = ref(storage, `${folder}/${filename}`);

        // Upload file
        const snapshot = await uploadBytes(storageRef, file);
        console.log('File uploaded successfully:', snapshot);

        // Get download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

/**
 * Delete an image from Firebase Storage
 * @param {string} imageUrl - The full URL of the image to delete
 */
export async function deleteImage(imageUrl) {
    try {
        if (!imageUrl) {
            throw new Error('No image URL provided');
        }

        // Extract the path from the URL
        const urlObj = new URL(imageUrl);
        const pathMatch = urlObj.pathname.match(/\/o\/(.+)\?/);
        
        if (!pathMatch) {
            throw new Error('Invalid image URL');
        }

        const imagePath = decodeURIComponent(pathMatch[1]);
        const imageRef = ref(storage, imagePath);

        // Delete the file
        await deleteObject(imageRef);
        console.log('Image deleted successfully');
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
}

/**
 * Upload multiple images
 * @param {FileList|Array} files - Array of files to upload
 * @param {string} folder - The folder path in storage
 * @returns {Promise<Array<string>>} - Array of download URLs
 */
export async function uploadMultipleImages(files, folder = 'images') {
    try {
        const uploadPromises = Array.from(files).map((file) => uploadImage(file, folder));
        const urls = await Promise.all(uploadPromises);
        return urls;
    } catch (error) {
        console.error('Error uploading multiple images:', error);
        throw error;
    }
}

/**
 * Get image dimensions and preview
 * @param {File} file - The image file
 * @returns {Promise<Object>} - Object with width, height, and preview URL
 */
export function getImagePreview(file) {
    return new Promise((resolve, reject) => {
        if (!file || !file.type.startsWith('image/')) {
            reject(new Error('Invalid image file'));
            return;
        }

        const reader = new FileReader();
        const img = new Image();

        reader.onload = (e) => {
            img.onload = () => {
                resolve({
                    width: img.width,
                    height: img.height,
                    preview: e.target.result,
                    size: file.size,
                    type: file.type,
                });
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Compress image before upload (optional, requires canvas)
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width
 * @param {number} quality - Quality (0-1)
 * @returns {Promise<Blob>} - Compressed image blob
 */
export function compressImage(file, maxWidth = 1920, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to compress image'));
                        }
                    },
                    file.type,
                    quality
                );
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

// Example usage in a React component:
/*

import { useState } from 'react';
import { uploadImage } from './storageUtils';

function ImageUploadComponent() {
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadImage(file, 'posts');
            setImageUrl(url);
            alert('Image uploaded successfully!');
        } catch (error) {
            alert('Failed to upload image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
            {uploading && <p>Uploading...</p>}
            {imageUrl && <img src={imageUrl} alt="Uploaded" />}
        </div>
    );
}

*/
