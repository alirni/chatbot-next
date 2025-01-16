import { FC } from 'react';
import { MessageDisplayProps } from './MessageDisplay.type';

const MessageDisplay: FC<MessageDisplayProps> = ({ messages }) => (
  <div className="mt-6 space-y-4">
    {messages.map((msg, idx) => (
      <div
        key={idx}
        className="p-4 border border-gray-300 rounded-md bg-white shadow-sm"
      >
        <p className="text-sm text-gray-700">
          <strong>User:</strong> {msg.user}
        </p>
        <p className="text-sm text-gray-900 mt-2">
          <strong>AI:</strong> {msg.ai}
        </p>
      </div>
    ))}
  </div>
);

export default MessageDisplay;
