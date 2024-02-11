import { useEffect, useRef } from "react";

interface Props {
  messages: string[];
  sendMessage: (message: string) => void;
}

export function Chat({ messages, sendMessage }: Props) {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto flex-grow">
        {messages.map((message, i) => (
          <p className="text-left" key={i}>
            {message}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        className="w-full text-xl p-2"
        type="text"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            sendMessage(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
}
