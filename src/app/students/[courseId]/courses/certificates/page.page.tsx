import CertificateClient from './Client';

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

const CertificatePage = async ({ params }: PageProps) => {
  const { courseId } = await params;

  return <CertificateClient courseId={courseId} />;
};

export default CertificatePage;
