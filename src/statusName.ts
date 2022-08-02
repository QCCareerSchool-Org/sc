export const statusName = (statusCode: string | null): string => {
  switch (statusCode) {
    case null:
      return '';
    case 'W':
      return 'Withdrawal';
    case 'H':
      return 'On Hold';
    case 'T':
      return 'Transferred';
    case 'R':
      return 'End-of-Course Refund';
    default:
      return '';
  }
};
