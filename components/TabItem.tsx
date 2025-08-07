import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Pressable } from "react-native";
import { cn } from "@/lib/utils";
import { TextClassContext } from "@/components/ui/text";

const tabItemVariants = cva(
  "group flex items-center justify-center px-4 py-3 rounded border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: ``,
        glass: `border-gradient-button-stroke`,
      },
      state: {
        selected: ``,
        unselected: ``,
      },
      disabled: { true: "", false: "" },
    },
    defaultVariants: {
      variant: "default",
      state: "unselected",
      disabled: false,
    },
    compoundVariants: [
      {
        variant: "default",
        state: "selected",
        className: "border-zinc-500",
      },
      {
        variant: "default",
        state: "unselected",
        className: "border-transparent bg-zinc-50 border-zinc-100",
      },
      {
        variant: "glass",
        state: "unselected",
        className: "bg-gradient-button-fill",
      },
      {
        variant: "glass",
        state: "selected",
        className: "bg-zinc-800",
      },
    ],
  }
);

const tabItemTextVariants = cva(
  "whitespace-nowrap paragraph-semibold-large text-white",
  {
    variants: {
      variant: {
        default: "",
        glass: "",
      },
      state: {
        selected: "",
        unselected: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
    compoundVariants: [
      {
        variant: "default",
        state: "unselected",
        className: "text-zinc-800",
      },
    ],
  }
);

type TabItemProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof tabItemVariants>;

const TabItem = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  TabItemProps
>(({ className, variant, state, ...props }, ref) => {
  return (
    <TextClassContext.Provider
      value={tabItemTextVariants({
        variant,
        state,
        className: "pointer-events-none",
      })}
    >
      <Pressable
        className={cn(
          { "opacity-50 pointer-events-none": props.disabled },
          tabItemVariants({
            variant,
            state,
            className,
            disabled: props.disabled,
          })
        )}
        ref={ref}
        role="tab"
        {...props}
      />
    </TextClassContext.Provider>
  );
});
TabItem.displayName = "TabItem";

export { TabItem, tabItemTextVariants, tabItemVariants };
export type { TabItemProps };
