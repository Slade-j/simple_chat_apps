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

class UserChannelsMap {

  addChannel(user, channel) {
    this[user] = this[user] ? this[user].push(channel) : [channel]
  }

  getChannels(user) {
    return this[user];
  }

  // there is no method for removeing channels at this time
  // as there is no feature to ubsubscibe to a conversation yet
}

const onlineUsers = new OnlineUsersMap();
const userChannels = new UserChannelsMap();

module.exports = onlineUsers
