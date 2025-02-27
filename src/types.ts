export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  title: string;
  npiNumber?: string;
  practiceId?: string;
  profileCompleted?: boolean;
}

export interface UserProfile extends User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  title: string;
  npiNumber: string;
  practiceId: string;
} 