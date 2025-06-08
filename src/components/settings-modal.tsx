import { useSettingsModal } from "@/store/use-settings-modal";

import { 
  Dialog, 
  DialogContent, 
  DialogHidden
} from "@/components/ui/dialog";

import { PeopleContent } from "@/components/people-content";
import { SettingSidebar } from "@/components/settings-sidebar";

export const SettingsModal = () => {
  const { open, onClose } = useSettingsModal();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-6xl sm:max-w-[calc(100vw-100px)] h-[calc(100vh-100px)] max-h-[715px] border-none p-0 focus-visible:outline-none">
        <DialogHidden />
        <div className="flex flex-row h-full">
          <SettingSidebar />
          <div role="tabpanel" className="grow h-full max-h-[715px] overflow-hidden rounded-r-lg">
            <div className="flex flex-col w-full h-full bg-background">
              <PeopleContent />
            </div>
          </div>
        </div>  
      </DialogContent>
    </Dialog>
  );
}