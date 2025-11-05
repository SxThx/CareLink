export function imageToBase64(file, quality = 0.7) {
  return new Promise((resolve, reject) => {
    // Check the file size (7MB in bytes)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      reject(new Error("Invalid image format. Please use PNG, WebP, or JPEG."));
      return;
    }
    const maxFileSize = 7 * 1024 * 1024; // 7MB in bytes
    if (file.size > maxFileSize) {
      reject(new Error("Image size should not exceed 7MB."));
      return;
    }



    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Convert image to WebP format
      const dataUrl = canvas.toDataURL('image/webp', quality);

      // Calculate and log the size of the compressed image
      const compressedSize = Math.round((dataUrl.length * (3/4)) / 1024);

      resolve(dataUrl);
    };

    img.onerror = () => {
      reject(new Error('There was an error loading the image.'));
    };

    img.crossOrigin = 'Anonymous';

    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
