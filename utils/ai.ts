import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function analyzeEntryWithGemini(content: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Analyze this journal entry and provide the following:
        1. A sentiment score between -10 (very negative) and 10 (very positive)
        2. The overall mood (choose one: Happy, Sad, Anxious, Neutral, Excited, Angry, Peaceful)
        3. A short summary of the entry (max 20 words) from the user perspective only,not third person.
        4. The main subject of the entry
        5. Whether there are any concerning negative thoughts (true/false)
        6. A hex color code that best represents the mood of this entry

        Format your response as a JSON object with keys: sentimentScore, mood, summary, subject, negative, color.

        Journal entry: "${content}"
      `,
    });

    const text = response.text;
    try {
      // Remove code block markers if present
      const cleanedText = text
        .replace(/^```json\s*/i, "")
        .replace(/```$/i, "")
        .trim();
      const analysis = JSON.parse(cleanedText);
      return {
        sentimentScore: parseFloat(analysis.sentimentScore),
        mood: analysis.mood,
        summary: analysis.summary,
        subject: analysis.subject,
        negative: Boolean(analysis.negative),
        color: analysis.color,
      };
    } catch (e) {
      console.error("Failed to parse Gemini response:", e);
      console.log("Raw response:", text);
      return getFallbackAnalysis();
    }
  } catch (error) {
    console.error("Error using Gemini API:", error);
    return getFallbackAnalysis();
  }
}

// Fallback function if the AI analysis fails
function getFallbackAnalysis() {
  function getRandomMood() {
    const moods = ["Happy", "Neutral", "Anxious"];
    return moods[Math.floor(Math.random() * moods.length)];
  }

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return {
    sentimentScore: Math.random() * 20 - 10,
    mood: getRandomMood(),
    summary: "Failed to analyze entry content. This is a fallback summary.",
    subject: "Unknown",
    negative: Math.random() < 0.5,
    color: getRandomColor(),
  };
}