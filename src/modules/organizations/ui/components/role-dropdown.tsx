import { Icon } from "@iconify-icon/react";
import { ChevronDownIcon } from "lucide-react";

import { role } from "@/db/schema";

import { ROLE_OPTIONS } from "@/types/role";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Props {
  roleBase: typeof role.enumValues[number];
  onChange: (roleBase: typeof role.enumValues[number]) => void;
}

export const RoleDropdown = ({
  roleBase,
  onChange
}: Props) => {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <span className="first-letter:uppercase">
            {roleBase}
          </span>
          <ChevronDownIcon className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        {ROLE_OPTIONS.map((role) => (
          <DropdownMenuItem 
            key={role.value}
            onClick={() => onChange(role.value)}
            className="h-auto hover:bg-accent"
          >
            <div className="flex items-center gap-2 leading-[120%] select-none min-h-7 w-full text-sm">
              <div className="flex-1">
                <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {role.label}
                </div>
                <div className="mt-1 text-xs text-muted-foreground break-words">
                  {role.description}
                </div>
              </div>
              {roleBase === role.value && <Icon icon="game-icons:check-mark" className="ml-auto self-start size-3" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}