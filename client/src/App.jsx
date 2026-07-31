import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context";
import { ToastProvider, ConfirmProvider } from "./studio/components/ux";
import router from "./router";

/**
 * App root — auth + studio UX providers wrap the router.
 */
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          <RouterProvider router={router} />
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
