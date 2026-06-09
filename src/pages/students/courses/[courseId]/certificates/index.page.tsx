import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import CertificateClient from './Client';

const CertificatePage: NextPage = () => {
  const router = useRouter();
  const { courseId } = router.query;

  if (typeof courseId !== 'string') {
    return <div>Invalid course ID</div>;
  }

  const courseIdNumber = parseInt(courseId, 10);
  if (isNaN(courseIdNumber)) {
    return <div>Course ID must be a number</div>;
  }

  console.log('Course ID:', courseIdNumber);

  return <CertificateClient courseId={courseIdNumber} />;
};

export default CertificatePage;
