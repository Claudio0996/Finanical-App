import { Provider } from "react-redux";

import { store } from "./store";
import { AppInitializer } from "./AppInitializer";
import { AppRouter } from "./AppRouter";

export function AppRoot() {
  return (
    <Provider store={store}>
      <>
        <AppInitializer />
        <AppRouter />
      </>
    </Provider>
  );
}
