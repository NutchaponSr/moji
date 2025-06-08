import { useSettingsModal } from "@/store/use-settings-modal";

import { Separator } from "@/components/ui/separator";

import { MenuItem } from "@/components/menu-item";

export const SettingSidebar = () => {
  const { type, onChange } = useSettingsModal();

  return (
    <div className="h-full bg-[#fbfbfa] grow-0 shrink-0 w-60 overflow-y-auto rounded-l-lg">
      <div className="flex flex-col justify-between py-3 px-2 gap-1">
        <div role="tablist" aria-orientation="vertical" className="flex flex-col gap-px">
          <h3 className="text-xs leading-none mb-px text-[#73726e] font-semibold flex h-6 px-2 text-ellipsis overflow-hidden">
            Account
          </h3>
          <MenuItem 
            icon="solar:user-circle-outline"
            label="Account"
            onOpen={() => {}}
          />
          <MenuItem 
            icon="solar:tuning-2-outline"
            label="Preferences"
            onOpen={() => {}}
          />
          <MenuItem 
            icon="solar:bell-outline"
            label="Notification"
            onOpen={() => {}}
          />
          <MenuItem 
            icon="solar:plug-circle-outline"
            label="Connections"
            onOpen={() => {}}
          />
          <div className="h-4.5 w-full flex" />
          <h3 className="text-xs leading-none mb-px text-[#73726e] font-semibold flex h-6 px-2 text-ellipsis overflow-hidden">
            Organization
          </h3>
          <MenuItem 
            icon="solar:settings-outline"
            label="General"
            onOpen={() => {}}
          />
          <MenuItem 
            icon={type === "people" ? "solar:users-group-rounded-bold" : "solar:users-group-rounded-outline"}
            label="Poeple"
            onOpen={() => onChange("people")}
            isActive={type === "people"}
          />
          <MenuItem 
            icon="solar:buildings-outline"
            label="Teamspaces"
            onOpen={() => {}}
          />
          <MenuItem 
            icon={type === "security" ? "solar:lock-keyhole-minimalistic-bold" : "solar:lock-keyhole-minimalistic-outline"}
            label="Security"
            onOpen={() => onChange("security")}
            isActive={type === "security"}
          />
          <MenuItem 
            icon="solar:shield-check-outline"
            label="Identity"
            onOpen={() => {}}
          />
          <Separator className="my-2" />
          <MenuItem 
            icon="solar:cpu-outline"
            label="Moji AI"
            onOpen={() => {}}
          />
          <MenuItem 
            icon="solar:widget-outline"
            label="Connections"
            onOpen={() => {}}
          />
          <MenuItem 
            icon="solar:sticker-smile-circle-2-outline"
            label="Emoji"
            onOpen={() => {}}
          />
          <MenuItem 
            icon="solar:archive-down-minimlistic-outline"
            label="Import"
            onOpen={() => {}}
          />
          <Separator className="my-2" />
          <MenuItem 
            icon="solar:round-arrow-up-bold"
            label="Upgrade plan"
            onOpen={() => {}}
            isPlan
          />
        </div>
      </div>
    </div>
  );
}