interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
}

interface CloudinaryDeleteResponse {
  result: string;
}

export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'bems_profile_pictures');
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudinary');
  }

  return response.json();
};

export const deleteFromCloudinary = async (publicId: string): Promise<CloudinaryDeleteResponse> => {
  // Create signature for deletion
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  // For client-side deletion, we need to use the upload API with destroy method
  // This requires the API key and secret, which should be handled server-side
  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('timestamp', timestamp.toString());
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');
  
  // Generate signature (this would normally be done server-side for security)
  // For now, we'll make a request to our API to handle the deletion
  const response = await fetch('/api/cloudinary/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ publicId }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete image from Cloudinary');
  }

  return response.json();
};

// Utility function to extract public ID from Cloudinary URL
export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    // Cloudinary URLs have format: https://res.cloudinary.com/[cloud_name]/image/upload/[transformations]/[public_id].[format]
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return null;
    
    // Get the part after 'upload' (might include transformations)
    const afterUpload = urlParts.slice(uploadIndex + 1).join('/');
    
    // Remove file extension and any transformations
    const publicIdWithExt = afterUpload.split('/').pop() || '';
    const publicId = publicIdWithExt.split('.')[0];
    
    return publicId || null;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
};