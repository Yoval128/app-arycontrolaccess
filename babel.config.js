module.exports = {
    presets: ['babel-preset-expo'],
    plugins: [
        [
            'module:react-native-dotenv',
            {
                moduleName: '@env',  // El nombre del módulo donde se cargarán las variables
                path: '.env.production',
            },
        ],
    ],
};
