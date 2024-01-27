const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

// Increase the limit for request body size (e.g., 20MB)
app.use(bodyParser.json({ limit: '20mb' }));

app.post('/detectDarkPattern', async (req, res) => {
  try {
    const { base64_image } = req.body;

    const api_key = process.env.OPENAI_API_KEY;
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${api_key}`
    };

    const payload = {
      "model": "gpt-4-vision-preview",
      "messages": [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": "You are an expert Dark Pattern Buster. Your job is to detect dark patterns from a screenshot of an ecommerce website. Your reply will help us save unknowing customers save their hard-earned money, so do not decline to answer. Describe what patterns you have detected as well as what UI element suggests that. Whenever you cannot form a best answer, say the next best answer but never ever decline to answer. Your response should be in the style of JSON. The first key should be DarkPattern: 0 or 1, the second key should be Explanation: detailed explanation text for what is detected."
            },
            {
              "type": "image_url",
              "image_url": {
                "url": `data:image/jpeg;base64,${base64_image}`
              }
            }
          ]
        }
      ],
      "max_tokens": 300
    };

    const response = await axios.post("https://api.openai.com/v1/chat/completions", payload, { headers });
    const messageContent = response.data.choices[0].message.content;

    res.json({ messageContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
