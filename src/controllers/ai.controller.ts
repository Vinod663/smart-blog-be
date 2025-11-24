import axios from "axios";
import { Request, Response } from "express";

export const generateAIContent = async (req: Request, res: Response) => {
    try{
        const { text, maxToken } = req.body

        // check text null send 400
        const aiResponse = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', 
            {
                contents: [
                    {
                        parts: [{text}]
                    }
                ], generationConfig: {
                    maxOutputTokens: maxToken || 150
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': 'AIzaSyCYpGU4ylWqsyYFnsR7pqBbirE6z9HHDec'
                }
            }
        )

        const genratedText =
        aiResponse.data?.candidates?.[0]?.content?.[0]?.text ||
        aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No data"

        console.log(aiResponse)
        console.log(res)

        console.log(aiResponse.data)

        res.status(200).json({
            data: genratedText
    })
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Failed to generate AI content.!' });
    }
}
