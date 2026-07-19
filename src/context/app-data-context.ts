import { createContext, type Dispatch } from 'react';
import type { AppDataAction, AppDataState } from '../types/domain';

export interface AppDataContextValue {
  state: AppDataState;
  dispatch: Dispatch<AppDataAction>;
}

export const AppDataContext = createContext<AppDataContextValue | null>(null);
