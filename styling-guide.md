# Theme & Language Hook Implementation Guide

## Overview

- Theme-aware colors (light/dark mode)
- Language-aware fonts (Poppins for English, Cairo for Arabic)
- RTL support for Arabic
- Dynamic styling based on current theme and language

## Installation Requirements

First, install the required font packages:

```bash
npx expo install @expo-google-fonts/poppins @expo-google-fonts/cairo
```

## Usage Examples

### Basic Usage

```typescript
import { useThemeStyle } from '@/hooks/use-theme-style';

function MyComponent() {
  const { colors, getFont, isRTL } = useThemeStyle();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    title: {
      color: colors.textPrimary,
      fontFamily: getFont('700'), // Bold
    },
    subtitle: {
      color: colors.textSecondary,
      fontFamily: getFont('400'), // Regular
    },
  });

  return <View style={styles.container}>...</View>;
}
```

### Using NativeWind + Theme Hook

```typescript
function MyComponent() {
  const { colors, getFont } = useThemeStyle();

  return (
    <View className="flex-1 p-4">
      <Text
        style={{
          color: colors.textPrimary,
          fontFamily: getFont('600')
        }}
        className="text-lg mb-4"
      >
        Hello World
      </Text>
    </View>
  );
}
```

### Font Weight Reference

Available weights for `getFont()`:

- `'300'`: Light
- `'400'`: Regular (default)
- `'500'`: Medium
- `'600'`: SemiBold
- `'700'`: Bold
- `'800'`: ExtraBold

### Available Colors

All colors from `Colors.light` and `Colors.dark`:

- `primary`, `secondary`
- `background`
- `textPrimary`, `textSecondary`
- `placeholder`
- `inputBorder`, `border`
- `danger`, `dangerSecondary`
- `error`, `success`
- `white`, `tint`

## Benefits

1. **Dynamic Theming**: Colors update automatically when theme changes
2. **Language Support**: Fonts switch automatically between Poppins (EN) and Cairo (AR)
3. **RTL Support**: Proper right-to-left layout for Arabic
4. **Type Safety**: Full TypeScript support
5. **Centralized Logic**: Single hook for all theme/language concerns
6. **Easy Migration**: Minimal changes to existing code
7. **NativeWind Compatible**: Works alongside Tailwind classes

## Notes

- Styles must be created inside component for dynamic theming
- RTL changes require app reload in production
- All fonts are loaded at app start
- Cairo fonts follow same weight system as Poppins
- Works with both StyleSheet and NativeWind

## Common Patterns

### Theme-aware components

```typescript
function ThemedButton({ title, onPress }) {
  const { colors, getFont } = useThemeStyle();

  return (
    <Pressable
      style={{
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 8,
      }}
      onPress={onPress}
    >
      <Text style={{
        color: colors.white,
        fontFamily: getFont('600')
      }}>
        {title}
      </Text>
    </Pressable>
  );
}
```

### Conditional styling based on language

```typescript
const { isRTL, colors } = useThemeStyle();

const styles = StyleSheet.create({
  row: {
    flexDirection: isRTL ? "row-reverse" : "row",
  },
  text: {
    textAlign: isRTL ? "right" : "left",
    marginLeft: isRTL ? 0 : 16,
    marginRight: isRTL ? 16 : 0,
  },
});
```
