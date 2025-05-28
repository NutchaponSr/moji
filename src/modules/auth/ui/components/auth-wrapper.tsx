import { Socials } from "@/modules/auth/ui/components/socials";

interface Props {
  title: string;
  children: React.ReactNode;
}

export const AuthWrapper = ({ title, children }: Props) => {
  return (
    <div className="relative w-80 py-[5em] lg:py-24">
      <div className="flex flex-col gap-y-3">
        <div className="relative mb-4 text-muted-foreground">
          <h2 className="text-center text-xl">
            {title}
          </h2>
        </div>
        {children}
      </div>
      <div className="after:border-border relative text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t my-5">
        <span className="bg-card text-muted-foreground relative z-10 px-2 uppercase">
          Or continue with
        </span>
      </div>
      <Socials />

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 mt-5">
        By clicking continue, you agree to out <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
      </div>
    </div>
  );
}