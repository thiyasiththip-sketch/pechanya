import { Medication, IntakeLog, HealthTip } from "./types";

export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: "med-amoxicillin",
    name: "Amoxicillin",
    nameTh: "อะม็อกซีซิลลิน",
    category: "ยาปฏิชีวนะ (Antibiotics)",
    dosage: "500 มก.",
    frequency: {
      morning: true,
      noon: true,
      evening: true,
      night: false,
    },
    timing: "หลังอาหารเช้า",
    foodInstruction: "ทานหลังอาหารทันที เพื่อเพิ่มประสิทธิภาพการดูดซึมและลดการระคายเคืองกระเพาะอาหาร",
    remainingCount: 14,
    originalCount: 30,
    warning: "หลีกเลี่ยงการดื่มนมหรือทานแคลเซียมก่อนทานยา 2 ชั่วโมง เนื่องจากอาจทำให้ประสิทธิภาพของยาในการดูดซึมลดลง",
    classification: "ยาปฏิชีวนะ (Antibiotics)",
    notes: "ใช้รักษาการติดเชื้อแบคทีเรีย เช่น การติดเชื้อในระบบทางเดินหายใจ, หูอักเสบ, ผิวหนังอักเสบ และทางเดินปัสสาวะ",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYqSZoh0pz2LyLjzaXxVuRTKfD7KEhgUpfYCJmQKtIxqH0xzn1_gHJtfhGnW6KtkK90eFNIFRblZRO0lxh2_exhYCnJsDemcyYmv417vJcvKqm2lLnm1eLaIaW5-tFKtqmbPrvkjYo_MNBiuet3mYySPiLXG9qz8drdPMhWR-7KJtJ9He4zefn1I1aSyFBFlh59iiftpD6rN5KDUy-qmy1NNPnU1xHMoWalEPd2JlD1jjF0A817Fs34zL4xzyYaNa1JMjyQvoaD57k",
    sideEffects: [
      "คลื่นไส้ อาเจียน หรือท้องเสียเล็กน้อย",
      "มีผื่นคันขึ้นตามร่างกาย (หากพบผื่นคันรุนแรงหรือมีไข้ร่วมด้วย ควรหยุดยาและพบแพทย์ทันที)"
    ],
    storage: "เก็บในอุณหภูมิห้อง ไม่เกิน 30 องศาเซลเซียส หลีกเลี่ยงแสงแดดและความชื้น",
    status: "active"
  },
  {
    id: "med-metformin",
    name: "Metformin",
    nameTh: "เมทฟอร์มิน",
    category: "ยาลดระดับน้ำตาลในเลือด",
    dosage: "500 มก.",
    frequency: {
      morning: true,
      noon: false,
      evening: true,
      night: false,
    },
    timing: "หลังอาหารเช้า",
    foodInstruction: "ทานพร้อมอาหารหรือหลังอาหารทันทีเพื่อลดอาการข้างเคียงเกี่ยวกับระบบทางเดินอาหาร",
    remainingCount: 28,
    originalCount: 60,
    warning: "หลีกเลี่ยงการดื่มแอลกอฮอล์ระหว่างทานยานี้ เนื่องจากเพิ่มความเสี่ยงต่อภาวะกรดแลคติกสะสมในร่างกาย",
    classification: "ยาลดน้ำตาลในเลือด (Antidiabetics)",
    notes: "ใช้รักษาโรคเบาหวานประเภทที่ 2 เพื่อควบคุมระดับน้ำตาลในเลือดและเพิ่มความไวต่ออินซูลิน",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYqSZoh0pz2LyLjzaXxVuRTKfD7KEhgUpfYCJmQKtIxqH0xzn1_gHJtfhGnW6KtkK90eFNIFRblZRO0lxh2_exhYCnJsDemcyYmv417vJcvKqm2lLnm1eLaIaW5-tFKtqmbPrvkjYo_MNBiuet3mYySPiLXG9qz8drdPMhWR-7KJtJ9He4zefn1I1aSyFBFlh59iiftpD6rN5KDUy-qmy1NNPnU1xHMoWalEPd2JlD1jjF0A817Fs34zL4xzyYaNa1JMjyQvoaD57k",
    sideEffects: [
      "ท้องอืด ท้องเสีย หรือมีลมในกระเพาะอาหาร",
      "เบื่ออาหาร รู้สึกขมในปากเล็กน้อย"
    ],
    storage: "เก็บที่อุณหภูมิต่ำกว่า 30 องศาเซลเซียส พ้นจากแสงแดดและความร้อน",
    status: "active"
  },
  {
    id: "med-paracetamol",
    name: "Paracetamol",
    nameTh: "พาราเซตามอล",
    category: "ยาแก้ปวด ลดไข้",
    dosage: "500 มก.",
    frequency: {
      morning: true,
      noon: false,
      evening: false,
      night: false,
    },
    timing: "หลังอาหารเช้า",
    foodInstruction: "ทานหลังอาหารหรือเมื่อมีอาการปวดหรือไข้ ทุก 4-6 ชั่วโมง ห้ามกินเกิน 8 เม็ดต่อวัน",
    remainingCount: 8,
    originalCount: 20,
    warning: "ห้ามดื่มสุราหรือเครื่องดื่มแอลกอฮอล์ร่วมกับยานี้ เพราะอาจทำให้ตับถูกทำลายอย่างรุนแรง",
    classification: "ยาแก้ปวดลดไข้ (Analgesic)",
    notes: "บรรเทาอาการปวดเล็กน้อยถึงปานกลาง เช่น ปวดศีรษะ ปวดฟัน และช่วยลดไข้",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYqSZoh0pz2LyLjzaXxVuRTKfD7KEhgUpfYCJmQKtIxqH0xzn1_gHJtfhGnW6KtkK90eFNIFRblZRO0lxh2_exhYCnJsDemcyYmv417vJcvKqm2lLnm1eLaIaW5-tFKtqmbPrvkjYo_MNBiuet3mYySPiLXG9qz8drdPMhWR-7KJtJ9He4zefn1I1aSyFBFlh59iiftpD6rN5KDUy-qmy1NNPnU1xHMoWalEPd2JlD1jjF0A817Fs34zL4xzyYaNa1JMjyQvoaD57k",
    sideEffects: [
      "อาจมีอาการผื่นแพ้ทางผิวหนัง",
      "การทานขนาดสูงติดต่อกันนานๆ มีพิษต่อตับ"
    ],
    storage: "เก็บในภาชนะปิดสนิท ป้องกันแสง และเก็บที่อุณหภูมิห้อง",
    status: "active"
  },
  {
    id: "med-amlodipine",
    name: "Amlodipine",
    nameTh: "แอมโลดิพีน",
    category: "ยาลดความดันโลหิตสูง",
    dosage: "5 มก.",
    frequency: {
      morning: false,
      noon: true,
      evening: false,
      night: false,
    },
    timing: "ลดความดันโลหิต",
    foodInstruction: "ทานก่อนหรือหลังอาหารก็ได้ แนะนำให้ทานในเวลาเดิมเป็นประจำทุกวัน",
    remainingCount: 15,
    originalCount: 30,
    warning: "หลีกเลี่ยงการดื่มน้ำส้มโอระหว่างทานยานี้ เนื่องจากอาจส่งผลต่อการตอบสนองของยาและทำความดันต่ำเกินไป",
    classification: "ยาลดความดันโลหิต (Antihypertensive)",
    notes: "ใช้รักษาโรคความดันโลหิตสูง และป้องกันภาวะเจ็บหน้าอกแบบแองไจนา",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYqSZoh0pz2LyLjzaXxVuRTKfD7KEhgUpfYCJmQKtIxqH0xzn1_gHJtfhGnW6KtkK90eFNIFRblZRO0lxh2_exhYCnJsDemcyYmv417vJcvKqm2lLnm1eLaIaW5-tFKtqmbPrvkjYo_MNBiuet3mYySPiLXG9qz8drdPMhWR-7KJtJ9He4zefn1I1aSyFBFlh59iiftpD6rN5KDUy-qmy1NNPnU1xHMoWalEPd2JlD1jjF0A817Fs34zL4xzyYaNa1JMjyQvoaD57k",
    sideEffects: [
      "ข้อเท้าบวม เท้าบวม หรือบวมน้ำ",
      "ปวดศีรษะ ร้อนวูบวาบ มึนงง"
    ],
    storage: "เก็บที่อุณหภูมิไม่เกิน 30 องศาเซลเซียส พ้นแสงแดดและความชื้น",
    status: "active"
  },
  {
    id: "med-multivitamin",
    name: "Multivitamin",
    nameTh: "วิตามินรวม",
    category: "วิตามินและอาหารเสริม",
    dosage: "1 แคปซูล",
    frequency: {
      morning: false,
      noon: true,
      evening: false,
      night: false,
    },
    timing: "พร้อมมื้อเที่ยง",
    foodInstruction: "แนะนำให้ทานร่วมกับอาหารมื้อใหญ่หรือพร้อมมื้ออาหารเที่ยงเพื่อให้ดูดซึมวิตามินที่ละลายในไขมันได้ดียิ่งขึ้น",
    remainingCount: 20,
    originalCount: 30,
    warning: "ไม่ควรทานร่วมกับยาปฏิชีวนะบางประเภทพร้อมกัน เนื่องจากแร่ธาตุในวิตามินอาจลดการดูดซึมของยาปฏิชีวนะ",
    classification: "อาหารเสริม (Supplement)",
    notes: "บำรุงร่างกาย ชดเชยวิตามินที่ขาด และเสริมสร้างภูมิคุ้มกัน",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYqSZoh0pz2LyLjzaXxVuRTKfD7KEhgUpfYCJmQKtIxqH0xzn1_gHJtfhGnW6KtkK90eFNIFRblZRO0lxh2_exhYCnJsDemcyYmv417vJcvKqm2lLnm1eLaIaW5-tFKtqmbPrvkjYo_MNBiuet3mYySPiLXG9qz8drdPMhWR-7KJtJ9He4zefn1I1aSyFBFlh59iiftpD6rN5KDUy-qmy1NNPnU1xHMoWalEPd2JlD1jjF0A817Fs34zL4xzyYaNa1JMjyQvoaD57k",
    sideEffects: [
      "ปัสสาวะมีสีเหลืองเข้มขึ้นกว่าปกติ (เป็นเรื่องปกติของวิตามินบีขับออก)",
      "อาจมีอาการพะอืดพะอมหากทานตอนท้องว่าง"
    ],
    storage: "เก็บไว้ในที่แห้ง อุณหภูมิต่ำกว่า 25 องศาเซลเซียส พ้นจากแสงและมือเด็ก",
    status: "active"
  },
  {
    id: "med-vitaminc",
    name: "Vitamin C",
    nameTh: "วิตามินซี",
    category: "วิตามินและอาหารเสริม",
    dosage: "1000 มก.",
    frequency: {
      morning: false,
      noon: false,
      evening: false,
      night: true,
    },
    timing: "ก่อนนอน",
    foodInstruction: "ทานพร้อมน้ำปริมาณมาก แนะนำให้ทานเป็นประจำสม่ำเสมอ",
    remainingCount: 14,
    originalCount: 30,
    warning: "สำหรับผู้ที่เป็นโรคไตหรือมีนิ่วในทางเดินปัสสาวะ ควรปรึกษาแพทย์ก่อนทานวิตามินซีปริมาณสูง",
    classification: "วิตามิน (Vitamin)",
    notes: "เสริมภูมิต้านทานหวัด บำรุงผิวพรรณ และต้านอนุมูลอิสระ",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYqSZoh0pz2LyLjzaXxVuRTKfD7KEhgUpfYCJmQKtIxqH0xzn1_gHJtfhGnW6KtkK90eFNIFRblZRO0lxh2_exhYCnJsDemcyYmv417vJcvKqm2lLnm1eLaIaW5-tFKtqmbPrvkjYo_MNBiuet3mYySPiLXG9qz8drdPMhWR-7KJtJ9He4zefn1I1aSyFBFlh59iiftpD6rN5KDUy-qmy1NNPnU1xHMoWalEPd2JlD1jjF0A817Fs34zL4xzyYaNa1JMjyQvoaD57k",
    sideEffects: [
      "ระคายเคืองกระเพาะอาหารหากทานตอนท้องว่าง",
      "ปวดท้องหรือท้องเสียหากทานปริมาณมากเกินไป"
    ],
    storage: "เก็บในขวดสีชา ปิดฝาให้สนิท หลีกเลี่ยงความร้อน ความชื้น และแสงแดด",
    status: "active"
  }
];

