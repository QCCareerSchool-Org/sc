import type { NextPage } from 'next';

import { CreatePasswordResetRequest } from './CreatePasswordResetRequest';
import { Meta } from '@/components/Meta';

const CreatePasswordResetPage: NextPage = () => (
  <>
    <Meta title="Password Reset Request" />
    <CreatePasswordResetRequest />
  </>
);

export default CreatePasswordResetPage;
