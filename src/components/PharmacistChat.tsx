import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Send, Sparkles, MessageSquare, X, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PharmacistChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_CHIPS = [
  "อะม็อกซีซิลลิน (Amoxicillin) ทานอย่างไรดีที่สุด?",
  "ทำไมจึงควรกินยาปฏิชีวนะให้หมดขวด?",
  "ทานยากับชากาแฟได้ไหม?",
  "ยาลดความดันกับส้มโอมีปัญหาอะไรกัน?",
];

export default function PharmacistChat({ isOpen, onClose }: PharmacistChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "สวัสดีครับ! ผมคือเภสัชกรปัญญาประดิษฐ์ (AI Pharmacist) ยินดีต้อนรับสู่ระบบแนะนำการทานยาของ MedTrack มีคำถามเกี่ยวกับวิธีการกินยา ยาตีกัน ผลข้างเคียง หรือต้องการคำแนะนำสุขภาพส่วนตัวไหมครับ? ถามผมมาได้เลย!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsGenerating(true);

    try {
      // Package conversation history to give context to Gemini
      const formattedHistory = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          history: formattedHistory,
        }),
      });

      const data = await res.json();
      
      if (res.ok && data.reply) {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const errMsg = data.error || "ขออภัยด้วยครับ มีข้อผิดพลาดในการเชื่อมต่อกรุณาลองอีกครั้ง";
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "bot",
            text: `⚠️ ${errMsg}`,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "bot",
          text: "⚠️ ขออภัยครับ ไม่สามารถเชื่อมต่อกับเภสัชกร AI ได้ กรุณาตรวจสอบอินเทอร์เน็ตหรือแจ้งผู้พัฒนาระบบ",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: "สวัสดีครับ! ผมคือเภสัชกรปัญญาประดิษฐ์ (AI Pharmacist) ยินดีต้อนรับสู่ระบบแนะนำการทานยาของ MedTrack มีคำถามเกี่ยวกับวิธีการกินยา ยาตีกัน ผลข้างเคียง หรือต้องการคำแนะนำสุขภาพส่วนตัวไหมครับ? ถามผมมาได้เลย!",
        timestamp: new Date(),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="relative flex h-[85vh] w-full max-w-lg flex-col rounded-t-lg bg-[#f6fbf6] shadow-2xl sm:rounded-lg overflow-hidden border border-outline-variant/30"
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-primary p-4 text-white">
          <div className="flex items-center gap-2">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-inner">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">คุยกับเภสัชกร AI</h3>
              <p className="text-xs text-primary-container/85">ปรึกษาเรื่องยาและความปลอดภัยได้ 24 ชม.</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={resetChat}
              title="เริ่มคุยใหม่"
              className="rounded-full p-2 hover:bg-white/10 active:scale-95 transition-transform"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-white/10 active:scale-95 transition-transform"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-white text-on-surface rounded-tl-none border border-outline-variant/20"
                  }`}
                >
                  <p className="whitespace-pre-line font-body text-[15px] leading-relaxed">
                    {msg.text}
                  </p>
                  <span
                    className={`mt-1 block text-[10px] text-right opacity-60`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* AI Loader */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-2 rounded-2xl rounded-tl-none bg-white border border-outline-variant/20 px-4 py-3 shadow-sm text-on-surface-variant">
                <span className="flex h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></span>
                <span className="flex h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></span>
                <span className="flex h-2 w-2 animate-bounce rounded-full bg-primary"></span>
                <span className="font-body text-xs text-outline pl-1">เภสัชกรกำลังวิเคราะห์ตัวยา...</span>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length === 1 && !isGenerating && (
          <div className="bg-white border-t border-outline-variant/20 p-3 space-y-2">
            <p className="text-[11px] font-bold text-outline uppercase tracking-wider px-1">คำถามยอดนิยมที่แนะนำ:</p>
            <div className="flex flex-col gap-1.5">
              {DEFAULT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="w-full text-left bg-[#f0f5f0] hover:bg-primary-container/30 active:scale-[0.99] text-on-primary-container font-body text-xs py-2 px-3 rounded-full border border-primary-container/20 transition-all truncate"
                >
                  💡 {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input Footer */}
        <div className="border-t border-outline-variant/30 bg-white p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="พิมพ์ถามเรื่องยา เช่น ยานี้กินตอนไหน..."
              className="flex-1 rounded-full border border-outline-variant bg-[#f6fbf6] px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-body"
              disabled={isGenerating}
            />
            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-md transition-all hover:brightness-110 active:scale-95 disabled:bg-outline-variant disabled:pointer-events-none"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
          <p className="mt-1.5 text-center text-[10px] text-outline">
            *คำแนะนำจากระบบ AI เป็นข้อมูลเบื้องต้น ไม่สามารถทดแทนการพบแพทย์หรือใบสั่งยาจริงได้
          </p>
        </div>
      </motion.div>
    </div>
  );
}
