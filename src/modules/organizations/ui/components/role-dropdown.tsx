import { ChevronDownIcon } from "lucide-react";

import { role } from "@/db/schema";

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
        <DropdownMenuItem 
          onClick={() => onChange("admin")}
          className="flex flex-col items-start gap-0 leading-[120%] text-sm"
        >
          <p className="whitespace-nowrap overflow-hidden text-ellipsis font-medium">Admin</p>
          <p className="text-xs">
            Can create and edit workspaces and invite new members to organization
          </p>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onChange("member")}
          className="flex flex-col items-start gap-0 leading-[120%] text-sm"
        >
          <p className="whitespace-nowrap overflow-hidden text-ellipsis font-medium">Member</p>
          <p className="text-xs">
            Only can do form that be admited
          </p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}