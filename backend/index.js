import express from "express";
import cors from "cors";
import OpenAI from "openai";
import morgan from "morgan";
import 'dotenv/config';

const app = express();
app.use(morgan('dev'));
app.use(cors({origin: "http://localhost:3000"}));
app.use(express.json());

const nvidia = new OpenAI({
	apiKey: process.env.API,
    baseURL: process.env.URL,
});

app.post("/api/chat", async (req, res) => {
	try {
		const prompt = req.body;
		const completion = await nvidia.chat.completions.create({
			"model": prompt.model,
			"messages": prompt.messages,
			"temperature": prompt.temperature,
			"max_tokens": prompt.max_tokens,
		});

		res.json({"reply": completion.choices[0].message.content});
	} catch(error) {
		console.log(`Error: ${error.message}`);
		res.status(500).json({"error": error.message});
	}
});

app.listen(5000, ()=>console.log('Server running on port 5000'));
