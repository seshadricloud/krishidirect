// Ambient declarations for process.env keys used in the backend.
// Keep this file free of runtime imports or shell commands.

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: 'development' | 'production' | 'test';
    PORT?: string;
    DATABASE_URL?: string;
    JWT_SECRET?: string;
    [key: string]: string | undefined;
  }
}

export {};