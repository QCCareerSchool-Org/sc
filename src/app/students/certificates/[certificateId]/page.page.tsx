import { FaLinkedinIn } from 'react-icons/fa';
import { GiGraduateCap } from 'react-icons/gi';
import { GrDownload } from 'react-icons/gr';

import { BackgroundImage } from './backgroundImage';
import type Certificate from './Certificate';
import { CertificateWrapper } from './CertificateWrapper';
import { fetchAward } from './fetchAward';
import { fetchOldAward } from './fetchOldAward';
import Hero from './hero-.jpg';
import styles from './index.module.css';
import directorSignature from './kayla.svg';
import registrarSignature from './lucie.svg';
import { SuggestedText } from './suggestedText';
import { BlueskyShare } from '../share/bluesky';
import { FacebookShare } from '../share/facebook';
import { LinkedInShare } from '../share/linkedIn';
import { ThreadsShare } from '../share/threads';
import { TwitterShare } from '../share/twitter';
import type { Award } from '@/domain/award';

// import type { Award } from '@/domain/award';

interface Certificate {
  name: string;
  id: number;
  schoolName: string;
  courseName: string;
  date: string;
}

interface PageProps {
  params: Promise<{
    certificateId: string;
  }>;
}

const AwardPage = async ({ params }: PageProps) => {
  const { certificateId } = await params;
  console.log(certificateId);
  let certificate: Certificate;
  try {
    certificate = await getCertificate(certificateId);
  } catch {
    return <p>Certificate not found.</p>;
  }
  const suggestedText = `I just earned this Award of Excellence from ${certificate.schoolName} for my work in ${certificate.courseName}! I'm so excited to be pursuing my dream career. 💫 #AwardOfExcellence @QCEventPlanning`;
  const url = `https://www.qceventplanning.com/awards/${certificate.id}`;
  const certUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : '';
  const month = new Date(certificate.date).getMonth() + 1;
  const year = new Date(certificate.date).getFullYear();
  const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
    certificate.name,
  )}&organizationName=${encodeURIComponent(
    certificate.schoolName,
  )}&certId=${encodeURIComponent(
    certificate.id,
  )}&issueMonth=${month}&issueYear=${year}&certUrl=${encodeURIComponent(
    certUrl,
  )}`;

  const actions = [
    {
      title: 'Add to LinkedIn Profile',
      subtitle: 'Licenses & Certifications Section',
      description:
      "Add this verified credential to your LinkedIn profile's Licenses & Certifications section. It makes your profile highly searchable for recruiters and instantly signals your expertise.",
      buttonText: 'Add Credential',
      styling: styles.linkedin,
      link: linkedInUrl,
      icon: <FaLinkedinIn size={22} color="white" />,
    },

    {
      title: 'Download PDF',
      subtitle: 'Official Verified Document',
      styling: styles.blackBtn,
      description:
      'Download a high-quality PDF suitable for printing or adding to your portfolio. Perfect for framing or sharing with clients.',
      buttonText: 'Download Official PDF',
      link: `placeholder`,
      icon: <GrDownload color="white" />,
    },
    {
      title: 'Enjoy Alumni Benefits',
      subtitle: 'Lifetime Privileges & Savings',
      styling: styles.blackBtn,
      description:
      'Enjoy lifetime access to 50% off additional courses and 10% off QC Career School merchandise.',
      buttonText: 'See Merchandise',
      icon: <GiGraduateCap color="white" />,
    },
  ];

  return (
    <>
      <section className="position-relative overflow-hidden py-4 d-flex align-items-center" style={{ minHeight: '50vh' }}>
        <BackgroundImage src={Hero} />
        <div className="position-relative z-1 container text-center text-white">
          <h1 className="fw-bold mb-4">You Did It!</h1>
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-5">
              <div className="bg-white p-2 rounded-4 shadow text-black fw-bold mb-4">Congratulations, {certificate.name}!</div>
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
          <div className=" bg-white text-dark rounded-3 border border-1 p-4 mt-4 mb-4">CERTIFICATION ID: {certificate.id}</div>
        </div>
      </section>
      <div className="text-center">
        <CertificateWrapper name={certificate.name} schoolName={certificate.schoolName} courseName={certificate.courseName} registrarSignatureUrl={registrarSignature} directorSignatureUrl={directorSignature} date={certificate.date} />
      </div>
      <section>
        <div>
          <div className="bg-white text-dark rounded-3 border border-1 p-4 mt-4 mb-4 row justify-content-center">
            <div className="col-12 col-md-4">
              <p className="mb-0">CERTIFICATION ID</p>
              <p className="mb-0">{certificate.id}</p>
            </div>
            <div className="col-12 col-md-4">
              <p className="mb-0">DATE</p>
              <p className="mb-0">{certificate.date}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Next Steps</h2>
          <div className="row justify-content-center">
            {actions.map(action => (
              <div key={action.title} className="col-12 col-md-6 col-lg-4">
                <div className="p-4 h-100 d-flex flex-column">
                  <div className="d-flex gap-2">
                    <div
                      className={`rounded-3 d-flex align-items-center justify-content-center ${action.styling}`}
                      style={{ width: 40, height: 40 }}
                    >
                      {action.icon}
                    </div>

                    <div>
                      <h5 className="mb-0">{action.title}</h5>
                      <p>{action.subtitle}</p>
                    </div>
                  </div>

                  <p className="mt-2 flex-grow-1">
                    {action.description}
                  </p>

                  <a className={`btn btn-primary ${action.styling}`} href={action.link}>
                    {action.buttonText}
                  </a>
                </div>
              </div>
            ))}
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

const getCertificate = async (certificateId: string): Promise<Certificate> => {
  let award: Award;

  if (/^\d+$/u.test(certificateId)) {
    award = await fetchOldAward(parseInt(certificateId, 10));
  } else {
    award = await fetchAward(certificateId);
  }

  return {
    id: parseInt(award.submissionId, 10),
    name: award.name,
    schoolName: award.schoolName,
    courseName: award.courseName,
    date: award.created.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
  };
};
