export type FilterKey = 'all' | 'data-centers' | 'low-current' | 'power-electrical' | 'infrastructure';
export type ProjectCategory = Exclude<FilterKey, 'all'>;

export interface Project {
  id: string;
  category: ProjectCategory;
  image: string;
  gallery: [string, string, string];
  location: { en: string; ar: string };
  title: { en: string; ar: string };
  challenge: { en: string; ar: string };
  solution: { en: string; ar: string };
}

const U = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const projectsData: Project[] = [
  {
    id: 'p1',
    category: 'data-centers',
    image: U('photo-1558494949-ef010cbdcc31'),
    gallery: [
      U('photo-1597733336794-db1ebf48e0ab', 400),
      U('photo-1544197150-b99a580bb7a8', 400),
      U('photo-1605745341112-85968b19335b', 400),
    ],
    location: { en: 'Riyadh, KSA', ar: 'الرياض، المملكة العربية السعودية' },
    title: {
      en: 'King Abdullah Financial District — Tier-III Data Center',
      ar: 'مركز بيانات من الدرجة الثالثة — مركز الملك عبدالله المالي',
    },
    challenge: {
      en: 'Construct a Tier-III data center for a major financial institution requiring 99.98% uptime, within an active high-rise construction environment with strict EMI shielding requirements.',
      ar: 'إنشاء مركز بيانات من الدرجة الثالثة لمؤسسة مالية كبرى يتطلب توافراً بنسبة 99.98%، ضمن بيئة إنشاء ناشطة مع متطلبات صارمة للتدريع الكهرومغناطيسي.',
    },
    solution: {
      en: 'Deployed redundant UPS & generator systems, precision CRAC cooling units, Cat6A/OM4 structured cabling, hot-aisle containment, and a full BMS integration with real-time DCIM monitoring.',
      ar: 'تم نشر أنظمة UPS والمولدات الاحتياطية، ووحدات التبريد الدقيق CRAC، وكابلات Cat6A/OM4 الهيكلية، وعزل الممرات الساخنة، وتكامل BMS كامل مع مراقبة DCIM في الوقت الفعلي.',
    },
  },
  {
    id: 'p2',
    category: 'data-centers',
    image: U('photo-1518770660439-4636190af475'),
    gallery: [
      U('photo-1558618166-fcd25c85cd64', 400),
      U('photo-1517077304055-6e89abbf09b0', 400),
      U('photo-1488590528505-98d2b5aba04b', 400),
    ],
    location: { en: 'Dubai, UAE', ar: 'دبي، الإمارات العربية المتحدة' },
    title: {
      en: 'Dubai Internet City — Cloud Colocation Hub',
      ar: 'مركز الإنترنت في دبي — مركز التوطين السحابي',
    },
    challenge: {
      en: 'Expand an existing colocation facility by 40% while keeping live racks operational 24/7 with zero scheduled downtime during a 6-month construction window.',
      ar: 'توسيع منشأة التوطين الحالية بنسبة 40٪ مع إبقاء الرفوف الحية تعمل 24/7 دون توقف مجدول خلال فترة إنشاء مدتها 6 أشهر.',
    },
    solution: {
      en: 'Phased power cutover using temporary MV bypass, installed 3 new server rows with raised-floor extensions, cold-aisle enclosures, and a dedicated 10GbE fiber backbone per pod.',
      ar: 'إجراء تحويل الطاقة المرحلي باستخدام تجاوز MV مؤقت، وتركيب 3 صفوف خوادم جديدة مع امتدادات الأرضية المرتفعة، وحواجز الممرات الباردة، وألياف بصرية 10GbE مخصصة لكل وحدة.',
    },
  },
  {
    id: 'p3',
    category: 'low-current',
    image: U('photo-1557804506-669a67965ba0'),
    gallery: [
      U('photo-1563013544-824ae1b704d3', 400),
      U('photo-1486406146926-c627a92ad1ab', 400),
      U('photo-1497366811353-6870744d04b2', 400),
    ],
    location: { en: 'Riyadh, KSA', ar: 'الرياض، المملكة العربية السعودية' },
    title: {
      en: 'Al Faisaliah Tower — Integrated Smart Security Upgrade',
      ar: 'برج الفيصلية — ترقية منظومة الأمن الذكي المتكاملة',
    },
    challenge: {
      en: 'Replace aging CCTV and access-control systems across 44 floors of an occupied mixed-use tower without disrupting hotel, office, and retail tenants during business hours.',
      ar: 'استبدال أنظمة المراقبة والتحكم في الدخول القديمة عبر 44 طابقاً في برج مختلط الاستخدام مأهول، دون الإخلال بعمليات الفندق والمكاتب والتجزئة خلال ساعات العمل.',
    },
    solution: {
      en: 'Installed 380 AI-enabled IP cameras with license-plate recognition, biometric readers on all secure floors, a centralized Milestone VMS, and an addressable fire-alarm network with 3,200 detection points.',
      ar: 'تركيب 380 كاميرا IP بتقنية الذكاء الاصطناعي مع ميزة قراءة لوحات السيارات، وأجهزة قراءة بيومترية في جميع الطوابق الآمنة، ونظام VMS مركزي من Milestone، وشبكة إنذار حريق قابلة للعنونة بـ 3200 نقطة كشف.',
    },
  },
  {
    id: 'p4',
    category: 'low-current',
    image: U('photo-1451187580459-43490279c0fa'),
    gallery: [
      U('photo-1558618666-fcd25c85cd64', 400),
      U('photo-1521737604893-d14cc237f11d', 400),
      U('photo-1573164713712-03d486899d1f', 400),
    ],
    location: { en: 'Jeddah, KSA', ar: 'جدة، المملكة العربية السعودية' },
    title: {
      en: 'King Abdulaziz International Airport — Terminal Low-Current',
      ar: 'مطار الملك عبدالعزيز الدولي — منظومة التيار الخفيف للصالة',
    },
    challenge: {
      en: 'Deploy a unified fire-alarm, PA, and CCTV system across two terminal buildings covering 280,000 sqm with FAA-compliant standards while meeting a strict 18-month handover deadline.',
      ar: 'نشر منظومة موحدة للإنذار من الحريق والبث العام والمراقبة عبر صالتَي مطار تغطيان 280,000 م² وفق معايير FAA مع الالتزام بموعد تسليم صارم خلال 18 شهراً.',
    },
    solution: {
      en: 'Networked addressable fire panels covering 14,000 detection zones, 220-zone PA system with voice evacuation, 640 PTZ and fixed IP cameras integrated into a single operations center.',
      ar: 'لوحات حريق قابلة للعنونة تغطي 14,000 منطقة كشف، ونظام بث عام من 220 منطقة مع إخلاء صوتي، و640 كاميرا PTZ وثابتة مدمجة في مركز عمليات واحد.',
    },
  },
  {
    id: 'p5',
    category: 'power-electrical',
    image: U('photo-1473341304170-971dccb5ac1e'),
    gallery: [
      U('photo-1621905252507-b35492cc74b4', 400),
      U('photo-1504307651254-35680f356dfd', 400),
      U('photo-1526374965328-7f61d4dc18c5', 400),
    ],
    location: { en: 'Jubail Industrial City, KSA', ar: 'مدينة جبيل الصناعية، المملكة العربية السعودية' },
    title: {
      en: 'Jubail Petrochemical Plant — MV/LV Power Distribution',
      ar: 'مصنع البتروكيماويات في جبيل — توزيع طاقة MV/LV',
    },
    challenge: {
      en: 'Design and commission a complete MV/LV power network for a 350,000 sqm petrochemical facility operating in a Class 1 Div 2 hazardous area with ATEX-certified equipment mandates.',
      ar: 'تصميم وتشغيل شبكة طاقة MV/LV كاملة لمنشأة بتروكيماوية مساحتها 350,000 م² تعمل في بيئة خطرة من الفئة 1 الشعبة 2 مع متطلبات معدات معتمدة ATEX.',
    },
    solution: {
      en: 'Installed 8 MV ring-main substations, 60 LV distribution boards, ATEX-rated explosion-proof conduit runs, a SCADA-monitored energy management system, and a full earthing & lightning protection network.',
      ar: 'تركيب 8 محطات تحويل MV حلقية، و60 لوح توزيع LV، وأنابيب مقاومة للانفجار معتمدة ATEX، ونظام إدارة طاقة بمراقبة SCADA، وشبكة تأريض وحماية من الصواعق كاملة.',
    },
  },
  {
    id: 'p6',
    category: 'power-electrical',
    image: U('photo-1509391366360-2e959784a276'),
    gallery: [
      U('photo-1466611653911-95081537e5b7', 400),
      U('photo-1548613053-22087dd8edb8', 400),
      U('photo-1497440001374-f26997328c1b', 400),
    ],
    location: { en: 'NEOM, KSA', ar: 'نيوم، المملكة العربية السعودية' },
    title: {
      en: 'NEOM Smart District — 3 MW Rooftop Solar PV Array',
      ar: 'الحي الذكي في نيوم — منظومة طاقة شمسية 3 ميغاواط على الأسطح',
    },
    challenge: {
      en: 'Design a 3 MW grid-tied rooftop PV system for a mixed-use smart district with variable roof orientations and a mandatory >92% system efficiency target under harsh desert conditions.',
      ar: 'تصميم منظومة طاقة شمسية 3 ميغاواط على الأسطح متصلة بالشبكة لحي ذكي متعدد الاستخدامات مع توجهات سقف متغيرة وهدف كفاءة نظام >92% في ظروف صحراوية قاسية.',
    },
    solution: {
      en: 'Deployed 7,200 bifacial monocrystalline panels across 14 roof zones, 12 SMA Sunny Tripower inverters, full DC/AC protection, a cloud-based monitoring platform, and grid-synchronization tested to IEC 62116.',
      ar: 'نشر 7200 لوح أحادي البلورة ثنائي الوجه عبر 14 منطقة سطح، و12 عاكس SMA Sunny Tripower، وحماية كاملة للتيار المباشر والمتردد، ومنصة مراقبة سحابية، ومزامنة شبكة مختبرة وفق IEC 62116.',
    },
  },
  {
    id: 'p7',
    category: 'infrastructure',
    image: U('photo-1486325212027-8081e485255e'),
    gallery: [
      U('photo-1480714378408-67cf0d13bc1b', 400),
      U('photo-1543332164-6e82f355badc', 400),
      U('photo-1497366754035-f200581a7d1f', 400),
    ],
    location: { en: 'Riyadh, KSA', ar: 'الرياض، المملكة العربية السعودية' },
    title: {
      en: 'King Salman Energy Park — Fiber Optic Backbone',
      ar: 'حديقة الملك سلمان للطاقة — شبكة الألياف البصرية الرئيسية',
      },
    challenge: {
      en: 'Build a resilient multi-ring fiber optic backbone across a 50 km² industrial park connecting 120 buildings to a central NOC with sub-5ms inter-site latency and N+1 redundancy.',
      ar: 'إنشاء شبكة ألياف بصرية متينة متعددة الحلقات عبر منتزه صناعي بمساحة 50 كم² تربط 120 مبنى بمركز عمليات شبكة مركزي بزمن استجابة أقل من 5 ملي ثانية وتكرارية N+1.',
    },
    solution: {
      en: 'Laid 180 km of single-mode OS2 fiber in HDPE micro-ducts, installed 120 IDF cabinets with 48-port fiber panels, deployed OTDR-verified splices across all nodes, and commissioned a centralized NMS.',
      ar: 'مد 180 كم من الألياف أحادية الوضع OS2 في مجاري HDPE الدقيقة، وتركيب 120 خزانة IDF بألواح ألياف 48 منفذاً، ونشر وصلات موثقة بـ OTDR في جميع العقد، وتشغيل نظام إدارة شبكة مركزي.',
    },
  },
  {
    id: 'p8',
    category: 'infrastructure',
    image: U('photo-1497366216548-37526070297c'),
    gallery: [
      U('photo-1497366811353-6870744d04b2', 400),
      U('photo-1593642632559-0c6d3fc62b89', 400),
      U('photo-1497366754035-f200581a7d1f', 400),
    ],
    location: { en: 'Abu Dhabi, UAE', ar: 'أبوظبي، الإمارات العربية المتحدة' },
    title: {
      en: 'Masdar City — Smart Campus BMS Integration',
      ar: 'مدينة مصدر — تكامل نظام إدارة المباني للحرم الذكي',
    },
    challenge: {
      en: 'Integrate HVAC, lighting, metering, access control, and renewable-energy systems across 35 buildings into a single unified BMS platform with a target of 30% energy reduction.',
      ar: 'دمج أنظمة التكييف والإضاءة والعدادات والتحكم في الدخول والطاقة المتجددة عبر 35 مبنى في منصة BMS موحدة واحدة بهدف تخفيض الطاقة بنسبة 30٪.',
    },
    solution: {
      en: 'Deployed a KNX/BACnet-based BMS backbone, installed 4,800 intelligent field devices, developed a custom dashboard with real-time energy analytics, and achieved a verified 33% energy reduction in year one.',
      ar: 'نشر شبكة BMS مبنية على KNX/BACnet، وتركيب 4800 جهاز ميداني ذكي، وتطوير لوحة معلومات مخصصة بتحليلات طاقة آنية، وتحقيق تخفيض موثق بنسبة 33٪ في الطاقة خلال العام الأول.',
    },
  },
];
