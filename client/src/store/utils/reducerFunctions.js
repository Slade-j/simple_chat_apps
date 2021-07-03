export const addMessageToStore = (state, payload) => {
  const { message, sender, recipientId } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  // use recipiantId so new conversations will only be displayed to recipiant
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      currentUserId: recipientId,
      messages: [message],
      unread: 1,
      isActive: false
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    const convoCopy = { ...convo };
    if (convo.id === message.conversationId) {
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      !convoCopy.isActive && convoCopy.unread++;
    }


    return convoCopy;
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, data) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  data.users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, currentUserId: data.userId, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  const newState = [];
  state.forEach((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { ...convo };
      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;
      newState.unshift(newConvo);
    } else {
      newState.push(convo);
    }
  });
  return newState;
};

export const seatConvoIsActive = (state, conversationId) => {
  return state.map(convo => {
    const setConvo = { ...convo }
    if (convo.id === conversationId) {
      setConvo.isActive = true;
      setConvo.unread = 0;
      return setConvo
    } else {
      setConvo.isActive = false;
      return setConvo;
    }
  })
}
