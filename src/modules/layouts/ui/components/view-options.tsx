import { ArrowLeftIcon, ChevronRightIcon, LucideIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { ViewOptionsType } from "../../types";
import { viewOptionsHeader } from "../../constants";

interface ViewOptionsContentProps {
  children: React.ReactNode;
}

interface ViewOptionsItemProps {
  icon?: LucideIcon;
  label: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
}

interface ViewOptionsHeaderProps {
  viewOptions: ViewOptionsType;
  onBack: () => void;
}

const ViewOptionsContent = ({ children }: ViewOptionsContentProps) => {
  return (
    <div className="flex flex-col gap-px relative p-2">
      {children}
    </div>
  );
}

const ViewOptionsSeparator = () => {
  return (
    <div className="mx-4">
      <Separator />
    </div>
  );
}

const ViewOptionsItem = ({
  icon: Icon,
  label,
  description,
  action,
  onClick
}: ViewOptionsItemProps) => {
  return (
    <div 
      role="button"
      onClick={onClick}
      className="transition w-full flex rounded-sm text-primary items-center gap-2 leading-[120%] select-none min-h-7 text-sm px-2 hover:bg-accent"
    >
      {Icon && (
        <div className="flex items-center justify-center size-4.5">
          <Icon className="size-4.5 stroke-[1.7]" />
        </div>
      )}
      <div className="grow text-start">
        <p className="whitespace-nowrap overflow-hidden text-ellipsis text-sm">
          {label}
        </p>
      </div>

      <div className="ml-auto shrink-0 flex items-center text-muted">
        {description && (
          <p className="whitespace-nowrap overflow-hidden text-ellipsis text-sm first-letter:uppercase">
            {description}
          </p>
        )}
        {action ? action : <ChevronRightIcon className="size-4 ml-1.5" />}
      </div>
    </div>
  );
}

export const ViewOptionsHeader = ({ viewOptions, onBack }: ViewOptionsHeaderProps) => {
  return (
    <div className="flex items-center pt-3.5 px-4 pb-1.5 h-10.5">
    {viewOptions !== null && (
      <Button 
        variant="icon" 
        size="smIcon" 
        className="mr-2"
        onClick={onBack} 
      >
        <ArrowLeftIcon className="size-4 text-tertiary" />
      </Button>
    )}
    <h4 className="grow font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis text-primary">
      {viewOptionsHeader[viewOptions]}
    </h4>
    <button className="transition flex items-center justify-center rounded-full bg-accent size-4.5 shrink-0 hover:bg-white/3">
      <XIcon className="size-3 text-secondary stroke-[2.5]" />
    </button>
  </div>
  );
}

export {
  ViewOptionsContent,
  ViewOptionsItem,
  ViewOptionsSeparator
}