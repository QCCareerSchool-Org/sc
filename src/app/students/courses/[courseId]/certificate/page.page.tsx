import { CertificatePageClient } from './certificatePageClient';

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

const CertificatePage = async ({ params }: PageProps) => {
  const { courseId } = await params;

  return (
    <CertificatePageClient courseId={courseId} />
  );
};

export default CertificatePage;
