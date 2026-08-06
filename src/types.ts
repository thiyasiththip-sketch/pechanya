export type MedicationSlot = "morning" | "noon" | "evening" | "night";

export interface MedicationFrequency {
  morning: boolean;
  noon: boolean;
  evening: boolean;
  night: boolean;
}

export interface Medication {
  id: string;
  name: string;
  nameTh: string;
  category: string;
  dosage: string;
  frequency: MedicationFrequency;
  timing: "ก่อนอาหาร" | "หลังอาหาร" | "พร้อมอาหาร" | "พร้อมมื้อเที่ยง" | "พร้อมอาหารเย็น" | "หลังอาหารเช้า" | "ลดความดันโลหิต" | "ก่อนนอน" | "ทั่วไป";
  foodInstruction: string;
  remainingCount: number;
  originalCount: number;
  warning?: string;
  classification?: string; // e.g. "Antibiotics", "Vitamin"
  notes?: string;
  image?: string;
  sideEffects?: string[];
  storage?: string;
  status: "active" | "completed" | "paused";
}

export interface IntakeLog {
  id: string;
  date: string; // YYYY-MM-DD
  medId: string;
  slot: MedicationSlot;
  status: "taken" | "missed" | "pending";
  takenTime?: string; // e.g. "08:05"
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export interface HealthTip {
  id: string;
  title: string;
  category: "โภชนาการ" | "ผลข้างเคียง" | "เทคนิคการจำ" | "ความปลอดภัย" | "ทั้งหมด";
  summary: string;
  content: string;
  image: string;
  readTime: string;
}
