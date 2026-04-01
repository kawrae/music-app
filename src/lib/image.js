export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });
}

export async function cropImageDataUrlToSquare(dataUrl, options = {}) {
  if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
    return dataUrl;
  }

  const { outputSize = 1024, mimeType = "image/jpeg", quality = 0.9 } = options;

  try {
    const image = await loadImage(dataUrl);
    const width = image.naturalWidth || image.width;
    const height = image.naturalHeight || image.height;
    const cropSize = Math.min(width, height);

    if (!cropSize) return dataUrl;

    const sx = Math.floor((width - cropSize) / 2);
    const sy = Math.floor((height - cropSize) / 2);
    const canvas = document.createElement("canvas");
    const targetSize = Number.isFinite(outputSize) ? outputSize : cropSize;

    canvas.width = targetSize;
    canvas.height = targetSize;

    const context = canvas.getContext("2d");
    if (!context) return dataUrl;

    context.drawImage(image, sx, sy, cropSize, cropSize, 0, 0, targetSize, targetSize);
    return canvas.toDataURL(mimeType, quality);
  } catch (error) {
    console.error("Failed to crop image to square:", error);
    return dataUrl;
  }
}

export async function cropImageFileToSquare(file, options = {}) {
  const dataUrl = await readFileAsDataUrl(file);
  if (typeof dataUrl !== "string") return "";

  return cropImageDataUrlToSquare(dataUrl, options);
}
