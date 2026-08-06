import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API route for AI Pharmacist Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "โปรดระบุข้อความคำถาม" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: "กรุณาตั้งค่าคู่คีย์ความลับ GEMINI_API_KEY ใน Settings > Secrets ของคุณก่อนใช้งานฟีเจอร์นี้" 
      });
    }

    // Initialize GoogleGenAI server-side with AI Studio custom header
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });

    // Provide a detailed medical guideline persona to guide safe, empathetic and helpful pharmaceutical advice
    const systemInstruction = `คุณคือ "เภสัชกรปัญญาประดิษฐ์ (AI Pharmacist)" ผู้เชี่ยวชาญและใจดีของ MedTrack 
หน้าที่ของคุณคือให้คำแนะนำที่เป็นมิตร เข้าใจง่าย และถูกต้องตามหลักการแพทย์เกี่ยวกับการใช้ยา อาหารเสริม อาการข้างเคียง และข้อควรระวังในการกินยา
- ตอบเป็นภาษาไทยด้วยน้ำเสียงที่สุภาพ เป็นมิตร และให้กำลังใจผู้ใช้
- ใช้คำที่คนทั่วไปเข้าใจง่าย หลีกเลี่ยงศัพท์แพทย์ที่ซับซ้อนเกินไป หรือหากเลี่ยงไม่ได้ให้แปลเป็นภาษาไทยให้ชัดเจน
- หากผู้ใช้ถามเรื่องความปลอดภัยหรือผลข้างเคียง ให้เตือนอย่างนุ่มนวลและสุภาพ
- หากคำถามเป็นความเสี่ยงทางยาที่รุนแรงมาก หรือต้องการการวินิจฉัยเฉพาะทาง ให้ระบุคำแนะนำลงท้ายเสมอว่า "หากมีอาการรุนแรงหรือผิดปกติ แนะนำให้ปรึกษาแพทย์หรือเภสัชกรที่ร้านยาหรือโรงพยาบาลโดยตรงทันทีเพื่อความปลอดภัยสูงสุดของคุณ"
- พยายามใช้ข้อความเป็นย่อหน้าสั้นๆ หรือจุดหัวข้อ (Bullet points) เพื่อให้อ่านง่ายบนโทรศัพท์มือถือ`;

    // Map history to correct format if provided
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    // We can simulate chat history if needed, but since chat.sendMessage accepts the message parameter,
    // we can send any previous history first or just use a standard prompt that contains context.
    let promptWithContext = message;
    if (history && history.length > 0) {
      // Build simple context from previous history to keep it fast and responsive
      const historyText = history
        .map((h: { sender: string; text: string }) => `${h.sender === "user" ? "ผู้ใช้" : "เภสัชกร"}: ${h.text}`)
        .join("\n");
      promptWithContext = `ประวัติการสนทนา:\n${historyText}\n\nผู้ใช้ถาม: ${message}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptWithContext,
      config: {
        systemInstruction,
      }
    });

    const reply = response.text || "ขออภัยด้วยครับ ผมไม่สามารถหาคำตอบที่เหมาะสมได้ในขณะนี้";
    return res.json({ reply });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({ 
      error: `เกิดข้อผิดพลาดในการเรียกใช้ AI: ${err.message || "โปรดลองอีกครั้งภายหลัง"}` 
    });
  }
});

// Setup Vite middleware or Static files serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
