// store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import coinsReducer from "@/store/slices/coins-slice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userApi } from "@/services/user";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["coins"], // persist only coins slice
};

const rootReducer = combineReducers({
  coins: coinsReducer,
  [userApi.reducerPath]: userApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(userApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
