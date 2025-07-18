import { Logo } from "@/components/logo";
import { GridPattern } from "@/components/grid-pattern";

interface Props {
  children: React.ReactNode;
} 

const Layout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen">
      <Logo sticky />
      <div className="shrink relative hidden flex-1 basis-1/4 items-center justify-center border-r p-10 lg:flex">
        <GridPattern
          width={30}
          height={30}
          x={-1}
          y={-1}
          strokeDasharray={"4 2"}
        />
        <div className="overflow-hidden">
          <h2 className="absolute -translate-y-full text-wrap pr-10 text-6xl font-bold text-primary">
            Where Data Flows, Teams Grow
          </h2>
          <p className="py-10 text-primary">
            A database designed for every team, from simple tables to enterprise solutions
          </p>
        </div>
      </div>
      <div className="relative flex flex-1 shrink-0 flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default Layout;