import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import {
  Home,
  About,
  Blogs,
  SingleBlog,
  Categories,
  Contact,
  NotFound,
} from "../pages";
import { ROUTES } from "../constants";

/**
 * Central route map.
 * Add new pages here — keep App.jsx free of route noise.
 */
const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: ROUTES.ABOUT.slice(1), element: <About /> },
      { path: ROUTES.BLOGS.slice(1), element: <Blogs /> },
      { path: ROUTES.BLOG.slice(1), element: <SingleBlog /> },
      { path: ROUTES.CATEGORIES.slice(1), element: <Categories /> },
      { path: ROUTES.CONTACT.slice(1), element: <Contact /> },
      { path: ROUTES.NOT_FOUND, element: <NotFound /> },
    ],
  },
]);

export default router;
