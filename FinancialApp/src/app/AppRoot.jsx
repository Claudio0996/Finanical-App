import { Provider } from "react-redux";

import { store } from "./store";
import { AppInitializer } from "./AppInitializer";
import { AppRouter } from "./AppRouter";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function AppRoot() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <>
          <AppInitializer />
          <AppRouter />
        </>
      </QueryClientProvider>
    </Provider>
  );
}
