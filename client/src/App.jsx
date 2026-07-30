import { RouterProvider } from "react-router-dom";
import router from "./router";

/**
 * App root — mounts the router.
 * Providers (auth, theme) will wrap RouterProvider in later phases.
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;
