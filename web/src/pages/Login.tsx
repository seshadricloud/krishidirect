/// <reference types="vite/client" />
// One file only — remove other duplicate shims.
declare module 'react';
declare module 'react/jsx-runtime';

declare global {
  namespace JSX {
    interface IntrinsicElements { [elemName: string]: any; }
  }
}
export {};

import React from 'react';

export default function Login() {
  return (
    <div>
      <h2>Login</h2>
      <p>Implement login form that POSTs to /auth/login</p>
    </div>
  );
}