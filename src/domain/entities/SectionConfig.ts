export type StandardSectionType =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'certifications'
  | 'projects'
  | 'publications'
  | 'awards'
  | 'volunteer'
  | 'interests'
  | 'references';

export interface SectionConfig {
  type: StandardSectionType | 'custom';
  customSectionId?: string;
  title: string;
  isVisible: boolean;
  order: number;
  columns?: 1 | 2;
  showIcon: boolean;
  iconName?: string;
}

export interface CVLayout {
  sections: SectionConfig[];
  sidebarSections: SectionConfig[];
  hasSidebar: boolean;
  sidebarPosition: 'left' | 'right';
  headerStyle: 'centered' | 'left' | 'split';
  dateFormat: 'MM/YYYY' | 'YYYY' | 'MMM YYYY' | 'MMMM YYYY';
  showPageNumbers: boolean;
}
