const onlineUsers = [];

class ActiveConversationsMap {

  activateConversation (id, conversationId) {
    this[conversationId] = this[conversationId] ? this[conversationId].push(id) : [id];
  }

  deactivateConversation (conversationId) {
    this[conversationId].pop();
  }

  conversationIsActive (conversationId) {
    return this[conversationId].length >= 1;
  }
}

class LastReadMessagesMap {

  setLastRead (conversationId, userId, messageId) {
    const userMessages = {};
    if (this[conversationId]) {
      this[coversationId][userId] = messageId
    } else {
      userMessages[userId] = messageId;
      this[conversationId] = userMessages;
    }
  }
}

const activeConversations = new ActiveConversationsMap();
const recentlyRead = new LastReadMessagesMap();

module.exports = { onlineUsers, activeConversations };
