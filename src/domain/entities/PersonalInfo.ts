export interface SocialLink {
  platform: 'linkedin' | 'github' | 'twitter' | 'portfolio' | 'behance' | 'dribbble' | 'medium' | 'stackoverflow' | 'other';
  url: string;
  label?: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  dateOfBirth?: string;
  nationality?: string;
  drivingLicense?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed' | 'other';
  photoUrl?: string;
  socialLinks: SocialLink[];
}
