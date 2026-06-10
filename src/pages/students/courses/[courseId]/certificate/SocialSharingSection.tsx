import type { FC } from 'react';

import { getSchoolUsername } from './getSchoolUsername';
import { BlueskyShare } from './share/bluesky';
import { FacebookShare } from './share/facebook';
import { LinkedInShare } from './share/linkedIn';
import { ThreadsShare } from './share/threads';
import { TwitterShare } from './share/twitter';
import { SuggestedText } from './suggestedText';
import type { SchoolName } from '@/domain/school';

interface Props {
  schoolName: SchoolName;
  courseName: string;
  url: string;
}

export const SocialSharingSection: FC<Props> = ({ schoolName, courseName, url }) => {
  const schoolUsername = getSchoolUsername(schoolName);
  const suggestedText = `I just earned this Certificate from ${schoolName} for my work in ${courseName}! I'm so excited to be pursuing my dream career. 💫 ${schoolUsername}`;
  const suggestedTextNoUsername = `I just earned this Certificate from ${schoolName} for my work in ${courseName}! I'm so excited to be pursuing my dream career. 💫`;

  return (
    <section className="bg-light" style={{ borderBottom: '1px solid #ddd' }}>
      <div className="container text-center mb-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">
            <h2 className="mb-2">Share Your Success</h2>
            <p className="lead mb-5">Celebrate your achievement by sharing your Certificate with your friends and followers on social media. Don't forget to tag <b>{schoolUsername}</b> so we can cheer you on!</p>
            <div className="mb-4">
              <h3 className="h4 mb-1">Sample Text</h3>
              <SuggestedText text={suggestedText} />
            </div>
            <div className="d-flex flex-column align-items-center gap-2 mt-2">
              <ThreadsShare text={`${suggestedTextNoUsername.replace(' 💫', '')} ${url}`} />
              <BlueskyShare text={`${suggestedTextNoUsername} ${url}`} />
              <FacebookShare url={url} />
              <LinkedInShare url={url} text={suggestedText} />
              <TwitterShare url={url} text={suggestedText} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
