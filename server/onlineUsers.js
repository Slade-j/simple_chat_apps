class OnlineUsersMap {

  addOnlineUser(id) {
    this[id] = true;
  }

  removeOnlineUser(id) {
    this[id] = false;
  }

  isOnline(id) {
    return this[id];
  }
}


const onlineUsers = new OnlineUsersMap();

module.exports = onlineUsers;
