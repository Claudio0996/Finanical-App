import { createBrowserRouter } from "react-router";

import LoadingPage from "../layouts/LoadingPage";

const loadingRouter = createBrowserRouter([{ path: "/", element: <LoadingPage /> }]);

export default loadingRouter;
