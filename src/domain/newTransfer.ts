export type NewTransfer = {
  /** uuid */
  transferId: string;
  /** uuid */
  submissionId: string;
  administratorId: number;
  preTutorId: number;
  postTutorId: number;
  created: Date;
};

export type RawNewTransfer = {
  /** uuid */
  transferId: string;
  /** uuid */
  submissionId: string;
  administratorId: number;
  preTutorId: number;
  postTutorId: number;
  /** string date */
  created: string;
};
