import type { ReactElement, ReactNode } from 'react';
import { Component } from 'react';

interface Props {
  fallback: ReactElement;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class PageErrorBoundary extends Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  public render(): ReactNode {
    return this.state.hasError
      ? this.props.fallback
      : this.props.children;
  }
}
