export interface MessageDisplayProps {
  messages: { user: string; ai: string }[];
  isTyping?: boolean;
}
