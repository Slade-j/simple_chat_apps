import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";
import { openConversation, closeConversation } from "./store/conversationsRead";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });

  socket.on("opened-conversation", (conversationId) => {
    store.dispatch(openConversation(conversationId));
  });

  socket.on("closed-conversaton", (conversationId) => {
    store.dispatch(closeConversation(conversationId));
  })

  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.recipientId, data.sender));
  });
});

export default socket;
