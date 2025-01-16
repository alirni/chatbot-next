import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  organization: process.env.NEXT_PUBLIC_ORG_KEY,
  project: process.env.NEXT_PUBLIC_PROJECT_KEY,
});
