import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AppConfigStore, createAppConfigSlice } from "./slices/appConfigSlice";
import {
  createPowerBoardDriverSlice,
  PowerBoardDriverStore,
} from "./slices/powerBoardDriverSlice";

type StoreState = AppConfigStore & PowerBoardDriverStore;

// Sliced stores pattern
// see https://github.com/pmndrs/zustand/blob/main/docs/guides/flux-inspired-practice.md#single-store
// and https://github.com/pmndrs/zustand/blob/main/docs/guides/slices-pattern.md
export const useGlobalStore = create<StoreState>()((...args) => {
  const persistedAppConfig = persist<AppConfigStore>(
    (set, get) => createAppConfigSlice(set, get, {} as any),
    {
      name: "app-config-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state): any => ({
        userSettings: state.userSettings,
        systemConfig: state.systemConfig,
      }),
    }
  );

  return {
    ...persistedAppConfig(...args),
    ...createPowerBoardDriverSlice(...args),
  };
});
