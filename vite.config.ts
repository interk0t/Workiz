import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    // server: {
    //     port: process.env.PORT || 4173,
    // },
    plugins: [sveltekit()],
});
