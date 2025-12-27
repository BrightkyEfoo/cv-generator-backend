import type { CV } from "../../domain/entities/CV.js";

export interface MockCVData {
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

export const mockCVData: MockCVData = {
  personalInfo: {
    firstName: "Alexandre",
    lastName: "Martin",
    email: "alexandre.martin@email.com",
    phone: "+33 6 12 34 56 78",
    address: "15 Rue de la Paix",
    city: "Paris",
    country: "France",
    postalCode: "75001",
    title: "Senior Software Engineer",
    photoUrl: "",
    dateOfBirth: "1990-05-15",
    nationality: "French",
    socialLinks: [
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/amartin",
        label: "/in/amartin",
      },
      {
        platform: "github",
        url: "https://github.com/amartin",
        label: "github.com/amartin",
      },
      {
        platform: "portfolio",
        url: "https://amartin.dev",
        label: "amartin.dev",
      },
    ],
  },

  summary:
    "Experienced software engineer with over 8 years of expertise in full-stack development. Passionate about building scalable applications and mentoring junior developers. Strong background in cloud architecture, microservices, and agile methodologies. Proven track record of delivering high-quality solutions that drive business growth.",

  objective:
    "Seeking a challenging senior engineering role where I can leverage my expertise in cloud architecture and team leadership to drive innovation and deliver impactful solutions.",

  experiences: [
    {
      id: "1",
      company: "Tech Solutions Inc.",
      jobTitle: "Senior Software Engineer",
      location: "Paris, France",
      startDate: "Jan 2021",
      endDate: "",
      current: true,
      description:
        "Leading development of cloud-native applications using modern technologies.",
      achievements: [
        "Led a team of 5 developers in building a microservices architecture",
        "Reduced application load time by 40% through optimization",
        "Implemented CI/CD pipelines reducing deployment time by 60%",
        "Mentored 3 junior developers to senior positions",
      ],
    },
    {
      id: "2",
      company: "Digital Agency Pro",
      jobTitle: "Full Stack Developer",
      location: "Lyon, France",
      startDate: "Mar 2018",
      endDate: "Dec 2020",
      current: false,
      description:
        "Developed and maintained web applications for enterprise clients.",
      achievements: [
        "Built RESTful APIs serving 100k+ daily requests",
        "Developed responsive web applications using React and Node.js",
        "Collaborated with UX team to improve user engagement by 25%",
      ],
    },
    {
      id: "3",
      company: "StartUp Vision",
      jobTitle: "Junior Developer",
      location: "Marseille, France",
      startDate: "Sep 2016",
      endDate: "Feb 2018",
      current: false,
      description:
        "Started career developing web applications in a fast-paced startup.",
      achievements: [
        "Developed features for e-commerce platform using PHP and JavaScript",
        "Participated in code reviews and agile ceremonies",
      ],
    },
  ],

  education: [
    {
      id: "1",
      institution: "University of Paris",
      degree: "Master",
      field: "Computer Science",
      location: "Paris, France",
      startDate: "2014",
      endDate: "2016",
      current: false,
      description:
        "Specialized in Software Engineering and Distributed Systems",
      gpa: "3.8/4.0",
    },
    {
      id: "2",
      institution: "University of Lyon",
      degree: "Bachelor",
      field: "Information Technology",
      location: "Lyon, France",
      startDate: "2011",
      endDate: "2014",
      current: false,
      description: "Foundation in programming, databases, and networks",
      gpa: "3.6/4.0",
    },
  ],

  skills: [
    { id: "1", name: "JavaScript", level: "expert", category: "Programming" },
    { id: "2", name: "TypeScript", level: "expert", category: "Programming" },
    { id: "3", name: "Python", level: "advanced", category: "Programming" },
    { id: "4", name: "React", level: "expert", category: "Frontend" },
    { id: "5", name: "Node.js", level: "expert", category: "Backend" },
    { id: "6", name: "PostgreSQL", level: "advanced", category: "Database" },
    { id: "7", name: "AWS", level: "advanced", category: "Cloud" },
    { id: "8", name: "Docker", level: "advanced", category: "DevOps" },
    { id: "9", name: "Git", level: "expert", category: "Tools" },
    { id: "10", name: "Agile/Scrum", level: "expert", category: "Methodology" },
  ],

