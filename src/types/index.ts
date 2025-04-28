export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export type CrimeType = 
  | 'theft'
  | 'assault'
  | 'vandalism'
  | 'burglary'
  | 'robbery'
  | 'emergency'
  | 'other';

export type ReportStatus = 'pending' | 'in-progress' | 'resolved';

export type Coordinates = {
  lat: number;
  lng: number;
};

export type CrimeReport = {
  id: string;
  reporterId: string;
  reporterEmail: string;
  crimeType: CrimeType;
  description?: string;
  location: Coordinates;
  address: string;
  date: Date;
  images: string[];
  status: ReportStatus;
  assignedTeam?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type Team = {
  id: string;
  name: string;
  members: string[];
  available: boolean;
};