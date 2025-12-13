/// <reference types="vite/client" />

// Temporary shim only — prefer installing @types/react/@types/react-dom instead.
declare module 'react';
declare module 'react/jsx-runtime';

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  [key: string]: string | undefined;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace JSX {
    interface IntrinsicElements { [elemName: string]: any; }
  }
}

export {};