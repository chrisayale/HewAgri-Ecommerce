declare module 'use-react-screenshot' {
    import { RefObject } from 'react';
  
    type UseScreenshotReturnType = [string | null, (node: HTMLElement) => Promise<string>];
  
    const useScreenshot: () => UseScreenshotReturnType;
  
    const createFileName: (extension: string, mimeType: string) => string;
  
    export { useScreenshot, createFileName };
  }
  