import {
  Zap,
  Wifi,
  Server,
  ClipboardCheck,
  Building2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface ServiceCategory {
  id: string;
  Icon: LucideIcon;
  accent: boolean;
  en: {
    title: string;
    description: string;
    items: string[];
  };
  ar: {
    title: string;
    description: string;
    items: string[];
  };
}

export const servicesData: ServiceCategory[] = [
  {
    id: 'power-electrical',
    Icon: Zap,
    accent: false,
    en: {
      title: 'Power & Electrical Systems',
      description:
        'Complete LV/MV electrical installations for industrial, commercial, and infrastructure facilities — from design through commissioning.',
      items: [
        'LV/MV Switchgear & Distribution Panels',
        'Power Cabling & Conduit Systems',
        'Industrial & Commercial Lighting',
        'Earthing & Lightning Protection Systems',
        'Generator & UPS Installations',
        'Preventive Maintenance Contracts',
      ],
    },
    ar: {
      title: 'أنظمة القوى والتركيبات الكهربائية',
      description:
        'تركيبات كهربائية متكاملة للجهد المنخفض والمتوسط للمنشآت الصناعية والتجارية والبنية التحتية — من التصميم حتى التشغيل.',
      items: [
        'لوحات الجهد المنخفض والمتوسط وبانيلات التوزيع',
        'كابلات الطاقة وأنظمة القنوات الكهربائية',
        'الإضاءة الصناعية والتجارية',
        'أنظمة التأريض والحماية من الصواعق',
        'تركيب المولدات ووحدات الطاقة الاحتياطية UPS',
        'عقود الصيانة الوقائية الدورية',
      ],
    },
  },
  {
    id: 'low-current-smart',
    Icon: Wifi,
    accent: false,
    en: {
      title: 'Low Current & Smart Systems',
      description:
        'Integrated security, communications, and intelligent building systems — designed and delivered as a unified smart platform.',
      items: [
        'CCTV Surveillance & Video Analytics',
        'Fire Alarm & Detection Systems',
        'Access Control & Biometric Entry',
        'Structured LAN Cabling (Cat6 / Fiber)',
        'Public Address & Intercom Systems',
        'Nurse Call & Emergency Response',
      ],
    },
    ar: {
      title: 'أنظمة التيار الخفيف والأنظمة الذكية',
      description:
        'أنظمة أمن واتصالات ومباني ذكية متكاملة — مصممة ومُنفَّذة كمنصة ذكية موحدة.',
      items: [
        'أنظمة المراقبة بالكاميرات وتحليل الفيديو',
        'أنظمة إنذار الحريق والكشف المبكر',
        'التحكم في الدخول والبصمة البيومترية',
        'الكابلات الهيكلية للشبكات (Cat6 / فايبر)',
        'أنظمة الإذاعة الداخلية والإنترفون',
        'نداء الممرضات وأنظمة الاستجابة الطارئة',
      ],
    },
  },
  {
    id: 'data-centers-comms',
    Icon: Server,
    accent: true,
    en: {
      title: 'Data Centers & Communications',
      description:
        'End-to-end data center infrastructure — from structured cabling and fiber optics to precision cooling and full turnkey build-out.',
      items: [
        'Structured Cabling & Patch Panel Management',
        'Fiber Optic Networks (Multimode & Singlemode)',
        'Raised Floor & Cold/Hot Aisle Containment',
        'Precision Cooling (CRAC / CRAH Units)',
        'UPS & Power Distribution Units (PDU)',
        'Turnkey Data Center Build-Out',
      ],
    },
    ar: {
      title: 'مراكز البيانات والاتصالات',
      description:
        'بنية تحتية متكاملة لمراكز البيانات — من الكابلات الهيكلية والألياف البصرية إلى التبريد الدقيق والبناء الشامل.',
      items: [
        'الكابلات الهيكلية وإدارة لوحات التوصيل',
        'شبكات الألياف البصرية (متعدد الأوضاع وأحادي الوضع)',
        'الأرضيات المرتفعة وعزل الممرات الباردة والساخنة',
        'وحدات التبريد الدقيق (CRAC / CRAH)',
        'وحدات UPS ووحدات توزيع الطاقة (PDU)',
        'تنفيذ مراكز البيانات متكاملة بالكامل',
      ],
    },
  },
  {
    id: 'engineering-testing',
    Icon: ClipboardCheck,
    accent: false,
    en: {
      title: 'Engineering Services & Testing',
      description:
        'Professional engineering design, load analysis, and on-site testing to ensure code compliance, safety, and optimal system performance.',
      items: [
        'Electrical Design & CAD Drafting',
        'Load Flow & Short-Circuit Analysis',
        'Site Surveys & Feasibility Studies',
        'HV Cable Testing & Thermal Imaging',
        'PAT, FAT & Commissioning Testing',
        'Safety Audits & Compliance Reports',
      ],
    },
    ar: {
      title: 'الخدمات الهندسية والاختبارات',
      description:
        'تصميم وتحليل واختبار هندسي احترافي لضمان الامتثال للمعايير والسلامة وأمثل أداء للمنظومة.',
      items: [
        'التصميم الكهربائي والرسم بالكاد (CAD)',
        'تحليل تدفق الحمل والدوائر القصيرة',
        'مسوحات الموقع ودراسات الجدوى',
        'اختبارات كابلات الجهد العالي والتصوير الحراري',
        'اختبارات PAT وFAT والتشغيل',
        'تدقيق السلامة وتقارير الامتثال',
      ],
    },
  },
  {
    id: 'contracting-trading',
    Icon: Building2,
    accent: false,
    en: {
      title: 'General Contracting & Trading',
      description:
        'Turnkey project execution, procurement, and supply of electrical and smart-system equipment sourced from certified global vendors.',
      items: [
        'Electrical Equipment Supply & Procurement',
        'Cables, Switchgear & Control Panel Trading',
        'Solar PV Modules, Inverters & Mounting Systems',
        'Turnkey Project Management & Execution',
        'Site Supervision & Quality Control',
        'Logistics, Import & Vendor Management',
      ],
    },
    ar: {
      title: 'المقاولات العامة والتجارة',
      description:
        'تنفيذ مشاريع متكاملة وتوريد معدات كهربائية وأنظمة بنية ذكية من موردين عالميين معتمدين.',
      items: [
        'توريد المعدات الكهربائية والمشتريات',
        'تجارة الكابلات والمحولات ولوحات التحكم',
        'ألواح الطاقة الشمسية والعواكس وأنظمة التركيب',
        'إدارة وتنفيذ المشاريع المتكاملة',
        'الإشراف الميداني ومراقبة الجودة',
        'الخدمات اللوجستية والاستيراد وإدارة الموردين',
      ],
    },
  },
];
