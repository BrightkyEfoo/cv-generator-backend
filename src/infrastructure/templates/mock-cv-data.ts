import { CV } from '../../domain/entities/CV.js';

export interface MockCVData {
  personalInfo: CV['personalInfo'];
  summary: string;
  experiences: CV['experiences'];
  education: CV['education'];
  skills: CV['skills'];
  languages: CV['languages'];
  certifications: CV['certifications'];
  projects: CV['projects'];
  awards: CV['awards'];
  interests: CV['interests'];
  references: CV['references'];
  customSections: CV['customSections'];
}

export const mockCVData: MockCVData = {
  personalInfo: {
    firstName: 'Alexandre',
    lastName: 'Martin',
    email: 'alexandre.martin@email.com',
    phone: '+33 6 12 34 56 78',
    address: '15 Rue de la Paix',
    city: 'Paris',
    country: 'France',
    postalCode: '75001',
    title: 'Senior Software Engineer',
    photoUrl: '',
    dateOfBirth: '1990-05-15',
    nationality: 'French',
    socialLinks: [
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/amartin', label: '/in/amartin' },
      { platform: 'GitHub', url: 'https://github.com/amartin', label: 'github.com/amartin' },
      { platform: 'Portfolio', url: 'https://amartin.dev', label: 'amartin.dev' },
    ],
  },

  summary:
    'Experienced software engineer with over 8 years of expertise in full-stack development. Passionate about building scalable applications and mentoring junior developers. Strong background in cloud architecture, microservices, and agile methodologies. Proven track record of delivering high-quality solutions that drive business growth.',

  experiences: [
    {
      id: '1',
      company: 'Tech Solutions Inc.',
      jobTitle: 'Senior Software Engineer',
      location: 'Paris, France',
      startDate: 'Jan 2021',
      endDate: '',
      current: true,
      description:
        'Leading development of cloud-native applications using modern technologies.',
      achievements: [
        'Led a team of 5 developers in building a microservices architecture',
        'Reduced application load time by 40% through optimization',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
        'Mentored 3 junior developers to senior positions',
      ],
    },
    {
      id: '2',
      company: 'Digital Agency Pro',
      jobTitle: 'Full Stack Developer',
      location: 'Lyon, France',
      startDate: 'Mar 2018',
      endDate: 'Dec 2020',
      current: false,
      description: 'Developed and maintained web applications for enterprise clients.',
      achievements: [
        'Built RESTful APIs serving 100k+ daily requests',
        'Developed responsive web applications using React and Node.js',
        'Collaborated with UX team to improve user engagement by 25%',
      ],
    },
    {
      id: '3',
      company: 'StartUp Vision',
      jobTitle: 'Junior Developer',
      location: 'Marseille, France',
      startDate: 'Sep 2016',
      endDate: 'Feb 2018',
      current: false,
      description: 'Started career developing web applications in a fast-paced startup.',
      achievements: [
        'Developed features for e-commerce platform using PHP and JavaScript',
        'Participated in code reviews and agile ceremonies',
      ],
    },
  ],

  education: [
    {
      id: '1',
      institution: 'University of Paris',
      degree: 'Master',
      field: 'Computer Science',
      location: 'Paris, France',
      startDate: '2014',
      endDate: '2016',
      description: 'Specialized in Software Engineering and Distributed Systems',
      gpa: '3.8/4.0',
    },
    {
      id: '2',
      institution: 'University of Lyon',
      degree: 'Bachelor',
      field: 'Information Technology',
      location: 'Lyon, France',
      startDate: '2011',
      endDate: '2014',
      description: 'Foundation in programming, databases, and networks',
      gpa: '3.6/4.0',
    },
  ],

  skills: [
    { name: 'JavaScript', level: 'expert', category: 'Programming' },
    { name: 'TypeScript', level: 'expert', category: 'Programming' },
    { name: 'Python', level: 'advanced', category: 'Programming' },
    { name: 'React', level: 'expert', category: 'Frontend' },
    { name: 'Node.js', level: 'expert', category: 'Backend' },
    { name: 'PostgreSQL', level: 'advanced', category: 'Database' },
    { name: 'AWS', level: 'advanced', category: 'Cloud' },
    { name: 'Docker', level: 'advanced', category: 'DevOps' },
    { name: 'Git', level: 'expert', category: 'Tools' },
    { name: 'Agile/Scrum', level: 'expert', category: 'Methodology' },
  ],

  languages: [
    { name: 'French', proficiency: 'native' },
    { name: 'English', proficiency: 'fluent' },
    { name: 'Spanish', proficiency: 'intermediate' },
  ],

  certifications: [
    {
      id: '1',
      name: 'AWS Solutions Architect Associate',
      issuer: 'Amazon Web Services',
      date: '2022',
      expirationDate: '2025',
      credentialId: 'AWS-SAA-123456',
    },
    {
      id: '2',
      name: 'Professional Scrum Master I',
      issuer: 'Scrum.org',
      date: '2021',
      credentialId: 'PSM-I-789012',
    },
    {
      id: '3',
      name: 'Google Cloud Professional Developer',
      issuer: 'Google',
      date: '2023',
      credentialId: 'GCP-PD-345678',
    },
  ],

  projects: [
    {
      id: '1',
      name: 'E-Commerce Platform',
      description:
        'Built a scalable e-commerce solution handling 50k+ products with real-time inventory management',
      url: 'https://github.com/amartin/ecommerce',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
      startDate: '2022',
      endDate: '2023',
    },
    {
      id: '2',
      name: 'Task Management App',
      description:
        'Developed a collaborative task management tool with real-time updates and team features',
      url: 'https://taskapp.amartin.dev',
      technologies: ['Vue.js', 'Express', 'MongoDB', 'Socket.io'],
      startDate: '2021',
      endDate: '2022',
    },
  ],

  awards: [
    {
      id: '1',
      title: 'Rigoureux',
      issuer: '',
      date: '',
      description: 'Attention to detail and precision in all tasks',
    },
    {
      id: '2',
      title: 'Motive',
      issuer: '',
      date: '',
      description: 'Self-driven and passionate about achieving goals',
    },
    {
      id: '3',
      title: "Esprit d'equipe",
      issuer: '',
      date: '',
      description: 'Strong collaborator and team player',
    },
  ],

  interests: [
    { name: 'Photography', description: 'Landscape and street photography' },
    { name: 'Open Source', description: 'Contributing to community projects' },
    { name: 'Travel', description: 'Exploring new cultures and places' },
    { name: 'Reading', description: 'Tech blogs and science fiction' },
  ],

  references: [
    {
      id: '1',
      name: 'Marie Dupont',
      title: 'Engineering Manager',
      company: 'Tech Solutions Inc.',
      email: 'marie.dupont@techsolutions.com',
      phone: '+33 6 98 76 54 32',
      relationship: 'Direct Manager',
    },
    {
      id: '2',
      name: 'Jean-Pierre Lambert',
      title: 'CTO',
      company: 'Digital Agency Pro',
      email: 'jp.lambert@digitalagency.com',
      phone: '+33 6 11 22 33 44',
      relationship: 'Former Manager',
    },
  ],

  customSections: [],
};

export const defaultTemplateColors = {
  primary: '#e67e22',
  secondary: '#34495e',
  background: '#ffffff',
  text: '#333333',
  headings: '#2c3e50',
};

export const defaultTypography = {
  fontFamily: 'Segoe UI',
  headingFont: 'Segoe UI',
  bodySize: 10,
  headingSize: 14,
  lineHeight: 1.5,
};
