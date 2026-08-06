import React, { useState } from "react";
import { Medication, MedicationFrequency } from "../types";
import { X, Plus, Pill, Info, AlertTriangle, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (med: Medication) => void;
}

const CATEGORIES = [
  "ยาปฏิชีวนะ (Antibiotics)",
  "ยาลดความดันโลหิต (Antihypertensive)",
  "ยาลดระดับน้ำตาลในเลือด (Antidiabetics)",
  "ยาแก้ปวด ลดไข้ (Analgesic)",
  "วิตามินและอาหารเสริม (Supplement)",
  "ยาอื่นๆ (Others)"
];

const PRESETS = [
  { name: "Paracetamol", nameTh: "พาราเซตามอล", category: "ยาแก้ปวด ลดไข้ (Analgesic)", dosage: "500 มก.", timing: "หลังอาหารเช้า", instruction: "ทานหลังอาหารทันทีเมื่อมีอาการปวดหรือไข้ ทุก 4-6 ชั่วโมง" },
  { name: "Amoxicillin", nameTh: "อะม็อกซีซิลลิน", category: "ยาปฏิชีวนะ (Antibiotics)", dosage: "500 มก.", timing: "หลังอาหารเช้า", instruction: "ทานหลังอาหารเช้า-กลางวัน-เย็นทันที และทานให้หมดขวด", warning: "หลีกเลี่ยงการดื่มนมหรือแคลเซียมร่วมด้วย" },
  { name: "Amlodipine", nameTh: "แอมโลดิพีน", category: "ยาลดความดันโลหิต (Antihypertensive)", dosage: "5 มก.", timing: "ลดความดันโลหิต", instruction: "ทานหลังอาหารเช้าเป็นประจำทุกวันพร้อมน้ำสะอาด" },
  { name: "Vitamin C", nameTh: "วิตามินซี", category: "วิตามินและอาหารเสริม (Supplement)", dosage: "1000 มก.", timing: "ก่อนนอน", instruction: "ทานพร้อมน้ำปริมาณมากเพื่อการดูดซึมที่ดี" }
];

