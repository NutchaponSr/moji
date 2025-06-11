import { Icon } from "@iconify-icon/react";

interface Props {
  icon: string;
  label: string;
}

export const Navigation = ({
  icon,
  label
}: Props) => {
  return (
    <div role="button" className="select-none transition cursor-pointer flex font-medium hover:bg-sidebar-accent">
      <div className="flex items-center w-full text-sm min-h-7 h-7 px-2 py-1 gap-2">
        <div className="shrink-0 grow-0 size-5.5 flex items-center justify-center">
          <Icon icon={icon} width={20} height={20} className="text-tertiary stroke-3" />
        </div>
        <p className="flex-1 whitespace-nowrap min-w-0 overflow-hidden text-ellipsis">
          {label}
        </p>
      </div>
    </div>
  );
}