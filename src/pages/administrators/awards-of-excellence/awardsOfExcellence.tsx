import type { ChangeEventHandler, FC, FormEventHandler } from 'react';
import { useId, useState } from 'react';
import { AwardsTable } from './awardsTable';
import { Spinner } from '@/components/Spinner';
import type { Award } from '@/domain/award';
import { useAdminServices } from '@/hooks/useAdminServices';

type Props = {
  administratorId: number;
};

export const AwardsOfExcellence: FC<Props> = ({ administratorId }) => {
  const previousSunday = getPreviousSundayMidnight();
  const sundayBeforeThat = new Date(previousSunday);
  sundayBeforeThat.setDate(sundayBeforeThat.getDate() - 7);

  const { awardService } = useAdminServices();
  const id = useId();
  const [ state, setState ] = useState<'ready' | 'fetching' | 'success' | 'error'>('ready');
  const [ startDate, setStartDate ] = useState<Date>(sundayBeforeThat);
  const [ endDate, setEndDate ] = useState<Date>(previousSunday);

  const [ awards, setAwards ] = useState<Award[]>([]);

  const handleStartDateChange: ChangeEventHandler<HTMLInputElement> = e => {
    const target = e.target;
    setStartDate(new Date(target.value));
  };

  const handleEndDateChange: ChangeEventHandler<HTMLInputElement> = e => {
    const target = e.target;
    setEndDate(new Date(target.value));
  };

  const handleSubmit: FormEventHandler = e => {
    e.preventDefault();
    setState('fetching');
    awardService.getAllAwards(administratorId, startDate, endDate).subscribe({
      next: a => {
        setAwards(a);
        setState('success');
      },
      error: () => setState('error'),
    });
  };

  return (
    <>
      <section>
        <div className="container">
          <h1>Awards of Excellence</h1>
          <div className="row">
            <div className="col-6 col-md-4 col-lg-3 col-xl-2">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor={`start${id}`} className="form-label">Start Date</label>
                  <input id={`start${id}`} type="date" name="startDate" value={startDate.toISOString().split('T')[0]} onChange={handleStartDateChange} className="form-control" />
                </div>
                <div className="mb-3">
                  <label htmlFor={`end${id}`} className="form-label">End Date</label>
                  <input id={`end${id}`} type="date" name="endDate" value={endDate.toISOString().split('T')[0]} onChange={handleEndDateChange} className="form-control" />
                </div>
                <div className="d-flex align-items-center">
                  <button type="submit" className="btn btn-primary">Search</button>
                  {state === 'fetching' && <div className="ms-2"><Spinner size="sm" /></div>}
                  {state === 'error' && <div className="ms-2 text-danger">Error fetching data.</div>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      {state === 'success' && (
        <section>
          <div className="container">
            <h2>Results</h2>
            <AwardsTable awards={awards} />
          </div>
        </section>
      )}
    </>
  );
};

const getPreviousSundayMidnight = (): Date => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

  // Calculate how many days to subtract to get to the previous Sunday
  const daysToSubtract = dayOfWeek; // If today is Sunday, this will subtract 0

  // Create new Date object and set to midnight
  const previousSunday = new Date(now);
  previousSunday.setDate(now.getDate() - daysToSubtract);
  previousSunday.setHours(0, 0, 0, 0);

  return previousSunday;
};
