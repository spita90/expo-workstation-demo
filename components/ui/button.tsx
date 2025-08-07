import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Pressable } from "react-native";

export const PRIMARY_BUTTON_STYLE =
  "bg-gradient-to-b from-primary-500 to-primary-800 border-[1px] border-primary-700 active:bg-primary-900 active:bg-none active:border-primary-800";
export const PRIMARY_LIGHT_BUTTON_STYLE =
  "bg-gradient-to-b from-primary-400 to-primary-500 border-[1px] border-primary-500 active:bg-primary-700 active:bg-none active:border-primary-600";
export const OUTLINE_BUTTON_STYLE =
  "bg-transparent border border-white active:border-zinc-400";

const buttonVariants = cva(
  "group flex items-center justify-center px-4 py-2 rounded ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: PRIMARY_BUTTON_STYLE,
        primaryLight: PRIMARY_LIGHT_BUTTON_STYLE,
        secondary: `bg-gradient-to-tr from-zinc-600 to-zinc-900 border-zinc-700 border-[1px]
          active:bg-zinc-800 active:bg-none`,
        pill: `h-8 px-3 py-0 bg-white/20 rounded-full
          active:bg-white/30`,
        outline: OUTLINE_BUTTON_STYLE,
        ghost: "hover:bg-accent",
      },
      disabled: { true: "", false: "" },
    },
    defaultVariants: {
      variant: "primary",
      disabled: false,
    },
    compoundVariants: [
      {
        variant: ["primary", "primaryLight", "secondary"],
        disabled: true,
        className: "bg-zinc-500 border-zinc-600 bg-none",
      },
      {
        variant: "pill",
        disabled: true,
        className: "bg-zinc-500 bg-none",
      },
      {
        variant: "outline",
        disabled: true,
        className: "border-zinc-600",
      },
    ],
  }
);

const buttonTextVariants = cva(
  "whitespace-nowrap paragraph-semibold-large text-white",
  {
    variants: {
      variant: {
        primary: "",
        primaryLight: "",
        secondary: "",
        pill: "",
        outline: "",
        ghost: "",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
    compoundVariants: [
      {
        variant: "pill",
        className: "paragraph-regular-small",
      },
    ],
  }
);

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(({ className, variant, ...props }, ref) => {
  return (
    <TextClassContext.Provider
      value={buttonTextVariants({
        variant,
        className: "pointer-events-none",
      })}
    >
      <Pressable
        className={cn(
          { "opacity-50 pointer-events-none": props.disabled },
          buttonVariants({ variant, className, disabled: props.disabled })
        )}
        ref={ref}
        role="button"
        {...props}
      />
    </TextClassContext.Provider>
  );
});
Button.displayName = "Button";

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
