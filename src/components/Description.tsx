import type { FC } from 'react';

import type { NewDescriptionType } from '@/domain/newDescriptionType';

type Props = {
  description: string;
  descriptionType: NewDescriptionType;
};

export const Description: FC<Props> = ({ description, descriptionType }) => {
  if (descriptionType === 'text') {
    return (
      <>
        {description?.replace(/\r\n/gu, '\n').split('\n\n').map((p, i) => <p key={i} className="lead">{p}</p>)}
      </>
    );
  }
  if (descriptionType === 'html') {
    return <div className="htmlDescription" dangerouslySetInnerHTML={{ __html: description }} />;
  }
  return null;
};
