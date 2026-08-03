import { DoctorProfile, demoDoctorProfile } from './doctor-demo-data';

export const allDoctors: DoctorProfile[] = [
  // 1. Dr. Rajesh Sharma
  {
    ...demoDoctorProfile,
    id: "doc-101",
    slug: "dr-rajesh-sharma",
    name: "Dr. Rajesh Sharma",
    photo: "/doctor-demo.jpg",
    city: "Ahmedabad",
    specialtyTag: "Oncology",
    featured: true,
    contactWhatsApp: "+919876543210"
  },
  // 2. Dr. Priya Mehta
  {
    id: "doc-102",
    slug: "dr-priya-mehta",
    name: "Dr. Priya Mehta",
    photo: "/doctor-demo.jpg",
    designation: "Senior Interventional Cardiologist",
    specialtyTag: "Cardiology",
    city: "Mumbai",
    featured: true,
    contactWhatsApp: "+919876543211",
    experienceYears: 14,
    qualification: "MBBS, MD (Medicine), DM (Cardiology), FESC",
    specialization: "Interventional Cardiology & Heart Failure",
    languages: ["English", "Hindi", "Marathi"],
    registrationNumber: "MCI-67823-2010",
    statistics: {
      rating: 4.8,
      reviewCount: 1120,
      patientsTreated: 9800,
      surgeriesCompleted: 3200,
      recommendationRate: 97
    },
    clinic: {
      name: "HeartCare Advanced Cardiac Centre",
      address: "404, Lilavati Hospital Complex, Bandra West, Mumbai 400050",
      mapUrl: "https://maps.google.com",
      parkingAvailable: true,
      wheelchairAccess: true,
      emergencyNumber: "+91 98765 43211",
      facilities: ["Cath Lab", "Echo Suite", "ICU", "CCU", "24/7 Emergency"],
      consultationFee: 1200,
      followUpFee: 600
    },
    bio: {
      about: "Dr. Priya Mehta is one of Mumbai's most sought-after interventional cardiologists, with over 14 years of expertise in complex coronary interventions, structural heart disease, and heart failure management.",
      expertise: ["Complex Coronary Interventions", "TAVR & Structural Heart", "Heart Failure Management", "Cardiac Electrophysiology", "Preventive Cardiology"],
      philosophy: "Every heart deserves precision care guided by evidence and delivered with compassion.",
      achievements: ["Performed 3,000+ successful coronary interventions", "Pioneer in TAVR procedures in Western India", "Published 28 international research papers"],
      research: ["Outcomes in TAVR vs SAVR in High-risk Patients", "Novel Biomarkers in Acute Heart Failure"],
      teaching: ["Faculty at Mumbai University Cardiology Programme"],
      memberships: ["Cardiological Society of India", "American College of Cardiology", "European Society of Cardiology"]
    },
    services: [
      { id: "srv-1", title: "Coronary Angioplasty & Stenting", description: "Minimally invasive procedure to open blocked arteries using balloon and stent.", time: "1-2 Hours", recovery: "2-3 Days", suitableFor: "Patients with coronary artery disease or heart attack.", fee: 2500 },
      { id: "srv-2", title: "TAVR (Transcatheter Aortic Valve Replacement)", description: "Minimally invasive valve replacement without open-heart surgery.", time: "2-3 Hours", recovery: "5-7 Days", suitableFor: "High-risk patients with severe aortic stenosis.", fee: 4000 },
      { id: "srv-3", title: "Echocardiography & Cardiac Imaging", description: "Advanced 2D/3D echo for complete heart function assessment.", time: "30-45 Min", recovery: "Same Day", suitableFor: "All cardiac patients requiring diagnostic workup.", fee: 800 }
    ],
    conditions: ["Coronary Artery Disease", "Heart Failure", "Aortic Stenosis", "Atrial Fibrillation", "Hypertensive Heart Disease", "Cardiomyopathy"],
    awards: [{ name: "Best Cardiologist Award", organization: "Mumbai Medical Association", year: "2023", description: "Recognized for excellence in interventional cardiology." }],
    experience: [
      { period: "2018-Present", position: "Senior Interventional Cardiologist", hospital: "Lilavati Hospital, Mumbai", description: "Leading the cath lab and structural heart programme." },
      { period: "2012-2018", position: "Consultant Cardiologist", hospital: "Hinduja Hospital, Mumbai", description: "Complex coronary interventions and heart failure clinic." }
    ],
    education: [
      { degree: "DM - Cardiology", institution: "KEM Hospital, Mumbai", year: "2012", country: "India", achievement: "Distinction in Final Exams" },
      { degree: "MD - General Medicine", institution: "Seth GS Medical College, Mumbai", year: "2009", country: "India" },
      { degree: "MBBS", institution: "Grant Medical College, Mumbai", year: "2006", country: "India" }
    ],
    certifications: [{ name: "FESC Fellowship", authority: "European Society of Cardiology", year: "2019" }],
    publications: [{ title: "TAVR outcomes in Indian high-risk patients: A 5-year follow-up", journal: "Indian Heart Journal", year: "2023" }],
    gallery: [{ title: "Cath Lab", category: "ot", url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80" }],
    videos: [],
    reviews: [{ id: "rev-1", patientName: "Ramesh Nair", rating: 5, date: "10 June 2024", verified: true, treatment: "Angioplasty", comment: "Dr. Mehta explained every step clearly and the procedure went perfectly. Back to normal life in 3 days!", helpfulCount: 18 }],
    faq: [
      { question: "What is the consultation fee?", answer: "In-clinic consultation is ₹1,200. Video consultation is ₹900. Follow-ups within 14 days are ₹600." },
      { question: "Does Dr. Mehta perform angioplasty?", answer: "Yes, Dr. Mehta specializes in complex angioplasty, stenting, and TAVR procedures." }
    ],
    availability: [
      { day: "Monday", slots: ["10:00 AM", "11:00 AM", "05:00 PM", "06:00 PM"] },
      { day: "Tuesday", slots: ["10:00 AM", "11:00 AM", "05:00 PM", "06:00 PM"] },
      { day: "Wednesday", slots: ["10:00 AM", "11:00 AM"] },
      { day: "Thursday", slots: ["10:00 AM", "11:00 AM", "05:00 PM", "06:00 PM"] },
      { day: "Friday", slots: ["10:00 AM", "11:00 AM", "05:00 PM", "06:00 PM"] },
      { day: "Saturday", slots: ["10:00 AM", "12:00 PM"] },
      { day: "Sunday", slots: [], isClosed: true }
    ],
    insurance: [{ name: "Star Health" }, { name: "HDFC ERGO" }, { name: "Max Bupa" }],
    socialLinks: [{ platform: "LinkedIn", url: "https://linkedin.com" }]
  },
  // 3. Dr. Amit Patel
  {
    id: "doc-103",
    slug: "dr-amit-patel",
    name: "Dr. Amit Patel",
    photo: "/doctor-demo.jpg",
    designation: "Senior Orthopedic & Joint Replacement Surgeon",
    specialtyTag: "Orthopedics",
    city: "Ahmedabad",
    featured: true,
    contactWhatsApp: "+919876543212",
    experienceYears: 18,
    qualification: "MBBS, MS (Ortho), DNB (Ortho), FRCS (UK)",
    specialization: "Joint Replacement & Sports Medicine",
    languages: ["English", "Hindi", "Gujarati"],
    registrationNumber: "GMC-34521-2006",
    statistics: {
      rating: 4.9,
      reviewCount: 2100,
      patientsTreated: 15000,
      surgeriesCompleted: 6500,
      recommendationRate: 99
    },
    clinic: {
      name: "OrthoPlus Joint & Spine Clinic",
      address: "201, Navrangpura Medical Hub, Ahmedabad 380009",
      mapUrl: "https://maps.google.com",
      parkingAvailable: true,
      wheelchairAccess: true,
      emergencyNumber: "+91 98765 43212",
      facilities: ["Arthroscopy Suite", "Physiotherapy", "Bone Density Lab", "24/7 OT"],
      consultationFee: 1000,
      followUpFee: 500
    },
    bio: {
      about: "Dr. Amit Patel is one of Gujarat's most experienced joint replacement surgeons with 18 years of practice and over 6,500 successful joint replacement surgeries.",
      expertise: ["Total Knee Replacement", "Hip Replacement", "Arthroscopic Surgery", "Sports Injury Rehab", "Spine Surgery"],
      philosophy: "Every patient deserves to move freely and live without pain. Precision surgery combined with rehabilitation is the key.",
      achievements: ["Performed Gujarat's first robotic-assisted knee replacement", "6,500+ joint replacement surgeries", "Awarded Best Orthopedic Surgeon by Gujarat Medical Association 2022"],
      research: ["Outcomes of robotic knee replacement vs conventional TKR in Indian patients"],
      teaching: ["Professor, BJ Medical College Ahmedabad"],
      memberships: ["Indian Orthopaedic Association", "British Orthopaedic Association", "ISAKOS"]
    },
    services: [
      { id: "srv-1", title: "Total Knee Replacement", description: "State-of-art implant-based replacement for severe knee arthritis.", time: "1.5-2 Hours", recovery: "3-6 Weeks", suitableFor: "Severe knee arthritis patients.", fee: 2000 },
      { id: "srv-2", title: "Hip Replacement Surgery", description: "Complete hip joint replacement for arthritis and avascular necrosis.", time: "2-3 Hours", recovery: "4-8 Weeks", suitableFor: "Hip arthritis, AVN, fractures.", fee: 2200 },
      { id: "srv-3", title: "Arthroscopic Knee Surgery", description: "Minimally invasive scope surgery for meniscus, ACL, and cartilage.", time: "45-90 Min", recovery: "2-4 Weeks", suitableFor: "Sports injuries, meniscus tears.", fee: 1500 }
    ],
    conditions: ["Knee Arthritis", "Hip Arthritis", "ACL Tear", "Meniscus Injury", "Shoulder Dislocation", "Spine Problems"],
    awards: [{ name: "Best Orthopedic Surgeon", organization: "Gujarat Medical Association", year: "2022", description: "Recognized for 6000+ successful joint replacements." }],
    experience: [
      { period: "2015-Present", position: "Director - Joint Replacement", hospital: "OrthoPlus Clinic, Ahmedabad", description: "Founded and leads the joint replacement centre." },
      { period: "2008-2015", position: "Senior Consultant Orthopedics", hospital: "Civil Hospital, Ahmedabad", description: "Performed complex trauma and joint surgeries." }
    ],
    education: [
      { degree: "FRCS - Orthopedics", institution: "Royal College of Surgeons, Edinburgh, UK", year: "2014", country: "UK" },
      { degree: "MS - Orthopedics", institution: "BJ Medical College, Ahmedabad", year: "2006", country: "India" },
      { degree: "MBBS", institution: "BJ Medical College, Ahmedabad", year: "2003", country: "India" }
    ],
    certifications: [{ name: "FRCS (Trauma & Orthopaedics)", authority: "Royal College of Surgeons, Edinburgh", year: "2014" }],
    publications: [{ title: "Robotic TKR vs Conventional: 3-year Gujarat cohort", journal: "Indian Journal of Orthopaedics", year: "2022" }],
    gallery: [{ title: "OT Suite", category: "ot", url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80" }],
    videos: [],
    reviews: [{ id: "rev-1", patientName: "Jayshree Shah", rating: 5, date: "20 July 2024", verified: true, treatment: "Knee Replacement", comment: "I was limping for 3 years. Dr. Patel gave me my life back. Walking perfectly within 6 weeks!", helpfulCount: 42 }],
    faq: [
      { question: "What is total knee replacement?", answer: "It is a surgical procedure where the damaged knee joint is replaced with an artificial implant to restore movement and relieve pain." },
      { question: "How long is recovery after knee replacement?", answer: "Most patients start walking within 24 hours and return to normal activities within 6-8 weeks." }
    ],
    availability: [
      { day: "Monday", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "05:00 PM", "06:00 PM"] },
      { day: "Tuesday", slots: ["09:00 AM", "10:00 AM", "11:00 AM"] },
      { day: "Wednesday", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "05:00 PM", "06:00 PM"] },
      { day: "Thursday", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "05:00 PM", "06:00 PM"] },
      { day: "Friday", slots: ["09:00 AM", "10:00 AM", "11:00 AM"] },
      { day: "Saturday", slots: ["09:00 AM", "11:00 AM"] },
      { day: "Sunday", slots: [], isClosed: true }
    ],
    insurance: [{ name: "Star Health" }, { name: "ICICI Lombard" }, { name: "Bajaj Allianz" }],
    socialLinks: [{ platform: "Instagram", url: "https://instagram.com" }]
  },
  // 4. Dr. Sneha Joshi
  {
    id: "doc-104",
    slug: "dr-sneha-joshi",
    name: "Dr. Sneha Joshi",
    photo: "/doctor-demo.jpg",
    designation: "Senior Gynecologist & IVF Specialist",
    specialtyTag: "Gynecology",
    city: "Surat",
    featured: false,
    contactWhatsApp: "+919876543213",
    experienceYears: 12,
    qualification: "MBBS, MD (OBG), FRCOG (UK)",
    specialization: "Gynecology, Obstetrics & Fertility",
    languages: ["English", "Hindi", "Gujarati"],
    registrationNumber: "SMC-12984-2012",
    statistics: {
      rating: 4.8,
      reviewCount: 980,
      patientsTreated: 8500,
      surgeriesCompleted: 2400,
      recommendationRate: 97
    },
    clinic: {
      name: "Bloom Women & Fertility Centre",
      address: "Ring Road, Vesu, Surat 395007",
      mapUrl: "https://maps.google.com",
      parkingAvailable: true,
      wheelchairAccess: true,
      emergencyNumber: "+91 98765 43213",
      facilities: ["IVF Lab", "Ultrasound Suite", "Delivery Suite", "NICU"],
      consultationFee: 900,
      followUpFee: 450
    },
    bio: {
      about: "Dr. Sneha Joshi is Surat's leading fertility specialist with 12 years of experience helping couples achieve their dream of parenthood through advanced IVF and reproductive medicine.",
      expertise: ["IVF & Embryo Transfer", "Laparoscopic Gynecology", "High-risk Obstetrics", "PCOS Management", "Endometriosis Surgery"],
      philosophy: "Every woman deserves compassionate, evidence-based care through her journey to motherhood.",
      achievements: ["800+ successful IVF cycles", "Pioneer in minimal stimulation IVF in South Gujarat", "Awarded Best Gynecologist Surat 2023"],
      research: ["Success rates of minimal stimulation IVF in poor responders"],
      teaching: ["Guest Faculty, Veer Narmad South Gujarat University"],
      memberships: ["FOGSI", "ISAR", "Royal College of Obstetricians and Gynaecologists"]
    },
    services: [
      { id: "srv-1", title: "IVF Treatment", description: "Complete in-vitro fertilization with advanced embryo culture and transfer.", time: "4-6 Weeks (cycle)", recovery: "2-3 Days", suitableFor: "Couples with infertility challenges.", fee: 3500 },
      { id: "srv-2", title: "Laparoscopic Surgery", description: "Minimally invasive surgery for endometriosis, fibroids, and ovarian cysts.", time: "1-2 Hours", recovery: "3-5 Days", suitableFor: "Endometriosis, fibroids, PCOS.", fee: 1800 },
      { id: "srv-3", title: "High-risk Pregnancy Care", description: "Specialized monitoring and management for high-risk pregnancies.", time: "Ongoing", recovery: "N/A", suitableFor: "Twin pregnancy, gestational diabetes, pre-eclampsia.", fee: 1200 }
    ],
    conditions: ["Infertility", "PCOS", "Endometriosis", "Uterine Fibroids", "Irregular Periods", "High-risk Pregnancy"],
    awards: [{ name: "Best Gynecologist Award", organization: "Surat Medical Association", year: "2023", description: "For contribution to fertility medicine in South Gujarat." }],
    experience: [
      { period: "2017-Present", position: "Director - Bloom Women & Fertility Centre", hospital: "Bloom Centre, Surat", description: "Founded and leads Surat's premier fertility clinic." },
      { period: "2012-2017", position: "Consultant Gynecologist", hospital: "Kiran Hospital, Surat", description: "Complex gynecological surgeries and high-risk obstetrics." }
    ],
    education: [
      { degree: "FRCOG", institution: "Royal College of Obstetricians and Gynaecologists, London", year: "2016", country: "UK" },
      { degree: "MD - Obstetrics & Gynaecology", institution: "Surat Municipal Institute of Medical Education", year: "2012", country: "India" },
      { degree: "MBBS", institution: "Government Medical College, Surat", year: "2008", country: "India" }
    ],
    certifications: [{ name: "Fellowship in Reproductive Medicine", authority: "ISAR", year: "2015" }],
    publications: [{ title: "Minimal stimulation IVF outcomes in poor ovarian responders", journal: "Journal of Human Reproductive Sciences", year: "2022" }],
    gallery: [{ title: "IVF Lab", category: "ot", url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80" }],
    videos: [],
    reviews: [{ id: "rev-1", patientName: "Kiran & Deven Patel", rating: 5, date: "5 Aug 2024", verified: true, treatment: "IVF", comment: "After years of trying, Dr. Sneha Joshi made our dream come true. Our baby girl is now 6 months old!", helpfulCount: 67 }],
    faq: [
      { question: "How many IVF cycles might be needed?", answer: "Most couples achieve success within 2-3 cycles. Dr. Joshi creates personalized protocols to maximize success rates." },
      { question: "What is the success rate for IVF?", answer: "Our clinic maintains a 65-70% success rate per cycle for women under 35, which is above the national average." }
    ],
    availability: [
      { day: "Monday", slots: ["09:30 AM", "10:30 AM", "11:30 AM", "05:00 PM", "06:00 PM"] },
      { day: "Tuesday", slots: ["09:30 AM", "10:30 AM", "11:30 AM"] },
      { day: "Wednesday", slots: ["09:30 AM", "10:30 AM", "11:30 AM", "05:00 PM", "06:00 PM"] },
      { day: "Thursday", slots: ["09:30 AM", "10:30 AM", "11:30 AM", "05:00 PM", "06:00 PM"] },
      { day: "Friday", slots: ["09:30 AM", "10:30 AM", "11:30 AM"] },
      { day: "Saturday", slots: ["10:00 AM", "12:00 PM"] },
      { day: "Sunday", slots: [], isClosed: true }
    ],
    insurance: [{ name: "Care Health" }, { name: "Star Health" }],
    socialLinks: [{ platform: "Instagram", url: "https://instagram.com" }]
  },
  // 5. Dr. Kiran Shah
  {
    id: "doc-105",
    slug: "dr-kiran-shah",
    name: "Dr. Kiran Shah",
    photo: "/doctor-demo.jpg",
    designation: "Consultant Dermatologist & Cosmetic Physician",
    specialtyTag: "Dermatology",
    city: "Vadodara",
    featured: false,
    contactWhatsApp: "+919876543214",
    experienceYears: 10,
    qualification: "MBBS, MD (Dermatology), FCPS",
    specialization: "Dermatology, Cosmetology & Hair Transplant",
    languages: ["English", "Hindi", "Gujarati"],
    registrationNumber: "BMC-29834-2014",
    statistics: {
      rating: 4.7,
      reviewCount: 760,
      patientsTreated: 6200,
      surgeriesCompleted: 1200,
      recommendationRate: 95
    },
    clinic: {
      name: "Derma Glow Skin & Hair Clinic",
      address: "Alkapuri, Vadodara 390007",
      mapUrl: "https://maps.google.com",
      parkingAvailable: true,
      wheelchairAccess: false,
      emergencyNumber: "+91 98765 43214",
      facilities: ["Laser Suite", "Hair Transplant Room", "Chemical Peel Room", "Consultation Suites"],
      consultationFee: 700,
      followUpFee: 350
    },
    bio: {
      about: "Dr. Kiran Shah is Vadodara's leading dermatologist and cosmetic physician with 10 years of expertise in advanced skin treatments, hair restoration, and aesthetic dermatology.",
      expertise: ["Hair Transplant (FUE/FUT)", "Laser Skin Treatments", "Anti-aging & Botox", "Acne & Scar Treatment", "Chemical Peels & Fillers"],
      philosophy: "Every person deserves healthy, confident skin. Combining medical dermatology with aesthetic precision is my approach.",
      achievements: ["Performed 1,200+ hair transplant surgeries", "Pioneer in PRP therapy for hair loss in Vadodara", "Awarded Best Dermatologist Vadodara 2023"],
      research: ["PRP vs Minoxidil for androgenic alopecia: a comparative study"],
      teaching: ["Visiting Faculty, Baroda Medical College"],
      memberships: ["Indian Association of Dermatologists", "IADVL", "ISDS"]
    },
    services: [
      { id: "srv-1", title: "FUE Hair Transplant", description: "Follicular unit extraction for natural-looking permanent hair restoration.", time: "4-8 Hours", recovery: "7-10 Days", suitableFor: "Male/female pattern baldness.", fee: 3000 },
      { id: "srv-2", title: "Laser Skin Rejuvenation", description: "Advanced fractional CO2 laser for acne scars, pigmentation, and anti-aging.", time: "45-60 Min", recovery: "3-5 Days", suitableFor: "Acne scars, sun damage, pigmentation.", fee: 1500 },
      { id: "srv-3", title: "Botox & Dermal Fillers", description: "Non-surgical facial contouring and wrinkle reduction treatments.", time: "30-45 Min", recovery: "1-2 Days", suitableFor: "Fine lines, wrinkles, volume loss.", fee: 2000 }
    ],
    conditions: ["Acne & Acne Scars", "Hair Loss & Alopecia", "Psoriasis", "Eczema", "Vitiligo", "Skin Pigmentation"],
    awards: [{ name: "Best Dermatologist", organization: "Vadodara Doctors Association", year: "2023", description: "For excellence in cosmetic dermatology and hair transplant." }],
    experience: [
      { period: "2019-Present", position: "Director - Derma Glow Clinic", hospital: "Derma Glow Clinic, Vadodara", description: "Founded and leads Vadodara's premium skin & hair clinic." },
      { period: "2014-2019", position: "Consultant Dermatologist", hospital: "SSG Hospital, Vadodara", description: "Medical dermatology, allergy, and skin disease management." }
    ],
    education: [
      { degree: "FCPS - Dermatology", institution: "College of Physicians & Surgeons, Mumbai", year: "2014", country: "India" },
      { degree: "MD - Dermatology", institution: "Baroda Medical College", year: "2013", country: "India" },
      { degree: "MBBS", institution: "Baroda Medical College", year: "2009", country: "India" }
    ],
    certifications: [{ name: "Certification in Cosmetic Dermatology", authority: "ISDS", year: "2017" }],
    publications: [{ title: "PRP vs Minoxidil for androgenic alopecia in Indian patients", journal: "Indian Dermatology Online Journal", year: "2021" }],
    gallery: [{ title: "Laser Suite", category: "equipment", url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80" }],
    videos: [],
    reviews: [{ id: "rev-1", patientName: "Pooja Trivedi", rating: 5, date: "15 Sept 2024", verified: true, treatment: "Hair Transplant", comment: "I had severe hair loss for years. Dr. Shah performed FUE and my hairline looks completely natural now!", helpfulCount: 29 }],
    faq: [
      { question: "Is hair transplant permanent?", answer: "Yes, FUE hair transplant results are permanent. Transplanted follicles are genetically resistant to hair loss." },
      { question: "How many sessions of laser are needed for acne scars?", answer: "Most patients see significant improvement in 3-5 sessions spaced 4-6 weeks apart." }
    ],
    availability: [
      { day: "Monday", slots: ["10:00 AM", "11:00 AM", "12:00 PM", "05:00 PM", "06:00 PM"] },
      { day: "Tuesday", slots: ["10:00 AM", "11:00 AM", "12:00 PM"] },
      { day: "Wednesday", slots: ["10:00 AM", "11:00 AM", "12:00 PM", "05:00 PM", "06:00 PM"] },
      { day: "Thursday", slots: ["10:00 AM", "11:00 AM", "12:00 PM", "05:00 PM", "06:00 PM"] },
      { day: "Friday", slots: ["10:00 AM", "11:00 AM", "12:00 PM"] },
      { day: "Saturday", slots: ["10:00 AM", "01:00 PM"] },
      { day: "Sunday", slots: [], isClosed: true }
    ],
    insurance: [{ name: "Star Health" }],
    socialLinks: [{ platform: "Instagram", url: "https://instagram.com" }]
  },
  // 6. Dr. Neel Desai
  {
    id: "doc-106",
    slug: "dr-neel-desai",
    name: "Dr. Neel Desai",
    photo: "/doctor-demo.jpg",
    designation: "Senior Neurologist & Stroke Specialist",
    specialtyTag: "Neurology",
    city: "Rajkot",
    featured: false,
    contactWhatsApp: "+919876543215",
    experienceYears: 11,
    qualification: "MBBS, MD (Medicine), DM (Neurology)",
    specialization: "Neurology, Stroke Medicine & Epilepsy",
    languages: ["English", "Hindi", "Gujarati"],
    registrationNumber: "RMC-18274-2013",
    statistics: {
      rating: 4.8,
      reviewCount: 640,
      patientsTreated: 5800,
      surgeriesCompleted: 0,
      recommendationRate: 96
    },
    clinic: {
      name: "Neuro Care Brain & Spine Centre",
      address: "Kalawad Road, Rajkot 360005",
      mapUrl: "https://maps.google.com",
      parkingAvailable: true,
      wheelchairAccess: true,
      emergencyNumber: "+91 98765 43215",
      facilities: ["EEG Lab", "EMG Suite", "MRI", "Stroke Unit", "24/7 Neuroemergency"],
      consultationFee: 800,
      followUpFee: 400
    },
    bio: {
      about: "Dr. Neel Desai is Rajkot's foremost neurologist, specializing in stroke management, epilepsy, movement disorders, and headache medicine, with 11 years of dedicated neurological practice.",
      expertise: ["Stroke Management & Thrombolysis", "Epilepsy & Seizure Disorders", "Parkinson's & Movement Disorders", "Migraine & Headache Clinic", "Peripheral Nerve Disorders"],
      philosophy: "The brain is the most complex organ. Every neurological condition requires a systematic, evidence-based, patient-centred approach.",
      achievements: ["Established Rajkot's first dedicated Stroke Unit", "Reduced stroke mortality in his unit by 40% through thrombolysis protocol", "Awarded Best Neurologist Saurashtra 2022"],
      research: ["Thrombolysis outcomes in rural stroke patients: Saurashtra cohort"],
      teaching: ["Faculty, PDU Medical College Rajkot"],
      memberships: ["Neurological Society of India", "Indian Epilepsy Society", "WFN"]
    },
    services: [
      { id: "srv-1", title: "Stroke Evaluation & Thrombolysis", description: "Emergency stroke management with IV tPA and endovascular therapy.", time: "Emergency", recovery: "Weeks to Months", suitableFor: "Acute ischemic stroke patients.", fee: 1500 },
      { id: "srv-2", title: "Epilepsy Management", description: "Comprehensive seizure assessment, EEG monitoring, and medication management.", time: "60-90 Min", recovery: "Same Day", suitableFor: "Seizure disorders and epilepsy.", fee: 900 },
      { id: "srv-3", title: "Migraine & Headache Clinic", description: "Specialized headache management including Botox for chronic migraine.", time: "30-45 Min", recovery: "Same Day", suitableFor: "Chronic migraine, cluster headache.", fee: 700 }
    ],
    conditions: ["Stroke", "Epilepsy", "Parkinson's Disease", "Migraine", "Multiple Sclerosis", "Vertigo", "Neuropathy"],
    awards: [{ name: "Best Neurologist Saurashtra", organization: "Saurashtra Medical Association", year: "2022", description: "For establishing the first stroke unit in Rajkot." }],
    experience: [
      { period: "2018-Present", position: "Director - Neuro Care Centre", hospital: "Neuro Care Brain & Spine Centre, Rajkot", description: "Founded Rajkot's dedicated neuro centre and stroke unit." },
      { period: "2013-2018", position: "Consultant Neurologist", hospital: "Civil Hospital, Rajkot", description: "Managed complex neurological cases and epilepsy clinic." }
    ],
    education: [
      { degree: "DM - Neurology", institution: "NIMHANS, Bangalore", year: "2013", country: "India", achievement: "Gold Medalist" },
      { degree: "MD - General Medicine", institution: "PDU Medical College, Rajkot", year: "2010", country: "India" },
      { degree: "MBBS", institution: "PDU Medical College, Rajkot", year: "2006", country: "India" }
    ],
    certifications: [{ name: "Certification in Stroke Medicine", authority: "Neurological Society of India", year: "2016" }],
    publications: [{ title: "Rural stroke thrombolysis outcomes: A Saurashtra retrospective study", journal: "Annals of Indian Academy of Neurology", year: "2023" }],
    gallery: [{ title: "EEG Lab", category: "equipment", url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80" }],
    videos: [],
    reviews: [{ id: "rev-1", patientName: "Bhavesh Chauhan", rating: 5, date: "18 May 2024", verified: true, treatment: "Stroke Management", comment: "My father had a stroke at 2am. Dr. Desai's team responded immediately and gave clot-busting treatment. He has recovered 90% now!", helpfulCount: 55 }],
    faq: [
      { question: "What are the warning signs of stroke?", answer: "Remember FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency. Immediate treatment within 4.5 hours is critical." },
      { question: "Is epilepsy curable?", answer: "Many forms of epilepsy can be well-controlled with medication. About 70% of patients become seizure-free with proper treatment." }
    ],
    availability: [
      { day: "Monday", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "05:30 PM", "06:30 PM"] },
      { day: "Tuesday", slots: ["09:00 AM", "10:00 AM", "11:00 AM"] },
      { day: "Wednesday", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "05:30 PM", "06:30 PM"] },
      { day: "Thursday", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "05:30 PM", "06:30 PM"] },
      { day: "Friday", slots: ["09:00 AM", "10:00 AM", "11:00 AM"] },
      { day: "Saturday", slots: ["09:00 AM", "11:00 AM"] },
      { day: "Sunday", slots: [], isClosed: true }
    ],
    insurance: [{ name: "HDFC ERGO" }, { name: "Star Health" }, { name: "Care Health" }],
    socialLinks: [{ platform: "LinkedIn", url: "https://linkedin.com" }]
  },
  // 7. Dr. Ritu Agarwal
  {
    id: "doc-107",
    slug: "dr-ritu-agarwal",
    name: "Dr. Ritu Agarwal",
    photo: "/doctor-demo.jpg",
    designation: "Senior Pediatrician & Neonatologist",
    specialtyTag: "Pediatrics",
    city: "Mumbai",
    featured: false,
    contactWhatsApp: "+919876543216",
    experienceYears: 13,
    qualification: "MBBS, MD (Pediatrics), Fellowship Neonatology",
    specialization: "Pediatrics & Neonatal Intensive Care",
    languages: ["English", "Hindi", "Marathi"],
    registrationNumber: "MMC-45621-2011",
    statistics: {
      rating: 4.9,
      reviewCount: 1380,
      patientsTreated: 12000,
      surgeriesCompleted: 0,
      recommendationRate: 98
    },
    clinic: {
      name: "Little Stars Children & Neonatal Centre",
      address: "Andheri West, Mumbai 400053",
      mapUrl: "https://maps.google.com",
      parkingAvailable: true,
      wheelchairAccess: true,
      emergencyNumber: "+91 98765 43216",
      facilities: ["Level III NICU", "Pediatric ICU", "Vaccination Centre", "Child Development Clinic"],
      consultationFee: 800,
      followUpFee: 400
    },
    bio: {
      about: "Dr. Ritu Agarwal is one of Mumbai's most trusted pediatricians and neonatologists, with 13 years of expertise in newborn care, childhood development, and pediatric emergencies.",
      expertise: ["Neonatal Intensive Care (NICU)", "Newborn Resuscitation", "Child Development Assessment", "Pediatric Nutrition", "Vaccination & Immunization"],
      philosophy: "Every child deserves the best start in life. Compassionate, evidence-based care from day one makes all the difference.",
      achievements: ["Managed 12,000+ newborns and children", "Zero NICU infection rate for 3 consecutive years", "Awarded Best Pediatrician Mumbai 2024"],
      research: ["Outcomes of early skin-to-skin contact in preterm NICU infants"],
      teaching: ["Faculty, Lokmanya Tilak Municipal Medical College"],
      memberships: ["Indian Academy of Pediatrics", "NNF", "American Academy of Pediatrics"]
    },
    services: [
      { id: "srv-1", title: "Neonatal Intensive Care (NICU)", description: "24/7 advanced care for premature and critically ill newborns.", time: "Ongoing", recovery: "Weeks", suitableFor: "Premature babies, sick newborns.", fee: 5000 },
      { id: "srv-2", title: "Child Wellness & Vaccination", description: "Comprehensive immunization schedule and developmental monitoring.", time: "30-45 Min", recovery: "Same Day", suitableFor: "All children 0-18 years.", fee: 500 },
      { id: "srv-3", title: "Pediatric Emergency Care", description: "24/7 emergency care for fever, respiratory distress, and acute illness.", time: "Emergency", recovery: "Variable", suitableFor: "Acute pediatric emergencies.", fee: 900 }
    ],
    conditions: ["Premature Birth", "Neonatal Jaundice", "Respiratory Distress", "Childhood Fever", "Asthma", "Malnutrition", "Autism Assessment"],
    awards: [{ name: "Best Pediatrician Award", organization: "Mumbai Pediatric Association", year: "2024", description: "For zero NICU infection rate and excellence in neonatal care." }],
    experience: [
      { period: "2016-Present", position: "Director - Little Stars Centre", hospital: "Little Stars Children & Neonatal Centre, Mumbai", description: "Founded and leads Level III NICU and pediatric centre." },
      { period: "2011-2016", position: "Senior Neonatologist", hospital: "Kokilaben Dhirubhai Ambani Hospital, Mumbai", description: "NICU management and newborn resuscitation." }
    ],
    education: [
      { degree: "Fellowship in Neonatology", institution: "KEM Hospital, Mumbai", year: "2013", country: "India", achievement: "Best Fellow Award" },
      { degree: "MD - Pediatrics", institution: "Seth GS Medical College, Mumbai", year: "2011", country: "India" },
      { degree: "MBBS", institution: "Grant Medical College, Mumbai", year: "2007", country: "India" }
    ],
    certifications: [{ name: "Neonatal Resuscitation Provider (NRP)", authority: "American Academy of Pediatrics", year: "2019" }],
    publications: [{ title: "Skin-to-skin care in preterm infants: a Mumbai NICU study", journal: "Indian Pediatrics", year: "2023" }],
    gallery: [{ title: "NICU Ward", category: "ot", url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80" }],
    videos: [],
    reviews: [{ id: "rev-1", patientName: "Priti & Rahul Sharma", rating: 5, date: "3 Oct 2024", verified: true, treatment: "Premature Baby NICU Care", comment: "Our daughter was born at 28 weeks. Dr. Agarwal and her team cared for her in NICU for 2 months. She is now a healthy toddler!", helpfulCount: 89 }],
    faq: [
      { question: "At what age should I start vaccinating my baby?", answer: "Vaccination starts at birth with BCG and Hepatitis B. Dr. Agarwal follows the IAP recommended immunization schedule for all children." },
      { question: "What is a Level III NICU?", answer: "A Level III NICU provides the highest level of care for premature babies born as early as 24 weeks and sick newborns requiring ventilator support." }
    ],
    availability: [
      { day: "Monday", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "05:00 PM", "06:00 PM"] },
      { day: "Tuesday", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "05:00 PM", "06:00 PM"] },
      { day: "Wednesday", slots: ["09:00 AM", "10:00 AM", "11:00 AM"] },
      { day: "Thursday", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "05:00 PM", "06:00 PM"] },
      { day: "Friday", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "05:00 PM", "06:00 PM"] },
      { day: "Saturday", slots: ["10:00 AM", "12:00 PM"] },
      { day: "Sunday", slots: [], isClosed: true }
    ],
    insurance: [{ name: "Star Health" }, { name: "Max Bupa" }, { name: "Religare Health" }],
    socialLinks: [{ platform: "Instagram", url: "https://instagram.com" }]
  }
];

export function getDoctorBySlug(slug: string): DoctorProfile | undefined {
  return allDoctors.find(doc => doc.slug === slug);
}

export function getFeaturedDoctors(): DoctorProfile[] {
  return allDoctors.filter(doc => doc.featured === true);
}

export const allSpecialties: string[] = Array.from(new Set(allDoctors.map(doc => doc.specialtyTag)));

export const allCities: string[] = Array.from(new Set(allDoctors.map(doc => doc.city)));
