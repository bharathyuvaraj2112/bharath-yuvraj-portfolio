export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  skillsCovered: string[];
  certificateUrl?: string;
  issueDate?: string;
  credentialUrl?: string;
  certificateImageUrl?: string;
  description?: string;
  isPlaceholder?: boolean;
}

export const certificationsData: Certification[] = [];
