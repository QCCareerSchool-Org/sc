import { type FC, useEffect, useState } from 'react';

import { RedditExpertSection } from './RedditSection';
import type { SchoolSlug } from '@/domain/school';
import { useAuthState } from '@/hooks/useAuthState';
import { useStudentServices } from '@/hooks/useStudentServices';

interface State {
  school?: SchoolSlug;
  schools: SchoolSlug[];
}

interface FacebookGroup {
  url: string;
  name: string;
}

const facebookGroups: Partial<Record<SchoolSlug, FacebookGroup>> = {
  makeup: { url: 'https://www.facebook.com/groups/qcmakeupacademyvc', name: 'QC Makeup Academy Virtual Community' },
  event: { url: 'https://www.facebook.com/groups/qceventschoolvc', name: 'QC Event School Virtual Community' },
  design: { url: 'https://www.facebook.com/groups/QCDesignSchoolVirtualClassroom', name: 'QC Design School Virtual Community' },
  pet: { url: 'https://www.facebook.com/groups/qcpetstudiesvirtualclassroom', name: 'QC Pet Studies Virtual Community' },
  wellness: { url: 'https://www.facebook.com/groups/qcwellnessvc', name: 'QC Wellness Studies Virtual Community' },
};

interface WorkshopSeries {
  name: string;
  src: string;
  title: string;
}

const workshopSeries: Partial<Record<SchoolSlug, WorkshopSeries>> = {
  makeup: {
    name: 'QC Makeup Academy',
    src: 'https://www.youtube.com/embed/videoseries?si=NX5x6cClllAAvFNk&list=PL6pqmTpxO7WBNhflQdKQGYS_CT4qC2umf',
    title: 'QC Makeup Academy Workshop Series',
  },
  event: {
    name: 'QC Event School',
    src: 'https://www.youtube.com/embed/videoseries?si=M9I1sGk0DOZrTsCH&list=PLWYYvKyONg0TxfGRI85RrXdJCMTmdwTXu',
    title: 'QC Event School Workshop Series',
  },
  design: {
    name: 'QC Design School',
    src: 'https://www.youtube.com/embed/videoseries?si=1r-axjeIVMYcQ-7n&list=PLNG6NxnVOh2YuyyQ4iWB_Awiq5PzOqOzQ',
    title: 'QC Design School Workshop Series',
  },
  pet: {
    name: 'QC Pet Studies',
    src: 'https://www.youtube.com/embed/videoseries?si=CMrwrOYoKh7Fyv4f&list=PLtnulAvzvluAcszJ-EiH3mTQ7TewjBYNI',
    title: 'QC Pet Studies Workshop Series',
  },
};

const initialState: State = { schools: [] };

const Community: FC = () => {
  const { studentId } = useAuthState();
  const { studentService } = useStudentServices();
  const [ state, dispatch ] = useState<State>(initialState);

  useEffect(() => {
    if (!studentId) {
      return;
    }

    const subscription = studentService.getStudent(studentId).subscribe(student => {
      const slugs = student.enrollments.map(e => e.course.school.slug);
      const uniqueSlugs = [ ...new Set(slugs) ] as SchoolSlug[];
      dispatch({
        schools: uniqueSlugs,
        school: uniqueSlugs[0],
      }); // update the state here based on the response
    });

    return () => { subscription.unsubscribe(); };
  }, [ studentService, studentId ]);

  if (!state.school) {
    return;
  }

  const hasWorkshopSeries =
    state.school === 'event' ||
    state.school === 'design' ||
    state.school === 'makeup' ||
    state.school === 'pet';

  return (
    <>
      {hasWorkshopSeries && <RedditExpertSection school={state.school} />}

      <section className="bg-white">
        <div className="container">
          <h2 className="h1">Join the Virtual Community</h2>
          <p>Meet and interact with fellow students across all programs in our private Facebook group. Ask questions, share insights, or just say hi—this is your space to connect.</p>
          {state.schools.map(slug => {
            const group = facebookGroups[slug];
            if (!group) { return null; } // skip if no facebook group for this school
            return <p key={slug}><a href={group.url}>{group.name}</a></p>;
          })}
        </div>
      </section>

      {hasWorkshopSeries && (
        <section>
          <div className="container">
            <h2>Live Expert Workshop Series</h2>
            <p className="lead">Expert Advice. Industry Insights. Real-World Success.</p>
            <p>Watch past live workshops featuring industry professionals sharing career advice, practical tips, and insider knowledge to help you succeed in the design industry.</p>
            {state.schools.map(slug => {
              const series = workshopSeries[slug];
              if (!series) { return null; }
              return (
                <div key={slug}>
                  <h3 className="h5 mt-2">{series.name}</h3>
                  <iframe
                    width="560"
                    height="315"
                    src={series.src}
                    title={series.title}
                    allowFullScreen
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
};

export default Community;
