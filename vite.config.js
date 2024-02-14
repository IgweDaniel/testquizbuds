import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import Icons from "unplugin-icons/vite";
import { fileURLToPath } from "node:url";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Icons({ compiler: "vue3" }), vue()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
});
