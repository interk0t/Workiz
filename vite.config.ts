import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: process.env.PORT || 4173, // Используем порт из переменной окружения или 4173 по умолчанию
    },
    plugins: [sveltekit()],
});
