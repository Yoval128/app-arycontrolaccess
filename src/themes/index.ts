import { extendTheme } from "native-base";

const customTheme = extendTheme({
    fonts: {
        heading: "Poppins-Bold",  // Usamos Poppins para títulos y encabezados
        body: "Inter-Italic",    // Inter para el contenido principal
        mono: "Roboto-Mono",      // Opcional: Fuente monoespaciada si se usa código o datos técnicos
    },
    colors: {
        primary: {
            50: "#E1E8EF",
            100: "#C4D1DF",
            200: "#A6B9CF",
            300: "#879FBF",
            400: "#6786AF",
            500: "#2C3E50", // Color Primario Base (para Login)
            600: "#253646",
            700: "#1E2D3C",
            800: "#17242F",
            900: "#101A23",
        },
        secondary: {
            500: "#304C69", // Azul oscuro medio
            600: "#2C2C50", // Azul grisáceo profundo
            700: "#252729", // Gris oscuro neutro
        },
        accent: {
            500: "#003469", // Azul profundo
            600: "#0074E8", // Azul vibrante
        },
        background: {
            light: "#F5F7FA",
            dark: "#1C1E22",
        },
        text: {
            light: "#1C1E22",
            dark: "#FFFFFF",
        },
        status: {
            success: "#4CAF50", // Verde
            warning: "#FFEB3B", // Amarillo
            error: "#F44336", // Rojo
        }
    },
    components: {
        Button: {
            baseStyle: {
                rounded: "xl",
                _text: {
                    fontWeight: "bold",
                    fontFamily: "Poppins-Bold",
                    color: "white",
                },
            },
            defaultProps: {
                colorScheme: "secondary",
            },
        },
        Input: {
            baseStyle: {
                borderRadius: "md",
                borderColor: "primary.400",
                fontFamily: "Inter-Regular",
                _focus: {
                    borderColor: "primary.500",
                    bg: "primary.50",
                },
            },
        },
        Text: {
            baseStyle: {
                color: "text.light",
                fontFamily: "Inter-Regular",
            },
            defaultProps: {
                fontSize: "md",
            },
        },
        Heading: {
            baseStyle: {
                fontFamily: "Poppins-Bold",
                fontWeight: "bold",
                color: "text.light",
            },
        },
    },
    config: {
        initialColorMode: "light",
    },
});

export default customTheme;
