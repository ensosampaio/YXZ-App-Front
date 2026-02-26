import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,        // ← PORTA CORRETA DO FRONTEND
    host: true,
    open: true,
    strictPort: true,  // Falha se porta já estiver em uso
  },
  preview: {
    port: 4173,
  },
})