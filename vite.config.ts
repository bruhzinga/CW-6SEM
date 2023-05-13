import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import mkcert from 'vite-plugin-mkcert'

const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({

    server: { https: true },
    plugins: [react(), viteTsconfigPaths(), svgrPlugin(),mkcert()],
    resolve:{
        alias:{
            '@' : path.resolve(__dirname, './src')
        },
    },
});
