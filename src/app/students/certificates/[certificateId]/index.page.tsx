import type { GetServerSideProps, NextPage } from 'next';

import { BackgroundImage } from './backgroundImage';
import { fetchAward } from './fetchAward';
import { fetchOldAward } from './fetchOldAward';
import Hero from './hero-.jpg';
import type { Award } from '@/domain/award';

export interface Props {
  submissionId: string | null;
};

export interface Certificate {
  name: string;
  id: string;
}

const AwardPage: NextPage<{ submissionId: string }> = async ({ submissionId }) => {
  console.log(submissionId);
  return (
    <>
      <section>
        <BackgroundImage src={Hero} />
        <div className="container text-center text-white">
          <h1 className="fw-bold">You Did It!</h1>
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-3">
              <p className="bg-white p-2 rounded-4 shadow text-black fw-bold">Congratulations!</p>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-9 col-lg-5">
              <p className="mt-2">You have successfully completed your [course name] course and earned the professional designation of [course designation]. Today, we proudly celebrate your talent, your hard work, and your official graduation.</p>
            </div>
          </div>
          {/* <p className="lead fw-bold text-primary mb-2">Congratulations, {award.name}! 🎉</p>
          <p className="lead mb-2 fw-bold">Grade: {award.grade}</p> */}
        </div>
      </section>
    </>
  );
};

export default AwardPage;

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const submissionId = typeof ctx.params?.submissionId === 'string' ? ctx.params.submissionId : null;
  return await Promise.resolve({ props: { submissionId } });
};

const getCertificate = async (submissionId: string): Promise<Certificate> => {
  if (/^\d+$/u.test(submissionId)) {
    const submissionIdNumber = parseInt(submissionId, 10);
    return fetchOldAward(submissionIdNumber);
  }

  return fetchAward(submissionId);
};

// look up how to do NextJS Pages Router PDF request
// social integration (mockup backend call to get data)
// template already exists
