import { defineConfig } from "vite";
import htmlMinifier from 'vite-plugin-html-minifier';

export default defineConfig({
    base: 'ml-finger-trails',
    server: {
        port: 8001
    },
    plugins: [
        htmlMinifier({
          minify: true
        })
    ]
})