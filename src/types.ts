export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
export type IssueStatus = 'Reported' | 'Under Investigation' | 'Work In Progress' | 'Resolved';

export interface ContractorBid {
  id: string;
  contractorName: string;
  amount: number; // in INR (₹)
  timelineDays: number;
  status: 'Pending' | 'Accepted' | 'Declined';
  createdAt: string;
}

export interface CivicLocation {
  lat: number;
  lng: number;
  address: string;
  ward: string;
  city: string;
}

export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  category: string; // e.g., "Potholes & Roads", "Water Logging", "Waste & Garbage", "Electricity & Lights"
  severity: Severity;
  status: IssueStatus;
  location: CivicLocation;
  upvotes: number;
  witnesses: string[]; // List of mock user IDs or phone numbers who witnessed this
  reporterName: string;
  reporterAvatar?: string;
  createdAt: string;
  imageUrl: string;
  resolvedImageUrl?: string;
  isPredictive?: boolean;
  predictiveReason?: string;
  department: string; // e.g., "Mahanagar Palika Road Dept"
  complaintLetter?: string;
  bids?: ContractorBid[];
  beforeAfterVerifiedByAI?: boolean;
  pointsEarned: number;
}

export interface MLAPerformance {
  id: string;
  name: string;
  wardName: string;
  constituency: string;
  city: string;
  party: string;
  resolvedIssues: number;
  totalIssues: number;
  score: number; // calculated as resolved / total * 100 with active points
  rank: number;
  avatar: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  unlockedAt?: string;
}

export interface UserProfile {
  name: string;
  role: 'Citizen' | 'Contractor' | 'Corporator';
  points: number;
  ranks: {
    city: number;
    ward: number;
  };
  stats: {
    reported: number;
    witnessed: number;
    verified: number;
  };
  badges: Badge[];
}
