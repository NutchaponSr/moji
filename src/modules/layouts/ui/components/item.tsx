import { Icon } from "@iconify-icon/react";
import { VariantProps } from "class-variance-authority";
import { iconVariants } from "../../types";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import { JSX } from "react";

interface Props extends VariantProps<typeof iconVariants> {
  icon?: string;
  label: string;
  level?: number;
  action?: JSX.Element;
  isLast?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const Item = ({
  color,
  icon,
  label,
  isLast,
  isExpanded,
  level,
  text,
  action,
  onToggle
}: Props) => {
  return (
    <div 
      role="button" 
      className="select-none transition cursor-pointer flex font-medium hover:bg-sidebar-accent group/item"
      style={{
        paddingLeft: level ? `${(level * 12)}px` : undefined
      }}
    >
      <div className="flex items-center w-full text-sm min-h-7 h-7 px-2 py-1 gap-2">
        {icon && (
          <>
            <div className={cn(
                "shrink-0 grow-0 size-5.5 flex items-center justify-center rounded-sm group-hover/item:hidden", 
                isLast && "group-hover/item:flex",
                iconVariants({ color })
              )}
            >
              <Icon icon={icon} width={16} height={16} className={cn(iconVariants({ text }))} />
            </div>
            <div 
              role="button"
              onClick={onToggle}
              className={cn(
                "shrink-0 grow-0 size-5.5 hidden items-center justify-center rounded-sm group-hover/item:flex",
                isLast && "group-hover/item:hidden",
                iconVariants({ color: "secondary" })
              )}
            >
              <ChevronRightIcon className={cn("size-4 text-muted transition-transform", isExpanded && "rotate-90")} />
            </div>
          </>
        )}
        <p className="flex-1 whitespace-nowrap min-w-0 overflow-hidden text-ellipsis">
          {label}
        </p>

        {action && (
          <div className="flex items-center justify-center shrink-0 grow-0 h-full">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}