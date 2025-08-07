import { Config } from "tailwindcss";
import { hairlineWidth } from "nativewind/theme";
import plugin from "tailwindcss/plugin";
import animate from "tailwindcss-animate";
import { typography } from "./lib/theme/typography";

const config: Config = {
  darkMode: ["class"],
  // NOTE: Update this to include the paths to all of your component files.
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        agdasima: ["AgdaSima", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
        zinc: {
          50: "#FAFAFA",
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B",
        },
        success: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },
        alert: {
          50: "#FEFCE8",
          100: "#FEF9C3",
          200: "#FEF08A",
          300: "#FDE047",
          400: "#FACC15",
          500: "#EAB308",
          600: "#CA8A04",
          700: "#A16207",
          800: "#854D0E",
          900: "#713F12",
        },
        background: "var(--background)",
        destructive: "var(--destructive)",
      },
      borderRadius: {
        DEFAULT: "6px",
      },
      spacing: {
        "spacing-4": "var(--spacing-4)",
        "spacing-8": "var(--spacing-8)",
        "spacing-12": "var(--spacing-12)",
        "spacing-16": "var(--spacing-16)",
        "spacing-24": "var(--spacing-24)",
        "spacing-32": "var(--spacing-32)",
      },
      backgroundImage: {
        "gradient-button-fill": "var(--gradient-button-fill)",
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    animate,
    plugin(({ addUtilities }) => {
      Object.entries(typography).map(([name, styles]) => {
        addUtilities({
          [`.${name}`]: styles,
        });
      });

      // Object.entries(textGradients).map(([name, styles]) => {
      //   addUtilities({
      //     [`.text-${name}`]: styles,
      //   });
      // });
    }),
  ],
};

export default config;
