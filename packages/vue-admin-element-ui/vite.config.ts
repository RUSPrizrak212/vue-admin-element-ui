import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    build: {
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'VueAdmin',
            fileName: 'index',
        },
        rollupOptions: {
            external: [
                'vue',
                '@ckeditor/ckeditor5-vue',
            ],
            output: {
                globals: {
                    vue: 'Vue',
                    "@ckeditor/ckeditor5-vue": 'Ckeditor'
                },
            },
        },
    },
    plugins: [
        vue(),
    ],
});
