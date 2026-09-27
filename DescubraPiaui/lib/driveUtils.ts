// Utilitário para gerar URLs de imagens do Google Drive

export function getDriveThumbnailUrl(fileId: string, size: number = 600): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}

export function getDriveImageUrl(fileId: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
  const sizeMap = {
    small: 400,
    medium: 600,
    large: 1000,
  };
  
  return getDriveThumbnailUrl(fileId, sizeMap[size]);
}

// Pré-carregar imagem
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}

// Pré-carregar múltiplas imagens
export async function preloadImages(urls: string[]): Promise<void> {
  try {
    await Promise.all(urls.map(url => preloadImage(url)));
  } catch (error) {
    console.error('Erro ao pré-carregar imagens:', error);
  }
}