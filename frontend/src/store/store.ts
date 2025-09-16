import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import authSlice from "./slices/authSlice.ts";
import { authApi } from "./api/authApi.ts";
import { baseApi } from "./api/baseApi.ts";

export const store = configureStore({
    reducer: {
        // API slice reducer (RTK Query)
        [ baseApi.reducerPath ]: baseApi.reducer,
        auth: authSlice,
    },
    // api middleware enables caching, invalidation, polling, ...
    middleware: ( getDefaultMiddleware ) =>
        getDefaultMiddleware({
            serializableCheck: {
                // ignore these action types
                ignoredActions: [ 'persist/PERSIST', 'persist/REHYDRATE' ],
            },
        }).concat(baseApi.middleware),
});

// enable listener behavior for the store (for automatic fetching)
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

