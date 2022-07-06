import type { ErrorInfo, MouseEventHandler, ReactNode } from 'react';
import { Component } from 'react';

import { TrackJS } from '../trackjs-isomorphic';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error: unknown;
};

export class AppErrorBoundary extends Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  public static getDerivedStateFromError(error: unknown): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: unknown, errorInfo: ErrorInfo): void {
    if (error instanceof Error || (typeof error === 'object' && error !== null) || typeof error === 'string') {
      TrackJS.track(error);
    }
    console.error('ErrorBoundary', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <section>
          <div className="container text-center">
            <h1>Please bear with us...</h1>
            <p className="lead">Sorry for the inconvenience. We suggest you <strong>refresh the page</strong> to resolve the issue.</p>
            <button onClick={this.handleRefreshClick} className="btn btn-primary">Refresh</button>
          </div>
        </section>
      );
    }
    return this.props.children;
  }

  private async unregisterServiceWorkers(): Promise<void | boolean[]> {
    if (!('navigator' in window && 'serviceWorker' in navigator && window.isSecureContext)) {
      return;
    }
    const registrations = await window.navigator.serviceWorker.getRegistrations();
    return Promise.all(registrations.map(async r => r.unregister()));
  }

  private async clearCaches(): Promise<void | boolean[]> {
    if (!('caches' in window && window.isSecureContext)) {
      return;
    }
    const keys = await window.caches.keys();
    return Promise.all(keys.map(async k => window.caches.delete(k)));
  }

  private readonly handleRefreshClick: MouseEventHandler<HTMLButtonElement> = () => {
    Promise.all([
      this.unregisterServiceWorkers(),
      this.clearCaches(),
    ]).catch(err => {
      console.error('Refresh error', err);
    }).finally(() => {
      window.location.reload();
    });
  };
}
