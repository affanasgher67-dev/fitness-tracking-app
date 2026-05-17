import { NativeModules, TurboModuleRegistry } from 'react-native';

const STORAGE_KEY = 'WORKOUT_PROGRESS';

let memoryProgress: Progress = {};

type Progress = {
  [level: string]: number[];
};

type NativeAsyncStorageModule = {
  multiGet: (
    keys: string[],
    callback: (errors?: unknown, result?: Array<[string, string | null]>) => void
  ) => void;
  multiSet: (
    keyValuePairs: Array<[string, string]>,
    callback: (errors?: unknown) => void
  ) => void;
};

const getNativeAsyncStorage = (): NativeAsyncStorageModule | null => {
  const storageModule =
    TurboModuleRegistry?.get('PlatformLocalStorage') ||
    TurboModuleRegistry?.get('RNC_AsyncSQLiteDBStorage') ||
    TurboModuleRegistry?.get('RNCAsyncStorage') ||
    NativeModules.PlatformLocalStorage ||
    NativeModules.RNC_AsyncSQLiteDBStorage ||
    NativeModules.RNCAsyncStorage;

  if (
    storageModule &&
    typeof storageModule.multiGet === 'function' &&
    typeof storageModule.multiSet === 'function'
  ) {
    return storageModule as NativeAsyncStorageModule;
  }

  return null;
};

export const getProgress = async (): Promise<Progress> => {
  try {
    const storage = getNativeAsyncStorage();

    if (!storage) {
      return memoryProgress;
    }

    return await new Promise<Progress>(resolve => {
      storage.multiGet([STORAGE_KEY], (_errors, result) => {
        const storedValue = result?.[0]?.[1];

        if (!storedValue) {
          resolve(memoryProgress);
          return;
        }

        try {
          const parsed = JSON.parse(storedValue) as Progress;
          memoryProgress = parsed;
          resolve(parsed);
        } catch {
          resolve(memoryProgress);
        }
      });
    });
  } catch {
    return memoryProgress;
  }
};

export const markDayComplete = async (level: string, day: number) => {
  const progress = await getProgress();

  if (!progress[level]) {
    progress[level] = [];
  }

  if (!progress[level].includes(day)) {
    progress[level].push(day);
  }

  memoryProgress = progress;

  try {
    const storage = getNativeAsyncStorage();

    if (!storage) {
      return;
    }

    await new Promise<void>(resolve => {
      storage.multiSet([[STORAGE_KEY, JSON.stringify(progress)]], () => {
        resolve();
      });
    });
  } catch {
    // Fall back to in-memory progress when native storage is unavailable.
  }
};
