"use client";

import { useState } from "react";

import { Hint } from "@/components/hint";

interface Props {
  invitationId: string;
}

export const InviteLink = ({ invitationId }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const link = `${process.env.NEXT_PUBLIC_APP_URL}/join/${invitationId}`;

  const splitWord = `${process.env.NEXT_PUBLIC_APP_URL}` + "..." + invitationId.slice(30, invitationId.length);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  };

  return (
    <Hint label="Copied" open={isCopied}>
      <div onClick={handleCopy}>
        <span className="text-tertiary underline select-none whitespace-nowrap overflow-hidden text-ellipsis hover:text-danger hover:cursor-pointer">
          {splitWord}
        </span>
      </div>
    </Hint>
  );
}