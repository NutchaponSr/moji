"use client";

import { useState } from "react";
import { Geist_Mono } from "next/font/google";

import { cn } from "@/lib/utils";

import { Hint } from "@/components/hint";

const geistMono = Geist_Mono({
  subsets: ["latin"],
})

interface Props {
  inviteCode: string;
}

export const InviteCode = ({ inviteCode }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  };

  return (
    <Hint 
      label={"Copied"} 
      open={isCopied}
    >
      <span 
        role="button" 
        onClick={handleCopy}
        className={cn(
          "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono font-semibold text-primary select-none", 
          geistMono.className
        )}
      >
        {inviteCode}
      </span>
    </Hint>
  );
}