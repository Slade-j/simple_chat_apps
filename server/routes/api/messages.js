const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;
    let conversation = {};

    // if we have conversationId use it to find conversation
    if (conversationId) {
      conversation = await Conversation.findByPk(conversationId)
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    if (!conversationId) {
      conversation = await Conversation.findConversation(
        senderId,
        recipientId
      );
    }

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      sender.online = onlineUsers.isOnline(senderId)
    }

    // make sure sender is part of conversation before creating message
    if (conversation.user1Id === senderId || conversation.user2Id === senderId) {
      const message = await Message.create({
        senderId,
        text,
        conversationId: conversation.id,
      });
      res.json({ message, sender });
    } else {
      res.sendStatus(403);
    }

  } catch (error) {
    next(error);
  }
});

module.exports = router;
