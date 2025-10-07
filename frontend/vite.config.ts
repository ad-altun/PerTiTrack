import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [ react() ],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Core React libraries
                    'react-vendor': [ 'react', 'react-dom' ],

                    // Routing
                    'router': [ 'react-router-dom' ],

                    // State Management & Data Fetching
                    'rtk': [ '@reduxjs/toolkit', 'react-redux' ],

                    // Form & Validation
                    'forms': [ 'react-hook-form', 'zod' ],

                    // MUI Core
                    'mui-core': [ '@mui/material', '@emotion/react', '@emotion/styled' ],
                    'mui-icons': [ '@mui/icons-material' ],

                    // Date/Time (if you add these)
                    // 'date': [ 'date-fns', 'dayjs', 'moment' ], // whichever you use

                    // Other utilities (if you add these)
                    // 'utils': [ 'lodash', 'uuid', 'classnames' ]
                }
            }
        }
    }
});
