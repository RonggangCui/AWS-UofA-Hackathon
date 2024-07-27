require("dotenv").config();
const express = require("express");
const AWS = require("aws-sdk");

const app = express();
const port = 3000;

// Configure the AWS SDK with your credentials and region from environment variables
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Example: Create an instance of the Bedrock runtime client
const bedrock = new AWS.BedrockRuntime({ apiVersion: "latest" });

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
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
