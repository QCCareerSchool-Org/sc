import { NextPage } from 'next';
import { MouseEventHandler, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { BehaviorSubject, map, Observable, Observer } from 'rxjs';

const StudentPage: NextPage = () => {
  const [ adjustment, setAdjustment ] = useState(3);

  const foo$ = useRef(new BehaviorSubject<number>(0));

  const onClick: MouseEventHandler<HTMLButtonElement> = e => {
    foo$.current.next(foo$.current.value + 1);
  };

  console.log('parent render');

  return (
    <div>
      <h1>Welcome!</h1>
      <ChildComponent foo$={foo$.current.asObservable()} adjustment={adjustment} />
      <button onClick={onClick}>Increment</button>
      <p>Adjustment is {adjustment}</p>
      <button onClick={() => setAdjustment(c => c + 1)}>Other</button>
    </div>
  );
};

type ChildProps = {
  foo$: Observable<number>;
  adjustment: number;
};

const ChildComponent = ({ foo$, adjustment }: ChildProps): ReactElement => {
  const foo = useObservable(foo$);
  console.log('child render');

  const observer = useMemo(() => ({
    next: (val: number) => {
      console.log('in subscriber', val);
    },
  }), []);

  const otherObserver = useMemo(() => ({
    next: (val: number) => {
      console.log('in adjusted subscriber', val + adjustment);
    },
  }), [ adjustment ]);

  const fooX2$ = useRef(foo$.pipe(map(x => x * 2)));

  const adjustedFoo$ = useMemo(() => foo$.pipe(map(x => x + adjustment)), [ foo$, adjustment ]);

  useObservable2(fooX2$.current, observer);
  useObservable2(adjustedFoo$, observer);
  useObservable2(adjustedFoo$, otherObserver);

  return (
    <>
      <p>Value: {foo}</p>
    </>
  );
};

export default StudentPage;

function useObservable<T>(observable: Observable<T>): T | undefined {
  const [ state, setState ] = useState<T>();

  useEffect(() => {
    const subscription = observable.subscribe(setState);
    return () => subscription.unsubscribe();
  }, [ observable ]);

  return state;
}

function useObservable2<T>(observable: Observable<T>, observer: Partial<Observer<T>>): void {
  useEffect(() => {
    const subscription = observable.subscribe(observer);
    return () => subscription.unsubscribe();
  }, [ observable, observer ]);
}
