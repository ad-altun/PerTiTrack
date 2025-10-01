import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import authSlice from "./slices/authSlice.ts";
import { baseApi } from "./api/baseApi.ts";
import workspaceSlice from "./slices/workspaceSlice.ts";
import timeTrackSlice from "./slices/timeTrackSlice.ts";
import { rtkQueryErrorLogger } from "./middleware/errorMiddleware.ts";

export const store = configureStore({
    reducer: {
        // API slice reducer (RTK Query)
        [ baseApi.reducerPath ]: baseApi.reducer,
        auth: authSlice,
        workspace: workspaceSlice,
        timeTrack: timeTrackSlice,
    },
    // api middleware enables caching, invalidation, polling, ...
    middleware: ( getDefaultMiddleware ) =>
        getDefaultMiddleware({
            serializableCheck: {
                // ignore these action types
                ignoredActions: [ 'persist/PERSIST', 'persist/REHYDRATE' ],
            },
        })
            .concat(baseApi.middleware)
            .concat(rtkQueryErrorLogger),
});

// enable listener behavior for the store (for automatic fetching)
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

