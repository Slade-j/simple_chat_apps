import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";

const getSocket = (token) => io.connect(window.location.origin, { query: { token } });

export const getSocketEvents = (socket) => {

  return (
    socket.on("connect", () => {
      console.log("connected to server");

      socket.on("add-online-user", (id) => {
        store.dispatch(addOnlineUser(id));
      });

      socket.on("remove-offline-user", (id) => {
        store.dispatch(removeOfflineUser(id));
      });
      socket.on("new-message", (data) => {
        store.dispatch(setNewMessage(data.message, data.recipientId, data.sender));
      });
    })
  );
}

export default getSocket;
