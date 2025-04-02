import { extendTheme } from "native-base";

const customTheme = extendTheme({
    fonts: {
        heading: "Poppins-Bold",
        body: "Inter-Italic",
        mono: "Roboto-Mono",
    },
    colors: {
        primary: {
            50: "#E1E8EF",
            100: "#C4D1DF",
            200: "#A6B9CF",
            300: "#879FBF",
            400: "#6786AF",
            500: "#2C3E50",
            600: "#253646",
            700: "#1E2D3C",
            800: "#17242F",
            900: "#101A23",
        },
        secondary: {
            500: "#304C69",
            600: "#2C2C50",
            700: "#252729",
        },
        accent: {
            500: "#003469",
            600: "#0074E8",
        },
        // Mejoramos la definición de colores para dark/light
        background: {
            light: "#F5F7FA",
            dark: "#1C1E22",
        },
        text: {
            light: "#1C1E22",
            dark: "#FFFFFF",
        },
        status: {
            success: "#4CAF50",
            warning: "#FFEB3B",
            error: "#F44336",
        }
    },
    components: {
        Button: {
            baseStyle: ({ colorMode }: { colorMode: "light" | "dark" }) => ({
                rounded: "xl",
                _text: {
                    fontWeight: "bold",
                    fontFamily: "Poppins-Bold",
                    color: colorMode === "dark" ? "text.dark" : "text.light",
                },
                bg: colorMode === "dark" ? "primary.700" : "primary.500",
            }),
            defaultProps: {
                colorScheme: "secondary",
            },
        },
        Input: {
            baseStyle: ({ colorMode }: { colorMode: "light" | "dark" }) => ({
                borderRadius: "md",
                borderColor: colorMode === "dark" ? "primary.400" : "primary.500",
                fontFamily: "Inter-Regular",
                bg: colorMode === "dark" ? "coolGray.800" : "coolGray.100",
                _focus: {
                    borderColor: "primary.500",
                    bg: colorMode === "dark" ? "coolGray.700" : "primary.50",
                },
            }),
        },
        Text: {
            baseStyle: ({ colorMode }: { colorMode: "light" | "dark" }) => ({
                color: colorMode === "dark" ? "text.dark" : "text.light",
                fontFamily: "Inter-Regular",
            }),
            defaultProps: {
                fontSize: "md",
            },
        },
        Heading: {
            baseStyle: ({ colorMode }: { colorMode: "light" | "dark" }) => ({
                fontFamily: "Poppins-Bold",
                fontWeight: "bold",
                color: colorMode === "dark" ? "text.dark" : "text.light",
            }),
        },
    },
    config: {
        initialColorMode: "light",
        useSystemColorMode: false,
    },
});

// Extender los tipos para TypeScript
type CustomThemeType = typeof customTheme;

declare module "native-base" {
    interface ICustomTheme extends CustomThemeType {}
}

export default customTheme;