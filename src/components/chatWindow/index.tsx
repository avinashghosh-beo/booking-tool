import React, { useEffect, useRef } from "react";
import HeaderSection from "./components/HeaderSection";
import IncomingItem from "./components/IncomingItem";
import OutgoingItem from "./components/OutgoingItem";
import InputSection from "./components/InputSection";

const incomingMessage = {
  id: 2,
  createdTime: new Date("2023-12-15T10:31:00"),
  updateTime: new Date("2023-12-15T10:31:00"),
  //   text: "Sure! Could you provide more details about the role?",
  text: "Incoming Message !",
  authorID: 2,
  authorAvatar: "https://picsum.photos/seed/author2/200/300",
  messageType: "incoming", // Incoming message
};

const outgoingMessage = {
  id: 1,
  createdTime: new Date("2023-12-15T10:30:00"),
  updateTime: new Date("2023-12-15T10:30:00"),
  //   text: "I need a job ad for a Marketing Manager",
  text: "Outgoing Message !",
  authorID: 1,
  authorAvatar: "https://picsum.photos/id/237/200/300",
  messageType: "outgoing", // Outgoing message
};

const ChatWindow = ({ data, loadOlderMessages, addNewMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  const handleSend = () => {
    addNewMessage(outgoingMessage);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimeout(() => {
      addNewMessage(incomingMessage);
    }, 2000);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <HeaderSection />

      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto"
        style={{ maxWidth: "100%", padding: "0 10px" }}
      >
        <div className="flex flex-col" style={{ maxWidth: "100%" }}>
          {data.map((item, index) =>
            item?.messageType === "incoming" ? (
              <IncomingItem key={index} data={item} />
            ) : (
              <OutgoingItem key={index} data={item} />
            )
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Section */}
      <InputSection onSubmit={handleSend} style={{ maxWidth: "100%", padding: "0 10px" }} />
    </div>
  );
};

export default ChatWindow;
