import type { MouseEventHandler, ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';

import type { PaysafeInstance } from '../../../paysafe';
import { createInstance, tokenize } from '../../../paysafe';

type Props = {
  currencyCode: string;
  onTokenize: (paymentToken: string) => void;
};

type State = {
  instanceState: 'uninitialized' | 'initialized' | 'error';
  instance?: PaysafeInstance;
  panValid: boolean;
  expValid: boolean;
  cvvValid: boolean;
  panFilled: boolean;
  expFilled: boolean;
  cvvFilled: boolean;
  submitted?: boolean;
  errors?: { displayMessage?: string };
};

const apiKeys = {
  CA: 'T1QtMjM2NjU0OkItcDEtMC01OWY5ZTIzNS0wLTMwMmMwMjE0MzAzYTA1ZDYzNTYwMGMyMzBhNzdhMzk4MDU4NDkzY2I2NTFhOGI2NTAyMTQxOTBjMzM3NzhlZGFkMGVmNzQ4NDkzYjE5NDEyMzk2NGNkYjU3NGFh',
  US: 'T1QtMjM2NjU0OkItcDEtMC01OWY5ZTIzNS0wLTMwMmMwMjE0MzAzYTA1ZDYzNTYwMGMyMzBhNzdhMzk4MDU4NDkzY2I2NTFhOGI2NTAyMTQxOTBjMzM3NzhlZGFkMGVmNzQ4NDkzYjE5NDEyMzk2NGNkYjU3NGFh',
  GB: 'T1QtMzEyOTc0OkItcDEtMC01ZDFlMDAwYS0wLTMwMmMwMjE0NTY4ZmM1MjE4M2MyYTI3YWQ1MWMxNzA2NGVjM2Y1NjEwZDIwNjc0OTAyMTQ2ZTQ5OTBkOGM0MTY3NDlkZWZlYThiZGU2NDY3MDA2NGJlNDA1Njc3',
};

const accounts = {
  CA: {
    CAD: 1002521124,
    NZD: 1002567684,
    AUD: 1002567744,
    GBP: 1002567754,
  },
  US: {
    USD: 1002704564,
  },
  GB: {
    GBP: 1002659124,
    AUD: 1002649432,
    NZD: 1002818994,
  },
};

export const PaysafeForm = (props: Props): ReactElement => {
  // const id = useId(); // react 18
  const id = useRef('x' + Math.random().toString(32).slice(2));

  let company: 'CA' | 'US' | 'GB';
  if (props.currencyCode === 'USD') {
    company = 'US';
  } else if (props.currencyCode === 'CAD') {
    company = 'CA';
  } else if ([ 'GBP', 'AUD', 'NZD' ].includes(props.currencyCode)) {
    company = 'GB';
  } else {
    throw Error('Invalid currency');
  }

  const [ state, setState ] = useState<State>({
    instanceState: 'uninitialized',
    panValid: false,
    expValid: false,
    cvvValid: false,
    panFilled: false,
    expFilled: false,
    cvvFilled: false,
  });

  useEffect(() => {
    setState(s => ({ ...s, instanceState: 'uninitialized', instance: undefined }));

    const options = {
      environment: 'LIVE',
      fields: {
        cardNumber: { selector: `#${id.current}_newCardPan`, placeholder: 'Card Number' },
        expiryDate: { selector: `#${id.current}_newCardExpiry`, placeholder: 'Exp. Date' },
        cvv: { selector: `#${id.current}_newCardCvv`, placeholder: 'CSC' },
      },
      style: {
        input: {
          'font-family': 'Helvetica,Arial,sans-serif',
          'font-weight': 'normal',
          'font-size': '14px',
          'color': 'black',
        },
      },
    };

    createInstance(apiKeys[company], options).then(instance => {
      instance.fields('cardNumber').valid(() => setState(s => ({ ...s, panValid: true })));
      instance.fields('expiryDate').valid(() => setState(s => ({ ...s, expValid: true })));
      instance.fields('cvv').valid(() => setState(s => ({ ...s, cvvValid: true })));
      instance.fields('cardNumber').invalid(() => setState(s => ({ ...s, panValid: false })));
      instance.fields('expiryDate').invalid(() => setState(s => ({ ...s, expValid: false })));
      instance.fields('cvv').invalid(() => setState(s => ({ ...s, cvvValid: false })));
      instance.fields('cardNumber expiryDate cvv').on('FieldValueChange', () => setState(s => ({ ...s, submitted: false, errors: undefined })));
      instance.fields('cardNumber').on('Blur', () => setState(s => ({ ...s, panFilled: true })));
      instance.fields('expiryDate').on('Blur', () => setState(s => ({ ...s, expFilled: true })));
      instance.fields('cvv').on('Blur', () => setState(s => ({ ...s, cvvFilled: true })));
      setState(s => ({ ...s, instance }));
    }).catch(err => {
      console.error(err);
    });
  }, [ company ]);

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (!state.instance) {
      return;
    }
    tokenize(state.instance).then(paymentToken => {
      props.onTokenize(paymentToken);
    }).catch(err => {
      console.error(err);
    });
  };

  const disabled = !(state.instance && state.panFilled && state.expFilled && state.cvvFilled && state.panValid && state.expValid && state.cvvValid);

  return (
    <>
      <div id={id.current + '_newCardPan'} />
      <div id={id.current + '_newCardExpiry'} />
      <div id={id.current + '_newCardCvv'} />
      <button onClick={handleButtonClick} type="button" className="btn btn-primary" disabled={disabled}>Save Card</button>
    </>
  );
};
