import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import StudioLayout from "../studio/layouts/StudioLayout";
import ProtectedRoute from "../studio/components/ProtectedRoute";
import GuestRoute from "../studio/components/GuestRoute";
import StudioLoader from "../studio/components/StudioLoader/StudioLoader";
import { Loader } from "../components";
import { ROUTES, STUDIO } from "../constants";

const Home = lazy(() => import("../pages/Home/Home"));
const About = lazy(() => import("../pages/About/About"));
const Blogs = lazy(() => import("../pages/Blogs/Blogs"));
const SingleBlog = lazy(() => import("../pages/SingleBlog/SingleBlog"));
const Categories = lazy(() => import("../pages/Categories/Categories"));
const Contact = lazy(() => import("../pages/Contact/Contact"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

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
const StudioPlaceholder = lazy(
  () => import("../studio/pages/StudioPlaceholder/StudioPlaceholder")
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

function Placeholder({ title, description }) {
  return (
    <Suspend studio>
      <StudioPlaceholder title={title} description={description} />
    </Suspend>
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
          <Placeholder
            title="Pages"
            description="Static pages like About and Contact will be editable here."
          />
        ),
      },
      {
        path: "categories",
        element: (
          <Placeholder
            title="Categories"
            description="Organize the shelves of your journal."
          />
        ),
      },
      {
        path: "comments",
        element: (
          <Placeholder
            title="Comments"
            description="Moderate reader notes with a soft editorial eye."
          />
        ),
      },
      {
        path: "subscribers",
        element: (
          <Placeholder
            title="Subscribers"
            description="The quiet list of people who asked for letters."
          />
        ),
      },
      {
        path: "seo",
        element: (
          <Placeholder
            title="SEO"
            description="Titles, descriptions, and Open Graph details for discovery."
          />
        ),
      },
      {
        path: "settings",
        element: (
          <Placeholder
            title="Settings"
            description="Site identity, socials, and studio preferences."
          />
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
            <Home />
          </Suspend>
        ),
      },
      {
        path: "about",
        element: (
          <Suspend>
            <About />
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
