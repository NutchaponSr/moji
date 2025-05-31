import { AuthWrapper } from "@/modules/auth/ui/components/auth-wrapper";
import { OrgView } from "@/modules/organization/ui/views/org-view";

const Page = () => {
  return (
    <AuthWrapper title="Create your organization">
      <OrgView />
    </AuthWrapper>
  );
}

export default Page;