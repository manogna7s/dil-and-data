import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context";
import router from "./router";

/**
 * App root — auth provider wraps the router for Creator Studio sessions.
 */
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
