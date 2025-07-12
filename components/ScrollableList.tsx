import { clamp } from "lodash";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ComponentType, useCallback, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  Pressable,
  View,
} from "react-native";

const CHEVRON_BUTTON_STYLE =
  "w-12 h-12 p-2 rounded-full bg-white/20 active:bg-white/10";

export interface ScrollableListProps {
  items: ArrayLike<any>;
  renderItem: ListRenderItem<any>;
  itemSeparatorComponent?: ComponentType<any>;
}

export const ScrollableList = ({
  items,
  renderItem,
  itemSeparatorComponent,
}: ScrollableListProps) => {
  const flatListRef = useRef<FlatList>(null);
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 0 });

  const scrollHeight = useRef<number>(1);
  const displayedListItemIndexes = useRef<number[]>([]);

  const [listHeight, setListHeight] = useState(1);
  const [scrollIndicatorContainerHeight, setScrollIndicatorContainerHeight] =
    useState(1);
  const [currentScrollOffset, setCurrentScrollOffset] = useState(0);
  const [scrollbarOffsetY, setScrollbarOffsetY] = useState(0);

  const isScrollable = listHeight > scrollHeight.current;

  const scrollbarHeight = clamp(
    (scrollHeight.current / listHeight) * scrollIndicatorContainerHeight,
    40,
    scrollIndicatorContainerHeight
  );

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setCurrentScrollOffset(offsetY);

    const maxScrollable = listHeight - scrollHeight.current;
    const maxScrollbarTranslate =
      scrollIndicatorContainerHeight - scrollbarHeight;

    if (maxScrollable > 0) {
      const ratio = offsetY / maxScrollable;
      setScrollbarOffsetY(ratio * maxScrollbarTranslate);
    } else {
      setScrollbarOffsetY(0);
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => isScrollable,
    onPanResponderMove: (_, gestureState) => {
      if (!isScrollable) return;

      const scrollRatio =
        (gestureState.dy / scrollHeight.current) * listHeight +
        currentScrollOffset;

      flatListRef.current?.scrollToOffset({
        offset: clamp(scrollRatio, 0, listHeight - scrollHeight.current),
        animated: false,
      });
    },
  });

  const onViewCallBack = useCallback((event: any) => {
    displayedListItemIndexes.current = event.viewableItems.map(
      (item: any) => item.index
    );
  }, []);

  const scrollOne = (where: "up" | "down") => {
    if (!isScrollable) return;
    let index = clamp(
      displayedListItemIndexes.current[0] + (where === "up" ? -1 : 1),
      0,
      items.length - 1
    );
    if (Number.isNaN(index)) index = 0;
    flatListRef.current?.scrollToIndex({ index });
  };

  return (
    <View className="flex-1 flex-row gap-4">
      <FlatList
        className="rounded"
        ref={flatListRef}
        data={items}
        ItemSeparatorComponent={itemSeparatorComponent}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={renderItem}
        initialNumToRender={items.length}
        onViewableItemsChanged={onViewCallBack}
        viewabilityConfig={viewConfigRef.current}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onContentSizeChange={(_, height) => setListHeight(height)}
        onLayout={(event) =>
          (scrollHeight.current = event.nativeEvent.layout.height)
        }
      />
      {isScrollable && (
        <View className="relative w-fit justify-between items-center gap-2">
          <Pressable onPress={() => scrollOne("up")}>
            <ChevronUp className={CHEVRON_BUTTON_STYLE} color="white" />
          </Pressable>
          <View
            className="relative flex-1 w-12 items-center"
            onLayout={(event) =>
              setScrollIndicatorContainerHeight(event.nativeEvent.layout.height)
            }
          >
            <View className="absolute w-4 h-full bg-white/20 rounded-full" />
            <View
              {...panResponder.panHandlers}
              className="absolute h-full flex items-center justify-center cursor-pointer"
              style={{
                width: 48,
                height: scrollbarHeight,
                transform: [{ translateY: scrollbarOffsetY }],
              }}
            >
              <View className="w-4 h-full self-center bg-white rounded-full" />
            </View>
          </View>
          <Pressable onPress={() => scrollOne("down")}>
            <ChevronDown className={CHEVRON_BUTTON_STYLE} color="white" />
          </Pressable>
        </View>
      )}
    </View>
  );
};
