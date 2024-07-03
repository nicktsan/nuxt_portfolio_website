/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        extend: {
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        a: {
                            color: theme('colors.blue.600'),
                            '&:hover': {
                            color: theme('colors.blue.800'),
                            },
                        },
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        // ...
    ],
}