import { create } from "zustand";
import { AppConfigStore, createAppConfigSlice } from "./slices/appConfigSlice";
import {
  createPowerBoardDriverSlice,
  PowerBoardDriverStore,
} from "./slices/powerBoardDriverSlice";

type StoreState = AppConfigStore & PowerBoardDriverStore;

// Sliced stores pattern
// see https://github.com/pmndrs/zustand/blob/main/docs/guides/flux-inspired-practice.md#single-store
// and https://github.com/pmndrs/zustand/blob/main/docs/guides/slices-pattern.md
export const useGlobalStore = create<StoreState>()((...args) => ({
  ...createAppConfigSlice(...args),
  ...createPowerBoardDriverSlice(...args),
}));
