import { SwitchAuth } from "@/modules/auth/ui/components/switch-auth";

interface Props {
  children: React.ReactNode;
} 

const Layout = ({ children }: Props) => {
  return (
    <>
      <SwitchAuth />
      {children}
    </>
  );
}

export default Layout;