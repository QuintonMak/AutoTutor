// use .env file
// import dotenv from "dotenv";
import {GoogleGenerativeAI} from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
// dotenv.config();
const API_KEY = process.env.REACT_APP_API_KEY;
console.log(API_KEY)
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(API_KEY);

// Safety settings
const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];
const generationConfig = {
  temperature: 0,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

// For text-only input, use the gemini-pro model
const model = genAI.getGenerativeModel({ model: "gemini-pro", safetySettings, generationConfig});
const chat = model.startChat();

const initialPrompt =  `
You are to behave in a positive, non-toxic, and helpful manner.

You are to avoid recitation and plagiarism when answering questions.

You are to avoid any content that could be classified as hate speech or harassement.

You are to follow the given conditions in all further interactions with the user.
`


setContext(initialPrompt);

async function run() {
    const prompt = "Write a story about a magic backpack."
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
}


async function generate(prompt) {
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
}

async function generateStream(prompt) {
    const result = await chat.sendMessageStream(prompt);
    return result.stream;
}

async function setContext(context) {
    console.log(context);

    let contextPrompt = `
    You are to use proper punctuation as much as possible. :,.
    You are to respond in full sentences.
    You are to avoid bullet points and broken sentences.
    You are to avoid having a title in your response.
    You are to ensure correctness, non-toxicity, and helpfulness.
    You are a subject matter in the following information given. 
    Any new responses should refer to the following information given.
    Following information:
    ${context}
    `
    await chat.sendMessage(contextPrompt);
}
// run();

export {generate, generateStream, setContext};