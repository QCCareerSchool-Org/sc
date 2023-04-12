import type { NextPage } from 'next';

import { Meta } from '@/components/Meta';
import { CreatePasswordResetRequest } from '@/components/passwordResets/CreatePasswordResetRequest';

const CreatePasswordResetPage: NextPage = () => (
  <>
    <Meta title="Password Reset Request" />
    <CreatePasswordResetRequest />
  </>
);

export default CreatePasswordResetPage;
