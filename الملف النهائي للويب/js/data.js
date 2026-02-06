// بيانات مساحات العمل في غزة
const workspaces = [
    {
        id: 1,
        name: "مساحة الإبداع - غزة",
        location: "غزة - الرمال",
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop",
        status: "available",
        area: "gaza",
        capacity: 25,
        price: 20,
        description: "مساحة عمل مفتوحة مع إنترنت سريع وكافيه داخلي وطابعات متاحة للاستخدام",
        features: ["واي فاي سريع", "كافيه مجاني", "طابعات", "تكييف"]
    },
    {
        id: 2,
        name: "كوفيه وورك سبيس - تل الهوا",
        location: "غزة - تل الهوا",
        image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop",
        status: "occupied",
        area: "gaza",
        capacity: 15,
        price: 25,
        description: "مقهى عمل هادئ مع مساحات فردية وجماعية ومشروبات ساخنة مجانية",
        features: ["مقهى داخلي", "مقاعد مريحة", "شحن لاسلكي", "حديقة"]
    },
    {
        id: 3,
        name: "مساحة شمال غزة للدراسة",
        location: "شمال غزة - بيت حانون",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
        status: "available",
        area: "north",
        capacity: 40,
        price: 15,
        description: "قاعة دراسة جماعية هادئة ومنظمة مع إضاءة ممتازة ومقاعد مريحة",
        features: ["قاعة دراسة", "إضاءة ممتازة", "هدوء تام", "مكتبة مراجع"]
    },
    {
        id: 4,
        name: "مساحة العمل الذكية - الرمال",
        location: "غزة - الرمال",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
        status: "available",
        area: "gaza",
        capacity: 30,
        price: 30,
        description: "مساحة عمل ذكية مجهزة بأحدث التقنيات وشاشات عرض ومقابلات",
        features: ["شاشات ذكية", "غرفة مقابلات", "أجهزة متطورة", "واي فاي سريع"]
    },
    {
        id: 5,
        name: "كوفيه الدراسه - جباليا",
        location: "شمال غزة - جباليا",
        image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2070&auto=format&fit=crop",
        status: "occupied",
        area: "north",
        capacity: 20,
        price: 18,
        description: "مقهى مخصص للدراسة والعمل مع أجواء هادئة ومشروبات ساخنة وباردة",
        features: ["مشروبات مجانية", "مقاعد مريحة", "هدوء", "مقابس كهرباء"]
    },
    {
        id: 6,
        name: "مساحة التقنيين - غزة",
        location: "غزة - الشجاعية",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
        status: "available",
        area: "gaza",
        capacity: 12,
        price: 35,
        description: "مساحة عمل متخصصة للتقنيين والمبرمجين مع أجهزة كمبيوتر قوية وإنترنت فائق السرعة",
        features: ["أجهزة قوية", "إنترنت فائق", "شاشات متعددة", "تكييف مركزى"]
    }
];

// بيانات الباقات
const pricingPlans = [
    {
        id: 1,
        name: "الباقة اليومية",
        duration: "1 يوم",
        normalPrice: "70 شيكل",
        specialPrice: "60 شيكل",
        savings: "10 شيكل",
        features: "واي فاي، مشروبات، طباعة 10 صفحات",
        popular: false
    },
    {
        id: 2,
        name: "الباقة الأسبوعية",
        duration: "7 أيام",
        normalPrice: "400 شيكل",
        specialPrice: "350 شيكل",
        savings: "50 شيكل",
        features: "كل المميزات + مكتب خاص",
        popular: true
    },
    {
        id: 3,
        name: "الباقة الشهرية",
        duration: "30 يوم",
        normalPrice: "1500 شيكل",
        specialPrice: "1200 شيكل",
        savings: "300 شيكل",
        features: "مكتب ثابت + تخزين + اجتماعات مجانية",
        popular: true
    },
    {
        id: 4,
        name: "الباقة الفصلية",
        duration: "90 يوم",
        normalPrice: "4000 شيكل",
        specialPrice: "3200 شيكل",
        savings: "800 شيكل",
        features: "كل المميزات + تخزين شخصي + اجتماعات غير محدودة",
        popular: false
    }
];

// إعدادات التطبيق
const appConfig = {
    currency: "شيكل",
    maxBookingDays: 7,
    notificationTime: 24,
    siteName: "Gaza Workspaces",
    contact: {
        phone: "+970 599 123 456",
        email: "info@gazaworkspaces.ps",
        address: "غزة - شارع عمر المختار"
    }
};

// الحجوزات الحالية
let currentReservations = [];