import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi.ts";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { authReducer } from "./slices/authSlice.ts";

export const store = configureStore({
    reducer: {
        // auth slice reducer
        auth: authReducer,

        // API slice reducer
        [ baseApi.reducerPath ]: baseApi.reducer,
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

