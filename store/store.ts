import { configureStore, Action, combineReducers } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import UserSlice from "./userSlice";
import PreferencesSlice from "./userPreferencesSlice";
import { ThunkAction } from "redux-thunk";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const reducerr = combineReducers({
  user: UserSlice,
  preferences: PreferencesSlice,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducerr);
const epicMiddleware = createEpicMiddleware();

const store: any = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: false, //process.env.NODE_ENV !== 'production',
});

let persistor = persistStore(store);

export default store;
export { persistor };
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
