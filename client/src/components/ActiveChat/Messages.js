import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;
  const [ recentlyRead, setRecentlyRead ] = useState('')

  useEffect(() => {
    if(!messages.length) return;

    for (let i = messages.length - 1; i >= 0 ; i--) {
      const latestMessage = messages[i]
      if (latestMessage.senderId === userId) {
        setRecentlyRead(latestMessage.id);
        return;
      }
    }
  }, [messages.length])

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} recentlyRead={recentlyRead === message.id} otherUser={otherUser} />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
