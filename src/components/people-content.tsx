import { useSettingsModal } from "@/store/use-settings-modal";
import { Button } from "./ui/button";
import { Organization } from "@/modules/organizations/types";
import { RoleDropdown } from "@/modules/organizations/ui/components/role-dropdown";
import { useState } from "react";
import { role } from "@/db/schema"
import { cn } from "@/lib/utils";
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { columns as invitationColumns } from "@/modules/invitations/ui/components/invitation-columns";
import { columns as memberColumns } from "@/modules/members/ui/components/member-columns";
import { SearchIcon } from "lucide-react";
import { Icon } from "@iconify-icon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

interface Props {
  organization: Organization;
}

export const PeopleContent = ({ organization }: Props) => {
  const { type } = useSettingsModal();

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  const [isFocused, setIsFocused] = useState(false);
  const [memberGlobalFilter, setMemberGlobalFilter] = useState("");

  const [roleBase, setRoleBase] = useState<typeof role.enumValues[number]>("member");

  const createLink = useMutation(trpc.invitations.create.mutationOptions());

  const table = useReactTable({
    data: organization.invitations,
    columns: invitationColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableMember = useReactTable({
    data: organization.members,
    columns: memberColumns,
    state: {
      globalFilter: memberGlobalFilter,
    },
    onGlobalFilterChange: setMemberGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  const handleGenerateLink = () => {
    createLink.mutate({
      organizationId: organization.id,
      role: roleBase,
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.organizations.current.queryOptions({ organizationId: organization.id }));
      }
    });
  }

  if (type !== "people") return null;

  return (
    <div className="grow py-9 px-15 flex flex-col overflow-auto">
      <div className="flex flex-col">
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-dotted">
          <h2 className="text-base font-medium text-primary">
            Share link
          </h2>
        </div>
        <div className="flex flex-col gap-4.5">
          <div className="flex items-center">
            <div className="space-x-2 grow">
              <h3 className="text-sm text-primary font-normal w-auto mb-px">
                Role
              </h3>
              <p className="text-xs text-[#73726e] w-[85%] leading-4">
                access to anyone who open it.
              </p>
            </div>

            <RoleDropdown roleBase={roleBase} onChange={(role) => setRoleBase(role)} />
          </div>
          <div className="flex items-center">
            <div className="space-x-2 grow">
              <h3 className="text-sm text-primary font-normal w-auto mb-px">
                Invite link to add member
              </h3>
              <p className="text-xs text-[#73726e] w-[85%] leading-4">
              Only people with permission to invite members can see this.
              </p>
            </div>

            <Button 
              variant="primary" 
              onClick={handleGenerateLink}
              disabled={organization.invitations.length >= 2}
            >
              Generate
            </Button>
          </div>

          <div className="text-sm text-primary leading-5 whitespace-nowrap overflow-hidden text-ellipsis font-medium flex h-7 items-center">
            Invite links
          </div>

          <table className="w-full text-xs border-y border-primary/9">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="h-8 w-full">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="font-normal text-left px-2"
                      style={{ width: header.column.columnDef.meta?.width }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header,header.getContext())
                      }
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="w-full border-t border-primary/9">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="py-2 h-11 px-2"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={table.getAllColumns().length} 
                    className="text-xs text-[#73726e] leading-4 whitespace-nowrap overflow-hidden text-ellipsis h-8 px-1 py-2 border-t border-primary/9"
                  >
                    No links
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="h-10 w-full" />
      <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-dotted">
        <h2 className="text-base font-medium text-primary">
          People
        </h2>

        <label className={cn(
          "flex items-center max-w-64 w-full text-xs leading-4 py-1 px-2.5 rounded-full bg-[#f2f1ee99] cursor-text",
          isFocused 
            ? "shadow-[inset_0_0_0_1px_rgba(84,72,49,0.15),0_0_0_2px_rgb(255,255,255),0_0_0_4px_rgb(35,131,226),0_0_0_6px_rgb(255,255,255)]"
            : "shadow-[0_0_0_1px_rgba(15,15,15,0.1)]"
        )}>
          <SearchIcon className="size-4 mr-2 text-[#73726e]" />
          <input 
            placeholder="Search member"
            className="focus-visible:outline-none h-4 w-full placeholder:text-xs placeholder:text-[#b6b5b2] text-primary"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={memberGlobalFilter}
            onChange={(e) => setMemberGlobalFilter(e.target.value)}
          />
          {memberGlobalFilter && (
            <button
              onClick={() => setMemberGlobalFilter("")}
              className="inline-flex justify-center items-center shrink-0 rounded-full transition ml-2"
            >
              <Icon icon="solar:close-circle-bold" height={16} width={16} className="text-[#c1bfb8] hover:text-[#b6b5b2]" />
            </button>
          )}
        </label>
      </div>
      
      <table className="w-full text-xs border-y border-primary/9">
        <thead>
          {tableMember.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="h-8 w-full">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={cn(
                    "font-normal text-left px-2",
                    header.column.columnDef.meta?.sticky && "border-r sticky z-4 left-0 top-0"
                  )}
                  style={{ width: header.column.columnDef.meta?.width }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header,header.getContext())
                  }
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {tableMember.getRowModel().rows.length ? (
            tableMember.getRowModel().rows.map((row) => (
              <tr key={row.id} className="w-full border-t border-primary/9">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      "px-3",
                      cell.column.columnDef.meta?.sticky && "border-r sticky left-0 z-2"
                    )}
                    style={{ width: cell.column.columnDef.meta?.width }}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={tableMember.getAllColumns().length} 
                className="text-xs text-[#73726e] leading-4 whitespace-nowrap overflow-hidden text-ellipsis h-8 px-1 py-2 border-t border-primary/9"
              >
                No search results
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}