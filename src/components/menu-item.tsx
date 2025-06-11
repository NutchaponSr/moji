import { Icon } from "@iconify-icon/react";

import { cn } from "@/lib/utils";

interface Props {
  icon: string;
  label: string;
  isPlan?: boolean;
  isActive?: boolean;
  onOpen: () => void;
}

export const MenuItem = ({
  icon,
  label,
  isPlan,
  isActive,
  onOpen
}: Props) => {
  return (
    <div 
      role="tab"
      onClick={onOpen}
      className={cn(
        "min-h-7 transition cursor-pointer flex items-center justify-between px-2 rounded-sm relative hover:bg-primary/6", isActive && "bg-primary/6 hover:bg-primary/10"
      )}
    >
      <div className="flex items-center space-x-2">
        <Icon icon={icon} height={20} width={20} className={cn("text-primary shrink-0 stroke-[1.65]", isPlan && "text-marine")} />
        <p className={cn(
          "text-sm leading-5 text-primary overflow-hidden whitespace-nowrap text-ellipsis", 
          isPlan && "text-marine",
          isActive && "font-medium"
        )}>
          {label}
        </p>
      </div>
    </div>
  );
}