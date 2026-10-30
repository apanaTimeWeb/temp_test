export type AdminFinanceTrustScoreStudent = {
  rank: number;
  studentName: string;
  smartId: string;
  shift: AdminFinanceTrustScoreStudentShift;
  trustScore: number;
  totalPromises: number;
  timesChanged: number;
  fulfilledCount: number;
  badge: AdminFinanceTrustScoreStudentBadge;
};

export type AdminFinanceTrustScoreStudentShift = 'Morning' | 'Evening' | 'Full Day';
export type AdminFinanceTrustScoreStudentBadge = 'reliable' | 'moderate' | 'low';
