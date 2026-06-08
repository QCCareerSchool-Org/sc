import CertificateClient from './certificateClient';

interface PageProps {
  params: Promise<{
    signature: string;
  }>;
}

const CertificatePage = async ({ params }: PageProps) => {
  const { signature } = await params;
  return <CertificateClient signature={signature} />;
};

export default CertificatePage;
