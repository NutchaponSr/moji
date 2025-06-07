import { ImageAvatar } from "@/components/image-avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useSettingsModal } from "@/store/use-settings-modal";
import { CheckIcon, SettingsIcon, UserPlus2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Organization {
  id: string;
  name: string;
  image?: string | null;
}

interface ProfilePopoverProps {
  trigger: React.ReactNode;
  title: string;
  subtitle?: string;
  image?: string;
  email?: string;
  organizations: Organization[];
  currentOrganizationId: string;
  onLogout: () => void;
  align?: "start" | "end" | "center";
}

export const ProfilePopover = ({
  trigger,
  title,
  subtitle,
  image,
  email,
  organizations,
  currentOrganizationId,
  onLogout,
  align = "start"
}: ProfilePopoverProps) => {
  const router = useRouter();
  const { onOpen } = useSettingsModal();

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent align={align} className="w-64 p-0">
        <div className="p-3 flex flex-col gap-3">
          <div className="flex flex-row items-center justify-start gap-2 w-full">
            <ImageAvatar
              className="rounded size-8.5" 
              name={title}
              src={image || ""}
            />
            <div className="flex flex-col gap-0 whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-left text-foreground text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                {title}
              </span>
              {subtitle && (
                <span className="text-left text-muted-foreground text-xs whitespace-nowrap overflow-hidden text-ellipsis first-letter:uppercase">
                  {subtitle}
                </span>
              )}
            </div>
          </div>
          <div className="inline-flex gap-2">
            <Button size="xs" variant="outline">
              <SettingsIcon className="size-3.5" />
              Settings
            </Button>
            <Button size="xs" variant="outline" onClick={onOpen}>
              <UserPlus2Icon className="size-3.5" />
              Invite members
            </Button>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-px p-1">
          {email && (
            <p className="px-2 my-1 text-xs font-medium">
              {email}
            </p>
          )}
          {organizations.map((org) => (
            <Button 
              key={org.id} 
              size="sm" 
              variant="item" 
              onClick={() => router.push(`/${org.id}`)}
            >
              <ImageAvatar 
                name={org.name}
                src={org.image ?? ""}
                className="size-5 rounded"
                fallbackClassName="rounded uppercase text-sm font-medium bg-sky-400 text-white"
              />
              {org.name}
              {currentOrganizationId === org.id && (
                <CheckIcon className="size-3 ml-auto" />
              )}
            </Button>
          ))}
        </div>
        <Separator />
        <div className="flex flex-col gap-px p-1">
          <Button 
            size="sm" 
            variant="item" 
            className="font-medium h-6"
            onClick={onLogout}
          >
            Log out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}; 