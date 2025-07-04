"use client";

import { Icon } from "@iconify-icon/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetHidden,
  SheetTrigger,
} from "@/components/ui/sheet"

import { peeks } from "../../constants";
import { useLayoutsStore } from "../../store/use-layouts-store";
import { Button } from "@/components/ui/button";
import { AtSignIcon, ChevronsRightIcon, CircleArrowUpIcon, ImageIcon, MoreHorizontalIcon, MoveDiagonal2Icon, PaperclipIcon, SidebarIcon } from "lucide-react";
import { Group } from "@/modules/groups/types";
import { useState } from "react";
import { Table } from "@tanstack/react-table";
import { authClient } from "@/lib/auth-client";
import { ImageAvatar } from "@/components/image-avatar";

interface Props<T extends Group> {
  data: T;
  table: Table<T>;
}

export const PeekButton = <T extends Group,>({ data, table }: Props<T>) => {
  const { peek } = useLayoutsStore();
  const { data: session } = authClient.useSession();

  const [value, setValue] = useState<Group>(data);

  const year = table.getAllColumns().find((f) => f.id === "year");

  const PeekIcon = peeks[peek].icon;

  const PropertyIcon = year?.columnDef.meta?.icon;

  return (
    <div className="flex justify-end absolute top-1.5 right-0 left-0 z-2 mx-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
      <div className="flex pointer-events-auto bg-popover dark:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.16),0_0_0_1px_rgba(255,255,255,0.094)] rounded-sm sticky right-1 p-0.5 h-6">
        <Sheet>
          <SheetTrigger asChild>
            <div role="button" className="transiton hover:bg-accent flex items-center justify-center h-5 px-1 rounded whitespace-nowrap text-xs font-medium leading-[1.2] text-tertiary uppercase tracking-wide gap-1">
              <PeekIcon className="size-3.5 stroke-2" />
              Open
            </div>
          </SheetTrigger>
          <SheetContent className="w-xl flex flex-col gap-0">
            <SheetHidden />
            <SheetHeader className="z-100 bg-popover">
              <div className="h-11 flex justify-between items-center px-3">
                <div className="flex gap-0.5 items-center">
                  <Button variant="icon" size="smIcon">
                    <ChevronsRightIcon className="size-4.5" />
                  </Button>
                  <Button variant="icon" size="smIcon">
                    <MoveDiagonal2Icon className="size-4.5" />
                  </Button>
                  <div className="h-3.5 w-px mx-1.5 bg-white/21" />
                  <Button variant="icon" size="smIcon">
                    <SidebarIcon className="size-4.5" />
                  </Button>
                </div>

                <div className="flex items-center grow-0 shrink-0 pl-3 justify-end gap-1.5">
                  <Button variant="ghost" size="sm">
                    Share
                  </Button>
                  <Button variant="ghost" size="smIcon">
                    <MoreHorizontalIcon className="size-4.5" />
                  </Button>
                </div>
              </div>
            </SheetHeader>

            <div className="flex flex-col relative items-center grow">
              <div className="grid grid-cols-[minmax(76px,1fr)_minmax(auto,424px)_minmax(76px,1fr)]">
                <div className="col-start-2 group">
                  <div className="flex py-1 justify-start flex-wrap opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="text-muted hover:text-muted">
                      <ImageIcon />
                      Add cover
                    </Button>
                  </div>
                  <div className="flex flex-col justify-start space-y-2">
                    <Button variant="ghost" size="lgIcon">
                      <Icon icon={value.icon || "lucide:file"} width={32} height={32} />
                    </Button>
                    
                    <div className="grow">
                      <div className="text-primary font-bold leading-[1.2] text-[32px] cursor-text flex items-center">
                        <input 
                          value={value.name}
                          placeholder="New page"
                          onChange={(e) => setValue({ ...value, name: e.target.value })}
                          className="max-w-full w-full whitespace-break-spaces break-words caret-primary px-0.5 pt-0.5 font-bold text-[1em] text-primary focus:outline-none placeholder:text-[#373737]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-start-2">
                  <div className="grow shrink-0 flex flex-col w-full max-w-full">
                    <div className="pt-3 grid grid-cols-1">
                      <div className="mb-3 pb-3">
                        <div className="flex flex-col gap-2">
                          <h2 className="py-1 text-xs leading-4.5 text-tertiary font-semibold flex flex-row ml-1.5">
                            Properties
                          </h2>

                          <table className="pt-2">
                            <tbody className="flex flex-col space-y-1">
                              <tr className="flex w-full relative mb-1">
                                <td className="h-[34px] w-40 max-w-40 items-center flex">
                                  <button className="hover:bg-accent transition cursor-pointer flex items-center rounded px-1.5 h-full w-full">
                                    <div className="flex items-center space-x-1 text-sm font-normal">
                                      {PropertyIcon && <PropertyIcon className="size-4 text-tertiary" />}
                                      <div className="whitespace-nowrap overflow-hidden text-ellipsis text-tertiary">
                                        Year
                                      </div>
                                    </div>
                                  </button>
                                </td>
                                <td className="flex grow h-full w-auto items-center ml-1">
                                  <button className="hover:bg-accent transition relative text-sm overflow-hidden inline-flex rounded items-center w-full h-[34px] px-1.5 py-1">
                                    <div className="text-muted leading-5 break-words whitespace-pre-wrap">
                                      Empty
                                    </div>
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* TODO: Comment page */}
                      <div className="mb-3">
                        <div className="flex flex-col gap-0.5">
                          <h2 className="py-1 text-xs leading-4.5 text-tertiary font-semibold flex flex-row ml-1.5">
                            Comments
                          </h2>

                          <div className="py-2.5">
                            <div className="flex flex-col w-full cursor-pointer">
                              <div className="flex items-center gap-1 grow">
                                <div className="shrink-0 grow-0 items-start">
                                  <ImageAvatar
                                    className="size-6"
                                    fallbackClassName="text-sm border"
                                    src={session?.user.image || ""}
                                    name={session?.user.name || ""}
                                  />
                                </div>
                                <div className="flex w-full text-sm flex-wrap cursor-text self-center relative justify-end items-center gap-x-1.5 p-1">
                                  <div className="grow flex min-h-6 pt-0.5">
                                    <input 
                                      placeholder="Add a comments..."
                                      className="max-w-full w-full font-normal whitespace-break-spaces break-words caret-primary px-0.5 pt-0.5 text-[1em] text-primary focus:outline-none placeholder:text-muted"
                                    />
                                  </div>
                                  <div className="flex flex-col-reverse items-end">
                                    <div className="flex flex-row items-center gap-1.5">
                                      <Button variant="icon" size="smIcon">
                                        <PaperclipIcon />
                                      </Button>
                                      <Button variant="icon" size="smIcon">
                                        <AtSignIcon />
                                      </Button>
                                      <Button variant="icon" size="smIcon">
                                        <CircleArrowUpIcon />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}