import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Props {
  connector: "and" | "or";
  onChange: (connector: "and" | "or") => void;
}

export const ConnectorDropdown = ({ connector, onChange }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="xs" variant="primary" className="h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-[10px] rounded px-2">
          {connector}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onChange("and")}>And</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange("or")}>Or</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}