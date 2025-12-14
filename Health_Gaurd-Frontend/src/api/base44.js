import Base44 from "@base44/sdk";   

export const base44 = new Base44({
  apiKey: import.meta.env.VITE_BASE44_API_KEY,
  projectId: import.meta.env.VITE_BASE44_PROJECT_ID
});
