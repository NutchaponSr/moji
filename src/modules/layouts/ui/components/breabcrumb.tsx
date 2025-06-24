import React from "react";
import Link from "next/link";

import { HomeIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

import { DEFAULT_PAGE } from "@/modules/layouts/constants";

export const Breabcrumb = () => {
  const pathname = usePathname();
  const params = useParams<{ organizationId: string }>();

  const paths: string[] = pathname
    .split("/")
    .filter((path) => path && path.toLowerCase() !== "overviews" && path !== params.organizationId) || [];

  const isMainPage = pathname === "/" + params.organizationId + DEFAULT_PAGE;

  return (
    <div className="flex items-center">
      {!isMainPage && (
        <Button
          asChild
          size="sm"
          variant="ghost"
        > 
          <Link href={`/${params.organizationId}/overviews`}>
            <HomeIcon className="size-4" />
            Overviews
          </Link>
        </Button>
      )}
      {paths.length > 0 && <span className="mx-0.5 text-secondary">/</span>}
      {paths.map((path, index) => {
        const href = `/${params.organizationId}/${paths.slice(0, index + 1).join("/")}`;
        
        return (
          <React.Fragment key={index}>
            <Button 
              asChild
              size="sm"
              variant="ghost"
              className="font-normal capitalize"
            >
              <Link href={href}>{path}</Link>
            </Button>
            {paths.length !== index + 1 && <span className="mx-0.5 text-secondary">/</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
}