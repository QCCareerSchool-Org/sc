import type { NextPage } from 'next';
import Link from 'next/link';

import { Button } from '../components/styled/Button';
import { Container } from '../components/styled/Container';
import { Paragraph } from '../components/styled/Paragraph';
import { Section } from '../components/styled/Section';
import { TextLink } from '../components/styled/TextLink';
import { useAuthDispatch } from '../hooks/useAuthDispatch';
import { useAuthState } from '../hooks/useAuthState';

const Home: NextPage = () => {
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();

  console.log('page rendered');
  return (
    <Section>
      <Container>
        <Paragraph><Button onClick={() => authDispatch({ type: 'STUDENT_LOG_IN', payload: 4 })}>Student</Button></Paragraph>
        <Paragraph><Button onClick={() => authDispatch({ type: 'TUTOR_LOG_IN', payload: 23 })}>Tutor</Button></Paragraph>
        <Paragraph><Link href="/" passHref><TextLink>home</TextLink></Link></Paragraph>
        {authState.studentId}
      </Container>
    </Section>
  );
};

export default Home;
