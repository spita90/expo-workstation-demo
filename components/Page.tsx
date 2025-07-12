import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { View, ViewProps } from "react-native";
import { BackButton } from "./BackButton";

export interface PageProps extends ViewProps {
  children: React.ReactNode;
  title?: string;
  border?: "basic" | "popOver";
  noBackButton?: boolean;
  onBackButtonPress?: () => void;
  backButton?: React.ReactNode; // custom back button component
}

export const Page = ({
  children,
  title,
  border,
  className,
  noBackButton = false,
  onBackButtonPress,
  backButton,
  ...rest
}: PageProps) => {
  return (
    <View
      id="page"
      {...rest}
      className={cn(`flex flex-1 w-full flex-col p-4`, className)}
    >
      <View
        className={cn("flex flex-row gap-4 items-center", {
          "mb-4": !!title || !noBackButton,
        })}
      >
        {!noBackButton &&
          (backButton ?? <BackButton onPress={onBackButtonPress} />)}
        <Text className="title-semibold-large">{title}</Text>
      </View>
      <View className="flex flex-1 w-full items-center justify-center">
        {border ? (
          <View className="flex flex-1 w-full p-2 bg-white/20 rounded">
            {border === "popOver" ? (
              <View className="flex flex-1 p-4 bg-background rounded">
                {children}
              </View>
            ) : (
              children
            )}
          </View>
        ) : (
          children
        )}
      </View>
    </View>
  );
};
