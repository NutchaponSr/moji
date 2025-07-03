import { Command } from "cmdk";

interface Props {
  children: React.ReactNode;
  placeholder?: string;
}

export const CommandSearch = ({ children, placeholder }: Props) => {

  return (
    <Command className="flex flex-col gap-1">
      <div className="flex items-center">
        <Command.Input 
          placeholder={placeholder}
          className="shadow-[inset_0_0_0_1px_rgba(15,15,15,0.1)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0)] h-7 px-2 py-0.5 rounded-sm bg-input w-full placeholder:font-light placeholder:text-foreground text-tertiary text-sm font-normal focus:shadow-[inset_0_0_0_1px_rgba(37,132,227,0.57),0_0_0_2px_rgba(37,132,227,0.35)] focus-visible:outline-none"
        />
      </div>
      <Command.List className="relative flex flex-col focus:outline-none">
        <Command.Empty className="flex items-center gap-2 leading-[120%] w-full text-xs py-1 px-2 mb-1.5 text-tertiary mt-0.5">
          No result 
        </Command.Empty>
        {children}
      </Command.List>
    </Command>
  );
}