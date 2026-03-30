const Message = require('../models/Message');

// @desc    Get all conversations for a user
// @route   GET /api/messages/conversations
const getConversations = async (req, res) => {
    try {
        const { Op } = require('sequelize');
        const User = require('../models/User'); // Import User for manual populate
        const userId = req.user.id;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [{ sender: userId }, { receiver: userId }]
            },
            order: [['createdAt', 'DESC']]
        });

        const map = new Map();

        for (const msg of messages) {
            const otherUserId = msg.sender === userId ? msg.receiver : msg.sender;

            if (!map.has(otherUserId.toString())) {
                const otherUser = await User.findByPk(otherUserId, {
                    attributes: ['id', 'name', 'profilePicture']
                });

                if (otherUser) {
                    map.set(otherUserId.toString(), {
                        id: otherUser.id,
                        name: otherUser.name,
                        avatar: otherUser.profilePicture,
                        lastMessage: msg.content,
                        time: msg.createdAt,
                        read: true
                    });
                }
            }
        }

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
        sender: req.user.id,
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
        const { Op } = require('sequelize');
        const { userId } = req.params;

        if (!userId || userId === 'undefined') {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { sender: req.user.id, receiver: userId },
                    { sender: userId, receiver: req.user.id }
                ]
            },
            order: [['createdAt', 'ASC']]
        });

        res.json(messages);
    } catch (error) {
        console.error("Get messages error:", error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};

module.exports = { sendMessage, getMessages, getConversations };