  languages: [
    { id: "1", name: "French", proficiency: "native" },
    { id: "2", name: "English", proficiency: "fluent" },
    { id: "3", name: "Spanish", proficiency: "conversational" },
  ],

  certifications: [
    {
      id: "1",
      name: "AWS Solutions Architect Associate",
      issuer: "Amazon Web Services",
      issueDate: "2022",
      expiryDate: "2025",
      credentialId: "AWS-SAA-123456",
    },
    {
      id: "2",
      name: "Professional Scrum Master I",
      issuer: "Scrum.org",
      issueDate: "2021",
      credentialId: "PSM-I-789012",
    },
    {
      id: "3",
      name: "Google Cloud Professional Developer",
      issuer: "Google",
      issueDate: "2023",
      credentialId: "GCP-PD-345678",
    },
  ],

  projects: [
    {
      id: "1",
      name: "E-Commerce Platform",
      description:
        "Built a scalable e-commerce solution handling 50k+ products with real-time inventory management",
      url: "https://github.com/amartin/ecommerce",
      technologies: ["React", "Node.js", "PostgreSQL", "Redis"],
      startDate: "2022",
      endDate: "2023",
    },
    {
      id: "2",
      name: "Task Management App",
      description:
        "Developed a collaborative task management tool with real-time updates and team features",
      url: "https://taskapp.amartin.dev",
      technologies: ["Vue.js", "Express", "MongoDB", "Socket.io"],
      startDate: "2021",
      endDate: "2022",
    },
  ],

  publications: [
    {
      id: "1",
      title: "Scaling Microservices in Production",
      authors: ["Alexandre Martin"],
      publisher: "Tech Blog Weekly",
      publicationDate: "2023",
      url: "https://techblog.com/scaling-microservices",
      description: "A comprehensive guide to scaling microservices architecture",
      type: "article",
    },
  ],

  awards: [
    {
      id: "1",
      title: "Rigoureux",
      issuer: "Personal Quality",
      date: "2024",
      description: "Attention to detail and precision in all tasks",
    },
    {
      id: "2",
      title: "Motive",
      issuer: "Personal Quality",
      date: "2024",
      description: "Self-driven and passionate about achieving goals",
    },
    {
      id: "3",
      title: "Esprit d'equipe",
      issuer: "Personal Quality",
      date: "2024",
      description: "Strong collaborator and team player",
    },
  ],

  volunteer: [
    {
      id: "1",
      organization: "Code for France",
      role: "Volunteer Developer",
      startDate: "2020",
      endDate: "",
      current: true,
      description: "Building open-source tools for civic engagement",
    },
  ],

  interests: [
    { id: "1", name: "Photography", description: "Landscape and street photography" },
    { id: "2", name: "Open Source", description: "Contributing to community projects" },
    { id: "3", name: "Travel", description: "Exploring new cultures and places" },
    { id: "4", name: "Reading", description: "Tech blogs and science fiction" },
  ],

  references: [
    {
      id: "1",
      name: "Marie Dupont",
      title: "Engineering Manager",
      company: "Tech Solutions Inc.",
      email: "marie.dupont@techsolutions.com",
      phone: "+33 6 98 76 54 32",
      relationship: "Direct Manager",
      isVisible: true,
    },
    {
      id: "2",
      name: "Jean-Pierre Lambert",
      title: "CTO",
      company: "Digital Agency Pro",
      email: "jp.lambert@digitalagency.com",
      phone: "+33 6 11 22 33 44",
      relationship: "Former Manager",
      isVisible: true,
    },
  ],

  customSections: [],
};

export const defaultTemplateColors = {
  primary: "#e67e22",
  secondary: "#34495e",
  background: "#ffffff",
  text: "#333333",
  headings: "#2c3e50",
};

export const defaultTypography = {
  fontFamily: "Segoe UI",
  headingFont: "Segoe UI",
  bodySize: 10,
  headingSize: 14,
  lineHeight: 1.5,
};
