declare global {
  interface Window {
    API_1484_11?: ScormAPI;
  }
}

type Data = Record<string, string>;

type CommitFunction = (data: Data) => boolean;

export class ScormAPI {
  private readonly data: Data;
  private interactionCount: number;

  public constructor(
    private readonly lessonId: string,
    private readonly commitFunction: CommitFunction,
    initialData: Data,
  ) {
    this.data = { ...initialData };
    this.interactionCount = Object.keys(initialData).filter(k => /^cmi\.interactions\.\d+\.id/u.test(k)).length;
  }

  public Initialize(): void {
    console.log('Function: Initialize');
  }

  public Finish(): void {
    console.log('Function: Finish');
  }

  public SetValue(element: string, value: string): void {
    console.log(`Function: SetValue (setting ${element} to "${value}" for ${this.lessonId})`);
    const matches = /^cmi\.interactions\.\d+/u.exec(element);
    if (matches) {
      if (parseInt(matches[1], 10) === this.interactionCount) {
        this.interactionCount++;
      }
    }
    this.data[element] = value;
  }

  public GetValue(element: string): string {
    console.log(`Function: GetValue (getting ${element})`);
    if (element === 'cmi.interactions._count') {
      return this.interactionCount.toString();
    }
    return this.data[element] ?? '';
  }

  public GetLastError(): unknown {
    console.log('Function: GetLastError');
    return {};
  }

  public GetErrorString(): string {
    console.log('Function: GetErrorString');
    return '';
  }

  public GetDiagnostic(): unknown {
    console.log('Function: GetDiagnostic');
    return {};
  }

  public Commit(): boolean {
    console.log('Function: Commit');
    return this.commitFunction(this.data);
  }
}
