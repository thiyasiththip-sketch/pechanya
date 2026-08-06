import React, { useState } from "react";
import { Medication } from "../types";
import { 
  ChevronLeft, Share2, AlertTriangle, ShieldCheck, HelpCircle, 
  Thermometer, Sun, Sunset, Moon, Bed, FileText, CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MedicationDetailsProps {
  medication: Medication;
  onBack: () => void;
  onLogIntakeToday: (medId: string) => void;
}

export default function MedicationDetails({ medication, onBack, onLogIntakeToday }: MedicationDetailsProps) {
  const [isLogged, setIsLogged] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const handleLogToday = () => {
    onLogIntakeToday(medication.id);
    setIsLogged(true);
    setTimeout(() => {
      setIsLogged(false);
    }, 3000);
  };

  const handleShare = () => {
    // Simulate share action with a beautiful toast notification
    setShowShareToast(true);
    navigator.clipboard?.writeText?.(
      `ข้อมูลการทานยา MedTrack: ${medication.nameTh} (${medication.name}) ขนาด ${medication.dosage} - ทาน${medication.timing} (${medication.foodInstruction})`
    );
    setTimeout(() => {
      setShowShareToast(false);
    }, 2500);
  };

  // Check which slots are active
  const slots = [
    { label: "เช้า (08:00)", active: medication.frequency.morning, icon: Sun, dose: medication.dosage },
    { label: "กลางวัน (12:30)", active: medication.frequency.noon, icon: Sunset, dose: medication.dosage },
    { label: "เย็น (20:00)", active: medication.frequency.evening, icon: Moon, dose: medication.dosage },
    { label: "ก่อนนอน (22:00)", active: medication.frequency.night, icon: Bed, dose: medication.dosage }
  ];

  const progressPercentage = Math.round((medication.remainingCount / medication.originalCount) * 100);

  return (
    <div className="relative space-y-4 pb-20">
      {/* Toast Notification */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#006c52] text-white font-body text-xs py-2 px-4 rounded-full shadow-lg flex items-center gap-2 border border-[#98ffd9]/20"
          >
            <ShieldCheck className="h-4 w-4 text-[#98ffd9]" />
            คัดลอกข้อมูลและลิ้งก์ยาเรียบร้อยแล้ว!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail view header */}
      <div className="flex items-center justify-between py-1 bg-white/40 backdrop-blur-sm rounded-xl px-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-primary hover:opacity-80 active:scale-95 transition-transform"
        >
          <ChevronLeft className="h-7 w-7" />
          <span className="font-display font-bold">กลับ</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 text-on-surface-variant hover:bg-[#f0f5f0] hover:text-primary rounded-full active:scale-95 transition-transform"
            title="แชร์ข้อมูลยา"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Warning banner */}
      {medication.warning && (
        <motion.section 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#ffdad6] text-[#93000a] rounded-xl p-4 flex gap-3 border border-red-200/50 shadow-sm"
        >
          <div className="shrink-0">
            <span className="material-symbols-outlined text-[32px] text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          </div>
          <div className="space-y-0.5">
            <h4 className="font-display font-bold text-sm">ข้อควรระวังสำคัญ (Warning)</h4>
            <p className="font-body text-xs leading-relaxed opacity-90">{medication.warning}</p>
          </div>
        </motion.section>
      )}

      {/* Main Medication card: Left is image, Right is metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card header & Visual info */}
        <div className="md:col-span-2 bg-white rounded-xl p-4 border border-outline-variant/30 shadow-sm flex flex-col sm:flex-row gap-5">
          <div className="w-full sm:w-44 h-44 rounded-xl overflow-hidden bg-surface-container-low shrink-0 shadow-sm border border-outline-variant/10">
            <img 
              alt={medication.nameTh} 
              className="w-full h-full object-cover" 
              src={medication.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuAYqSZoh0pz2LyLjzaXxVuRTKfD7KEhgUpfYCJmQKtIxqH0xzn1_gHJtfhGnW6KtkK90eFNIFRblZRO0lxh2_exhYCnJsDemcyYmv417vJcvKqm2lLnm1eLaIaW5-tFKtqmbPrvkjYo_MNBiuet3mYySPiLXG9qz8drdPMhWR-7KJtJ9He4zefn1I1aSyFBFlh59iiftpD6rN5KDUy-qmy1NNPnU1xHMoWalEPd2JlD1jjF0A817Fs34zL4xzyYaNa1JMjyQvoaD57k"} 
            />
          </div>
          <div className="flex-1 flex flex-col justify-between py-1 space-y-3">
            <div>
              <span className="inline-block bg-primary-container/40 text-primary font-body text-xs font-bold px-3 py-1 rounded-full border border-primary-container/20 mb-2">
                {medication.category}
              </span>
              <h2 className="font-display text-2xl font-bold text-on-surface leading-snug">
                {medication.name} <br />
                <span className="text-lg text-outline font-medium">({medication.nameTh})</span>
              </h2>
              <p className="text-on-surface-variant font-body text-sm mt-1">ขนาดยาที่กำหนด: {medication.dosage}</p>
            </div>

            {/* Progress remaining */}
            <div className="pt-3 border-t border-outline-variant/20 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-outline font-bold">สถานะการรักษา: <span className="text-primary font-extrabold">กำลังทาน</span></span>
                <span className="text-on-surface font-extrabold">คงเหลือ {medication.remainingCount} / {medication.originalCount} เม็ด</span>
              </div>
              <div className="w-full bg-[#f0f5f0] h-2.5 rounded-full overflow-hidden border border-outline-variant/10">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.max(2, Math.min(100, progressPercentage))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action instruction box */}
        <div className="bg-primary-container/20 border border-primary-container/30 text-on-primary-container rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-primary">วิธีรับประทาน</h3>
              <span className="material-symbols-outlined text-[24px] text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>schedule</span>
            </div>
            <div className="space-y-3 font-body text-sm text-on-surface-variant leading-relaxed">
              <div className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                <p>{medication.foodInstruction}</p>
              </div>
              <div className="flex gap-2 items-center">
                <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>autorenew</span>
                <p>ทานสม่ำเสมอต่อเนื่องตามคำสั่งเภสัชกร</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogToday}
            disabled={medication.remainingCount <= 0}
            className={`mt-6 w-full py-2.5 rounded-full font-display font-bold text-sm shadow-sm transition-all duration-300 active:scale-95 ${
              isLogged 
                ? "bg-primary text-white" 
                : "bg-white text-primary border border-primary hover:bg-[#f0f5f0]"
            } disabled:opacity-40 disabled:pointer-events-none`}
          >
            {isLogged ? (
              <span className="flex items-center justify-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> บันทึกสำเร็จ! ✨
              </span>
            ) : "บันทึกการทานวันนี้"}
          </button>
        </div>
      </div>

      {/* Daily Schedule Slots visual representation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {slots.map((slot, idx) => {
          const SlotIcon = slot.icon;
          return (
            <div 
              key={idx} 
              className={`p-3.5 rounded-xl shadow-sm border flex items-center gap-3 transition-all ${
                slot.active 
                  ? "bg-white border-primary-container text-on-surface" 
                  : "bg-surface-container-low/40 border-outline-variant/10 text-outline opacity-60"
              }`}
            >
              <div className={`p-1.5 rounded-full shrink-0 flex items-center justify-center ${
                slot.active ? "bg-primary-container/50 text-primary" : "bg-outline-variant/20 text-outline"
              }`}>
                <SlotIcon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-outline font-bold block leading-none mb-1">{slot.label}</span>
                <span className="font-display font-bold text-sm leading-none">
                  {slot.active ? slot.dose : "ไม่ต้องทาน"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive medical info sheet */}
      <div className="bg-white rounded-xl p-5 border border-outline-variant/30 shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base text-primary border-b border-[#98ffd9]/60 pb-2 flex items-center gap-1.5">
          <FileText className="h-5 w-5" /> ข้อมูลเพิ่มเติมทางการแพทย์
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1 font-body text-sm text-on-surface-variant leading-relaxed">
          {/* Indications */}
          <div className="space-y-1.5">
            <h4 className="font-display font-bold text-primary-container-variant text-on-surface flex items-center gap-1 text-[14px]">
              <span className="material-symbols-outlined text-primary text-[18px]">clinical_notes</span>
              ข้อบ่งใช้ (Indications)
            </h4>
            <p className="text-xs leading-relaxed opacity-95">
              {medication.notes || "ยาประเภทนี้ใช้เพื่อบำรุงและรักษาอาการเฉพาะโรคที่ตรวจวินิจฉัยโดยบุคลากรทางการแพทย์"}
            </p>
          </div>

          {/* Side Effects */}
          <div className="space-y-1.5">
            <h4 className="font-display font-bold text-on-surface flex items-center gap-1 text-[14px]">
              <span className="material-symbols-outlined text-primary text-[18px]">priority_high</span>
              ผลข้างเคียงที่อาจเกิดขึ้น
            </h4>
            <ul className="list-disc list-inside text-xs space-y-1 pl-0.5 opacity-95">
              {medication.sideEffects?.map((effect, index) => (
                <li key={index}>{effect}</li>
              )) || (
                <>
                  <li>อาจมีอาการท้องอืด ท้องเสีย หรือพะอืดพะอมเล็กน้อย</li>
                  <li>หากพบอาการผื่นคันรุนแรง ตาบวม ควรหยุดยาและไปพบแพทย์</li>
                </>
              )}
            </ul>
          </div>

          {/* Storage instructions */}
          <div className="space-y-1.5">
            <h4 className="font-display font-bold text-on-surface flex items-center gap-1 text-[14px]">
              <span className="material-symbols-outlined text-primary text-[18px]">thermometer</span>
              การเก็บรักษา
            </h4>
            <p className="text-xs leading-relaxed opacity-95">
              {medication.storage || "เก็บในอุณหภูมิห้อง ไม่เกิน 30 องศาเซลเซียส หลีกเลี่ยงแสงแดดและความชื้นสูง"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
