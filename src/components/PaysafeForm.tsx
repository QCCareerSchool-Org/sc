import type { MouseEventHandler, ReactElement } from 'react';
import { memo, useEffect, useId, useRef, useState } from 'react';

import type { PaysafeInstance, TokenizeOptions } from '../paysafe';
import { createInstance, tokenize } from '../paysafe';
import { Spinner } from './Spinner';

type Props = {
  currencyCode: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string | null;
  city: string;
  provinceCode: string | null;
  postalCode: string | null;
  countryCode: string;
  buttonText: string;
  submitting: boolean;
  onTokenize: (company: string, singleUseToken: string) => void;
  onChange?: () => void;
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

/** Stip colons because Paysafe can't handle selectors with colons in them */
const santizeId = (id: string): string => id.replace(/:/gu, '');

/**
 * A form for tokenizing credit cards with Paysagfe.js
 *
 * Always set the `key` prop equal to the currency code so that this component
 * is recreated from scratch each time the currency code changes
 */
export const PaysafeForm = memo((props: Props): ReactElement | null => {
  const id = useId();

  const [ client, setClient ] = useState(false);

  const panRef = useRef<HTMLDivElement>(null);
  const expRef = useRef<HTMLDivElement>(null);
  const cvvRef = useRef<HTMLDivElement>(null);

  const { currencyCode, onTokenize, onChange } = props;

  let company: 'CA' | 'US' | 'GB';
  if (currencyCode === 'USD') {
    company = 'US';
  } else if (currencyCode === 'CAD') {
    company = 'CA';
  } else if ([ 'GBP', 'AUD', 'NZD' ].includes(currencyCode)) {
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
    if (!client) {
      setClient(true);
      return;
    }
    setState(s => ({ ...s, instanceState: 'uninitialized', instance: undefined }));

    const options = {
      environment: process.env.NODE_ENV === 'production' ? 'LIVE' : 'TEST',
      fields: {
        cardNumber: { selector: `#${santizeId(id)}_newCardPan` },
        expiryDate: { selector: `#${santizeId(id)}_newCardExpiry` },
        cvv: { selector: `#${santizeId(id)}_newCardCvv` },
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

    let localInstance: PaysafeInstance | undefined;

    createInstance(apiKeys[company], options).then(instance => {
      localInstance = instance;
      instance.fields('cardNumber').valid(() => setState(s => ({ ...s, panValid: true, panFilled: true })));
      instance.fields('expiryDate').valid(() => setState(s => ({ ...s, expValid: true, expFilled: true })));
      instance.fields('cvv').valid(() => setState(s => ({ ...s, cvvValid: true, cvvFilled: true })));
      instance.fields('cardNumber').invalid(() => setState(s => ({ ...s, panValid: false })));
      instance.fields('expiryDate').invalid(() => setState(s => ({ ...s, expValid: false })));
      instance.fields('cvv').invalid(() => setState(s => ({ ...s, cvvValid: false })));
      instance.fields('cardNumber expiryDate cvv').on('FieldValueChange', () => {
        setState(s => ({ ...s, errors: undefined }));
        onChange?.();
      });
      setState(s => ({ ...s, instance, instanceState: 'initialized' }));
    }).catch(() => {
      setState(s => ({ ...s, instanceState: 'error' }));
    });

    return () => {
      localInstance?.resetCardDetails();
      // we don't need to call replaceChildren on the divs because this component will be destroyed and recreated
      // every time the currency code changes by the parent setting the key prop to the currecny code
    };
  }, [ client, company, id, onChange ]);

  if (!client) {
    return null;
  }

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (!state.instance) {
      return;
    }
    setState(s => ({ ...s, submitting: true, errors: undefined }));
    let options: TokenizeOptions | undefined = undefined;
    if (company === 'GB' && currencyCode === 'GBP' && process.env.NODE_ENV === 'production') {
      const accountId = accounts[company][currencyCode];
      if (typeof accountId === 'undefined') {
        throw Error(`Currency ${currencyCode} not supported by ${company} company`);
      }
      options = {
        threeDS: {
          amount: 0,
          currency: currencyCode,
          accountId,
          useThreeDSecureVersion2: true,
        },
        vault: {
          holderName: `${props.firstName} ${props.lastName}`,
          shippingAddress: {
            recipientName: `${props.firstName} ${props.lastName}`,
            street: props.address1,
            city: props.city,
            country: props.countryCode,
            zip: props.postalCode ?? '0',
            shipMethod: 'S',
          },
        },
      };
      if (options.vault?.shippingAddress) { // always true, needed for typescript
        if (props.address2) {
          options.vault.shippingAddress.street2 = props.address2;
        }
        if (props.provinceCode) {
          options.vault.shippingAddress.state = props.provinceCode;
        }
      }
    }
    tokenize(state.instance, options).then(singleUseToken => {
      onTokenize(company, singleUseToken);
    }).catch(err => {
      if (err !== null && typeof err === 'object') {
        setState(s => ({ ...s, errors: err as Record<string, unknown> }));
      }
      console.error('tokenize error', err);
    });
  };

  const disabled = props.submitting || !(state.instance && state.panFilled && state.expFilled && state.cvvFilled && state.panValid && state.expValid && state.cvvValid);

  return (
    <>
      <div className="mb-4 dd">
        <label htmlFor={santizeId(id) + '_newCardPan'}>Credit/Debit Card Number</label>
        <div ref={panRef} className={'form-control' + (state.panFilled && !state.panValid ? ' is-invalid' : '')} style={{ height: '36px', paddingTop: 0, paddingBottom: 0, paddingRight: 0 }} id={santizeId(id) + '_newCardPan'} />
      </div>
      <div className="row g-3">
        <div className="col-6">
          <div className="mb-4">
            <label htmlFor={santizeId(id) + '_newCardExpiry'}>Exp. Date</label>
            <div ref={expRef} className={'form-control' + (state.expFilled && !state.expValid ? ' is-invalid' : '')} style={{ height: '36px', paddingTop: 0, paddingBottom: 0, paddingRight: 0 }} id={santizeId(id) + '_newCardExpiry'} />
          </div>
        </div>
        <div className="col-6">
          <div className="mb-4">
            <label htmlFor={santizeId(id) + '_newCardCvv'}>CSC</label>
            <div ref={cvvRef} className={'form-control' + (state.cvvFilled && !state.cvvValid ? ' is-invalid' : '')} style={{ height: '36px', paddingTop: 0, paddingBottom: 0, paddingRight: 0 }} id={santizeId(id) + '_newCardCvv'} />
          </div>
        </div>
      </div>
      <button onClick={handleButtonClick} type="button" className="btn btn-primary" style={{ width: 150 }} disabled={disabled}>
        {props.submitting ? <Spinner size="sm" /> : props.buttonText}
      </button>
      {state.errors && (
        <div className="alert alert-danger mt-3 mb-0">
          {state.errors.displayMessage ?? 'Unknown Error'}
        </div>
      )}
    </>
  );
});

PaysafeForm.displayName = 'PaysafeForm';
