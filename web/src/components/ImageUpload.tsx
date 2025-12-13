import React, { useState } from 'react';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  maxSizeMB = 2
}) => {
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError('');

    // Check if adding these files would exceed max images
    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Image ${file.name} exceeds ${maxSizeMB}MB limit`);
        continue;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError(`File ${file.name} is not an image`);
        continue;
      }

      try {
        // Convert to base64
        const base64 = await fileToBase64(file);
        newImages.push(base64 as string);
      } catch (err) {
        setError(`Failed to process ${file.name}`);
      }
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }

    // Reset input
    e.target.value = '';
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newImages = [...images];
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= images.length) return;
    
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    onImagesChange(newImages);
  };

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">
        Product Images (Max {maxImages})
      </label>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
              />
              
              {/* Image controls overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'left')}
                    className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-200"
                    title="Move left"
                  >
                    ←
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                  title="Remove"
                >
                  ✕
                </button>
                
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'right')}
                    className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-200"
                    title="Move right"
                  >
                    →
                  </button>
                )}
              </div>

              {/* Primary badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {images.length < maxImages && (
        <div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="inline-block bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 cursor-pointer transition"
          >
            {images.length === 0 ? 'Upload Images' : 'Add More Images'}
          </label>
          <p className="text-sm text-gray-500 mt-2">
            {images.length} / {maxImages} images • Max {maxSizeMB}MB each
          </p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};
