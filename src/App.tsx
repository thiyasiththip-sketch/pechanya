import React, { useState, useEffect } from "react";
import { Medication, IntakeLog, HealthTip, MedicationSlot } from "./types";
import { INITIAL_MEDICATIONS, INITIAL_INTAKE_LOGS, HEALTH_TIPS } from "./data";
import PharmacistChat from "./components/PharmacistChat";
import AddMedicationModal from "./components/AddMedicationModal";
import MedicationDetails from "./components/MedicationDetails";
import { 
  Home as HomeIcon, Calendar as CalendarIcon, Pill as PillIcon, 
  Lightbulb as LightbulbIcon, Plus as PlusIcon, CheckCircle2, 
  AlertCircle, AlertTriangle, MessageSquare, ChevronRight, Search, 
  Bell, Check, RefreshCw, X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Local storage keys
  const STORAGE_MED_KEY = "medtrack_medications_v1";
  const STORAGE_LOG_KEY = "medtrack_logs_v1";

  // State
  const [medications, setMedications] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<IntakeLog[]>([]);
  const [activeTab, setActiveTab] = useState<"home" | "schedule" | "mymeds" | "tips">("home");
  const [selectedMedId, setSelectedMedId] = useState<string | null>(null);
  
  // Modals & overlay states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedTip, setSelectedTip] = useState<HealthTip | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTipCategory, setActiveTipCategory] = useState<HealthTip["category"] | "ทั้งหมด">("ทั้งหมด");
  
  // Weekly calendar selection (Schedule Page)
  const [selectedDateStr, setSelectedDateStr] = useState<string>("");
  const [calendarDays, setCalendarDays] = useState<{ dayLabel: string; dateNum: number; dateStr: string; dayFull: string }[]>([]);

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize and load data from LocalStorage
  useEffect(() => {
    const cachedMeds = localStorage.getItem(STORAGE_MED_KEY);
    const cachedLogs = localStorage.getItem(STORAGE_LOG_KEY);

    if (cachedMeds) {
      setMedications(JSON.parse(cachedMeds));
    } else {
      setMedications(INITIAL_MEDICATIONS);
      localStorage.setItem(STORAGE_MED_KEY, JSON.stringify(INITIAL_MEDICATIONS));
    }

    if (cachedLogs) {
      setLogs(JSON.parse(cachedLogs));
    } else {
      const defaultLogs = INITIAL_INTAKE_LOGS();
      setLogs(defaultLogs);
      localStorage.setItem(STORAGE_LOG_KEY, JSON.stringify(defaultLogs));
    }

    // Set today as selected date in YYYY-MM-DD
    const todayStr = new Date().toISOString().split("T")[0];
    setSelectedDateStr(todayStr);

    // Generate weekly calendar days (5 days surrounding today)
    const days = [];
    const weekdays = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
    const weekdaysFull = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    
    for (let i = -2; i <= 2; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        dayLabel: weekdays[d.getDay()],
        dayFull: weekdaysFull[d.getDay()],
        dateNum: d.getDate(),
        dateStr: d.toISOString().split("T")[0]
      });
    }
    setCalendarDays(days);
  }, []);

  // Sync state helpers to LocalStorage
  const saveMedications = (updatedMeds: Medication[]) => {
    setMedications(updatedMeds);
    localStorage.setItem(STORAGE_MED_KEY, JSON.stringify(updatedMeds));
  };

  const saveLogs = (updatedLogs: IntakeLog[]) => {
    setLogs(updatedLogs);
    localStorage.setItem(STORAGE_LOG_KEY, JSON.stringify(updatedLogs));
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check how many intakes are completed for today
  const todayStr = new Date().toISOString().split("T")[0];
  const todayLogs = logs.filter(l => l.date === todayStr);
  const completedToday = todayLogs.filter(l => l.status === "taken").length;
  const totalScheduledToday = todayLogs.length || 4; // default mock total to match screen
  const percentageToday = Math.round((completedToday / totalScheduledToday) * 100);

  // Filtered lists
  const nextPendingLog = logs
    .filter(l => l.date === todayStr && l.status === "pending")
    .sort((a, b) => {
      const timeA = a.slot === "morning" ? 1 : a.slot === "noon" ? 2 : a.slot === "evening" ? 3 : 4;
      const timeB = b.slot === "morning" ? 1 : b.slot === "noon" ? 2 : b.slot === "evening" ? 3 : 4;
      return timeA - timeB;
    })[0];

  const nextPendingMedication = nextPendingLog
    ? medications.find(m => m.id === nextPendingLog.medId)
    : null;

  // Bento Stats calculations
  const missedCount7Days = logs.filter(l => {
    const logDate = new Date(l.date);
    const diffTime = Math.abs(new Date().getTime() - logDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && l.status === "missed";
  }).length;

  const lowStockCount = medications.filter(m => m.remainingCount <= 5).length;

  // Add a medication
  const handleAddMedication = (newMed: Medication) => {
    const updated = [newMed, ...medications];
    saveMedications(updated);
    
    // Auto-schedule basic log entries for today for the new medicine
    const today = new Date().toISOString().split("T")[0];
    const newLogs: IntakeLog[] = [];
    
    if (newMed.frequency.morning) {
      newLogs.push({ id: `log-new-m-${Date.now()}`, date: today, medId: newMed.id, slot: "morning", status: "pending" });
    }
    if (newMed.frequency.noon) {
      newLogs.push({ id: `log-new-n-${Date.now()}`, date: today, medId: newMed.id, slot: "noon", status: "pending" });
    }
    if (newMed.frequency.evening) {
      newLogs.push({ id: `log-new-e-${Date.now()}`, date: today, medId: newMed.id, slot: "evening", status: "pending" });
    }
    if (newMed.frequency.night) {
      newLogs.push({ id: `log-new-ni-${Date.now()}`, date: today, medId: newMed.id, slot: "night", status: "pending" });
    }

    saveLogs([...newLogs, ...logs]);
    triggerToast(`เพิ่มยา "${newMed.nameTh}" เรียบร้อยแล้ว! ✨`);
  };

  // Perform intake logging (marking a medication as taken)
  const handleTakeMedication = (logId: string) => {
    const updated = logs.map(l => {
      if (l.id === logId) {
        const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        return { ...l, status: "taken" as const, takenTime: `${timeNow} น.` };
      }
      return l;
    });
    saveLogs(updated);

    // Subtract 1 from drug stock count
    const targetLog = logs.find(l => l.id === logId);
    if (targetLog) {
      const updatedMeds = medications.map(m => {
        if (m.id === targetLog.medId) {
          return { ...m, remainingCount: Math.max(0, m.remainingCount - 1) };
        }
        return m;
      });
      saveMedications(updatedMeds);
      
      const medObj = medications.find(m => m.id === targetLog.medId);
      if (medObj) {
        triggerToast(`บันทึกการทานยา "${medObj.nameTh}" เรียบร้อยแล้ว! 💊`);
      }
    }
  };

  // Log from drug details sheet
  const handleLogIntakeTodayFromDetail = (medId: string) => {
    const today = new Date().toISOString().split("T")[0];
    // Find if there is a pending log for this drug today, if so log it
    const pendingLog = logs.find(l => l.date === today && l.medId === medId && l.status === "pending");
    if (pendingLog) {
      handleTakeMedication(pendingLog.id);
    } else {
      // Just subtract stock directly and trigger toast
      const updatedMeds = medications.map(m => {
        if (m.id === medId) {
          return { ...m, remainingCount: Math.max(0, m.remainingCount - 1) };
        }
        return m;
      });
      saveMedications(updatedMeds);
      const medObj = medications.find(m => m.id === medId);
      triggerToast(`บันทึกการทานยา "${medObj?.nameTh}" ชดเชยเรียบร้อยแล้ว! ✨`);
    }
  };

  // Simulates purchasing / refilling stock back to original total
  const handleRefillStock = () => {
    const updated = medications.map(m => {
      if (m.remainingCount <= 5) {
        return { ...m, remainingCount: m.originalCount };
      }
      return m;
    });
    saveMedications(updated);
    triggerToast("🚚 สั่งซื้อและเติมคลังยาของคุณเป็นปริมาณเต็มพิกัดแล้ว!");
  };

  // Format date helper for Thai month
  const getThaiMonthYear = () => {
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const d = new Date();
    return `${thaiMonths[d.getMonth()]} ${d.getFullYear() + 543}`;
  };

  // Filtered health tips
  const filteredTips = HEALTH_TIPS.filter(tip => 
    activeTipCategory === "ทั้งหมด" || tip.category === activeTipCategory
  );

  return (
    <div className="bg-[#f6fbf6] min-h-screen text-[#171d1a] relative font-sans">
      {/* Top App Bar Header */}
      <header className="bg-white sticky top-0 z-40 flex justify-between items-center px-5 py-3 w-full border-b border-outline-variant/10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container active:scale-95 transition-transform duration-200 shadow-sm cursor-pointer">
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_FwW6JRKuhFLKKTFNbTJLb3C-b95j8O4CX5iCo3Jyu5gVwiinfn2OgsuQloSR6o1UtCSOayy9LY5BoEtrsoz6qNHvhv8kmK6OHNH2ocHk0uAmmKmH7Uu07m34Y1015qNWA3NXtv8EnZKyii0lXooiL1w1p1XFApDke_8U4IUyyTXA-zIEzIpeSpIIuE7efu5DOclPsbsr5JoIVB5xyVHEkhAAAIY--OXpL9VqcGxFXSG0pIJ7qUzrS3P6bJnA0LWx1rPnNGziK4cK"
            />
          </div>
          <div>
            <h1 className="font-display text-xl font-extrabold text-[#006c52] tracking-tight leading-none mb-0.5">MedTrack</h1>
            <span className="text-[10px] text-outline font-bold uppercase tracking-widest block">Kindred Care Companion</span>
          </div>
        </div>
        <button 
          onClick={() => triggerToast("🔔 คุณไม่มีการแจ้งเตือนค้างคาใหม่ในวันนี้")}
          className="text-primary hover:bg-[#f0f5f0] active:scale-95 transition-transform duration-200 p-2 rounded-full"
        >
          <Bell className="h-5 w-5" />
        </button>
      </header>

      {/* Main Container */}
      <main className="px-5 py-5 max-w-xl mx-auto space-y-5 pb-28">
        
        {/* Toast Notifier */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-[#006c52] text-white font-body text-xs py-2.5 px-5 rounded-full shadow-lg border border-primary-container/25 flex items-center gap-1.5"
            >
              <Check className="h-4 w-4 text-[#98ffd9]" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab content conditional switches */}
        <AnimatePresence mode="wait">
          {/* 1. HOME TAB */}
          {activeTab === "home" && (
            <motion.div
              key="home-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              {/* Daily Overview header */}
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <h2 className="font-display text-2xl font-extrabold text-on-surface leading-none">ภาพรวมวันนี้</h2>
                  <p className="font-body text-xs text-on-surface-variant">คุณทำได้ดีมาก! รักษาความต่อเนื่องไว้นะ</p>
                </div>
                <div className="bg-primary text-white text-xs px-3.5 py-1.5 rounded-full font-headline font-extrabold shadow-sm">
                  วันที่ 5 จาก 14
                </div>
              </div>

              {/* Bento Progress Ring Card */}
              <div className="bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,108,82,0.03)] border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <p className="font-body text-xs font-bold text-secondary uppercase tracking-wider leading-none">ทานยาแล้ว</p>
                    <h3 className="font-display text-4xl font-extrabold text-primary leading-none">
                      {completedToday} <span className="text-lg font-medium text-outline">จาก {totalScheduledToday} มื้อ</span>
                    </h3>
                    <div className="flex items-center gap-1 text-primary font-body text-xs bg-primary-container/30 px-3 py-1 rounded-full w-fit border border-primary-container/20">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      <span>สำเร็จ {percentageToday}% ของวันนี้</span>
                    </div>
                  </div>
                  {/* Circular progress wheel SVG */}
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle 
                        className="text-surface-container-high" 
                        cx="48" cy="48" fill="transparent" r="40" 
                        stroke="currentColor" strokeWidth="8"
                      />
                      <circle 
                        className="text-primary transition-all duration-1000" 
                        cx="48" cy="48" fill="transparent" r="40" 
                        stroke="currentColor" strokeWidth="8"
                        strokeDasharray="251.2" 
                        strokeDashoffset={251.2 - (251.2 * percentageToday) / 100} 
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute bg-[#f0f5f0] rounded-full w-12 h-12 flex items-center justify-center shadow-inner">
                      <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>medication</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming medication timeline slot */}
              <section className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <h3 className="font-display text-lg font-bold text-on-surface leading-none">ลำดับถัดไป</h3>
                  <button 
                    onClick={() => setActiveTab("schedule")}
                    className="text-primary font-body text-xs font-bold hover:underline"
                  >
                    ดูทั้งหมด
                  </button>
                </div>

                {nextPendingMedication && nextPendingLog ? (
                  <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div className="p-4 flex flex-col gap-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary-container/50 text-primary p-3 rounded-full flex items-center justify-center w-12 h-12 shadow-sm shrink-0">
                          <span className="material-symbols-outlined text-primary text-2xl">pill</span>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-1 text-secondary font-body text-xs font-extrabold">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            <span>{nextPendingLog.slot === "morning" ? "08:00 น." : nextPendingLog.slot === "noon" ? "12:30 น." : nextPendingLog.slot === "evening" ? "20:00 น." : "22:00 น."}</span>
                          </div>
                          <h4 className="font-display text-lg font-bold text-on-surface leading-none">
                            {nextPendingMedication.name}
                            <span className="text-xs text-outline font-medium pl-1.5">({nextPendingMedication.nameTh})</span>
                          </h4>
                          <p className="font-body text-xs text-on-surface-variant leading-none">
                            {nextPendingMedication.dosage} • ทาน{nextPendingMedication.timing}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleTakeMedication(nextPendingLog.id)}
                        className="bg-primary text-white font-headline font-bold text-sm py-2.5 px-6 rounded-full shadow-md active:scale-95 transition-all hover:brightness-110 flex items-center justify-center gap-1"
                      >
                        <span>ทานเลย</span>
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#f0f5f0]/40 p-5 rounded-xl border border-dashed border-outline-variant/40 text-center space-y-1">
                    <p className="font-display font-bold text-primary text-sm">ยอดเยี่ยมมาก! ไม่มีตารางยารอค้างคาแล้ว</p>
                    <p className="font-body text-xs text-outline">คุณรับประทานยามื้อสำคัญครบถ้วนเป็นที่เรียบร้อย</p>
                  </div>
                )}
              </section>

              {/* Stats Bento Grid */}
              <section className="grid grid-cols-2 gap-3">
                {/* Missed Stats */}
                <div className="bg-[#ffdad6] text-[#93000a] p-4 rounded-xl space-y-3 shadow-sm border border-red-100 flex flex-col justify-between">
                  <div>
                    <AlertTriangle className="h-6 w-6 text-error" />
                    <p className="font-body text-xs font-bold uppercase tracking-wider mt-1.5">พลาดยา</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl font-extrabold">{missedCount7Days} ครั้ง</p>
                    <p className="text-[10px] opacity-75 font-medium italic">ในรอบ 7 วันล่าสุด</p>
                  </div>
                </div>

                {/* Low stock Alert */}
                <div 
                  onClick={lowStockCount > 0 ? handleRefillStock : undefined}
                  className={`bg-secondary-container/30 text-on-secondary-container p-4 rounded-xl space-y-3 shadow-sm border border-secondary-container/20 flex flex-col justify-between ${
                    lowStockCount > 0 ? "cursor-pointer hover:bg-secondary-container/50" : ""
                  }`}
                >
                  <div>
                    <span className="material-symbols-outlined text-[28px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
                    <p className="font-body text-xs font-bold uppercase tracking-wider mt-1">ยาใกล้หมด</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl font-extrabold">{lowStockCount} ชนิด</p>
                    {lowStockCount > 0 ? (
                      <p className="text-[10px] font-bold underline text-secondary cursor-pointer hover:opacity-80">สั่งซื้อเพิ่มด่วน</p>
                    ) : (
                      <p className="text-[10px] opacity-75 font-medium">คลังยาสมบูรณ์ดี</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Health Tips Teaser Card */}
              <section 
                onClick={() => {
                  setActiveTab("tips");
                  setSelectedTip(HEALTH_TIPS[1]); // open consistency tip
                }}
                className="bg-tertiary-container/30 rounded-xl p-4 flex items-center gap-4 border border-tertiary-fixed-dim/10 cursor-pointer hover:bg-tertiary-container/40 transition-all shadow-sm"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm border border-outline-variant/10">
                  <img 
                    alt="Mint leaves and water" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6N6jYqPT6E1kROyWDdUct_l8-PQShP_43dAkZJxZSjsDdbO9kCd649am6wegKXvVq27nf6Cg-6N5Rmn13V-Z2UQox9xMPlZViS8hly_w3a5LH3uEVCBOxRSl2TebLlSSOXLiX5qSLD4d-wmCuD1Geagl8YqZwTf2pKwlDkk99IZ7iHAaPodXeaiHRuGo4Dw5sXB-74ps3OZKqFeChR5iwzGn6B7x6Kh3dQeIxWOb62HXYvKXoJoTkNGHQEhQIJU-7uu7vom3ZOhiQ" 
                  />
                </div>
                <div className="space-y-1 overflow-hidden flex-1">
                  <span className="inline-block bg-tertiary text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest leading-none">
                    Tip of the day
                  </span>
                  <h5 className="font-display font-bold text-sm text-primary truncate leading-none">ความสม่ำเสมอคือหัวใจ</h5>
                  <p className="font-body text-xs text-on-surface-variant truncate">
                    การกินยาตรงเวลาช่วยรักษาระดับยาในกระแสเลือด...
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-outline shrink-0" />
              </section>
            </motion.div>
          )}

          {/* 2. SCHEDULE TAB */}
          {activeTab === "schedule" && (
            <motion.div
              key="schedule-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Calendar Selector Header */}
              <div className="space-y-4 py-1">
                <div className="flex justify-between items-center">
                  <h2 className="font-display text-2xl font-extrabold text-[#171d1a] leading-none">{getThaiMonthYear()}</h2>
                  <button 
                    onClick={() => triggerToast("📅 ดับเบิลคลิกเพื่อเชื่อมปฏิทินของเครื่องผู้ใช้")}
                    className="text-primary font-headline text-xs font-bold hover:underline bg-primary-container/30 px-3 py-1.5 rounded-full border border-primary-container/20"
                  >
                    ดูปฏิทิน
                  </button>
                </div>

                {/* Calendar Days carousel */}
                <div className="flex gap-2 justify-between overflow-x-auto pb-1 no-scrollbar">
                  {calendarDays.map((day, idx) => {
                    const isActive = day.dateStr === selectedDateStr;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedDateStr(day.dateStr)}
                        className={`flex-1 flex flex-col items-center justify-center py-3.5 px-3.5 rounded-full transition-all duration-300 active:scale-95 ${
                          isActive 
                            ? "bg-[#006c52] text-white shadow-md scale-105 ring-4 ring-[#98ffd9]/20" 
                            : "bg-white text-outline border border-outline-variant/30 hover:bg-[#f0f5f0]"
                        }`}
                      >
                        <span className="text-[10px] font-bold tracking-wider mb-1 opacity-80">{day.dayLabel}</span>
                        <span className="text-base font-extrabold leading-none">{day.dateNum}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Timeline slots list */}
              <section className="space-y-4 mt-2">
                {/* Filter logs for selected calendar date */}
                {(() => {
                  const dayLogs = logs.filter(l => l.date === selectedDateStr);
                  
                  // Slots dictionary
                  const slotItems = [
                    { time: "08:00", name: "morning" as const, title: "มื้อเช้า" },
                    { time: "12:30", name: "noon" as const, title: "มื้อกลางวัน" },
                    { time: "20:00", name: "evening" as const, title: "มื้อเย็น" },
                    { time: "22:00", name: "night" as const, title: "ก่อนนอน" }
                  ];

                  return slotItems.map((slot, index) => {
                    // Find any matching logs for this slot
                    const slotLogs = dayLogs.filter(l => l.slot === slot.name);

                    return (
                      <div key={index} className="relative pl-4 space-y-2">
                        {/* Vertical line indicator */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-outline-variant/30 rounded-full" />
                        
                        {/* Slot label */}
                        <div className="flex items-center gap-2">
                          <span className="font-display font-extrabold text-sm text-[#286487]">{slot.time} น.</span>
                          <span className="text-[10px] text-outline font-bold">({slot.title})</span>
                          <div className="h-[1px] flex-1 bg-outline-variant/15" />
                        </div>

                        {/* Logs list under slot */}
                        {slotLogs.length > 0 ? (
                          slotLogs.map((log) => {
                            const med = medications.find(m => m.id === log.medId);
                            if (!med) return null;

                            return (
                              <div
                                key={log.id}
                                className={`rounded-xl p-4 border transition-all ${
                                  log.status === "taken"
                                    ? "bg-[#98ffd9]/15 border-[#006c52]/10"
                                    : log.status === "missed"
                                    ? "bg-[#ffdad6]/20 border-[#ba1a1a]/10"
                                    : "bg-white border-outline-variant/30 shadow-sm"
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="space-y-1">
                                    <h4 className="font-display text-base font-bold text-on-surface">
                                      {med.name}
                                      <span className="text-xs text-outline font-medium pl-1.5">({med.nameTh})</span>
                                    </h4>
                                    <p className="font-body text-xs text-on-surface-variant">
                                      {med.dosage} • {med.timing}
                                    </p>
                                  </div>

                                  <div className="flex flex-col items-end gap-1 shrink-0">
                                    {log.status === "taken" && (
                                      <span className="bg-primary text-white text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-sm">
                                        <CheckCircle2 className="h-3 w-3" /> ทานแล้ว {log.takenTime}
                                      </span>
                                    )}

                                    {log.status === "missed" && (
                                      <span className="bg-error text-white text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-sm">
                                        <AlertCircle className="h-3 w-3" /> พลาด
                                      </span>
                                    )}

                                    {log.status === "pending" && (
                                      <div className="flex items-center gap-1.5">
                                        <span className="bg-secondary-container text-on-secondary-container text-[10px] px-2.5 py-1 rounded-full font-bold leading-none">
                                          กำลังมาถึง
                                        </span>
                                        <button
                                          onClick={() => handleTakeMedication(log.id)}
                                          className="bg-primary text-white text-[10px] px-3 py-1 rounded-full font-headline font-bold shadow-sm hover:brightness-110 active:scale-95 transition-transform"
                                        >
                                          ยืนยันการทาน
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="bg-white/30 rounded-xl p-3 border border-outline-variant/10 text-xs text-outline italic text-center">
                            ไม่มีตารางทานยาในเวลานี้
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </section>
            </motion.div>
          )}

          {/* 3. MY MEDS TAB */}
          {activeTab === "mymeds" && (
            <motion.div
              key="mymeds-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <AnimatePresence mode="wait">
                {selectedMedId ? (
                  // Deep detail subpage
                  <motion.div
                    key="med-details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {(() => {
                      const med = medications.find(m => m.id === selectedMedId);
                      if (!med) return null;
                      return (
                        <MedicationDetails 
                          medication={med} 
                          onBack={() => setSelectedMedId(null)}
                          onLogIntakeToday={handleLogIntakeTodayFromDetail}
                        />
                      );
                    })()}
                  </motion.div>
                ) : (
                  // Medicine cabinet list
                  <motion.div
                    key="med-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {/* Cabinet stats & actions */}
                    <div className="flex justify-between items-center py-1">
                      <div>
                        <h2 className="font-display text-2xl font-extrabold text-[#171d1a] leading-none">คลังยาของคุณ</h2>
                        <p className="font-body text-xs text-outline mt-1">คลังประวัติยาและปริมาณยาคงเหลือสะสม</p>
                      </div>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-primary text-white text-xs py-2 px-4 rounded-full font-headline font-bold shadow-md hover:brightness-110 active:scale-95 transition-transform flex items-center gap-1"
                      >
                        <PlusIcon className="h-4 w-4" /> เพิ่มยาใหม่
                      </button>
                    </div>

                    {/* Search filter */}
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ค้นหาชื่อยาของคุณ..."
                        className="w-full rounded-full border border-outline-variant/30 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-body shadow-sm"
                      />
                    </div>

                    {/* Medications grid list */}
                    <div className="grid grid-cols-1 gap-3">
                      {medications
                        .filter(m => 
                          m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.nameTh.includes(searchQuery)
                        )
                        .map((med) => (
                          <div
                            key={med.id}
                            onClick={() => setSelectedMedId(med.id)}
                            className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/30 hover:border-primary/20 transition-all cursor-pointer flex gap-4 group"
                          >
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container-low shrink-0 border border-outline-variant/15 shadow-inner">
                              <img alt={med.nameTh} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={med.image} />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1 py-0.5">
                              <div className="flex justify-between items-start gap-1">
                                <h3 className="font-display text-base font-extrabold text-on-surface truncate">
                                  {med.name}
                                </h3>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                  med.remainingCount <= 5 ? "bg-error-container text-[#93000a]" : "bg-primary-container/30 text-[#00785c]"
                                }`}>
                                  เหลือ {med.remainingCount} เม็ด
                                </span>
                              </div>
                              <p className="font-body text-xs text-outline leading-none mb-1">({med.nameTh})</p>
                              <div className="flex flex-wrap items-center gap-1">
                                <span className="bg-surface-container-high/60 text-on-surface-variant text-[9px] font-bold px-2 py-0.5 rounded-full">
                                  {med.dosage}
                                </span>
                                <span className="bg-secondary-container/20 text-secondary text-[9px] font-bold px-2 py-0.5 rounded-full">
                                  {med.timing}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* 4. TIPS TAB */}
          {activeTab === "tips" && (
            <motion.div
              key="tips-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Healthy Guides Hero banner */}
              <div className="space-y-1 py-1">
                <h2 className="font-display text-2xl font-extrabold text-[#171d1a] leading-none">เคล็ดลับและคำแนะนำ</h2>
                <p className="font-body text-xs text-outline">เพื่อความปลอดภัยและประสิทธิภาพสูงสุดในการใช้ยาของคุณ</p>
              </div>

              {/* Safety alert */}
              <div className="bg-[#ffdad6] text-[#93000a] rounded-xl p-4 flex gap-3 border border-red-200/50 shadow-sm items-start">
                <AlertTriangle className="h-5 w-5 text-error shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-bold text-xs leading-tight">แจ้งเตือนความปลอดภัย</h4>
                  <p className="font-body text-[11px] leading-relaxed mt-0.5 opacity-90">
                    อย่าลืมปรึกษาเภสัชกรทุกครั้งเมื่อซื้อยาเสริมอาหารใหม่ เพื่อป้องกันปฏิกิริยาระหว่างยาที่อาจเป็นอันตราย
                  </p>
                </div>
              </div>

              {/* Featured article milk/capsules */}
              <div 
                onClick={() => setSelectedTip(HEALTH_TIPS[0])}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant/30 flex flex-col cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="w-full h-44 overflow-hidden">
                  <img 
                    alt="Milk and pills" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6CKCs3mxIGLVpuc4T415mlDpZOC4LmkxDU9wdCh3spDA8QT9D7IJnhnHSaTWResENNvSratqsTnn7nX_HaDj1CaTRLcsdzqraNgYoqsLuqikxlWE1ycoKi4-wRZ0_JqKMy14ji9nZmO3Y6kZl1cObvqJNZcVQJIBzJR8L6owiXP9khwDXgaITj7Tj6mLs927Op3hd9yX-yupoRpijaUXvSRdYRrQaT2HutyNtfJAiAdbi9mRmR3oVJnNkJobKA8Wnkmky2lZbPv5Ib-" 
                  />
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-secondary font-body text-[10px] uppercase font-bold tracking-wide block leading-none">ความปลอดภัยของยา</span>
                  <h3 className="font-display font-extrabold text-base text-on-surface leading-snug">ทำไมจึงควรเลี่ยงการทานยาบางชนิดคู่กับนม?</h3>
                  <p className="font-body text-xs text-on-surface-variant leading-relaxed">นมมีแคลเซียมที่สามารถไปจับตัวกับยาปฏิชีวนะบางชนิด ทำให้ร่างกายดูดซึมยาได้ไม่เต็มที่...</p>
                  <button className="bg-primary text-white text-xs px-4 py-2 rounded-full font-headline font-bold hover:brightness-110 active:scale-95 transition-all mt-1">
                    อ่านต่อ
                  </button>
                </div>
              </div>

              {/* Category chips */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {(["ทั้งหมด", "โภชนาการ", "ผลข้างเคียง", "เทคนิคการจำ", "ความปลอดภัย"] as const).map((cat, idx) => {
                  const isActive = activeTipCategory === cat;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveTipCategory(cat)}
                      className={`whitespace-nowrap px-4 py-1.5 rounded-full font-body text-xs border transition-all active:scale-95 ${
                        isActive 
                          ? "bg-primary text-white border-primary shadow-sm" 
                          : "bg-white text-outline border-outline-variant/30 hover:bg-[#f0f5f0]"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Tips list grid */}
              <div className="grid grid-cols-2 gap-3">
                {filteredTips.map((tip) => (
                  <article
                    key={tip.id}
                    onClick={() => setSelectedTip(tip)}
                    className="bg-white p-3.5 rounded-xl shadow-sm border border-outline-variant/20 hover:border-primary/20 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2">
                      <div className="w-9 h-9 rounded-full bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                        <LightbulbIcon className="h-4.5 w-4.5" />
                      </div>
                      <h4 className="font-display font-extrabold text-xs text-on-surface leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {tip.title}
                      </h4>
                      <p className="font-body text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                        {tip.summary}
                      </p>
                    </div>
                    <div className="flex items-center text-primary font-body text-[10px] font-extrabold pt-1">
                      <span>{tip.readTime}</span>
                      <ChevronRight className="h-3.5 w-3.5 ml-auto" />
                    </div>
                  </article>
                ))}
              </div>

              {/* Empathetic AI pharmacist block */}
              <section className="bg-primary-container/20 rounded-xl p-5 border border-primary-container/30 text-center space-y-4">
                <div className="relative flex justify-center">
                  <div className="absolute inset-0 bg-[#98ffd9] rounded-full blur-2xl opacity-20"></div>
                  <img 
                    alt="AI Pharmacist Helper Icon" 
                    className="relative w-36 h-36 object-contain rounded-full border-4 border-white shadow-md bg-white" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC3_bODImeS3Z_y7FLUEh-58wCY0geXutTHnGouTuM5y9OErlchAKawkOz5c2y50fHAhq6UXFOKdmRqdXZ3CtfQsVpWGfcwmLTB_L_hrU1RmvINaFG8i0nCgs1E9dINMCf659XLDxGz-15CRS3SdFo45blwb-95ENMbT_VEpnVSu5o9aQQZaXmB17nDafjYzNiOUwFEpGKXQjL6MqIDiF4jysClj9qktGyOAnUjMZsUpYm6jNe2Wyqvyxb4IsQJGV9f7HYzfwBOouw"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-lg text-primary">มีข้อสงสัยเกี่ยวกับยาของคุณไหม?</h3>
                  <p className="font-body text-xs text-on-surface-variant leading-relaxed max-w-sm mx-auto">
                    ทีมเภสัชกรอัจฉริยะของเราพร้อมให้คำแนะนำเบื้องต้นเกี่ยวกับประเภทการออกฤทธิ์ อาหารแสลง และวิธีการใช้ยาที่ถูกต้องปลอดภัยสูงสุด
                  </p>
                </div>
                <div className="flex gap-2 justify-center max-w-sm mx-auto">
                  <button 
                    onClick={() => setShowChat(true)}
                    className="flex-1 bg-primary text-white text-xs py-2.5 px-4 rounded-full font-headline font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="h-4 w-4" /> แชทกับเภสัชกร
                  </button>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Navigation overlay panel for specific Tip Reading */}
      <AnimatePresence>
        {selectedTip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-xl p-6 shadow-2xl border border-outline-variant/20 flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between border-b border-outline-variant/15 pb-4 shrink-0">
                <span className="bg-primary-container/40 text-primary font-body text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  {selectedTip.category} • {selectedTip.readTime}
                </span>
                <button
                  onClick={() => setSelectedTip(null)}
                  className="rounded-full p-2 hover:bg-[#f0f5f0] text-outline hover:text-primary transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-4 space-y-4 font-body text-sm text-on-surface-variant leading-relaxed no-scrollbar">
                <div className="w-full h-44 rounded-xl overflow-hidden shadow-sm border border-outline-variant/10 shrink-0">
                  <img alt={selectedTip.title} className="w-full h-full object-cover" src={selectedTip.image} />
                </div>
                <h3 className="font-display font-extrabold text-xl text-on-surface leading-snug">
                  {selectedTip.title}
                </h3>
                <p className="whitespace-pre-line text-xs font-body leading-relaxed text-on-surface-variant opacity-95">
                  {selectedTip.content}
                </p>
              </div>

              <div className="border-t border-outline-variant/15 pt-4 shrink-0">
                <button
                  onClick={() => setSelectedTip(null)}
                  className="w-full bg-primary text-white rounded-full font-headline font-bold text-sm py-2.5 shadow-md active:scale-95 transition-all"
                >
                  เข้าใจแล้ว
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Persistent Bottom Tab Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 pb-4 pt-2.5 bg-white/80 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,108,82,0.06)] rounded-t-xl border-t border-outline-variant/10">
        {/* Home */}
        <button 
          onClick={() => { setActiveTab("home"); setSelectedMedId(null); }}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 active:scale-90 ${
            activeTab === "home" 
              ? "bg-[#98ffd9]/30 text-[#00785c] px-4 py-1.5 font-bold shadow-sm" 
              : "text-outline hover:bg-[#f0f5f0]"
          }`}
        >
          <HomeIcon className="h-5 w-5" />
          <span className="font-headline text-[10px] mt-0.5">หน้าหลัก</span>
        </button>

        {/* Schedule */}
        <button 
          onClick={() => { setActiveTab("schedule"); setSelectedMedId(null); }}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 active:scale-90 ${
            activeTab === "schedule" 
              ? "bg-[#98ffd9]/30 text-[#00785c] px-4 py-1.5 font-bold shadow-sm" 
              : "text-outline hover:bg-[#f0f5f0]"
          }`}
        >
          <CalendarIcon className="h-5 w-5" />
          <span className="font-headline text-[10px] mt-0.5">ตารางเวลา</span>
        </button>

        {/* Floating Add Medication Button */}
        <div className="relative -top-6 shrink-0">
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform hover:brightness-110 ring-4 ring-[#98ffd9]/20"
          >
            <PlusIcon className="h-7 w-7" />
          </button>
        </div>

        {/* My Meds */}
        <button 
          onClick={() => { setActiveTab("mymeds"); setSelectedMedId(null); }}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 active:scale-90 ${
            activeTab === "mymeds" 
              ? "bg-[#98ffd9]/30 text-[#00785c] px-4 py-1.5 font-bold shadow-sm" 
              : "text-outline hover:bg-[#f0f5f0]"
          }`}
        >
          <PillIcon className="h-5 w-5" />
          <span className="font-headline text-[10px] mt-0.5">รายการยา</span>
        </button>

        {/* Tips */}
        <button 
          onClick={() => { setActiveTab("tips"); setSelectedMedId(null); }}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 active:scale-90 ${
            activeTab === "tips" 
              ? "bg-[#98ffd9]/30 text-[#00785c] px-4 py-1.5 font-bold shadow-sm" 
              : "text-outline hover:bg-[#f0f5f0]"
          }`}
        >
          <LightbulbIcon className="h-5 w-5" />
          <span className="font-headline text-[10px] mt-0.5">เคล็ดลับ</span>
        </button>
      </nav>

      {/* Add Medication Form Modal */}
      <AddMedicationModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onAdd={handleAddMedication}
      />

      {/* AI Pharmacist Chat Overlay */}
      <PharmacistChat 
        isOpen={showChat} 
        onClose={() => setShowChat(false)} 
      />
    </div>
  );
}
