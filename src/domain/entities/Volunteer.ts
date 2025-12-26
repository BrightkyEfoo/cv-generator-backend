export interface Volunteer {
  id: string;
  organization: string;
  role: string;
  cause?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  achievements?: string[];
}
