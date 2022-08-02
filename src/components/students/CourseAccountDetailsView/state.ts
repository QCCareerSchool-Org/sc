import Big from 'big.js';

import type { CRMEnrollmentWithCourse } from '@/services/students/crmEnrollmentService';

export type State = {
  crmEnrollment?: CRMEnrollmentWithCourse & { meta: { discountedCost: number; balance: number; nextInstallment: Date | null } };
  form: {
    data: {
      amount: number;
      paymentMethodId: number | null;
    };
    validationMessages: {
      amount?: string;
      paymentMethodId?: string;
    };
    processingState: 'idle' | 'processing' | 'success' | 'error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: CRMEnrollmentWithCourse }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }
  | { type: 'AMOUNT_CHANGED'; payload: number };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED': {
      const discountedCost = Big(action.payload.cost).minus(action.payload.discount);
      const amountPaid = action.payload.transactions.filter(t => !t.extraCharge).reduce((prev, cur) => prev.plus(cur.amount), Big(0));
      const balance = discountedCost.minus(amountPaid);

      const paymentHour = 9;
      const paymentMinute = 45;

      const now = new Date();

      let nextInstallment: Date | null = null;
      if (action.payload.paymentPlan !== 'full' && balance.gt(0)) {
        if (action.payload.paymentFrequency === 'monthly') {
          const paymentDay = action.payload.paymentDay ?? action.payload.paymentStart?.getDate() ?? null;
          if (paymentDay !== null) {
            const thisYear = now.getFullYear();
            const thisMonth = now.getMonth();
            const lastDayOfThisMonth = new Date(thisYear, thisMonth + 1, 0).getDate();
            const thisMonthPaymentDay = Math.min(paymentDay, lastDayOfThisMonth);
            nextInstallment = new Date(thisYear, thisMonth, thisMonthPaymentDay, paymentHour, paymentMinute);
            if (nextInstallment.getTime() <= now.getTime()) {
              const lastDayOfNextMonth = new Date(thisYear, thisMonth + 2, 0).getDate();
              const nextMonthPaymentDay = Math.min(paymentDay, lastDayOfNextMonth);
              nextInstallment = new Date(thisYear, thisMonth + 1, nextMonthPaymentDay, paymentHour, paymentMinute);
            }
          }
        } else if (action.payload.paymentFrequency === 'weekly') {
          if (action.payload.paymentStart) {
            nextInstallment = new Date(action.payload.paymentStart.getFullYear(), action.payload.paymentStart.getMonth(), action.payload.paymentStart.getDate(), paymentHour, paymentMinute);
            while (nextInstallment.getTime() < now.getTime()) {
              nextInstallment.setDate(nextInstallment.getDate() + 7);
            }
          }
        } else if (action.payload.paymentFrequency === 'biWeekly') {
          if (action.payload.paymentStart) {
            nextInstallment = new Date(action.payload.paymentStart.getFullYear(), action.payload.paymentStart.getMonth(), action.payload.paymentStart.getDate(), paymentHour, paymentMinute);
            while (nextInstallment.getTime() < now.getTime()) {
              nextInstallment.setDate(nextInstallment.getDate() + 7);
            }
          }
        }
      }

      return {
        ...initialState,
        form: {
          ...initialState.form,
          data: {
            ...initialState.form.data,
            amount: Math.min(action.payload.installment, balance.toNumber()),
            paymentMethodId: action.payload.paymentMethods.find(p => p.primary)?.paymentMethodId ?? null,
          },
          processingState: 'idle',
          errorMessage: undefined,
        },
        crmEnrollment: { ...action.payload, meta: { discountedCost: discountedCost.toNumber(), balance: balance.toNumber(), nextInstallment } },
      };
    }
    case 'LOAD_DATA_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'AMOUNT_CHANGED':
      return {
        ...state,
        form: { ...state.form, data: { ...state.form.data, amount: action.payload } },
      };
  }
};

export const initialState: State = {
  error: false,
  form: {
    data: { amount: 0, paymentMethodId: null },
    validationMessages: {},
    processingState: 'idle',
  },
};
