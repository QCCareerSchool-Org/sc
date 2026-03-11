export interface NewTransfer {
  /** uuid */
  transferId: string;
  /** uuid */
  submissionId: string;
  administratorId: number;
  preTutorId: number;
  postTutorId: number;
  created: Date;
}

export interface RawNewTransfer {
  /** uuid */
  transferId: string;
  /** uuid */
  submissionId: string;
  administratorId: number;
  preTutorId: number;
  postTutorId: number;
  /** string date */
  created: string;
}
