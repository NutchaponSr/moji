

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { OrganizationForm } from "@/modules/organizations/ui/components/organization-form";

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void
}

export const OrganizationCreateSheet = ({ ...props }: Props) => {
  return (
    <Sheet {...props}>
      <SheetContent className="w-[420px] flex flex-col">
        <SheetHeader className="h-11 flex flex-row justify-between items-center px-3">
          <SheetTitle className="grid grid-flow-col">
            <SheetClose />
          </SheetTitle>
          <div />
        </SheetHeader>
        <div className="pb-[120px] grid grid-cols-[48px_1fr_48px] gap-y-4">
          <h2 className="col-start-2 text-xl font-semibold">
            Create organization
          </h2>
          <div className="col-start-2">
            <OrganizationForm />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}