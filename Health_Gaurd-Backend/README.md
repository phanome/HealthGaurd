npm install
npm run dev
curl -X POST http://localhost:4000/api/records \
  -H "Content-Type: application/json" \
  -d '{"blood_hemoglobin":13.5,"env_aqi":120,"heart_bmi":23.5}'
curl http://localhost:4000/api/records
curl -X POST http://localhost:4000/api/ai/symptom-check \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"I have fever and sore throat for 3 days."}]}'
curl -X POST http://localhost:4000/api/ai/lifestyle \
  -H "Content-Type: application/json" \
  -d '{"blood_hemoglobin":12.3,"lipid_hdl":40,"env_aqi":180,"family_history":"mother: diabetes"}'
