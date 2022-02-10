import { NextPage } from 'next';
import React, { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { Button } from '../components/styled/Button';
import { Col } from '../components/styled/Col';
import { Container } from '../components/styled/Container';
import { FormGroup } from '../components/styled/FormGroup';
import { Heading } from '../components/styled/Heading';
import { Input } from '../components/styled/Input';
import { Label } from '../components/styled/Label';
import { PageTitle } from '../components/styled/PageTitle';
import { Paragraph } from '../components/styled/Paragraph';
import { Row } from '../components/styled/Row';
import { Section } from '../components/styled/Section';

const LoginPage: NextPage = () => {
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ submitting, setSubmitting ] = useState(false);

  const formSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    const url = 'https://api.qccareerschool.com/';
  };

  const usernameChange: ChangeEventHandler<HTMLInputElement> = e => {
    setUsername(e.target.value);
  };

  const passwordChange: ChangeEventHandler<HTMLInputElement> = e => {
    setPassword(e.target.value);
  };

  return (
    <Section>
      <Container>
        <PageTitle>Student Center Login</PageTitle>
        <Row>
          <Col cols={6}>
            <form onSubmit={formSubmit}>
              <FormGroup>
                <Label htmlFor="username">Username / Student Number</Label>
                <Input type="text" id="username" name="username" required value={username} onChange={usernameChange} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" name="password" required value={password} onChange={passwordChange} />
              </FormGroup>
              <Button type="submit">Log In</Button>
            </form>
          </Col>
          <Col cols={6}>
            <Heading>Missing your username or password?</Heading>
            <Paragraph>You'll find your username and password in your welcome email from the School or call us at 1-833-600-3751 and one of our student support specialists will be happy to help.</Paragraph>
            <Button variant="secondary">Forgot Your Password?</Button>
          </Col>
        </Row>
      </Container>
    </Section>
  );
};

export default LoginPage;
