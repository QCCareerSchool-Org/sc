import type { ReactNode } from 'react';
import { Component } from 'react';

import { TrackJS } from 'src/trackjs-isomorphic';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<Props, State> {

  public componentDidCatch(error: Error): void {
    if (error instanceof Error || (typeof error === 'object' && error !== null) || typeof error === 'string') {
      TrackJS.track(error);
    }
  }

  public render(): ReactNode {
    return this.props.children;
  }
}
