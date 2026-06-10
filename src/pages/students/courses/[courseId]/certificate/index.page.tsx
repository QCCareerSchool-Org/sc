import cookie from 'cookie';
import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { ActionsSection } from './ActionsSection';
import HeroBackgroundImage from './hero-bg.jpg';
import styles from './index.module.css';
import { SocialSharingSection } from './SocialSharingSection';
import { BackgroundImage } from '@/components/BackgroundImage';
import { CertificateView } from '@/components/certificate/CertificateView';
import { CertificateWrapper } from '@/components/certificate/CertificateWrapper';
import type { Certificate, RawCertificate } from '@/domain/certificate';
import { fetchRawCertificate } from 'src/lib/fetchCertificate';

type Props = {
  rawCertificate: RawCertificate;
  error?: undefined;
} | {
  rawCertificate?: undefined;
  error: {
    code: number;
    message: string;
  };
};

const CertificatePage: NextPage<Props> = ({ rawCertificate, error }) => {
  if (error) {
    console.error(error.message);
    return <ErrorPage statusCode={error.code} />;
  }

  const certificate: Certificate = {
    ...rawCertificate,
    graduationDate: new Date(rawCertificate.graduationDate),
  };

  const certUrl = `https://studentcenter.qccareerschool.com/sc/certificates/${certificate.signature}`;

  return (
    <>
      <section>
        <BackgroundImage src={HeroBackgroundImage} />
        <div className="container text-center text-white">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-9">
              <h1 className="fw-bold mb-4">You Did It!</h1>
              <div className="bg-white py-2 px-4 rounded-4 shadow text-black fw-bold mb-4 d-inline-block">Congratulations, {certificate.firstName} {certificate.lastName}! 🎉</div>
              <p className="lead mb-0">You have successfully completed your <span className="fw-bold">{certificate.courseName}</span> course and earned the professional designation of <span className="fw-bold">{certificate.designation.name}</span>. Today, we proudly celebrate your talent, your hard work, and your official graduation.</p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div>
          <div className="mx-auto" style={{ maxWidth: '1000px', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)' }}>
            <CertificateWrapper savePdf>
              <CertificateView
                name={`${certificate.firstName} ${certificate.lastName}`}
                courseName={certificate.courseName}
                schoolName={certificate.schoolName}
                date={certificate.graduationDate}
              />
            </CertificateWrapper>
          </div>
        </div>
      </section>
      <section>
        <div className="row justify-content-center mb-4 mt-4">
          <div className="col-12 col-md-8 col-lg-6">
            <div className={`no-print rounded-3 p-4 border ${styles.infoCard}`}>
              <div className="row g-3 text-center">
                <div className="col-6">
                  <span className={`d-block text-uppercase ${styles.infoLabel}`}>Certification ID</span>
                  <span className={`fw-bold ${styles.infoValue}`}>{certificate.signature}</span>
                </div>
                <div className="col-6">
                  <span className={`d-block text-uppercase ${styles.infoLabel}`}>Issue Date Authority</span>
                  <span className={`fw-bold ${styles.infoValue}`}>{certificate.graduationDate.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ActionsSection graduationDate={certificate.graduationDate} url={certUrl} />
      <SocialSharingSection schoolName={certificate.schoolName} courseName={certificate.courseName} url={certUrl} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const courseIdParam = context.query.courseId;
  if (typeof courseIdParam !== 'string') {
    return { props: { error: { code: 400, message: 'missing courseId' } } };
  }

  const courseId = parseInt(courseIdParam, 10);
  if (isNaN(courseId)) {
    return { props: { error: { code: 400, message: 'invalid courseId' } } };
  }

  const parsedCookies = cookie.parse(context.req.headers.cookie ?? '');

  const studentIdCookie = parsedCookies.studentId;
  if (!studentIdCookie) {
    return { props: { error: { code: 400, message: 'missing studentId' } } };
  }

  const studentId = parseInt(studentIdCookie, 10);
  if (isNaN(studentId)) {
    return { props: { error: { code: 400, message: 'missing studentId' } } };
  }

  try {
    const rawCertificate = await fetchRawCertificate(studentId, courseId);

    return { props: { rawCertificate } };
  } catch (err) {
    return { props: { error: { code: 500, message: err instanceof Error ? err.message : String(err) } } };
  }
};

export default CertificatePage;
