import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

const root = fileURLToPath(new URL("..", import.meta.url));
const src = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [react(), viteSingleFile()],
  resolve: {
    alias: [
      { find: /^@\/lib\/kanban$/, replacement: `${src}/store.ts` },
      { find: /^next\/link$/, replacement: `${src}/link.tsx` },
      { find: /^@\//, replacement: root },
    ],
    dedupe: ["react", "react-dom"],
  },
  server: { fs: { allow: [root] } },
});
