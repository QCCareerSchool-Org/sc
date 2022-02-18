import type { NextPage } from 'next';
import Link from 'next/link';

import { useAuthDispatch } from '../hooks/useAuthDispatch';
import { useAuthState } from '../hooks/useAuthState';

const Home: NextPage = () => {
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();

  return (
    <section>
      <div className="container">
        <p><button onClick={() => authDispatch({ type: 'STUDENT_LOG_IN', payload: 4 })} className="btn btn-primary">Student</button></p>
        <p><button onClick={() => authDispatch({ type: 'TUTOR_LOG_IN', payload: 23 })} className="btn btn-primary">Tutor</button></p>
        <p><Link href="/"><a className="link-primary">home</a></Link></p>
        {authState.studentId}
      </div>
    </section>
  );
};

export default Home;
