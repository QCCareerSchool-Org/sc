import type { NextPage } from 'next';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import { useEffect, useReducer } from 'react';

import { ActionsSection } from './ActionsSection';
import HeroBackgroundImage from './hero-bg.jpg';
import { SocialSharingSection } from './SocialSharingSection';
import { initialState, reducer } from './state';
import { BackgroundImage } from '@/components/BackgroundImage';
import { CertificateView } from '@/components/certificate/CertificateView';
import { CertificateWrapper } from '@/components/certificate/CertificateWrapper';
import { Spinner } from '@/components/Spinner';
import { useAuthState } from '@/hooks/useAuthState';
import { useStudentServices } from '@/hooks/useStudentServices';

const CertificatePage: NextPage = () => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  const { courseId: courseIdParam } = router.query;
  const { studentId } = useAuthState();
  const { certificateService } = useStudentServices();

  useEffect(() => {
    if (typeof courseIdParam !== 'string') { return; }
    if (typeof studentId !== 'number') {
      dispatch({ type: 'CERTIFICATE_FAILED', payload: { code: 400, message: 'No studentId' } });
      return;
    }
    const courseId = parseInt(courseIdParam, 10);
    if (isNaN(courseId)) {
      dispatch({ type: 'CERTIFICATE_FAILED', payload: { code: 400, message: 'Invalid courseId' } });
      return;
    }

    dispatch({ type: 'FETCH_STARTED' });

    const subscription = certificateService.getCertificate(studentId, courseId).subscribe({
      next: c => dispatch({ type: 'CERTIFICATE_LOADED', payload: c }),
      error: (e: unknown) => dispatch({ type: 'CERTIFICATE_FAILED', payload: { code: 500, message: e instanceof Error ? e.message : String(e) } }),
    });

    return () => subscription.unsubscribe();
  }, [ studentId, courseIdParam, certificateService ]);

  if (state.fetchState === 'idle') {
    return;
  }

  if (state.fetchState === 'fetching') {
    return (
      <section>
        <div className="d-flex justify-content-center">
          <Spinner />
        </div>
      </section>
    );
  }

  if (state.fetchState === 'error') {
    return <ErrorPage statusCode={state.error.code} title={state.error.message} />;
  }

  const certUrl = `https://studentcenter.qccareerschool.com/sc/certificates/${state.certificate.signature}`;

  return (
    <>
      <section>
        <BackgroundImage src={HeroBackgroundImage} />
        <div className="container text-center text-white">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-9">
              <h1 className="fw-bold mb-4">You Did It!</h1>
              <div className="bg-white py-2 px-4 rounded-4 shadow text-black fw-bold mb-4 d-inline-block">Congratulations, {state.certificate.firstName} {state.certificate.lastName}! 🎉</div>
              <p className="lead mb-0">You have successfully completed <span className="fw-bold">{state.certificate.courseName}</span>{state.certificate.designation?.name && <> and earned the professional designation of <span className="fw-bold">{state.certificate.designation.name}</span></>}. Today, we proudly celebrate your talent, your hard work, and your official graduation.</p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="mx-auto" style={{ maxWidth: '1000px', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)', borderRadius: '1rem' }}>
            <CertificateWrapper savePdf>
              <CertificateView
                name={`${state.certificate.firstName} ${state.certificate.lastName}`}
                courseName={state.certificate.courseName}
                designation={state.certificate.designation?.name}
                schoolName={state.certificate.schoolName}
                date={state.certificate.graduationDate}
              />
            </CertificateWrapper>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 text-center">
              <div className={`rounded-3 p-4 border card`}>
                <div className="text-uppercase">Issue Date Authority</div>
                <div className="fw-bold">{state.certificate.graduationDate.toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ActionsSection certification={state.certificate.designation?.name} graduationDate={state.certificate.graduationDate} url={certUrl} />
      <SocialSharingSection schoolName={state.certificate.schoolName} courseName={state.certificate.courseName} url={certUrl} />
    </>
  );
};

export default CertificatePage;
