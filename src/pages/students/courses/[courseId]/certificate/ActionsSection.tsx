import type { FC } from 'react';
import { FaLinkedinIn } from 'react-icons/fa';
import { GiGraduateCap } from 'react-icons/gi';
import { GrDownload } from 'react-icons/gr';

import styles from './ActionsSection.module.css';
import { DownloadButton } from './DownloadButton';

interface Props {
  certification?: string;
  graduationDate: Date;
  url: string;
}

export const ActionsSection: FC<Props> = ({ certification, graduationDate, url }) => {
  const linkedInUrl = getLinkedInUrl(graduationDate, url);

  const actions = [
    {
      title: 'Add to LinkedIn Profile',
      subtitle: 'Licenses & Certifications Section',
      description: `Update your LinkedIn Profile to add your ${certification} certification under "Licenses & Certifications." This designation instantly signals your expertise.`,
      buttonText: 'Add Credential',
      styling: styles.linkedin,
      link: linkedInUrl,
      icon: <FaLinkedinIn size={22} color="white" />,
    },
    {
      title: 'Download PDF',
      subtitle: 'Official Verified Document',
      styling: styles.blackBtn,
      description: 'Download a high-quality PDF suitable for printing or adding to your portfolio. Perfect for framing or sharing with clients.',
      button: <DownloadButton />,
      icon: <GrDownload color="white" />,
    },
    {
      title: 'Enjoy Alumni Benefits',
      subtitle: 'Lifetime Privileges & Savings',
      styling: styles.blackBtn,
      description: 'Enjoy lifetime access to 50% off additional courses and 10% off QC Career School merchandise.',
      buttonText: 'See Merchandise',
      link: 'https://shop.qccareerschool.com/',
      icon: <GiGraduateCap color="white" />,
    },
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-4">Next Steps</h2>
        <div className="row justify-content-center">
          {actions.map(action => (
            <div key={action.title} className="col-12 col-md-6 col-lg-4">
              <div className="p-4 h-100 d-flex flex-column">
                <div className="d-flex gap-2">
                  <div className={`rounded-3 d-flex align-items-center justify-content-center ${action.styling}`} style={{ width: 40, height: 40 }}>{action.icon}</div>
                  <div>
                    <h5 className="mb-0">{action.title}</h5>
                    <p>{action.subtitle}</p>
                  </div>
                </div>
                <p className="mt-2 flex-grow-1">{action.description}</p>
                {action.button ?? <a className={`btn btn-primary ${action.styling}`} href={action.link}>{action.buttonText}</a>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const getLinkedInUrl = (graduationDate: Date, url: string): string => {
  const month = new Date(graduationDate).getMonth() + 1;
  const year = new Date(graduationDate).getFullYear();

  const linkedInSearchParams = new URLSearchParams();
  linkedInSearchParams.append('startTask', 'CERTIFICATION_NAME');
  linkedInSearchParams.append('name', 'certificate.courseName');
  linkedInSearchParams.append('organizationName', 'certificate.schoolName');
  linkedInSearchParams.append('certId', 'certificate.signature');
  linkedInSearchParams.append('issueMonth', month.toString());
  linkedInSearchParams.append('issueYear', year.toString());
  linkedInSearchParams.append('certUrl', url);

  return `https://www.linkedin.com/profile/add?${linkedInSearchParams.toString()}`;
};
