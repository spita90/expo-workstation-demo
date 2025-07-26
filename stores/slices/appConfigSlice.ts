import { UnitOfMeasure } from "@/lib/utils";
import { FALLBACK_LANGUAGE } from "@/localizations";
import _ from "lodash";
import { StateCreator } from "zustand";

export enum InitializationType {
  INITIALIZING = "INITIALIZING",
  USER = "USER",
}

export type UnitOfMeasureSettings = {
  pressure: UnitOfMeasure;
  weight: UnitOfMeasure;
  temperature: UnitOfMeasure;
  volume: UnitOfMeasure;
};

export type SystemConfig = {
  serialNumber: string;
};

export type UserSettings = {
  userLanguage: string;
  unitOfMeasures: UnitOfMeasureSettings;
};

export type AppConfigState = {
  initializationType: InitializationType;
  userSettings: UserSettings;
  systemConfig: SystemConfig;
  wifiConnected: boolean;
  error?: Error;
};

export type AppConfigStore = AppConfigState & {
  setError(error: Error): void;
  setUserSettings(userSettings: Partial<UserSettings>): void;
  setSystemConfig(systemConfig: Partial<SystemConfig>): void;
  setInitializationType(initializationType: InitializationType): void;
};

const initialState: AppConfigState = {
  initializationType: InitializationType.INITIALIZING,
  userSettings: {
    userLanguage: FALLBACK_LANGUAGE,
    unitOfMeasures: {
      // international system default
      pressure: UnitOfMeasure.BAR,
      weight: UnitOfMeasure.GRAMS,
      temperature: UnitOfMeasure.CELSIUS_DEGREES,
      volume: UnitOfMeasure.MILLILITERS,
    },
  },
  systemConfig: {
    serialNumber: "",
  },
  wifiConnected: false,
};

export const createAppConfigSlice: StateCreator<
  AppConfigStore,
  [],
  [],
  AppConfigStore
> = (set, get) => ({
  ...initialState,
  setError(error) {
    set({ error });
  },
  setUserSettings(userSettings) {
    set({ userSettings: _.merge({}, get().userSettings, userSettings) });
  },
  setSystemConfig(systemConfig) {
    set({ systemConfig: _.merge({}, get().systemConfig, systemConfig) });
  },
  setInitializationType(initializationType) {
    set({
      initializationType,
    });
  },
});
