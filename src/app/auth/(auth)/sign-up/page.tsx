import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";
import { AuthWrapper } from "@/modules/auth/ui/components/auth-wrapper";

const Page = async () => {
  return (
    <AuthWrapper socials title="Create a new account">
      <SignUpView />
    </AuthWrapper>
  );
}

export default Page;