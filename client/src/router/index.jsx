import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Loader } from "../components";
import { ROUTES } from "../constants";

const Home = lazy(() => import("../pages/Home/Home"));
const About = lazy(() => import("../pages/About/About"));
const Blogs = lazy(() => import("../pages/Blogs/Blogs"));
const SingleBlog = lazy(() => import("../pages/SingleBlog/SingleBlog"));
const Categories = lazy(() => import("../pages/Categories/Categories"));
const Contact = lazy(() => import("../pages/Contact/Contact"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

function Suspend({ children }) {
  return <Suspense fallback={<Loader label="Opening the journal…" />}>{children}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [
      { index: true, element: <Suspend><Home /></Suspend> },
      { path: "about", element: <Suspend><About /></Suspend> },
      { path: "blogs", element: <Suspend><Blogs /></Suspend> },
      { path: "blogs/:slug", element: <Suspend><SingleBlog /></Suspend> },
      { path: "categories", element: <Suspend><Categories /></Suspend> },
      { path: "contact", element: <Suspend><Contact /></Suspend> },
      { path: "*", element: <Suspend><NotFound /></Suspend> },
    ],
  },
]);

export default router;
