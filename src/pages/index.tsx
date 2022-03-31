import type { NextPage } from 'next';

import { useState } from 'react';
import { Section } from '@/components/Section';

let error = false;

const mightThrow = (): number => {
  const rand = Math.random();
  console.log('generating number', rand);
  if (rand >= 0.80) {
    error = true;
  }
  if (error) {
    throw Error('oh no!');
  }
  return rand;
};

const Home: NextPage = () => {
  console.log('home render');
  const [ counter, setCounter ] = useState(0);
  const rand = mightThrow();
  console.log(rand);
  return (
    <Section>
      <div className="container">
        <h1>Student Center {rand}</h1>
        <p>{counter}</p>
        <button onClick={() => setCounter(c => c + 1)}>+</button>
      </div>
    </Section>
  );
};

export default Home;