// Seed standard intake logs for the current day and previous days
// Format date: YYYY-MM-DD
const getFormattedToday = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_INTAKE_LOGS = (): IntakeLog[] => {
  const today = getFormattedToday();
  const yesterday = getFormattedToday(-1);
  const dayBefore = getFormattedToday(-2);
  
  return [
    // Today logs
    {
      id: "log-1",
      date: today,
      medId: "med-paracetamol",
      slot: "morning",
      status: "taken",
      takenTime: "08:05"
    },
    {
      id: "log-2",
      date: today,
      medId: "med-amlodipine",
      slot: "noon",
      status: "missed"
    },
    {
      id: "log-3",
      date: today,
      medId: "med-multivitamin",
      slot: "noon",
      status: "pending"
    },
    {
      id: "log-4",
      date: today,
      medId: "med-metformin",
      slot: "evening",
      status: "pending"
    },
    {
      id: "log-5",
      date: today,
      medId: "med-vitaminc",
      slot: "night",
      status: "pending"
    },
    
    // Yesterday logs (mostly taken to build history)
    {
      id: "log-prev-1",
      date: yesterday,
      medId: "med-paracetamol",
      slot: "morning",
      status: "taken",
      takenTime: "08:12"
    },
    {
      id: "log-prev-2",
      date: yesterday,
      medId: "med-amlodipine",
      slot: "noon",
      status: "taken",
      takenTime: "12:35"
    },
    {
      id: "log-prev-3",
      date: yesterday,
      medId: "med-multivitamin",
      slot: "noon",
      status: "taken",
      takenTime: "12:35"
    },
    {
      id: "log-prev-4",
      date: yesterday,
      medId: "med-metformin",
      slot: "evening",
      status: "taken",
      takenTime: "20:02"
    }
  ];
};

