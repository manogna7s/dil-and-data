import { PageContainer, SectionTitle, Breadcrumb } from "../../components";
import { ROUTES } from "../../constants";

function SingleBlog() {
  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: "Home", href: ROUTES.HOME },
          { label: "Blogs", href: ROUTES.BLOGS },
          { label: "Single Blog" },
        ]}
      />
      <SectionTitle>Single Blog</SectionTitle>
    </PageContainer>
  );
}

export default SingleBlog;
