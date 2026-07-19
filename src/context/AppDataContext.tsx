import {
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { loadAppData, persistAppData } from '../services/storage';
import { AppDataContext } from './app-data-context';
import type { AppDataAction, AppDataState } from '../types/domain';

function appDataReducer(state: AppDataState, action: AppDataAction): AppDataState {
  switch (action.type) {
    case 'ADD_STOCK':
      return { ...state, stocks: [action.payload, ...state.stocks] };
    case 'UPDATE_STOCK':
      return {
        ...state,
        stocks: state.stocks.map((stock) =>
          stock.stockCode === action.payload.stockCode ? action.payload : stock,
        ),
      };
    case 'RECEIVE_STOCK':
      return {
        ...state,
        stocks: state.stocks.map((stock) => {
          if (stock.stockCode !== action.payload.stockCode) return stock;
          return {
            ...stock,
            availableQuantity: stock.availableQuantity + action.payload.receivedQuantity,
            lastReceivedQuantity: action.payload.receivedQuantity,
            lastReceivedDate: action.payload.receivedDate,
            updatedAt: new Date().toISOString(),
          };
        }),
      };
    case 'ADD_SUPPLIER':
      return { ...state, suppliers: [action.payload, ...state.suppliers] };
    case 'UPDATE_SUPPLIER':
      return {
        ...state,
        suppliers: state.suppliers.map((supplier) =>
          supplier.supplierCode === action.payload.supplierCode
            ? action.payload
            : supplier,
        ),
      };
    case 'ADD_PURCHASE_ORDER':
      return {
        ...state,
        purchaseOrders: [action.payload, ...state.purchaseOrders],
      };
    case 'RESET_DEMO_DATA':
      return action.payload;
    default:
      return state;
  }
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appDataReducer, undefined, loadAppData);

  useEffect(() => {
    persistAppData(state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}
