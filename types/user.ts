export interface User {
  uid: string;
  email: string;
  attemptsLeft: number;
  tempPassword?: string;
  hasSolvedCorrectly: boolean;
  rewardClaimed: boolean;
  answerSubmitted?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayoutDetails {
  method: 'upi' | 'bank';
  upiId?: string;
  bankAccount?: string;
  ifscCode?: string;
  holderName: string;
}
