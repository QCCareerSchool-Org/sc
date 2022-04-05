import Head from 'next/head';
import type { ReactElement } from 'react';
import { memo } from 'react';

type Props = {
  title?: string;
  description?: string;
};

const siteTitle = 'Online Student Center';

export const Meta = memo(({ title, description }: Props): ReactElement => (
  <Head>
    {title
      ? <title>{title} - {siteTitle}</title>
      : <title>{siteTitle}</title>
    }
    {description && <meta name="description" content={description} />}
  </Head>
));

Meta.displayName = 'Meta';
