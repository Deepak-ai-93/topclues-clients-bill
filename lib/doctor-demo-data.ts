export interface DoctorProfile {
  city: string;
  specialtyTag: string;
  featured?: boolean;
  contactWhatsApp?: string;
  id: string;
  slug: string;
  name: string;
  photo: string;
  designation: string;
  experienceYears: number;
  qualification: string;
  specialization: string;
  languages: string[];
  registrationNumber: string;
  bio: {
    about: string;
    expertise: string[];
    philosophy: string;
    achievements: string[];
    research: string[];
    teaching: string[];
    memberships: string[];
  };
  services: {
    id: string;
    title: string;
    description: string;
    time: string;
    recovery: string;
    suitableFor: string;
    fee: number;
  }[];
  conditions: string[];
  awards: {
    name: string;
    organization: string;
    year: string;
    description: string;
  }[];
  experience: {
    period: string;
    position: string;
    hospital: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
    country: string;
    achievement?: string;
  }[];
  certifications: {
    name: string;
    authority: string;
    year: string;
    imageUrl?: string;
  }[];
  publications: {
    title: string;
    journal: string;
    year: string;
    link?: string;
  }[];
  gallery: {
    title: string;
    category: 'clinic' | 'reception' | 'waiting' | 'doctor' | 'ot' | 'equipment' | 'certificates';
    url: string;
  }[];
  videos: {
    title: string;
    category: string;
    thumbnail: string;
    embedUrl: string;
  }[];
  reviews: {
    id: string;
    patientName: string;
    rating: number;
    date: string;
    verified: boolean;
    treatment: string;
    comment: string;
    helpfulCount: number;
  }[];
  faq: {
    question: string;
    answer: string;
    category?: string;
  }[];
  clinic: {
    name: string;
    address: string;
    mapUrl: string;
    parkingAvailable: boolean;
    wheelchairAccess: boolean;
    emergencyNumber: string;
    facilities: string[];
    consultationFee: number;
    followUpFee: number;
  };
  availability: {
    day: string;
    slots: string[];
    isClosed?: boolean;
  }[];
  insurance: {
    name: string;
    logoUrl?: string;
  }[];
  socialLinks: {
    platform: string;
    url: string;
  }[];
  statistics: {
    rating: number;
    reviewCount: number;
    patientsTreated: number;
    surgeriesCompleted: number;
    recommendationRate: number;
  };
}

