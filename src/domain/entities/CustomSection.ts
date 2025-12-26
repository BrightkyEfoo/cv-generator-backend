export type CustomFieldType = 'text' | 'textarea' | 'date' | 'url' | 'list' | 'rating';

export interface CustomField {
  id: string;
  label: string;
  type: CustomFieldType;
  value: string | string[] | number;
  required: boolean;
}

export interface CustomSectionItem {
  id: string;
  title?: string;
  subtitle?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  fields: CustomField[];
}

export interface CustomSection {
  id: string;
  name: string;
  icon?: string;
  order: number;
  isVisible: boolean;
  layout: 'list' | 'grid' | 'timeline';
  items: CustomSectionItem[];
}
