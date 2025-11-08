/** @type {import('tailwindcss').Config} */
const Colors = {
  light: {
    primary: "#24647A",
    secondary: "#5EC2A5",
    background: "#ffffff",
    textPrimary: "#7E7E7E",
    textSecondary: "#C6C6C6",
    placeholder: "#C6C6C6",
    inputBorder: "#DCDCDC",
    border: "#D9D9D9",
    danger: "#FF5F6B",
    dangerSecondary: "#FF4B55",
    error: "#ef4444",
    success: "#22c55e",
    white: "#FFFFFF",
  },
  dark: {
    primary: "#5EC2A5",
    secondary: "#24647A",
    background: "#07222B",
    textPrimary: "#FFFFFF",
    textSecondary: "#C6C6C6",
    placeholder: "#C6C6C6",
    inputBorder: "#DCDCDC",
    border: "#D9D9D9",
    danger: "#FF5F6B",
    dangerSecondary: "#FF4B55",
    error: "#ef4444",
    success: "#22c55e",
    white: "#FFFFFF",
  },
};

module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
    './src/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // light tokens
        primary: Colors.light.primary,
        secondary: Colors.light.secondary,
        background: Colors.light.background,
        'text-primary': Colors.light.textPrimary,
        'text-secondary': Colors.light.textSecondary,
        placeholder: Colors.light.placeholder,
        'input-border': Colors.light.inputBorder,
        border: Colors.light.border,
        danger: Colors.light.danger,
        'danger-secondary': Colors.light.dangerSecondary,
        error: Colors.light.error,
        success: Colors.light.success,
        white: Colors.light.white,

        // dark tokens (explicit names)
        'primary-dark': Colors.dark.primary,
        'secondary-dark': Colors.dark.secondary,
        'background-dark': Colors.dark.background,
        'text-primary-dark': Colors.dark.textPrimary,
        'text-secondary-dark': Colors.dark.textSecondary,
        'placeholder-dark': Colors.dark.placeholder,
        'input-border-dark': Colors.dark.inputBorder,
        'border-dark': Colors.dark.border,
        'danger-dark': Colors.dark.danger,
        'danger-secondary-dark': Colors.dark.dangerSecondary,
        'error-dark': Colors.dark.error,
        'success-dark': Colors.dark.success,
      },
    },
  },
  plugins: [],
};
