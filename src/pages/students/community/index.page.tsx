import { RedditExpertSection } from './RedditSection';
import { useAuthState } from '@/hooks/useAuthState';

const Community = () => {
  const authState = useAuthState();
  const studentType = authState.studentType;
  const hasWorkshopSeries =
    studentType === 'event' ||
    studentType === 'design' ||
    studentType === 'makeup' ||
    studentType === 'pet';
  return (
    <>
      {hasWorkshopSeries && (
        <RedditExpertSection school={studentType} />
      )}
      <section className="bg-white">
        <div className="container">
          <h2 className="h1">Join the Virtual Community</h2>

          <p>
            Meet and interact with fellow students across all programs in our
            private Facebook group. Ask questions, share insights, or just say
            hi—this is your space to connect.
          </p>

          {studentType === 'makeup' ? (
            <p>
              <a href="https://www.facebook.com/groups/qcmakeupacademyvc">
                QC Makeup Academy Virtual Community
              </a>
            </p>
          ) : null}

          {studentType === 'event' && (
            <p>
              <a href="https://www.facebook.com/groups/qceventschoolvc">
                QC Event School Virtual Community
              </a>
            </p>
          )}

          {studentType === 'design' && (
            <p>
              <a href="https://www.facebook.com/groups/QCDesignSchoolVirtualClassroom">
                QC Design School Virtual Community
              </a>
            </p>
          )}

          {studentType === 'pet' && (
            <p>
              <a href="https://www.facebook.com/groups/qcpetstudiesvirtualclassroom">
                QC Pet Studies Virtual Community
              </a>
            </p>
          )}

          {studentType === 'wellness' && (
            <p>
              <a href="https://www.facebook.com/groups/qcwellnessvc">
                QC Wellness Studies Virtual Community
              </a>
            </p>
          )}
        </div>
      </section>

      {hasWorkshopSeries && (
        <section>
          <div className="container">
            <h2>Live Expert Workshop Series</h2>

            <p className="lead">
              Expert Advice. Industry Insights. Real-World Success.
            </p>

            <p>
              Watch past live workshops featuring industry professionals
              sharing career advice, practical tips, and insider knowledge to
              help you succeed in the design industry.
            </p>

            {studentType === 'makeup' && (
              <>
                <h3 className="h5 mt-2">QC Makeup Academy</h3>
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/videoseries?si=NX5x6cClllAAvFNk&list=PL6pqmTpxO7WBNhflQdKQGYS_CT4qC2umf"
                  title="QC Makeup Academy Workshop Series"
                  allowFullScreen
                />
              </>
            )}

            {studentType === 'event' && (
              <>
                <h3 className="h5 mt-2">QC Event School</h3>
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/videoseries?si=M9I1sGk0DOZrTsCH&list=PLWYYvKyONg0TxfGRI85RrXdJCMTmdwTXu"
                  title="QC Event School Workshop Series"
                  allowFullScreen
                />
              </>
            )}

            {studentType === 'design' && (
              <>
                <h3 className="h5 mt-2">QC Design School</h3>
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/videoseries?si=1r-axjeIVMYcQ-7n&list=PLNG6NxnVOh2YuyyQ4iWB_Awiq5PzOqOzQ"
                  title="QC Design School Workshop Series"
                  allowFullScreen
                />
              </>
            )}

            {studentType === 'pet' && (
              <>
                <h3 className="h5 mt-2">QC Pet Studies</h3>
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/videoseries?si=CMrwrOYoKh7Fyv4f&list=PLtnulAvzvluAcszJ-EiH3mTQ7TewjBYNI"
                  title="QC Pet Studies Workshop Series"
                  allowFullScreen
                />
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default Community;
