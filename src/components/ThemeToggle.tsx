// components/ThemeToggle.tsx
import { useColorMode, IconButton, Icon } from "native-base";
import { Moon, Sun } from "lucide-react-native";

const ThemeToggle = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <IconButton
            onPress={toggleColorMode}
            icon={
                <Icon
                    as={colorMode === "dark" ? Sun : Moon}
                    size="sm"
                    color={colorMode === "dark" ? "yellow.400" : "coolGray.800"}
                />
            }
            borderRadius="full"
            _pressed={{
                bg: colorMode === "dark" ? "coolGray.800" : "coolGray.200",
            }}
            accessibilityLabel="Toggle color mode"
        />
    );
};

export default ThemeToggle;