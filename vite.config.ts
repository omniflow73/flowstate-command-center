import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/flowstate-command-center/', // Correct base URL for GitHub Pages deployment
  server: {
    host: "::", // Make sure this is necessary for your environment
    port: 8080,  // Default development server port
  },
  plugins: [
    react(),
    componentTagger(),  // Conditionally add this plugin if in development
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // Alias to make imports cleaner
    },
  },
});
