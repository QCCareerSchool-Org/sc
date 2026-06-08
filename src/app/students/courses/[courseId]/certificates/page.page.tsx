import CertificateClient from './Client';

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

const CertificatePage = async ({ params }: PageProps) => {
  const { courseId } = await params;
  console.log('Course ID:', courseId);

  return <CertificateClient courseId={courseId} />;
};

export default CertificatePage;
