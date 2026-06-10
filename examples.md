# Example Components

## Standard Component

```tsx
import type { FC } from 'react';

interface Props {
  bar: number;
}

// named export
export const Foo: FC<Props> = ({ bar }) => {
}
```

## Pages Router Page

```tsx
import type { GetServerSideProps, NextPage } from 'next'

interface Props {
  bar: number;
}

const FooPage: NextPage<Props> = ({ bar }) => (
  <div>{bar}</div>
);

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const bar = await fetchBar(); // server-side fetching
  return { props: { bar } }; // send value via props
}

export default FooPage;
```

## App Router Page

```tsx
import type { PageComponent } from '@/serverComponent';

const FooPage: PageComponent = async ({ searchParams }) => {
  const bar = await fetchBar(); // server-side fetching

  return (
    <div>{bar}</div>
  );
}

export default FooPage;
```

## App Router Layout

```tsx
import type { LayoutComponent } from '@/serverComponent';

const FooLayout: LayoutComponent = async ({ searchParams, children }) => {
  const { qux } = await searchParams;

  return (
    <div>
      {qux}
      <div>
        {children}
      </div>
    </div>
  )

}

export default FooLayout;
```

## App Router Page or Layout with Route Parms

e.g. /src/app/posts/[postId]/page.tsx

```tsx
import type { PageComponent } from '@/serverComponent';

// lint-disable-next-line @typescript-eslint/consistent-type-definitions
type Params = {
  postId: string;
};

const FooPage: PageComponent<Params> = ({ searchParams, params }) => {
  const { postId } = await params;
  const { qux } = await searchParams;

  return (
    <div>{studentId}{qux}</div>
  )
}

export default FooPage;
```

