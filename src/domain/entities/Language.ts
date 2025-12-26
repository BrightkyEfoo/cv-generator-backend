export type LanguageProficiency = 'basic' | 'conversational' | 'professional' | 'fluent' | 'native';

export interface Language {
  id: string;
  name: string;
  proficiency: LanguageProficiency;
}
