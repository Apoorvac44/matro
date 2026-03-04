const Message = require('../models/Message');

// @desc    Get all conversations for a user
// @route   GET /api/messages/conversations
const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
            .sort({ createdAt: -1 })
            .populate('sender', 'name profilePicture')
            .populate('receiver', 'name profilePicture');

        const map = new Map();

        messages.forEach(msg => {
            const isSender = msg.sender._id.toString() === userId.toString();
            const otherUser = isSender ? msg.receiver : msg.sender;

            // If the other user no longer exists, skip
            if (!otherUser) return;

            if (!map.has(otherUser._id.toString())) {
                map.set(otherUser._id.toString(), {
                    id: otherUser._id,
                    name: otherUser.name,
                    avatar: otherUser.profilePicture,
                    lastMessage: msg.content,
                    time: msg.createdAt,
                    read: true
                });
            }
        });

        res.json(Array.from(map.values()));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching conversations' });
    }
};

// @desc    Send a message
// @route   POST /api/messages
const sendMessage = async (req, res) => {
    const { receiverId, content } = req.body;
    const message = await Message.create({
        sender: req.user._id,
        receiver: receiverId,
        content
    });

    if (message) {
        res.status(201).json(message);
    } else {
        res.status(400).json({ message: 'Error sending message' });
    }
};

// @desc    Get messages between two users
// @route   GET /api/messages/:userId
const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId || userId === 'undefined') {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: userId },
                { sender: userId, receiver: req.user._id }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error("Get messages error:", error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};

module.exports = { sendMessage, getMessages, getConversations };
