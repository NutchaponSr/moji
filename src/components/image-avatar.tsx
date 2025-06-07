import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";

interface Props {
  src: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export const ImageAvatar = ({
  src,
  name,
  className,
  fallbackClassName
}: Props) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={src} />
      <AvatarFallback className={fallbackClassName}>
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}