// Declare the shape of import.meta.env for Vite (add keys as needed)
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  // add other VITE_... variables here
  [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}