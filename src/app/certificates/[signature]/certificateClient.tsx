'use client';
import { useEffect, useState } from 'react';

import directorSignature from '../../kayla.svg';
import registrarSignature from '../../lucie.svg';
import type { Certificate } from '@/domain/certificate';
import { useServices } from '@/hooks/useServices';
import { CertificateWrapper } from 'src/app/students/courses/[courseId]/certificate/CertificateWrapper';

interface PageProps {
  signature: string;
}

const CertificateClient = ({ signature }: PageProps) => {
  const { certificateService } = useServices();

  const [ certificate, setCertificate ] = useState<Certificate | null>(null);
  const [ error, setError ] = useState(false);

  useEffect(() => {
    const subscription = certificateService.getCertificate(signature).subscribe({
      next: data => setCertificate(data),
      error: () => setError(true),
    });

    return () => subscription.unsubscribe();
  }, [ signature, certificateService ]);

  if (error) {
    console.log(error);
    return (<div>Certificate not found</div>);
  }
  if (!certificate) {
    return (<div>Loading...</div>);
  }

  return (
    <>
      <section>
        <div className="container text-center">
          <div className=" bg-white text-dark rounded-3 border border-1 p-4 mt-4 mb-4">
            CERTIFICATION ID: {certificate.signature}
          </div>
        </div>
      </section>
      <div className="text-center">
        <div
          className="mx-auto"
          style={{
            maxWidth: '1200px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
          }}
        >
          <CertificateWrapper
            name={certificate.firstName + ' ' + certificate.lastName}
            schoolName={certificate.schoolName}
            courseName={certificate.courseName}
            registrarSignatureUrl={registrarSignature}
            directorSignatureUrl={directorSignature}
            date={certificate.graduationDate}
          />
        </div>
      </div>
      <section>
        <div>
          <div className="bg-white text-dark rounded-3 border border-1 p-4 mt-4 mb-4 row justify-content-center">
            <div className="col-12 col-md-4">
              <p className="mb-0">CERTIFICATION ID</p>
              <p className="mb-0">{certificate.signature}</p>
            </div>
            <div className="col-12 col-md-4">
              <p className="mb-0">DATE</p>
              <p className="mb-0">
                {certificate.graduationDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CertificateClient;
