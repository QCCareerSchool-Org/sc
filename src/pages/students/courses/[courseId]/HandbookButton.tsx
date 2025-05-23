import Link from 'next/link';
import type { FC } from 'react';

import { FaDownload } from 'react-icons/fa';
import type { Course } from '@/domain/course';
import type { School, SchoolName } from '@/domain/school';
import type { Variant, VariantName } from '@/domain/variant';

type Props = {
  course: Course & { school: School; variant: Variant | null };
};

export const HandbookButton: FC<Props> = ({ course }) => {
  const link = getLink(course.school.name, course.variant?.name);

  if (link) {
    return (
      <div className="mt-4">
        <Link href={link} target="_blank" rel="noreferrer"><button className="btn btn-lg btn-red">Student Handbook <FaDownload /></button></Link>
      </div>
    );
  }

  return null;
};

const getLink = (schoolName: SchoolName, variantName?: VariantName): string | null => {
  if (schoolName === 'QC Design School') {
    return '/student-handbooks/qc-design-school/content/index.html';
  }

  if (schoolName === 'QC Event School') {
    return '/student-handbooks/qc-event-school/content/index.html';
  }

  if (schoolName === 'QC Makeup Academy') {
    return '/student-handbooks/qc-makeup-academy/content/index.html';
  }

  if (schoolName === 'QC Pet Studies') {
    if (variantName === 'EarthWise Pet') {
      return '/student-handbooks/earthwise-pet/content/index.html';
    }
    return '/student-handbooks/qc-pet-studies/content/index.html';
  }

  if (schoolName === 'QC Wellness Studies') {
    return '/student-handbooks/qc-wellness-studies/content/index.html';
  }

  return null;
};
