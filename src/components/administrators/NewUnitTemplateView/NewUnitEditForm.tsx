import { memo, ReactElement } from 'react';
import { Subject } from 'rxjs';
import { State } from './state';
import { NewUnitTemplatePayload } from '@/services/administrators';

type Props = {
  save$: Subject<{ processingState: State['form']['processingState']; payload: NewUnitTemplatePayload }>;
  delete$: Subject<State['form']['processingState']>;
};

export const NewUnitEditForm = memo(({ save$, delete$ }: Props): ReactElement => {
  return (
    <>edit</>
  );
});

NewUnitEditForm.displayName = 'NewUnitEditForm';
