import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useId } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useSettingsModal } from "@/store/use-settings-modal";

const items = [
  { value: "light", label: "Light", image: "/ui-light.png" },
  { value: "dark", label: "Dark", image: "/ui-dark.png" },
  { value: "system", label: "System", image: "/ui-system.png" },
]

export const Preferences = () => {
  const id = useId();

  const { type } = useSettingsModal();
  const { theme, setTheme } = useTheme();

  if (type !== "preference") return null;

  return (
    <div className="grow py-9 px-15 flex flex-col overflow-auto">
      <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-border border-dotted">
        <h2 className="text-base font-medium text-primary">
          Preferences
        </h2>
      </div>

      <div className="flex flex-col gap-4.5">
        <div className="flex items-center">
          <div className="space-x-2 grow">
            <h3 className="text-sm text-primary font-normal w-auto mb-px">
              Appearance
            </h3>
            <p className="text-xs text-tertiary w-[85%] leading-4">
              Customize how Moji looks on your device.
            </p>
          </div>
          
          <RadioGroup 
            className="flex gap-3" 
            defaultValue={theme} 
            onValueChange={setTheme}
          >
            {items.map((item) => (
              <label key={`${id}-${item.value}`}>
                <RadioGroupItem 
                  id={`${id}-${item.value}`} 
                  value={item.value} 
                  className="peer sr-only after:absolute after:inset-0" 
                />
                <div className="relative h-16 w-24">
                  <Image 
                    fill
                    src={item.image}
                    alt={item.label}
                    className={cn(
                      "border relative cursor-pointer overflow-hidden rounded-md transition-[color,box-shadow] outline-none border-border",
                      item.value === theme && "border-marine ring-2 ring-marine/35"
                    )}
                  />
                </div>
              </label>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}