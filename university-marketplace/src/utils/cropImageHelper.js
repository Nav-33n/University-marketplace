export const cropToAspectRatio = (file, aspectRatio = 4 / 3) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const currentRatio = img.width / img.height;
      let cropWidth = img.width;
      let cropHeight = img.height;
      let offsetX = 0;
      let offsetY = 0;

      if (currentRatio > aspectRatio) {
        cropWidth = img.height * aspectRatio;
        offsetX = (img.width - cropWidth) / 2;
      } else if (currentRatio < aspectRatio) {
        cropHeight = img.width / aspectRatio;
        offsetY = (img.height - cropHeight) / 2;
      } else {
        URL.revokeObjectURL(img.src); 
        resolve(file);
        return;
      }

      if (cropWidth > img.width || cropHeight > img.height) {
        URL.revokeObjectURL(img.src); 
        resolve(file);
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        img,
        offsetX,
        offsetY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(img.src); // Cleanup
        if (!blob) {
          resolve(file);
          return;
        }
        resolve(new File([blob], file.name, { type: file.type }));
      }, file.type);
    };

    img.onerror = (err) => reject(err);
    img.src = URL.createObjectURL(file);
  });
};

export const cropFile = (file, cropArea) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      );

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(img.src);
        if (!blob) {
          resolve(file);
          return;
        }
        resolve(new File([blob], file.name, { type: file.type }));
      }, file.type);
    };

    img.onerror = (err) => reject(err);
    img.src = URL.createObjectURL(file);
  });
};
