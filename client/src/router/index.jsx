import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import StudioLayout from "../studio/layouts/StudioLayout";
import ProtectedRoute from "../studio/components/ProtectedRoute";
import GuestRoute from "../studio/components/GuestRoute";
import StudioLoader from "../studio/components/StudioLoader/StudioLoader";
import { Loader } from "../components";
import { ROUTES, STUDIO } from "../constants";

const CmsPage = lazy(() => import("../pages/CmsPage/CmsPage"));
const Blogs = lazy(() => import("../pages/Blogs/Blogs"));
const SingleBlog = lazy(() => import("../pages/SingleBlog/SingleBlog"));
const Categories = lazy(() => import("../pages/Categories/Categories"));
const Contact = lazy(() => import("../pages/Contact/Contact"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

if (typeof window !== "undefined") {
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 600));
  idle(() => {
    import("../pages/Blogs/Blogs");
    import("../pages/SingleBlog/SingleBlog");
  });
}

const StudioLogin = lazy(() => import("../studio/pages/StudioLogin/StudioLogin"));
const StudioDashboard = lazy(
  () => import("../studio/pages/StudioDashboard/StudioDashboard")
);
const ContentList = lazy(
  () => import("../studio/pages/ContentList/ContentList")
);
const ContentEditor = lazy(
  () => import("../studio/pages/ContentEditor/ContentEditor")
);
const MediaLibrary = lazy(
  () => import("../studio/pages/MediaLibrary/MediaLibrary")
);
const PagesList = lazy(() => import("../studio/pages/PagesList/PagesList"));
const PageBuilder = lazy(
  () => import("../studio/pages/PageBuilder/PageBuilder")
);
const CommentsDesk = lazy(
  () => import("../studio/pages/CommentsDesk/CommentsDesk")
);
const CategoriesDesk = lazy(
  () => import("../studio/pages/CategoriesDesk/CategoriesDesk")
);
const SubscribersDesk = lazy(
  () => import("../studio/pages/SubscribersDesk/SubscribersDesk")
);
const SeoDesk = lazy(() => import("../studio/pages/SeoDesk/SeoDesk"));
const SettingsDesk = lazy(
  () => import("../studio/pages/SettingsDesk/SettingsDesk")
);
const StudioNotFound = lazy(
  () => import("../studio/pages/StudioNotFound/StudioNotFound")
);

function Suspend({ children, studio = false }) {
  return (
    <Suspense
      fallback={
        studio ? (
          <StudioLoader label="Opening Creator Studio…" />
        ) : (
          <Loader label="Opening the journal…" />
        )
      }
    >
      {children}
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    path: STUDIO.LOGIN,
    element: (
      <GuestRoute>
        <Suspend studio>
          <StudioLogin />
        </Suspend>
      </GuestRoute>
    ),
  },
  {
    path: STUDIO.ROOT,
    element: (
      <ProtectedRoute>
        <StudioLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspend studio>
            <StudioDashboard />
          </Suspend>
        ),
      },
      {
        path: "content",
        element: (
          <Suspend studio>
            <ContentList />
          </Suspend>
        ),
      },
      {
        path: "content/new",
        element: (
          <Suspend studio>
            <ContentEditor />
          </Suspend>
        ),
      },
      {
        path: "content/:id",
        element: (
          <Suspend studio>
            <ContentEditor />
          </Suspend>
        ),
      },
      {
        path: "media",
        element: (
          <Suspend studio>
            <MediaLibrary />
          </Suspend>
        ),
      },
      {
        path: "pages",
        element: (
          <Suspend studio>
            <PagesList />
          </Suspend>
        ),
      },
      {
        path: "pages/:id",
        element: (
          <Suspend studio>
            <PageBuilder />
          </Suspend>
        ),
      },
      {
        path: "categories",
        element: (
          <Suspend studio>
            <CategoriesDesk />
          </Suspend>
        ),
      },
      {
        path: "comments",
        element: (
          <Suspend studio>
            <CommentsDesk />
          </Suspend>
        ),
      },
      {
        path: "subscribers",
        element: (
          <Suspend studio>
            <SubscribersDesk />
          </Suspend>
        ),
      },
      {
        path: "seo",
        element: (
          <Suspend studio>
            <SeoDesk />
          </Suspend>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspend studio>
            <SettingsDesk />
          </Suspend>
        ),
      },
      {
        path: "*",
        element: (
          <Suspend studio>
            <StudioNotFound />
          </Suspend>
        ),
      },
    ],
  },
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspend>
            <CmsPage slug="home" />
          </Suspend>
        ),
      },
      {
        path: "about",
        element: (
          <Suspend>
            <CmsPage slug="about" />
          </Suspend>
        ),
      },
      {
        path: "blogs",
        element: (
          <Suspend>
            <Blogs />
          </Suspend>
        ),
      },
      {
        path: "blogs/:slug",
        element: (
          <Suspend>
            <SingleBlog />
          </Suspend>
        ),
      },
      {
        path: "categories",
        element: (
          <Suspend>
            <Categories />
          </Suspend>
        ),
      },
      {
        path: "contact",
        element: (
          <Suspend>
            <Contact />
          </Suspend>
        ),
      },
      {
        path: ":slug",
        element: (
          <Suspend>
            <CmsPage />
          </Suspend>
        ),
      },
      {
        path: "*",
        element: (
          <Suspend>
            <NotFound />
          </Suspend>
        ),
      },
    ],
  },
]);

export default router;
