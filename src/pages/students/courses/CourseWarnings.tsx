import type { FC } from 'react';
import type { Course } from '@/domain/course';

type Props = {
  courses: Course[];
};

export const CourseWarnings: FC<Props> = ({ courses }) => {
  const courseExists = (courseCode: string): boolean => courses.findIndex(c => c.code === courseCode) !== -1;

  const i2 = courseExists('A');
  const ms = courseExists('M');
  const ap = courseExists('AP');

  const mz = courseExists('MZ');
  const mw = courseExists('MW');
  const vm = courseExists('VM');

  return (
    <>
      {i2 && (ms || ap) && (
        <div className="alert alert-info" role="alert">
          <><strong>Important note:</strong> </>
          {!ap ?
            <><em>Staging for Designers</em> builds </>
            : !ms
              ? <><em>Aging in Place</em> builds </>
              : <>both <em>Staging for Designers</em> and <em>Aging in Place</em> build </>
          }
          <>on the concepts covered in <em>Interior Decorating</em>. Please complete your <em>Interior Decorating</em> course before starting </>
          {!ap ?
            <em>Staging for Designers</em>
            : !ms
              ? <em>Aging in Place</em>
              : <>your advanced courses</>
          }
        </div>
      )}
      {mz && (mw || vm) && (
        <div className="alert alert-info" role="alert">
          <><strong>Important note:</strong> </>
          {!vm ?
            <><em>Pro Makeup Workshop</em> builds </>
            : !vm
              ? <><em>Virtual Makeup</em> builds </>
              : <>both <em>Pro Makeup Workshop</em> and <em>Virtual Makeup</em> build </>
          }
          <>on the concepts covered in <em>Master Makeup Artistry</em>. Please complete your <em>Master Makeup Artistry</em> course before starting </>
          {!vm ?
            <em>Pro Makeup Workshop</em>
            : !vm
              ? <em>Virtual Makeup</em>
              : <>your advanced courses</>
          }
        </div>
      )}
    </>
  );
};
