import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        products: resolve(__dirname, 'products.html'),
        insights: resolve(__dirname, 'insights.html'),
        businesses: resolve(__dirname, 'businesses.html'),
        contact: resolve(__dirname, 'contact.html'),
      }
    }
  }
});
