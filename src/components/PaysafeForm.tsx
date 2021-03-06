import type { MouseEventHandler, ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';

import type { PaysafeInstance, TokenizeOptions } from '../paysafe';
import { createInstance, tokenize } from '../paysafe';

type Props = {
  currencyCode: string;
  onTokenize: (singleUseToken: string) => void;
  buttonText: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string | null;
  city: string;
  provinceCode: string | null;
  postalCode: string | null;
  countryCode: string;
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

const apiKeys = process.env.NODE_ENV === 'production'
  ? {
    CA: 'T1QtMjM2NjU0OkItcDEtMC01OWY5ZTIzNS0wLTMwMmMwMjE0MzAzYTA1ZDYzNTYwMGMyMzBhNzdhMzk4MDU4NDkzY2I2NTFhOGI2NTAyMTQxOTBjMzM3NzhlZGFkMGVmNzQ4NDkzYjE5NDEyMzk2NGNkYjU3NGFh',
    US: 'T1QtMjM2NjU0OkItcDEtMC01OWY5ZTIzNS0wLTMwMmMwMjE0MzAzYTA1ZDYzNTYwMGMyMzBhNzdhMzk4MDU4NDkzY2I2NTFhOGI2NTAyMTQxOTBjMzM3NzhlZGFkMGVmNzQ4NDkzYjE5NDEyMzk2NGNkYjU3NGFh',
    GB: 'T1QtMzEyOTc0OkItcDEtMC01ZDFlMDAwYS0wLTMwMmMwMjE0NTY4ZmM1MjE4M2MyYTI3YWQ1MWMxNzA2NGVjM2Y1NjEwZDIwNjc0OTAyMTQ2ZTQ5OTBkOGM0MTY3NDlkZWZlYThiZGU2NDY3MDA2NGJlNDA1Njc3',
  }
  : {
    CA: 'T1QtNzkwMTA6Qi1xYTItMC01OGUyOTQ0Yy0wLTMwMmQwMjE0M2VlZjg5YTcwMTEzZTNjNGY1MGI0MjdjYzU1N2NlOTQ1ZjRlMjRhNTAyMTUwMDk1YTNlMjc1N2M4MjMwOGNjYzNkODhiOGRhNWY1NDdlYzVhOTU5M2M=',
    US: 'T1QtNzkwMTA6Qi1xYTItMC01OGUyOTQ0Yy0wLTMwMmQwMjE0M2VlZjg5YTcwMTEzZTNjNGY1MGI0MjdjYzU1N2NlOTQ1ZjRlMjRhNTAyMTUwMDk1YTNlMjc1N2M4MjMwOGNjYzNkODhiOGRhNWY1NDdlYzVhOTU5M2M=',
    GB: 'T1QtNzkwMTA6Qi1xYTItMC01OGUyOTQ0Yy0wLTMwMmQwMjE0M2VlZjg5YTcwMTEzZTNjNGY1MGI0MjdjYzU1N2NlOTQ1ZjRlMjRhNTAyMTUwMDk1YTNlMjc1N2M4MjMwOGNjYzNkODhiOGRhNWY1NDdlYzVhOTU5M2M=',
  };

const accounts = process.env.NODE_ENV === 'production'
  ? {
    CA: { CAD: 1002521124 },
    US: { USD: 1002704564 },
    GB: { GBP: 1002659124, AUD: 1002649432, NZD: 1002818994 },
  }
  : {
    CA: { CAD: 1001091500 },
    US: { USD: 1001091500 },
    GB: { GBP: 1001091500, AUD: 1001091500, NZD: 1001091500 },
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
      environment: process.env.NODE_ENV === 'production' ? 'LIVE' : 'TEST',
      fields: {
        cardNumber: { selector: `#${id.current}_newCardPan` },
        expiryDate: { selector: `#${id.current}_newCardExpiry` },
        cvv: { selector: `#${id.current}_newCardCvv` },
      },
      style: {
        input: {
          'font-family': `'Open Sans',Helvetica,Arial,sans-serif`,
          'font-weight': 'normal',
          'font-size': '1rem',
          'line-height': '1.5rem',
          'color': '#212529',
        },
      },
    };

    createInstance(apiKeys[company], options).then(instance => {
      instance.fields('cardNumber').valid(() => setState(s => ({ ...s, panValid: true, panFilled: true })));
      instance.fields('expiryDate').valid(() => setState(s => ({ ...s, expValid: true, expFilled: true })));
      instance.fields('cvv').valid(() => setState(s => ({ ...s, cvvValid: true, cvvFilled: true })));
      instance.fields('cardNumber').invalid(() => setState(s => ({ ...s, panValid: false })));
      instance.fields('expiryDate').invalid(() => setState(s => ({ ...s, expValid: false })));
      instance.fields('cvv').invalid(() => setState(s => ({ ...s, cvvValid: false })));
      instance.fields('cardNumber expiryDate cvv').on('FieldValueChange', () => setState(s => ({ ...s, submitted: false, errors: undefined })));
      setState(s => ({ ...s, instance }));
    }).catch(err => {
      console.error(err);
    });
  }, [ company ]);

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (!state.instance) {
      return;
    }
    let options: TokenizeOptions | undefined = undefined;
    if (company === 'GB' && props.currencyCode === 'GBP' && process.env.NODE_ENV === 'production') {
      const accountId = accounts[company][props.currencyCode];
      if (typeof accountId === 'undefined') {
        throw Error(`Currency ${props.currencyCode} not supported by ${company} company`);
      }
      options = {
        threeDS: {
          amount: 0,
          currency: props.currencyCode,
          accountId,
          useThreeDSecureVersion2: true,
        },
        vault: {
          holderName: `${props.firstName} ${props.lastName}`,
          shippingAddress: {
            recipientName: `${props.firstName} ${props.lastName}`,
            street: props.address1,
            street2: props.address2 ?? undefined,
            city: props.city,
            country: props.countryCode,
            zip: props.postalCode ?? '0',
            state: props.provinceCode ?? undefined,
            shipMethod: 'S',
          },
        },
      };
    }
    tokenize(state.instance, options).then(singleUseToken => {
      props.onTokenize(singleUseToken);
    }).catch(err => {
      if (err !== null && typeof err === 'object') {
        setState(s => ({ ...s, errors: err as Record<string, unknown> }));
      } else {
        console.error('unknown error', err);
      }
    });
  };

  const disabled = !(state.instance && state.panFilled && state.expFilled && state.cvvFilled && state.panValid && state.expValid && state.cvvValid);

  return (
    <>
      <div className="mb-4">
        <label htmlFor={id.current + '_newCardPan'}>Credit/Debit Card Number</label>
        <div className={'form-control' + ((state.submitted || state.panFilled) && !state.panValid ? ' is-invalid' : '')} style={{ height: '36px', paddingTop: 0, paddingBottom: 0, paddingRight: 0 }} id={id.current + '_newCardPan'} />
      </div>
      <div className="row g-3">
        <div className="col-6">
          <div className="mb-4">
            <label htmlFor={id.current + '_newCardExpiry'}>Exp. Date</label>
            <div className={'form-control' + ((state.submitted || state.expFilled) && !state.expValid ? ' is-invalid' : '')} style={{ height: '36px', paddingTop: 0, paddingBottom: 0, paddingRight: 0 }} id={id.current + '_newCardExpiry'} />
          </div>
        </div>
        <div className="col-6">
          <div className="mb-4">
            <label htmlFor={id.current + '_newCardCvv'}>CSC</label>
            <div className={'form-control' + ((state.submitted || state.cvvFilled) && !state.cvvValid ? ' is-invalid' : '')} style={{ height: '36px', paddingTop: 0, paddingBottom: 0, paddingRight: 0 }} id={id.current + '_newCardCvv'} />
          </div>
        </div>
      </div>
      <button onClick={handleButtonClick} type="button" className="btn btn-primary" disabled={disabled}>{props.buttonText}</button>
      {state.errors && (
        <div className="alert alert-danger mt-3 mb-0">
          {state.errors.displayMessage ?? 'Unknown Error'}
        </div>
      )}
    </>
  );
};
