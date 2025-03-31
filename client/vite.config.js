import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build", // Ensures the build output is in the 'build' folder as CRA does.
    sourcemap: true,
  },
});
