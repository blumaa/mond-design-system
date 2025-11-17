import { useEffect, useState } from 'react';

type ImageLoadState = 'loading' | 'loaded' | 'error';

interface UseAvatarImageProps {
  src?: string;
}

/**
 * Custom hook to preload avatar images and track their loading state.
 *
 * This approach loads images in memory first (using new Image()) before
 * rendering them in the DOM. This prevents flashing of fallback content
 * while images are loading.
 *
 * @param src - Image source URL
 * @returns loading state: 'loading', 'loaded', or 'error'
 */
export function useAvatarImage({ src }: UseAvatarImageProps): ImageLoadState {
  const [status, setStatus] = useState<ImageLoadState>('loading');

  useEffect(() => {
    if (!src) {
      setStatus('error');
      return;
    }

    let active = true;
    const image = new Image();

    image.onload = () => {
      if (!active) return;
      setStatus('loaded');
    };

    image.onerror = () => {
      if (!active) return;
      setStatus('error');
    };

    image.src = src;

    return () => {
      active = false;
    };
  }, [src]);

  return status;
}
