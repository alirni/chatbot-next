import { FC } from 'react';
import { MessageDisplayProps } from './MessageDisplay.type';

const MessageDisplay: FC<MessageDisplayProps> = ({ messages, isTyping }) => (
  <div className="space-y-3">
    {messages.map((msg, index) => (
      <div key={index} className="flex flex-col">
        {/* User message */}
        <div className="self-end bg-blue-500 text-white px-4 py-2 rounded-md mb-1 max-w-xs">
          {msg.user}
        </div>
        {/* AI message */}
        <div className="self-start bg-gray-300 text-gray-800 px-4 py-2 rounded-md mt-1 max-w-xs">
          {msg.ai}
        </div>
      </div>
    ))}
    {/* AI is typing indicator */}
    {isTyping && (
      <div className="text-gray-500 text-sm italic">AI is typing...</div>
    )}
  </div>
);

export default MessageDisplay;
