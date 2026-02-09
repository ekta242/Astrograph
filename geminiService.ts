
import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult, QuizQuestion, AscensionStep } from "./types";

// Always use a named parameter and direct process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCaptainLog = async (text: string, imageData?: string): Promise<ScanResult> => {
  const model = 'gemini-3-flash-preview';
  const prompt = `You are Astrograph, the supreme Celestial Cartographer of professional destinies. 
  Your task is to analyze this "Void Journal" (resume, portfolio, or vision notes). 
  
  You must assign them a grand "Professional Constellation Name" (e.g., 'The Orion of Data Architecture').
  
  CRITICAL INSTRUCTION: The "summary" must be written in EXCELLENT, CLEAR, PROFESSIONAL ENGLISH. 
  It should explain their career path, current status, and future potential in real-world professional terms (e.g., "Seasoned Full-stack developer with a focus on React and Node.js", "Strategic Leader specializing in Operations and Team Growth"). 
  Keep the tone inspiring but grounded in career reality.
  
  COORDINATE MAPPING: Provide 5 {x, y} coordinates (0-100) that represent their professional growth trajectory from start to apex.
  
  Return a JSON object:
  - summary: A clear, professional 2-sentence explanation of their career archetype and where they are headed.
  - constellationName: Their grand mystical title.
  - threatLevel: 'LOW' (steady growth), 'MEDIUM' (pivoting/transforming), or 'HIGH' (high-risk/high-reward innovator).
  - coordinates: 5 {x, y} coordinates for their career stars (0-100).
  `;

  const contents = imageData ? {
    parts: [
      { text: prompt + "\nDossier: " + text },
      { inlineData: { mimeType: 'image/jpeg', data: imageData.split(',')[1] } }
    ]
  } : prompt + "\nDossier: " + text;

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          constellationName: { type: Type.STRING },
          threatLevel: { type: Type.STRING },
          coordinates: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } },
              required: ["x", "y"]
            }
          }
        },
        required: ["summary", "constellationName", "threatLevel", "coordinates"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as ScanResult;
};

export const generateCelestialQuiz = async (context: string): Promise<QuizQuestion[]> => {
  const model = 'gemini-3-flash-preview';
  const response = await ai.models.generateContent({
    model,
    contents: `You are Astrograph. Based on this professional archetype: "${context}", generate 3 psychometric questions. 
    Every answer the user gives provides a set of coordinates (x, y) in the professional galaxy. Your goal is to map these points into a coherent constellation.
    The questions should be clear, professional aptitude tests disguised as celestial navigation choices. 
    Ensure the options represent different real-world professional styles.
    USE PROPER ENGLISH for questions and options.
    Return as a JSON array of objects: { question, options[4], correctIndex }.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER }
          },
          required: ["question", "options", "correctIndex"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]') as QuizQuestion[];
};

export const generateAscensionSteps = async (constellation: string, summary: string): Promise<AscensionStep[]> => {
  const model = 'gemini-3-flash-preview';
  const response = await ai.models.generateContent({
    model,
    contents: `As Astrograph, provide a 5-step detailed career ascension plan for the constellation "${constellation}" (Profile: ${summary}).
    Each step must correspond to these phases: Awakening, Ascension, Alignment, Radiance, Apex.
    The steps should be highly practical, specific career advice (e.g. "Master GraphQL and System Design", "Obtain PMP Certification").
    Return a JSON array of 5 objects: { phase, instruction, objective }.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            phase: { type: Type.STRING },
            instruction: { type: Type.STRING },
            objective: { type: Type.STRING }
          },
          required: ["phase", "instruction", "objective"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]') as AscensionStep[];
};
