import type { CV } from "../../domain/entities/CV.js";

export interface BrightCVData {
  personalInfo: CV["personalInfo"];
  summary: string;
  objective: string;
  experiences: CV["experiences"];
  education: CV["education"];
  skills: CV["skills"];
  languages: CV["languages"];
  certifications: CV["certifications"];
  projects: CV["projects"];
  publications: CV["publications"];
  awards: CV["awards"];
  volunteer: CV["volunteer"];
  interests: CV["interests"];
  references: CV["references"];
  customSections: CV["customSections"];
}

export const brightCVData: BrightCVData = {
  personalInfo: {
    firstName: "Brightman Klin",
    lastName: "EFO'O DJOUCK KOMEKA",
    email: "brightefoo@gmail.com",
    phone: "+237 655 388 662",
    address: "",
    city: "Douala",
    country: "Cameroun",
    postalCode: "",
    title: "Ingénieur Fullstack JS/TS - Web & Mobile",
    photoUrl: "",
    dateOfBirth: "",
    nationality: "Camerounais",
    socialLinks: [
      {
        platform: "github",
        url: "https://github.com/BrightkyEfoo",
        label: "github.com/BrightkyEfoo",
      },
      {
        platform: "linkedin",
        url: "https://www.linkedin.com/in/brightman-efoo-719480191",
        label: "linkedin.com/in/brightman-efoo",
      },
      {
        platform: "portfolio",
        url: "https://brightkyefoo.cm",
        label: "brightkyefoo.cm",
      },
      {
        platform: "other",
        url: "https://www.npmjs.com/~brightkyefoo",
        label: "npmjs.com/~brightkyefoo",
      },
    ],
  },

  summary:
    "Ingénieur logiciel expérimenté avec plus de 6 ans d'expérience, spécialisé dans la conception et le développement d'applications web et mobile modernes, souvent dans des contextes complexes et métiers (fintech, transport, restauration, éducation). Très à l'aise avec les architectures scalables, les microservices et les bonnes pratiques logicielles (SOLID). Apprenant rapide, curieux et enthousiaste, je m'adapte facilement à de nouvelles technologies et logiques métier.",

  objective:
    "Recherche un emploi stable en ingénierie logicielle ou des missions techniques à forte valeur ajoutée. Projets sérieux nécessitant rigueur, autonomie et expertise.",

  experiences: [
    {
      id: "1",
      company: "Scriptify",
      jobTitle: "Fondateur / Dirigeant",
      location: "Douala, Cameroun",
      startDate: "2023",
      endDate: "",
      current: true,
      description:
        "Entreprise de développement logiciel sur mesure. Conception de solutions digitales, maintenance de sites web, facturation et contrats de maintenance.",
      achievements: [
        "Conseil en digitalisation pour clients à fort potentiel",
        "Conception et développement de solutions sur mesure",
        "Gestion de projets techniques de bout en bout",
        "Travail en équipe frontend/backend",
      ],
    },
    {
      id: "2",
      company: "ST Digital",
      jobTitle: "Développeur Fullstack",
      location: "Cameroun",
      startDate: "Juin 2024",
      endDate: "Oct 2025",
      current: false,
      description:
        "Développement fullstack pendant 1 an sur des projets digitaux variés.",
      achievements: [
        "Développement d'applications web et mobile",
        "Travail sur des projets à forte valeur ajoutée",
        "Collaboration avec des équipes techniques",
      ],
    },
    {
      id: "3",
      company: "Chillo Tech",
      jobTitle: "Développeur Fullstack",
      location: "Cameroun",
      startDate: "2023",
      endDate: "",
      current: true,
      description:
        "Développement web fullstack et travail collaboratif frontend/backend sur des applications métiers.",
      achievements: [
        "Développement d'applications métiers complexes",
        "Collaboration étroite entre équipes frontend et backend",
        "Mise en place d'architectures scalables",
      ],
    },
    {
      id: "4",
      company: "Sekure",
      jobTitle: "Développeur Fullstack (Mission Fintech)",
      location: "Cameroun",
      startDate: "2025",
      endDate: "2025",
      current: false,
      description:
        "Mission technique fintech - Développement d'une application de création de cartes prépayées.",
      achievements: [
        "Développement d'une application de gestion de cartes prépayées",
        "Intégration de solutions de paiement sécurisées",
        "Architecture backend pour gestion des transactions",
      ],
    },
    {
      id: "5",
      company: "DMServices",
      jobTitle: "Développeur Fullstack Junior",
      location: "Cameroun",
      startDate: "2021",
      endDate: "2023",
      current: false,
      description:
        "Entreprise de soutien digital et web. Travail sur divers projets web pendant près de deux ans.",
      achievements: [
        "Conception et développement d'applications web interactives",
        "Utilisation des dernières technologies web",
        "Participation à des projets variés",
      ],
    },
    {
      id: "6",
      company: "Freelance",
      jobTitle: "Développeur Web & Mobile",
      location: "Cameroun",
      startDate: "2019",
      endDate: "2021",
      current: false,
      description:
        "Studio créatif indépendant. Travail pour différents types de clients sur des projets web et mobile.",
      achievements: [
        "Conception d'applications mobiles hybrides et natives",
        "Développement backend Node.js avec API REST",
        "Intégration de maquettes Figma/XD",
      ],
    },
  ],

  education: [
    {
      id: "1",
      institution: "Université de Dschang",
      degree: "Licence",
      field: "Informatique Fondamentale",
      location: "Dschang, Cameroun",
      startDate: "2020",
      endDate: "2023",
      current: false,
      description:
        "Formation approfondie en informatique, algorithmes et développement logiciel.",
      gpa: "",
    },
    {
      id: "2",
      institution: "IUT-FV Bandjoun",
      degree: "DUT",
      field: "Automatique et Informatique Industrielle (AII)",
      location: "Bandjoun, Cameroun",
      startDate: "2018",
      endDate: "2020",
      current: false,
      description:
        "Formation en programmation assembleur, programmation Arduino, automatique industrielle et systèmes embarqués.",
      gpa: "",
    },
  ],

  skills: [
    { id: "1", name: "JavaScript / TypeScript", level: "expert", category: "Backend" },
    { id: "2", name: "Node.js / Express / AdonisJS", level: "expert", category: "Backend" },
    { id: "3", name: "React / Next.js", level: "expert", category: "Frontend" },
    { id: "4", name: "React Native / Expo", level: "advanced", category: "Mobile" },
    { id: "5", name: "PostgreSQL / Prisma", level: "expert", category: "Database" },
    { id: "6", name: "MongoDB", level: "advanced", category: "Database" },
    { id: "7", name: "Docker / DevOps", level: "advanced", category: "DevOps" },
    { id: "8", name: "Redis / Kafka", level: "intermediate", category: "Infrastructure" },
    { id: "9", name: "HTML5 / CSS3 / TailwindCSS", level: "expert", category: "Frontend" },
    { id: "10", name: "Python", level: "intermediate", category: "Programming" },
    { id: "11", name: "Git / GitHub", level: "expert", category: "Tools" },
    { id: "12", name: "Android Studio / Kotlin", level: "intermediate", category: "Mobile" },
  ],

  languages: [
    { id: "1", name: "Français", proficiency: "native" },
    { id: "2", name: "Anglais", proficiency: "conversational" },
  ],

  certifications: [],

  projects: [
    {
      id: "1",
      name: "Mapple-Rideshare",
      description:
        "Application de taxi type ride-sharing avec gestion temps réel et logique métier transport. Mobile React Native, Web React, Backend Node.js/Express.",
      url: "",
      technologies: ["React Native", "React", "Node.js", "Express"],
      startDate: "2023",
      endDate: "",
    },
    {
      id: "2",
      name: "Application de Chat Temps Réel",
      description:
        "Chat One-to-One et groupes avec messages statuts (envoyé, reçu, vu), fichiers, documents et médias. Architecture microservices robuste.",
      url: "",
      technologies: ["Node.js", "Kafka", "Redis", "PostgreSQL", "WebSocket"],
      startDate: "2023",
      endDate: "",
    },
    {
      id: "3",
      name: "Système de Commande Restaurant QR Code",
      description:
        "Plateforme de commande restaurant via QR Code. Backend AdonisJS microservices, Frontend Next.js. Commandes, factures, notifications cuisine.",
      url: "",
      technologies: ["AdonisJS", "Next.js", "PostgreSQL", "Microservices"],
      startDate: "2023",
      endDate: "",
    },
    {
      id: "4",
      name: "Plateforme E-learning / Auto-école",
      description:
        "Cours hiérarchisés (thèmes → chapitres → leçons), tests QCM chronométrés, suivi progression, gestion des rôles enseignants.",
      url: "",
      technologies: ["React", "Node.js", "PostgreSQL"],
      startDate: "2022",
      endDate: "2023",
    },
    {
      id: "5",
      name: "Create Node Server TS",
      description:
        "Package NPM pour créer rapidement un serveur Node.js TypeScript avec une structure de projet prête à l'emploi.",
      url: "https://www.npmjs.com/~brightkyefoo",
      technologies: ["Node.js", "TypeScript", "NPM"],
      startDate: "2022",
      endDate: "",
    },
  ],

  publications: [],

  awards: [
    {
      id: "1",
      title: "Forte capacité d'apprentissage",
      issuer: "Qualité professionnelle",
      date: "2024",
      description: "Apprenant rapide, curieux et enthousiaste",
    },
    {
      id: "2",
      title: "Orientation qualité & performance",
      issuer: "Qualité professionnelle",
      date: "2024",
      description: "Scalabilité et bonnes pratiques logicielles (SOLID)",
    },
    {
      id: "3",
      title: "Bon sens produit",
      issuer: "Qualité professionnelle",
      date: "2024",
      description: "Pragmatisme technique et communication claire",
    },
    {
      id: "4",
      title: "Esprit d'équipe",
      issuer: "Qualité professionnelle",
      date: "2024",
      description: "Excellente collaboration et leadership",
    },
  ],

  volunteer: [],

  interests: [
    { id: "1", name: "AI / IoT", description: "Intelligence artificielle et objets connectés" },
    { id: "2", name: "Open Source", description: "Contribution à des projets communautaires" },
    { id: "3", name: "Nouvelles technologies", description: "Exploration et veille technologique" },
    { id: "4", name: "Hackathons", description: "Participation à des défis de programmation" },
    { id: "5", name: "Cloud Computing", description: "Architecture cloud et déploiement" },
  ],

  references: [],

  customSections: [],
};

export const brightTemplateColors = {
  primary: "#5B6AE8",
  secondary: "#D5D9FF",
  background: "#F0F2FF",
  text: "#1a1a2e",
  headings: "#1a1a2e",
};

export const brightTypography = {
  fontFamily: "Inter",
  headingFont: "JetBrains Mono",
  bodySize: 10,
  headingSize: 14,
  lineHeight: 1.5,
};