export const demoDoctorProfile: DoctorProfile = {
  city: "Ahmedabad",
  specialtyTag: "Oncology",
  featured: true,
  contactWhatsApp: "+919876543210",
  id: "doc-101",
  slug: "dr-rajesh-sharma",
  name: "Dr. Rajesh Sharma",
  photo: "/doctor-demo.jpg",
  designation: "Senior Surgical Oncologist & Head-Neck Specialist",
  experienceYears: 16,
  qualification: "MBBS, MS (Gen Surg), MCh (Surgical Oncology), FACS",
  specialization: "Surgical Oncology & Robotic Head & Neck Surgery",
  languages: ["English", "Hindi", "Gujarati", "Marathi"],
  registrationNumber: "MCI-54892-2008",
  bio: {
    about: "Dr. Rajesh Sharma is a world-renowned Surgical Oncologist with over 16 years of clinical excellence in complex head, neck, and oral cancer surgeries. Having trained at prestigious institutes in India and abroad, he has performed over 5,000 successful surgeries. He is deeply committed to organ-preservation techniques, laser surgery, and cutting-edge robotic interventions that minimize recovery time while ensuring maximum oncological precision.",
    expertise: [
      "Head & Neck Cancer Resection",
      "Transoral Robotic Surgery (TORS)",
      "Laser Voice Box & Laryngeal Surgery",
      "Complex Thyroid & Parathyroid Operations",
      "Microvascular Reconstruction"
    ],
    philosophy: "Every patient deserves evidence-based, compassionate care with a focused effort on quality of life and complete emotional support throughout their treatment journey.",
    achievements: [
      "Pioneer in Minimally Invasive Transoral Robotic Surgery in Western India",
      "Awarded 'Best Surgical Oncologist' by National Health Excellence Forum 2023",
      "Over 45 Peer-reviewed publications in international medical journals"
    ],
    research: [
      "Clinical Trials on Sentinel Lymph Node Biopsy in Early Oral Cancers",
      "Impact of Microvascular Free Flap Reconstruction on Post-operative Speech & Swallowing"
    ],
    teaching: [
      "Professor & Postgraduate Examiner in Surgical Oncology",
      "Mentor for 30+ MCh Fellows in Surgical Oncology"
    ],
    memberships: [
      "Association of Surgeons of India (ASI)",
      "Indian Association of Surgical Oncology (IASO)",
      "American College of Surgeons (FACS)",
      "International Federation of Head & Neck Oncologic Societies (IFHNOS)"
    ]
  },
  services: [
    {
      id: "srv-1",
      title: "Oral & Tongue Cancer Surgery",
      description: "Precision wide local excision with neck dissection and immediate microvascular reconstruction for optimal functional restoration.",
      time: "3 - 5 Hours",
      recovery: "2 - 3 Weeks",
      suitableFor: "Patients diagnosed with Stage I - IV oral/tongue malignancies.",
      fee: 1500
    },
    {
      id: "srv-2",
      title: "Transoral Robotic Surgery (TORS)",
      description: "Minimally invasive scarless robotic surgery for throat and voice box tumors allowing rapid swallowing recovery.",
      time: "2 - 3 Hours",
      recovery: "1 - 2 Weeks",
      suitableFor: "Early stage tonsil, base of tongue, and hypopharyngeal tumors.",
      fee: 2000
    },
    {
      id: "srv-3",
      title: "Thyroid & Parathyroid Surgery",
      description: "Nerve-monitored thyroidectomy prioritizing voice preservation and complete tumor excision.",
      time: "1.5 - 2.5 Hours",
      recovery: "5 - 7 Days",
      suitableFor: "Thyroid nodules, thyroid carcinomas, hyperparathyroidism.",
      fee: 1200
    },
    {
      id: "srv-4",
      title: "Salivary Gland Tumor Resection",
      description: "Facial nerve preserving parotidectomy and submandibular gland surgeries.",
      time: "2 - 4 Hours",
      recovery: "1 - 2 Weeks",
      suitableFor: "Benign and malignant parotid or submandibular gland tumors.",
      fee: 1400
    }
  ],
  conditions: [
    "Oral Cancer (Mouth & Lip)",
    "Tongue Cancer",
    "Throat & Larynx Cancer",
    "Thyroid & Parathyroid Tumors",
    "Salivary Gland Malignancies",
    "Jaw & Maxilla Tumors",
    "Neck Lumps & Lymphadenopathy",
    "Skin & Facial Malignancies"
  ],
  awards: [
    {
      name: "Excellence in Surgical Oncology",
      organization: "Indian Medical Association",
      year: "2023",
      description: "Recognized for groundbreaking work in scarless head and neck robotic surgeries."
    },
    {
      name: "Young Scientist Award",
      organization: "Asian Head & Neck Cancer Foundation",
      year: "2019",
      description: "Awarded for research paper on functional outcomes in voice box preservation."
    }
  ],
  experience: [
    {
      period: "2021 - Present",
      position: "Senior Director & Chief Surgical Oncologist",
      hospital: "TopClues Cancer Care & Research Institute",
      description: "Leading the Head & Neck Robotic Surgery Unit and multidisciplinary tumor board."
    },
    {
      period: "2015 - 2021",
      position: "Senior Consultant Surgical Oncologist",
      hospital: "Apollo Specialty Hospital",
      description: "Performed over 2,500 major cancer operations and led clinical research."
    },
    {
      period: "2010 - 2015",
      position: "Associate Consultant",
      hospital: "Tata Memorial Hospital",
      description: "Specialized in head & neck oncology fellowship and complex organ preservation surgeries."
    }
  ],
  education: [
    {
      degree: "MCh - Surgical Oncology",
      institution: "Tata Memorial Hospital, Mumbai",
      year: "2010",
      country: "India",
      achievement: "Gold Medalist in Super-Specialty Board Exams"
    },
    {
      degree: "MS - General Surgery",
      institution: "King Edward Memorial (KEM) Hospital, Mumbai",
      year: "2007",
      country: "India"
    },
    {
      degree: "MBBS",
      institution: "Grant Medical College & JJ Group of Hospitals, Mumbai",
      year: "2003",
      country: "India"
    }
  ],
  certifications: [
    {
      name: "Fellowship in Transoral Robotic Surgery (TORS)",
      authority: "UPenn Health System, USA",
      year: "2018"
    },
    {
      name: "Fellow of American College of Surgeons (FACS)",
      authority: "American College of Surgeons, Chicago, USA",
      year: "2016"
    }
  ],
  publications: [
    {
      title: "Functional outcomes following Transoral Robotic Surgery vs Chemoradiation in Oropharyngeal Carcinoma",
      journal: "Journal of Surgical Oncology",
      year: "2022"
    },
    {
      title: "Nerve-monitoring assisted thyroidectomy: A randomized study of 500 cases",
      journal: "International Journal of Head and Neck Surgery",
      year: "2020"
    }
  ],
  gallery: [
    {
      title: "Advanced Robotic OT Suite",
      category: "ot",
      url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Executive Patient Lounge",
      category: "waiting",
      url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Consultation Suite",
      category: "doctor",
      url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
    }
  ],
  videos: [
    {
      title: "Understanding Head & Neck Cancer Symptoms & Early Detection",
      category: "Patient Education",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
  ],
  reviews: [
    {
      id: "rev-1",
      patientName: "Anil Patel",
      rating: 5,
      date: "12 May 2024",
      verified: true,
      treatment: "Thyroid Surgery",
      comment: "Dr. Rajesh Sharma is a true lifesaver. He explained the entire thyroidectomy procedure with immense clarity and performed the surgery with zero voice impairment. My recovery was remarkably fast!",
      helpfulCount: 24
    },
    {
      id: "rev-2",
      patientName: "Meena Kulkarni",
      rating: 5,
      date: "28 April 2024",
      verified: true,
      treatment: "Oral Cancer Surgery",
      comment: "Highly professional doctor and team. The care and attention my father received during his oral surgery was world-class. Dr. Sharma's patient-first approach gave our entire family hope.",
      helpfulCount: 19
    },
    {
      id: "rev-3",
      patientName: "Sunil Mehta",
      rating: 5,
      date: "05 March 2024",
      verified: true,
      treatment: "Robotic Throat Surgery",
      comment: "State of the art treatment. I was able to swallow normally within a week after TORS surgery. Eternally grateful to Dr. Sharma!",
      helpfulCount: 31
    }
  ],
  faq: [
    {
      question: "How can I book an appointment with Dr. Rajesh Sharma?",
      answer: "You can book directly using the online slot selector on this page, or call our dedicated clinic line at +91 98765 43210 for immediate slot confirmation."
    },
    {
      question: "What are the consultation fees for OPD & Video consultation?",
      answer: "In-clinic physical consultation fee is ₹1,000 and video consultation fee is ₹800. Follow-up consultations within 14 days are charged at ₹500."
    },
    {
      question: "Does Dr. Rajesh Sharma perform robotic and minimally invasive surgeries?",
      answer: "Yes, Dr. Sharma specializes in Transoral Robotic Surgery (TORS) and laser surgeries which minimize scarring, reduce pain, and accelerate swallowing recovery."
    },
    {
      question: "Is health insurance accepted for surgical procedures?",
      answer: "Yes, cashless facility is available for all major health insurance providers (Star Health, HDFC ERGO, ICICI Lombard, Care Insurance, Max Bupa, etc.)."
    },
    {
      question: "What are the clinic OPD consultation timings?",
      answer: "OPD hours are Monday through Saturday, 09:00 AM to 01:00 PM in the morning session, and 05:00 PM to 08:00 PM in the evening session."
    }
  ],
  clinic: {
    name: "TopClues Center for Head & Neck Cancer & Surgery",
    address: "Suite 402, 4th Floor, TopClues Healthcare Tower, CG Road, Ahmedabad, Gujarat 380009",
    mapUrl: "https://maps.google.com",
    parkingAvailable: true,
    wheelchairAccess: true,
    emergencyNumber: "+91 98765 43210",
    facilities: [
      "Dedicated Outpatient Suites",
      "Modular Robotic Operation Theatres",
      "Day Care Chemotherapy Unit",
      "On-site Pathology & PET-CT Scan",
      "24/7 Pharmacy & ICU Support"
    ],
    consultationFee: 1000,
    followUpFee: 500
  },
  availability: [
    { day: "Monday", slots: ["09:30 AM", "10:30 AM", "11:30 AM", "05:30 PM", "06:30 PM"] },
    { day: "Tuesday", slots: ["09:30 AM", "10:30 AM", "11:30 AM", "05:30 PM", "06:30 PM"] },
    { day: "Wednesday", slots: ["09:30 AM", "10:30 AM", "11:30 AM", "05:30 PM", "06:30 PM"] },
    { day: "Thursday", slots: ["09:30 AM", "10:30 AM", "11:30 AM", "05:30 PM", "06:30 PM"] },
    { day: "Friday", slots: ["09:30 AM", "10:30 AM", "11:30 AM", "05:30 PM", "06:30 PM"] },
    { day: "Saturday", slots: ["09:30 AM", "10:30 AM", "12:00 PM"] },
    { day: "Sunday", slots: [], isClosed: true }
  ],
  insurance: [
    { name: "Star Health Insurance" },
    { name: "HDFC ERGO" },
    { name: "ICICI Lombard" },
    { name: "Care Health Insurance" },
    { name: "Max Bupa / Neva Bupa" },
    { name: "Bajaj Allianz" }
  ],
  socialLinks: [
    { platform: "LinkedIn", url: "https://linkedin.com" },
    { platform: "YouTube", url: "https://youtube.com" },
    { platform: "Twitter", url: "https://twitter.com" }
  ],
  statistics: {
    rating: 4.9,
    reviewCount: 1540,
    patientsTreated: 12500,
    surgeriesCompleted: 5200,
    recommendationRate: 98
  }
};
