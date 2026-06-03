import { FaLinkedin, FaLinkedinIn } from 'react-icons/fa';

import { BackgroundImage } from './backgroundImage';
// import { fetchAward } from './fetchAward';
// import { fetchOldAward } from './fetchOldAward';
import Hero from './hero-.jpg';
import { SuggestedText } from './suggestedText';
import { BlueskyShare } from '../share/bluesky';
import { FacebookShare } from '../share/facebook';
import { LinkedInShare } from '../share/linkedIn';
import { ThreadsShare } from '../share/threads';
import { TwitterShare } from '../share/twitter';

// import type { Award } from '@/domain/award';

interface Certificate {
  name: string;
  id: number;
  schoolName: string;
  courseName: string;
}

interface PageProps {
  params: {
    certificateId: string;
  };
}

const AwardPage = ({ params }: PageProps) => {
  const certificate = getCertificate(params.certificateId);
  const suggestedText = `I just earned this Award of Excellence from ${certificate.schoolName} for my work in ${certificate.courseName}! I'm so excited to be pursuing my dream career. 💫 #AwardOfExcellence @QCEventPlanning`;
  const url = `https://www.qceventplanning.com/awards/${certificate.id}`;
  return (
    <>
      <section className="position-relative overflow-hidden py-4 d-flex align-items-center" style={{ minHeight: '70vh' }}>
        <BackgroundImage src={Hero} />
        <div className="position-relative z-1 container text-center text-white ">
          <h1 className="fw-bold">You Did It!</h1>
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-5">
              <div className="bg-white p-2 rounded-4 shadow text-black fw-bold">Congratulations, {certificate.name}!</div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-9">
              <p className="mt-2">You have successfully completed your {certificate.courseName} course and earned the professional designation of {certificate.courseName}. Today, we proudly celebrate your talent, your hard work, and your official graduation.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container text-center">
          <div className=" bg-white text-dark rounded-3 border border-1 p-4 mt-4 mb-4">Congratulations, {certificate.name}!</div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Next Steps</h2>

          <div className="row g-4 justify-content-center">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 d-flex flex-column">
                <div className="mb-3 text-center">
                  <i className="bi bi-linkedin fs-1 text-primary" />
                </div>
                <h5 className="fw-bold text-center"><div className="bg-blue rounded-3"><FaLinkedinIn color="#0A66C2" size={32} /></div> Add to LinkedIn Profile</h5>
                <p className="mt-2 flex-grow-1 text-center">
                  Add this verified credential to your LinkedIn profile’s Licenses & Certifications section.
                  It makes your profile highly searchable for recruiters and instantly signals your expertise.
                </p>
                <button className="btn btn-primary w-100 mt-3 fw-semibold">
                  Add Credential
                </button>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 d-flex flex-column">
                <div className="mb-3 text-center">
                  <i className="bi bi-file-earmark-pdf fs-1 text-danger" />
                </div>
                <h5 className="fw-bold text-center">Download PDF</h5>
                <p className="mt-2 flex-grow-1 text-center">
                  Download a high-quality PDF suitable for printing or adding to your portfolio.
                  Perfect for framing or sharing with clients.
                </p>
                <button className="btn btn-danger w-100 mt-3 fw-semibold">
                  Download Official PDF
                </button>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 d-flex flex-column">
                <div className="mb-3 text-center">
                  <i className="bi bi-gift fs-1 text-success" />
                </div>
                <h5 className="fw-bold text-center">Enjoy Alumni Benefits</h5>
                <p className="mt-2 flex-grow-1 text-center">
                  Enjoy lifetime access to 50% off additional courses and 10% off QC Career School merchandise.
                </p>
                <button className="btn btn-success w-100 mt-3 fw-semibold">
                  See Merchandise
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-light" style={{ borderBottom: '1px solid #ddd' }}>
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6">
              <h2 className="mb-2">Share Your Success</h2>
              <p className="lead mb-5">Celebrate your achievement by sharing your Award of Excellence with your friends and followers on social media. Don't forget to tag <b>@QCEventPlanning</b> so we can cheer you on!</p>
              <div className="mb-4">
                <h3 className="h4 mb-1">Sample Text</h3>
                <SuggestedText text={suggestedText} />
              </div>
              <div className="mt-2">
                <ThreadsShare text={`${suggestedText.replace(' 💫', '')} ${url}`} />
              </div>
              <div className="mt-2">
                <BlueskyShare text={`${suggestedText} ${url}`} />
              </div>
              <div className="mt-2">
                <FacebookShare url={url} />
              </div>
              <div className="mt-2">
                <LinkedInShare url={url} text={suggestedText} />
              </div>
              <div className="mt-2">
                <TwitterShare url={url} text={suggestedText} />
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default AwardPage;

const getCertificate = (certificateId: string): Certificate => {
  return {
    id: parseInt(certificateId, 10),
    name: 'Name LastName',
    schoolName: 'QC Event School',
    courseName: 'Event Planning',
  };
  // if (/^\d+$/u.test(certificateId)) {
  //   const certificateIdNumber = parseInt(certificateId, 10);
  //   return fetchOldAward(certificateIdNumber);
};

//   return fetchAward(certificateId);
// };

// look up how to do NextJS Pages Router PDF request
// social integration (mockup backend call to get data)
// template already exists
