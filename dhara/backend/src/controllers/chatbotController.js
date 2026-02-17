// @desc    Get chatbot response
// @route   POST /api/chatbot/query
// @access  Public
const axios = require('axios');

const queryChatbot = async (req, res) => {
  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    // Forward request to Python ML Service
    const mlResponse = await axios.post('http://localhost:5001/api/chatbot/query', {
      message,
      context
    });

    res.json(mlResponse.data);
  } catch (error) {
    console.error('ML Service Error:', error.message);

    // Fallback if ML service is down
    res.json({
      response: "I'm having trouble connecting to my brain right now. Please try again later.",
      type: "text"
    });
  }
};

module.exports = { queryChatbot };
