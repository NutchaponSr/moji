import Link from "next/link";
import Image from "next/image";

interface Props {
  sticky?: boolean;
}

export const Logo = ({ sticky }: Props) => {
  if (sticky) {
    return (
      <Link href="/" className="fixed left-3 top-5 flex flex-none items-center gap-2 py-1.5 px-3 z-100">
        <Image 
          src="/logo.svg"
          alt="Logo"
          width={28}
          height={28}
        />
        <p className="font-medium text-xl">
          Moji
        </p>
      </Link>
    );
  }

  return null;
}