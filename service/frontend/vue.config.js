const { defineConfig } = require('@vue/cli-service');
const fs = require('fs');
const path = require('path');

const host = 'localhost';
const port = '8081';

let httpsOptions = null;
try {
    httpsOptions = {
        key: fs.readFileSync(path.join(__dirname, '.cert', 'localhost-key.pem')),
        cert: fs.readFileSync(path.join(__dirname, '.cert', 'localhost.pem')),
    };
} catch (err) {
    console.error('HTTPS 인증서 파일을 읽는 중 오류 발생:', err.message);
    console.error('HTTPS 서버를 시작할 수 없습니다. 인증서 파일 경로를 확인하세요.');
}

module.exports = defineConfig({
    transpileDependencies: true,
    outputDir: path.resolve(__dirname, '../resources/static'),
    devServer: {
        https: httpsOptions,
        host: host,
        port: 8080,
        hot: true,
        proxy: {
            '/api/': {
                target: `https://${host}:${port}`,
                changeOrigin: true,
            },
            '/auth': {
                target: `https://${host}:${port}`,
                changeOrigin: true,
                pathRewrite: { '^/auth': '' },
            },
        },
    },

    configureWebpack: {
        resolve: {
            fallback: {
                https: require.resolve('https-browserify'),
                url: require.resolve('url/'),
                http: require.resolve('stream-http'), // Add the http polyfill
            },
        },
        module: {
            rules: [
                {
                    test: /\.d\.ts$/,
                    loader: 'ignore-loader',
                },
            ],
        },
    },
});
