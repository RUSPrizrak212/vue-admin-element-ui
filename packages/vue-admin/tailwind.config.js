const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: [
        './src/components/**/*.vue',
    ],

    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
            },
            fontSize: {
                xxxs: '0.5rem',
                xxs: '0.625rem',
            },
            colors: {
                transparent: 'transparent',
                current: 'currentColor',
            },
        },
    },

    variants: {
        extend: {
            opacity: ['disabled'],
        },
    },
};
