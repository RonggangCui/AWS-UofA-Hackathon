require("dotenv").config();
const express = require("express");
const axios = require('axios');
const AWS = require("aws-sdk");

const app = express();
const port = 3000;

// Configure the AWS SDK with your credentials and region from environment variables
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const getRedditAuthToken = async () => {
    try {
      console.log('Attempting to fetch Reddit auth token...');
      const authResponse = await axios.post(
        'https://www.reddit.com/api/v1/access_token',
        new URLSearchParams({
          grant_type: 'client_credentials',
        }),
        {
          auth: {
            username: process.env.REDDIT_CLIENT_ID,
            password: process.env.REDDIT_SECRET,
          },
          headers: {
            'User-Agent': process.env.REDDIT_USER_AGENT,
          },
        }
      );
      console.log('Successfully obtained auth token');
      return authResponse.data.access_token;
    } catch (error) {
      console.error('Error fetching Reddit auth token:', error.message);
      throw error;
    }
  };
  
  const searchReddit = async (query) => {
    try {
      console.log('Obtaining Reddit auth token...');
      const token = await getRedditAuthToken();
      console.log('Searching Reddit for query:', query);
      const searchResponse = await axios.get(
        `https://oauth.reddit.com/search?q=${encodeURIComponent(query)}&sort=hot&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'User-Agent': process.env.REDDIT_USER_AGENT,
          },
        }
      );
      console.log('Successfully fetched search results');
  
      const posts = searchResponse.data.data.children.map((child) => {
        const { title, selftext, author, ups, score, num_comments, created_utc, permalink, num_crossposts } = child.data;
  
        return {
          post_title: title,
          post_content: selftext,
          author: author,
          number_of_upvotes: ups,
          number_of_downvotes: Math.abs(score) - ups,
          number_of_comments: num_comments,
          number_of_shares: num_crossposts,
          created_at: new Date(created_utc * 1000).toISOString(),
          permalink: `https://reddit.com${permalink}`,
        };
      });
  
      console.log('Successfully processed all posts');
      return posts;
    } catch (error) {
      console.error('Error occurred during Reddit search:', error.message);
      throw error;
    }
  };
  

// Example: Create an instance of the Bedrock runtime client
const bedrock = new AWS.BedrockRuntime({ apiVersion: "latest" });

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get('/search', async (req, res) => {
    const query = "jasper wildfire";
  
    try {
      const redditResponse = await searchReddit(query);
      console.log(redditResponse);
      res.json(redditResponse);
    } catch (error) {
      if (error.code === 'ENOTFOUND') {
        console.error('DNS resolution failed. Unable to reach www.reddit.com.');
      } else {
        console.error('Error occurred while fetching data from Reddit:', error.message);
      }
      res.status(500).json({ error: 'Failed to fetch data from Reddit' });
    }
});
  

// Define the GET endpoint
app.get("/bedrock-query", async (req, res) => {
    try {
        const params = {
            modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1000,
                messages: [
                    {
                        role: "user",
                        content: "Hello?",
                    },
                ],
            }),
        };
        console.log("Request Params:", params); // Log request parameters for debugging
        const response = await bedrock.invokeModel(params).promise();
        console.log("Raw Response:", response); // Log raw response for debugging

        // Convert Buffer to string and then parse as JSON
        const responseBody = JSON.parse(response.body.toString());
        console.log("Parsed Response:", responseBody); // Log parsed response for debugging
        const answer = responseBody.content[0].text; // Extract the text from the response

        res.send(answer);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
