export type ModalProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const settingsType = [
  "account",
  "preference",
  "notification",
  "myConnections",
  "general",
  "people",
  "teamspaces",
  "security",
  "identity",
  "ai",
  "connections",
  "emoji",
  "import",
  "plan"
] as const

export type SettingsType = typeof settingsType[number];

export interface SettingsModal extends ModalProps {
  type: SettingsType;
  onChange: (type: SettingsType) => void;
}