export const HEALTH_TIPS: HealthTip[] = [
  {
    id: "tip-milk",
    title: "ทำไมจึงควรเลี่ยงการทานยาบางชนิดคู่กับนม?",
    category: "ความปลอดภัย",
    summary: "นมมีแคลเซียมที่สามารถไปจับตัวกับยาปฏิชีวนะบางชนิด ทำให้ร่างกายดูดซึมยาได้ไม่เต็มที่และประสิทธิภาพลดลง...",
    content: `การรับประทานยาปฏิชีวนะ (Antibiotics) กลุ่มควิโนโลน (Quinolones) หรือเตตราไซคลีน (Tetracyclines) พร้อมกับการดื่มนม หรือผลิตภัณฑ์จากนม เช่น โยเกิร์ต ชีส รวมถึงอาหารหรือวิตามินเสริมที่มีแคลเซียม ธาตุเหล็ก หรือสังกะสี เป็นข้อห้ามสำคัญทางการแพทย์

เนื่องจาก "แคลเซียม" และแร่ธาตุอื่นๆ จะเข้าไปทำปฏิกิริยากับตัวยา เกิดเป็นสารประกอบเชิงซ้อนที่ไม่ละลายน้ำในทางเดินอาหาร ส่งผลให้ร่างกายไม่สามารถดูดซึมยาเข้าสู่กระแสเลือดได้ตามปกติ ทำให้ระดับยาไม่สูงพอที่จะฆ่าเชื้อโรคได้ ซึ่งเป็นสาเหตุสำคัญที่ทำให้การรักษาไม่ได้ผล และเสี่ยงต่อการเกิดเชื้อดื้อยาอีกด้วย

คำแนะนำในการปฏิบัติเพื่อความปลอดภัย:
1. หลีกเลี่ยงการดื่มนมหรือทานผลิตภัณฑ์จากนม รวมถึงวิตามินเสริมที่มีแร่ธาตุสูงอย่างน้อย 2 ชั่วโมงก่อนรับประทานยา หรือหลังรับประทานยาไปแล้วอย่างน้อย 2-4 ชั่วโมง
2. ควรกลืนยาด้วย "น้ำเปล่าสะอาด" ที่อุณหภูมิห้องเท่านั้น ซึ่งเป็นทางเลือกที่ปลอดภัยที่สุดสำหรับยาทุกชนิด
3. ยาปฏิชีวนะส่วนใหญ่แนะนำให้รับประทานให้ครบตามปริมาณที่แพทย์หรือเภสัชกรสั่ง แม้ว่าจะมีอาการดีขึ้นแล้วก็ตาม เพื่อป้องกันอาการติดเชื้อซ้ำซ้อนและการดื้อยาในอนาคต`,
    image: "https://lh3.googleusercontent.com/aida-public/AB6CKCs3mxIGLVpuc4T415mlDpZOC4LmkxDU9wdCh3spDA8QT9D7IJnhnHSaTWResENNvSratqsTnn7nX_HaDj1CaTRLcsdzqraNgYoqsLuqikxlWE1ycoKi4-wRZ0_JqKMy14ji9nZmO3Y6kZl1cObvqJNZcVQJIBzJR8L6owiXP9khwDXgaITj7Tj6mLs927Op3hd9yX-yupoRpijaUXvSRdYRrQaT2HutyNtfJAiAdbi9mRmR3oVJnNkJobKA8Wnkmky2lZbPv5Ib-",
    readTime: "อ่าน 3 นาที"
  },
  {
    id: "tip-consistency",
    title: "ความสม่ำเสมอในการทานยา",
    category: "เทคนิคการจำ",
    summary: "การกินยาให้ตรงเวลาตามคำสั่งแพทย์อย่างเคร่งครัดช่วยรักษาระดับยาในกระแสเลือดให้อยู่ในเกณฑ์ที่สามารถรักษาโรคได้...",
    content: `การรับประทานยาไม่ตรงเวลา ลืมรับประทานยา หรือหยุดยาเอง เป็นปัญหาใหญ่ในการรักษาโรคเรื้อรัง เช่น โรคความดันโลหิตสูง โรคเบาหวาน หรือการติดเชื้อ

หลักการทำงานของยาในร่างกาย:
เมื่อเราทานยา ตัวยาจะถูกดูดซึมเข้าสู่กระแสเลือดและค่อยๆ ถูกกำจัดออกจากร่างกาย การทานยาตามรอบเวลาที่กำหนด (เช่น ทุก 12 ชั่วโมง หรือทุก 24 ชั่วโมง) ถูกคำนวณมาเพื่อรักษาระดับยาในเลือดให้คงที่เสมอ หากทานยาช้าเกินไป ระดับยาจะตกลงจนไม่สามารถออกฤทธิ์รักษาได้ แต่หากทานยาเร็วเกินไป ระดับยาอาจสูงเกินจนเกิดพิษหรือผลข้างเคียงที่อันตราย

เทคนิคช่วยจำให้ทานยาได้สม่ำเสมอ:
1. ผูกเวลาทานยากับกิจวัตรประจำวัน เช่น ทานพร้อมอาหารเช้า ทานก่อนแปรงฟันตอนกลางคืน หรือตั้งไว้ข้างๆ โทรศัพท์มือถือ
2. ใช้กล่องแบ่งยาแบบรายสัปดาห์ (Pill Box) เพื่อให้ตรวจสอบได้ง่ายว่าทานยาของมื้อนั้นๆ ไปแล้วหรือยัง
3. ใช้ฟีเจอร์แจ้งเตือนของแอปพลิเคชันอย่าง MedTrack ซึ่งจะช่วยส่งสัญญาณบอกเมื่อถึงเวลาทานยาทันที`,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6N6jYqPT6E1kROyWDdUct_l8-PQShP_43dAkZJxZSjsDdbO9kCd649am6wegKXvVq27nf6Cg-6N5Rmn13V-Z2UQox9xMPlZViS8hly_w3a5LH3uEVCBOxRSl2TebLlSSOXLiX5qSLD4d-wmCuD1Geagl8YqZwTf2pKwlDkk99IZ7iHAaPodXeaiHRuGo4Dw5sXB-74ps3OZKqFeChR5iwzGn6B7x6Kh3dQeIxWOb62HXYvKXoJoTkNGHQEhQIJU-7uu7vom3ZOhiQ",
    readTime: "อ่าน 4 นาที"
  },
  {
    id: "tip-pill-syrup",
    title: "ยาเม็ด vs ยาน้ำ",
    category: "โภชนาการ",
    summary: "ข้อดีข้อเสียของการเลือกใช้ยาแต่ละประเภทที่คุณควรรู้เพื่อปรับใช้ให้เหมาะกับร่างกายและวัย...",
    content: `การเลือกใช้ยาระหว่าง "ยาเม็ด" และ "ยาน้ำ" มักขึ้นอยู่กับความสะดวก อายุของผู้ป่วย และความเร็วในการออกฤทธิ์ที่ต้องการ

ยาเม็ด (Tablets / Capsules):
- ข้อดี: พกพาสะดวก ควบคุมขนาดและปริมาณของยาได้แม่นยำสูง เก็บรักษาได้ง่ายกว่าและเสื่อมสภาพช้ากว่า ไม่มีรสชาติขมเมื่อกลืนผ่านแคปซูล
- ข้อเสีย: กลืนยากสำหรับเด็ก ผู้สูงอายุ หรือผู้มีปัญหาการกลืน ร่างกายต้องใช้เวลาในการย่อยและละลายเม็ดยาก่อนดูดซึม

ยาน้ำ (Syrups / Suspensions):
- ข้อดี: ทานง่าย เหมาะมากสำหรับเด็กและผู้สูงอายุ ร่างกายสามารถดูดซึมตัวยาได้ทันทีทำให้เริ่มออกฤทธิ์เร็วกว่ายาเม็ด
- ข้อเสีย: พกพายาก เสี่ยงต่อการหกเลอะเทอะ ตวงปริมาณยาได้ยากกว่าหากใช้ช้อนทั่วไป (แนะนำให้ใช้ไซริงค์ตวงยาหรือถ้วยตวงที่แถมมากับยา) เสื่อมสภาพเร็วขึ้นหลังจากเปิดขวด`,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYqSZoh0pz2LyLjzaXxVuRTKfD7KEhgUpfYCJmQKtIxqH0xzn1_gHJtfhGnW6KtkK90eFNIFRblZRO0lxh2_exhYCnJsDemcyYmv417vJcvKqm2lLnm1eLaIaW5-tFKtqmbPrvkjYo_MNBiuet3mYySPiLXG9qz8drdPMhWR-7KJtJ9He4zefn1I1aSyFBFlh59iiftpD6rN5KDUy-qmy1NNPnU1xHMoWalEPd2JlD1jjF0A817Fs34zL4xzyYaNa1JMjyQvoaD57k",
    readTime: "อ่าน 3 นาที"
  },
  {
    id: "tip-grapefruit",
    title: "ส้มโอและยาความดัน",
    category: "ผลข้างเคียง",
    summary: "ระวัง! ผลไม้บางชนิดอย่างส้มโอสามารถยับยั้งเอนไซม์ย่อยยาในตับ ส่งผลให้ระดับยาในเลือดสูงผิดปกติจนเกิดอันตราย...",
    content: `สารประกอบทางธรรมชาติที่พบใน "ส้มโอ" (รวมถึงเกรปฟรุต) สามารถทำปฏิกิริยาที่อันตรายอย่างยิ่งกับยาลดความดันโลหิตและยาลดไขมันบางชนิด

ปฏิกิริยาเคมีในร่างกาย:
ส้มโอมีสารประกอบที่เรียกว่า ฟูราโนคูมาริน (Furanocoumarins) ซึ่งไปยับยั้งการทำงานของเอนไซม์ CYP3A4 ในลำไส้เล็กและตับ ซึ่งเอนไซม์ชนิดนี้มีหน้าที่ทำลายและกำจัดยาออกจากร่างกาย เมื่อเอนไซม์ถูกทำลาย ยาที่ทานเข้าไปจะไม่ถูกย่อยสลาย ส่งผลให้ระดับยาในกระแสเลือดสูงขึ้นอย่างรวดเร็วและคงอยู่ยาวนาน เสมือนผู้ป่วยรับประทานยาเกินขนาด (Overdose)

อันตรายที่อาจเกิดขึ้น:
- สำหรับยาลดความดันโลหิต (เช่น Amlodipine, Nifedipine): อาจทำให้ความดันโลหิตลดต่ำลงอย่างรวดเร็ว จนเกิดอาการเวียนศีรษะ หน้ามืด หน้ามืดจนเป็นลม หรือหัวใจเต้นเร็วผิดปกติ
- สำหรับยาลดไขมันกลุ่มสแตติน (Statins): อาจทำให้เกิดอาการปวดกล้ามเนื้ออย่างรุนแรง กล้ามเนื้อสลายตัว และส่งผลเสียต่อไตได้

ข้อแนะนำ: หลีกเลี่ยงการบริโภคส้มโอหรือน้ำส้มโออย่างเด็ดขาดหากคุณกำลังอยู่ในช่วงรักษาด้วยยาเหล่านั้น และปรึกษาเภสัชกรทุกครั้ง`,
    image: "https://lh3.googleusercontent.com/aida-public/AB6CKCs3mxIGLVpuc4T415mlDpZOC4LmkxDU9wdCh3spDA8QT9D7IJnhnHSaTWResENNvSratqsTnn7nX_HaDj1CaTRLcsdzqraNgYoqsLuqikxlWE1ycoKi4-wRZ0_JqKMy14ji9nZmO3Y6kZl1cObvqJNZcVQJIBzJR8L6owiXP9khwDXgaITj7Tj6mLs927Op3hd9yX-yupoRpijaUXvSRdYRrQaT2HutyNtfJAiAdbi9mRmR3oVJnNkJobKA8Wnkmky2lZbPv5Ib-",
    readTime: "อ่าน 5 นาที"
  },
  {
    id: "tip-before-food",
    title: "ยา \"ก่อนอาหาร\" ต้องทานก่อนกี่นาที?",
    category: "โภชนาการ",
    summary: "ทานยาอย่างไรให้ได้ผลดีที่สุด ทำไมจึงห้ามทานพร้อมมื้ออาหาร และทำไมถึงต้องรอ 30 นาทีก่อนเริ่มทานคำแรก...",
    content: `คำแนะนำการทานยา "ก่อนอาหาร" เป็นสิ่งที่เราได้ยินบ่อยๆ แต่หลายคนยังมีความเข้าใจคลาดเคลื่อนเกี่ยวกับเวลาที่แท้จริงและเหตุผลทางการแพทย์

ทานก่อนอาหารเพื่ออะไร?
1. เพื่อการดูดซึมที่ดีที่สุด: ยาหลายชนิดต้องการความเป็นกรดในกระเพาะอาหารที่ว่างเปล่าเพื่อสลายตัวและดูดซึม หรือถูกทำลายได้ง่ายหากพบกับอาหารหรือน้ำย่อยที่หลั่งออกมาหลังการกินอาหาร
2. เพื่อให้ออกฤทธิ์พอดีเวลา: เช่น ยาลดกรด หรือยาลดอาการคลื่นไส้อาเจียน ต้องทานล่วงหน้าเพื่อให้ยาเริ่มออกฤทธิ์เคลือบกระเพาะหรือปรับสภาพทางเดินอาหารก่อนที่อาหารจะตกถึงท้อง

เวลาที่ถูกต้อง:
ควรรับประทานยานี้ก่อนเริ่มทานอาหารอย่างน้อย "30 ถึง 60 นาที" (ขณะที่กระเพาะอาหารว่างเปล่าที่สุด)
หากลืมรับประทานยาตามกำหนด: ห้ามทานพร้อมอาหารทันที เพราะยาจะผสมกับอาหารและสูญเสียประสิทธิภาพ แนะนำให้ข้ามมื้อนั้นไป หรือรอให้หลังอาหารไปแล้วอย่างน้อย 2 ชั่วโมง ค่อยทานยาก่อนอาหารชดเชย`,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6N6jYqPT6E1kROyWDdUct_l8-PQShP_43dAkZJxZSjsDdbO9kCd649am6wegKXvVq27nf6Cg-6N5Rmn13V-Z2UQox9xMPlZViS8hly_w3a5LH3uEVCBOxRSl2TebLlSSOXLiX5qSLD4d-wmCuD1Geagl8YqZwTf2pKwlDkk99IZ7iHAaPodXeaiHRuGo4Dw5sXB-74ps3OZKqFeChR5iwzGn6B7x6Kh3dQeIxWOb62HXYvKXoJoTkNGHQEhQIJU-7uu7vom3ZOhiQ",
    readTime: "อ่าน 2 นาที"
  },
  {
    id: "tip-humidity",
    title: "ความชื้นทำลายคุณภาพยา",
    category: "ความปลอดภัย",
    summary: "การเก็บยาไว้ในตู้ยาในห้องน้ำหรือในตู้เย็นที่ไม่ถูกต้อง อาจทำให้ความชื้นซึมเข้าทำลายโครงสร้างทางเคมีของยาได้...",
    content: `สถานที่เก็บรักษายามีผลโดยตรงต่อคุณภาพและความปลอดภัยของตัวยา โดยเฉพาะ "ความชื้น" และ "ความร้อน" ที่มองไม่เห็น

ทำไมห้องน้ำและตู้เย็นจึงเสี่ยงต่อการทำลายยา?
1. ห้องน้ำ: เป็นจุดที่มีระดับความชื้นและอุณหภูมิเปลี่ยนแปลงสูงมากระหว่างการอาบน้ำอุ่น ความชื้นและไอน้ำสามารถซึมเข้าไปในซองยาหรือกระปุกยาที่ปิดไม่สนิท ทำให้ยาเม็ดเปื่อยละลาย บวม หรือตัวยาสำคัญสลายตัวเร็วขึ้น
2. ตู้เย็น (ที่ไม่จำเป็น): หลายคนเข้าใจผิดว่าการเก็บยาทุกชนิดในตู้เย็นเป็นสิ่งที่ดี แต่ความจริงแล้ว ยาเม็ดส่วนใหญ่ต้องการการเก็บที่อุณหภูมิห้องแห้งๆ การเอาเข้าและออกจากตู้เย็นบ่อยๆ จะทำให้เกิด "ไอน้ำเกาะ" (Condensation) ที่ผิวยาและภายในขวด ส่งผลให้ยาชื้นและเสื่อมสภาพอย่างรวดเร็ว

วิธีการเก็บยาที่ถูกต้อง:
- เก็บในที่แห้ง เย็น อุณหภูมิห้องต่ำกว่า 30 องศาเซลเซียส เช่น ในลิ้นชัก ตู้เก็บของที่สูงพ้นมือเด็ก หรือกล่องยาเฉพาะทาง
- หลีกเลี่ยงแสงแดดส่องถึงโดยตรง โดยเฉพาะในรถยนต์ที่จอดตากแดด เพราะความร้อนอาจสูงเกิน 50 องศาเซลเซียสซึ่งจะทำลายยาทันที`,
    image: "https://lh3.googleusercontent.com/aida-public/AB6CKCs3mxIGLVpuc4T415mlDpZOC4LmkxDU9wdCh3spDA8QT9D7IJnhnHSaTWResENNvSratqsTnn7nX_HaDj1CaTRLcsdzqraNgYoqsLuqikxlWE1ycoKi4-wRZ0_JqKMy14ji9nZmO3Y6kZl1cObvqJNZcVQJIBzJR8L6owiXP9khwDXgaITj7Tj6mLs927Op3hd9yX-yupoRpijaUXvSRdYRrQaT2HutyNtfJAiAdbi9mRmR3oVJnNkJobKA8Wnkmky2lZbPv5Ib-",
    readTime: "อ่าน 4 นาที"
  }
];
