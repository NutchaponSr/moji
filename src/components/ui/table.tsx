"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm relative", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("flex text-secondary-foreground left-0 right-0 relative box-border shadow-[inset_0_-1px_0_rgb(233,233,231),inset_0_1px_0_rgb(233,233,231)] dark:shadow-[-3px_0_0_rgb(25,25,25),inset_0_-1px_0_rgb(47,47,47)] min-w-[calc(100%-192px)] group", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("relative w-full isolation-auto shrink-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors flex h-[34px] border-border relative group",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-muted-foreground p-2 text-left align-middle font-medium whitespace-nowrap overflow-hidden text-sm border-border [&>[role=checkbox]]:translate-y-[2px] first:p-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&>[role=checkbox]]:translate-y-[2px] first:p-0 relative not-first:border-r text-primary font-medium",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

function TableAction({
  children,
  className,
  position,
  isChecked,
  isCheckbox
}: {
  children: React.ReactNode; 
  className?: string;
  position: string;
  isChecked?: boolean;
  isCheckbox?: boolean;
}) {
  return (
    <div className={cn("sticky flex", position)}>
      <div className={cn("absolute", position)}>
        <div className={cn(
          "h-full transition opacity-0 group-hover:opacity-100", 
          isChecked && "opacity-100",
          isCheckbox && "group-hover:opacity-60 hover:opacity-100",
          (isCheckbox && isChecked) && "group-hover:opacity-100"
        )}>
          <div className="h-full items-center justify-center flex cursor-pointer">
            <div className={cn("flex items-center justify-center", className)}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableAction,
}
