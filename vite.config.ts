import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // Windows-specific optimizations
      optimizeDeps: {
        include: ['react', 'react-dom', 'lucide-react'],
        force: true,
        esbuildOptions: {
          target: 'es2020'
        }
      },
      server: {
        fs: {
          strict: false
        },
        watch: {
          usePolling: true
        }
      },
      build: {
        target: 'es2020',
        rollupOptions: {
          output: {
            manualChunks: undefined
          }
        }
      },
      esbuild: {
        target: 'es2020'
      }
    };
});
