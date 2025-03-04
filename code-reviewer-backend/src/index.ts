import { Hono } from 'hono'
import axios from 'axios'
import {cors} from 'hono/cors';

const app = new Hono()
// Enable CORS for all routes
app.use("*", cors());
app.get('/', (c) => {
  return c.text('Hello Hono!')
})


const API_URL = 'https://api.deepseek.com/v1/chat/completions';

app.post('/review', async (c) => {
  try {
    console.log("Incoming request...");


    const githuburl = await c.req.json();
    if (!githuburl?.code) {
      console.log("Missing 'code' parameter!");
      return c.json({ error: "Invalid request, 'code' parameter is missing" }, 400);
    }

    console.log("Fetching PR diff from:", githuburl.code);
    const response = await axios.get(`${githuburl.code}.diff`, { responseType: "text" });

    const payload = {
      model: "deepseek-coder",
      messages: [{ role: "user", content: `Review the following GitHub PR changes:\n${response.data}` }],
      temperature: 0.7,
      max_tokens: 1000
    };

    console.log("Sending request to DeepSeek API...");
    const deepseekResponse = await axios.post(API_URL, payload, {
      headers: {
        Authorization: `Bearer ${c?.env?.API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("DeepSeek Response:", deepseekResponse.data);
    
    return c.json(deepseekResponse.data);
  } catch (err) {
    console.error("Error:", err);
    return c.json({ error: "Internal Server Error", details: err }, 500);
  }
});


export default app;
