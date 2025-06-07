import { useSettingsModal } from "@/store/use-settings-modal";

import { 
  Dialog, 
  DialogContent, 
  DialogHidden
} from "@/components/ui/dialog";
import { SettingSidebar } from "./settings-sidebar";
import { PeopleContent } from "./people-content";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useParams } from "next/navigation";

export const SettingsModal = () => {
  const trpc = useTRPC();
  const params = useParams<{ organizationId: string }>();

  const { open, onClose } = useSettingsModal();
  const { 
    data: organization, 
    isLoading 
  } = useQuery(trpc.organizations.current.queryOptions({ organizationId: params.organizationId }));

  if (isLoading || !organization) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-6xl sm:max-w-[calc(100vw-100px)] h-[calc(100vh-100px)] max-h-[715px] border-none p-0 focus-visible:outline-none">
        <DialogHidden />
        <div className="flex flex-row h-full">
          <SettingSidebar />
          <div role="tabpanel" className="grow h-full max-h-[715px] overflow-hidden rounded-r-lg">
            <div className="flex flex-col w-full h-full bg-background">
              <PeopleContent organization={organization} />
            </div>
          </div>
        </div>  
      </DialogContent>
    </Dialog>
  );
}