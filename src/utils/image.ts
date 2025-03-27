export const getCroppedImage = (
  file: File | string,
  cropData: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
  }
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Calculate rotated dimensions
      const rotation = cropData.rotation || 0;
      const radian = (rotation * Math.PI) / 180;
      const absRotation = Math.abs(rotation % 360);

      // Determine if width and height should be swapped based on rotation
      const isRotated90Or270 = absRotation === 90 || absRotation === 270;
      const canvasWidth = isRotated90Or270 ? cropData.height : cropData.width;
      const canvasHeight = isRotated90Or270 ? cropData.width : cropData.height;

      // Set canvas dimensions
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Clear canvas and set background if needed
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Move to center of canvas
      ctx.translate(canvasWidth / 2, canvasHeight / 2);

      // Rotate the canvas
      ctx.rotate(radian);

      // Adjust the drawing position based on rotation
      let drawX = -cropData.width / 2;
      let drawY = -cropData.height / 2;

      // For 90 or 270 degree rotations, adjust the crop coordinates
      if (isRotated90Or270) {
        const temp = drawX;
        drawX = drawY;
        drawY = temp;
      }

      // Draw the cropped and rotated image
      ctx.drawImage(
        image,
        cropData.x,
        cropData.y,
        cropData.width,
        cropData.height,
        drawX,
        drawY,
        cropData.width,
        cropData.height
      );

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob from canvas"));
          }
        },
        "image/jpeg",
        0.95
      );
    };

    image.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    if (typeof file === "string") {
      image.src = file;
    } else {
      image.src = URL.createObjectURL(file);
    }
  });
};

interface CompressOptions {
  maxSizeInMB?: number;
  quality?: number;
  width?: number; // Add specific width
  height?: number; // Add specific height
}

export const compressImage = async (
  blob: Blob,
  options: CompressOptions = {}
): Promise<Blob> => {
  const {
    maxSizeInMB = 1,
    quality = 0.9,
    width: targetWidth, // Use passed width
    height: targetHeight, // Use passed height
  } = options;

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = URL.createObjectURL(blob);

    image.onload = () => {
      URL.revokeObjectURL(image.src);

      // Use the exact dimensions from the cropper if provided
      const width = targetWidth || image.width;
      const height = targetHeight || image.height;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Draw with exact dimensions
      ctx.drawImage(image, 0, 0, width, height);

      // Start with high quality
      let currentQuality = quality;
      const maxSize = maxSizeInMB * 1024 * 1024; // Convert MB to bytes

      const compressRecursively = () => {
        canvas.toBlob(
          (compressedBlob) => {
            if (!compressedBlob) {
              reject(new Error("Failed to compress image"));
              return;
            }

            // If the size is under max size or quality is too low, return current blob
            if (compressedBlob.size <= maxSize || currentQuality < 0.1) {
              resolve(compressedBlob);
              return;
            }

            // Reduce quality and try again
            currentQuality -= 0.1;
            compressRecursively();
          },
          "image/jpeg",
          currentQuality
        );
      };

      compressRecursively();
    };

    image.onerror = () => {
      reject(new Error("Failed to load image for compression"));
    };
  });
};

export const getAspectWidthAndHeightFromImageWidthAndHeight = (
  width: number,
  height: number
) => {
  // Helper function to calculate the greatest common divisor
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  // Calculate the GCD of the width and height
  const divisor = gcd(width, height);

  // Simplify the width and height by dividing by the GCD
  const aspectWidth = width / divisor;
  const aspectHeight = height / divisor;

  // Return the simplified aspect ratio
  return { aspectWidth, aspectHeight };
};

export const urlToFile = async (imageUrl, fileName = "image.jpg") => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const file = new File([blob], fileName, { type: blob.type });
  return file;
};
