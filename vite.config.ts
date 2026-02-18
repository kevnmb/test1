
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Replaces process.env.API_KEY in the source code with the actual environment variable value during build
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    // Provides a fallback for any other process.env checks to prevent crashes
    'process.env': {} 
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