export default function AddMedicationModal({ isOpen, onClose, onAdd }: AddMedicationModalProps) {
  const [name, setName] = useState("");
  const [nameTh, setNameTh] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [dosage, setDosage] = useState("1 เม็ด");
  const [frequency, setFrequency] = useState<MedicationFrequency>({
    morning: true,
    noon: false,
    evening: false,
    night: false,
  });
  const [timing, setTiming] = useState<Medication["timing"]>("หลังอาหารเช้า");
  const [foodInstruction, setFoodInstruction] = useState("");
  const [remainingCount, setRemainingCount] = useState(30);
  const [warning, setWarning] = useState("");
  const [notes, setNotes] = useState("");

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setName(preset.name);
    setNameTh(preset.nameTh);
    setCategory(preset.category);
    setDosage(preset.dosage);
    setFoodInstruction(preset.instruction);
    setWarning(preset.warning || "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !nameTh.trim()) return;

    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name: name.trim(),
      nameTh: nameTh.trim(),
      category,
      dosage,
      frequency,
      timing,
      foodInstruction: foodInstruction.trim() || "ทานตามที่แพทย์หรือเภสัชกรสั่งอย่างเคร่งครัด",
      remainingCount,
      originalCount: remainingCount,
      warning: warning.trim() || undefined,
      classification: category.split(" (")[0],
      notes: notes.trim() || undefined,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYqSZoh0pz2LyLjzaXxVuRTKfD7KEhgUpfYCJmQKtIxqH0xzn1_gHJtfhGnW6KtkK90eFNIFRblZRO0lxh2_exhYCnJsDemcyYmv417vJcvKqm2lLnm1eLaIaW5-tFKtqmbPrvkjYo_MNBiuet3mYySPiLXG9qz8drdPMhWR-7KJtJ9He4zefn1I1aSyFBFlh59iiftpD6rN5KDUy-qmy1NNPnU1xHMoWalEPd2JlD1jjF0A817Fs34zL4xzyYaNa1JMjyQvoaD57k", // Default high quality meds placeholder
      sideEffects: ["อาจมีอาการพะอืดพะอมเล็กน้อย", "ควรหยุดใช้เมื่อมีผื่นแดงรุนแรง"],
      storage: "เก็บในอุณหภูมิห้อง ไม่เกิน 30 องศาเซลเซียส หลีกเลี่ยงความร้อนและความชื้น",
      status: "active"
    };

    onAdd(newMed);
    
    // Reset form
    setName("");
    setNameTh("");
    setCategory(CATEGORIES[0]);
    setDosage("1 เม็ด");
    setFrequency({ morning: true, noon: false, evening: false, night: false });
    setTiming("หลังอาหารเช้า");
    setFoodInstruction("");
    setRemainingCount(30);
    setWarning("");
    setNotes("");

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white w-full max-w-lg rounded-lg p-6 shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4 shrink-0">
          <div className="flex items-center gap-2 text-primary">
            <Pill className="h-6 w-6" />
            <h2 className="font-display text-xl font-bold">เพิ่มข้อมูลยาใหม่</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-outline hover:bg-[#f0f5f0] hover:text-primary active:scale-95 transition-all"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar">
          {/* Presets chips */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-outline">ใช้ข้อมูลด่วน (Presets):</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="bg-primary-container/20 text-on-primary-container hover:bg-primary-container/50 font-body text-xs py-1 px-3 rounded-full border border-primary-container/10 transition-all active:scale-95"
                >
                  ✨ {p.nameTh}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* English Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-outline block">ชื่อยาภาษาอังกฤษ (Eng Name) *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amoxicillin"
                className="w-full rounded-full border border-outline-variant bg-[#f6fbf6] px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-body"
              />
            </div>

            {/* Thai Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-outline block">ชื่อยาภาษาไทย (Thai Name) *</label>
              <input
                type="text"
                required
                value={nameTh}
                onChange={(e) => setNameTh(e.target.value)}
                placeholder="e.g. อะม็อกซีซิลลิน"
                className="w-full rounded-full border border-outline-variant bg-[#f6fbf6] px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-body"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-outline block">หมวดหมู่ยา (Category)</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-full border border-outline-variant bg-[#f6fbf6] px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-body"
            >
              {CATEGORIES.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Dosage */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-outline block">ปริมาณยาต่อครั้ง (Dosage)</label>
              <input
                type="text"
                required
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 500 มก. หรือ 1 เม็ด"
                className="w-full rounded-full border border-outline-variant bg-[#f6fbf6] px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-body"
              />
            </div>

            {/* Remaining Count */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-outline block">จำนวนยาในคลัง (เม็ด/แคปซูล)</label>
              <input
                type="number"
                required
                min={1}
                value={remainingCount}
                onChange={(e) => setRemainingCount(Number(e.target.value))}
                className="w-full rounded-full border border-outline-variant bg-[#f6fbf6] px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-body"
              />
            </div>
          </div>

          {/* Schedule / Frequency Checks */}
          <div className="space-y-1.5 p-3.5 bg-[#f0f5f0] rounded-xl border border-primary-container/10">
            <label className="text-xs font-bold text-primary block">ช่วงเวลาทานยาในแต่ละวัน (Daily Slots):</label>
            <div className="grid grid-cols-4 gap-2">
              <label className="flex flex-col items-center justify-center p-2 rounded-lg border bg-white border-outline-variant/30 cursor-pointer hover:border-primary transition-all">
                <input
                  type="checkbox"
                  checked={frequency.morning}
                  onChange={(e) => setFrequency({ ...frequency, morning: e.target.checked })}
                  className="rounded text-primary focus:ring-primary mb-1.5"
                />
                <span className="text-[10px] font-bold text-on-surface">เช้า (08:00)</span>
              </label>

              <label className="flex flex-col items-center justify-center p-2 rounded-lg border bg-white border-outline-variant/30 cursor-pointer hover:border-primary transition-all">
                <input
                  type="checkbox"
                  checked={frequency.noon}
                  onChange={(e) => setFrequency({ ...frequency, noon: e.target.checked })}
                  className="rounded text-primary focus:ring-primary mb-1.5"
                />
                <span className="text-[10px] font-bold text-on-surface">กลางวัน (12:30)</span>
              </label>

              <label className="flex flex-col items-center justify-center p-2 rounded-lg border bg-white border-outline-variant/30 cursor-pointer hover:border-primary transition-all">
                <input
                  type="checkbox"
                  checked={frequency.evening}
                  onChange={(e) => setFrequency({ ...frequency, evening: e.target.checked })}
                  className="rounded text-primary focus:ring-primary mb-1.5"
                />
                <span className="text-[10px] font-bold text-on-surface">เย็น (20:00)</span>
              </label>

              <label className="flex flex-col items-center justify-center p-2 rounded-lg border bg-white border-outline-variant/30 cursor-pointer hover:border-primary transition-all">
                <input
                  type="checkbox"
                  checked={frequency.night}
                  onChange={(e) => setFrequency({ ...frequency, night: e.target.checked })}
                  className="rounded text-primary focus:ring-primary mb-1.5"
                />
                <span className="text-[10px] font-bold text-on-surface">ก่อนนอน (22:00)</span>
              </label>
            </div>
          </div>

          {/* Timing / Food relationship */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-outline block">เวลาที่แนะนำเมื่อสัมพันธ์กับมื้ออาหาร</label>
            <select
              value={timing}
              onChange={(e) => setTiming(e.target.value as Medication["timing"])}
              className="w-full rounded-full border border-outline-variant bg-[#f6fbf6] px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-body"
            >
              <option value="หลังอาหารเช้า">หลังอาหารเช้า</option>
              <option value="พร้อมมื้อเที่ยง">พร้อมมื้อเที่ยง</option>
              <option value="พร้อมอาหารเย็น">พร้อมอาหารเย็น</option>
              <option value="ก่อนนอน">ก่อนนอน</option>
              <option value="ลดความดันโลหิต">ลดความดันโลหิต (ทั่วไป)</option>
              <option value="ก่อนอาหาร">ก่อนอาหาร (30 นาทีก่อนอาหาร)</option>
              <option value="ทั่วไป">ทานเมื่อมีอาการ</option>
            </select>
          </div>

          {/* Food Instruction details */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-outline block">วิธีรับประทานโดยละเอียด (Instruction)</label>
            <textarea
              value={foodInstruction}
              onChange={(e) => setFoodInstruction(e.target.value)}
              placeholder="e.g. ทานหลังอาหารทันทีเพื่อเพิ่มประสิทธิภาพการดูดซึมและลดการระคายเคือง..."
              rows={2}
              className="w-full rounded-2xl border border-outline-variant bg-[#f6fbf6] px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-body resize-none"
            />
          </div>

          {/* Warning banner note */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-outline flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-error" /> ข้อควรระวังสำคัญ (Warning - ถ้ามี)
            </label>
            <input
              type="text"
              value={warning}
              onChange={(e) => setWarning(e.target.value)}
              placeholder="e.g. หลีกเลี่ยงการทานคู่กับนมหรือแร่ธาตุแคลเซียม"
              className="w-full rounded-full border border-outline-variant bg-[#f6fbf6] px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-body"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-outline-variant/20 pt-4 flex gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-outline text-outline font-headline font-bold py-2.5 hover:bg-surface-container transition-all active:scale-95"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim() || !nameTh.trim()}
            className="flex-1 bg-primary text-white rounded-full font-headline font-bold py-2.5 shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            ยืนยันบันทึกยา
          </button>
        </div>
      </motion.div>
    </div>
  );
}
