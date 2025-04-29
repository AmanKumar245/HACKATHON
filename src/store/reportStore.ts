import { create } from 'zustand';
import { CrimeReport, CrimeType, Coordinates, ReportStatus, Team } from '../types';
import { format } from 'date-fns';

type ReportState = {
  reports: CrimeReport[];
  teams: Team[];
  isLoading: boolean;
  submitReport: (report: Omit<CrimeReport, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateReportStatus: (id: string, status: ReportStatus, team?: string) => void;
  getReportById: (id: string) => CrimeReport | undefined;
  getDepartmentReports: () => CrimeReport[];
  getUserReports: (userId: string) => CrimeReport[];
};

// Demo teams
const demoTeams: Team[] = [
  { id: 'team-1', name: 'Rapid Response Unit', members: ['Officer Johnson', 'Officer Smith'], available: true },
  { id: 'team-2', name: 'Investigation Unit A', members: ['Detective Brown', 'Officer Davis'], available: true },
  { id: 'team-3', name: 'Patrol Team B', members: ['Officer Wilson', 'Officer Martinez'], available: true },
];

// Sample crime reports for demo
const initialReports: CrimeReport[] = [
  {
    id: 'report-1',
    reporterId: 'demo-user',
    reporterEmail: 'citizen@example.com',
    crimeType: 'theft',
    description: 'Bicycle stolen from outside the library',
    location: { lat: 40.7128, lng: -74.006 },
    address: '123 Main St, New York, NY',
    date: new Date('2023-06-15T14:30:00'),
    images: ['https://images.pexels.com/photos/1436129/pexels-photo-1436129.jpeg'],
    status: 'resolved',
    assignedTeam: 'team-1',
    resolvedAt: new Date('2023-06-16T10:15:00'),
    createdAt: new Date('2023-06-15T14:35:00'),
    updatedAt: new Date('2023-06-16T10:15:00'),
  },
  {
    id: 'report-2',
    reporterId: 'demo-user',
    reporterEmail: 'citizen@example.com',
    crimeType: 'vandalism',
    description: 'Graffiti on the wall of city hall',
    location: { lat: 40.7135, lng: -74.0010 },
    address: '456 Park Ave, New York, NY',
    date: new Date('2023-06-20T08:45:00'),
    images: ['https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg'],
    status: 'in-progress',
    assignedTeam: 'team-2',
    createdAt: new Date('2023-06-20T09:00:00'),
    updatedAt: new Date('2023-06-20T10:30:00'),
  },
  {
    id: 'report-3',
    reporterId: 'demo-user',
    reporterEmail: 'citizen@example.com',
    crimeType: 'emergency',
    description: 'Suspicious person in the park with possible weapon',
    location: { lat: 40.7116, lng: -74.0120 },
    address: '789 Central Park, New York, NY',
    date: new Date('2023-06-22T17:20:00'),
    images: [],
    status: 'pending',
    createdAt: new Date('2023-06-22T17:25:00'),
    updatedAt: new Date('2023-06-22T17:25:00'),
  },
];

const useReportStore = create<ReportState>((set, get) => ({
  reports: initialReports,
  teams: demoTeams,
  isLoading: false,
  
  submitReport: async (reportData) => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newReport: CrimeReport = {
      id: `report-${Date.now()}`,
      ...reportData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set(state => ({
      reports: [...state.reports, newReport],
      isLoading: false,
    }));
    
    return Promise.resolve();
  },
  
  updateReportStatus: (id, status, team) => {
    set(state => ({
      reports: state.reports.map(report => 
        report.id === id 
          ? { 
              ...report, 
              status, 
              assignedTeam: team || report.assignedTeam,
              resolvedAt: status === 'resolved' ? new Date() : report.resolvedAt,
              updatedAt: new Date(),
            } 
          : report
      ),
    }));
  },
  
  getReportById: (id) => {
    return get().reports.find(report => report.id === id);
  },
  
  getDepartmentReports: () => {
    return get().reports;
  },
  
  getUserReports: (userId) => {
    return get().reports.filter(report => report.reporterId === userId);
  },
}));

export default useReportStore;