import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { AuthWrapper } from "@/modules/auth/ui/components/auth-wrapper";

const Page = () => {
  return (
    <AuthWrapper title="Sign in to your account">
      <SignInView />
    </AuthWrapper>
  );
}

export default Page;