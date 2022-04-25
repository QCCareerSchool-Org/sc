export interface IGradeService {
  calculate: (mark: number, points: number, date: Date) => string;
}

export class GradeService implements IGradeService {
  private static readonly switchOverTime = Date.UTC(2014, 2, 10, 15, 21); // Mon Mar 10 2014 15:21:00 GMT+0000

  public calculate(mark: number, points: number, date: Date): string {
    if (points === 0) {
      throw Error('Divide by zero');
    }
    return date.getTime() >= GradeService.switchOverTime
      ? this.get2014GradeLetter(mark / points)
      : this.getOldGradeLetter(mark / points);
  }

  private get2014GradeLetter(percentage: number): string {
    if (percentage >= 0.95) {
      return 'A+';
    } else if (percentage >= 0.90) {
      return 'A';
    } else if (percentage >= 0.85) {
      return 'A-';
    } else if (percentage >= 0.80) {
      return 'B+';
    } else if (percentage >= 0.75) {
      return 'B';
    } else if (percentage >= 0.70) {
      return 'B-';
    } else if (percentage >= 0.65) {
      return 'C+';
    } else if (percentage >= 0.60) {
      return 'C';
    } else if (percentage >= 0.50) {
      return 'C-';
    }
    return 'F';
  }

  private getOldGradeLetter(percentage: number): string {
    if (percentage >= 0.95) {
      return 'A+';
    } else if (percentage >= 0.90) {
      return 'A';
    } else if (percentage >= 0.85) {
      return 'A-';
    } else if (percentage >= 0.80) {
      return 'B+';
    } else if (percentage >= 0.75) {
      return 'B';
    } else if (percentage >= 0.70) {
      return 'B-';
    } else if (percentage >= 0.65) {
      return 'C+';
    } else if (percentage > 0) {
      return 'C';
    }
    return 'F';
  }
}
