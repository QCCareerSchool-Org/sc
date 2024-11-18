import { Big } from 'big.js';

import type { CRMEnrollment } from '@/domain/student/crm/crmEnrollment';
import type { CRMPaymentMethod } from '@/domain/student/crm/crmPaymentMethod';
import type { CRMTransaction } from '@/domain/student/crm/crmTransaction';
import type { CRMEnrollmentWithCourse } from '@/services/students/crmEnrollmentService';

type MetaData = { discountedCost: number; balance: number; nextInstallment: Date | null };

export type State = {
  crmEnrollment?: CRMEnrollmentWithCourse & { meta: MetaData };
  form: {
    data: {
      amount: number;
      paymentMethodId: number | null;
    };
    validationMessages: {
      amount?: string;
      paymentMethodId?: string;
    };
    processingState: 'idle' | 'processing' | 'success' | 'declined' | 'error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: CRMEnrollmentWithCourse }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }
  | { type: 'AMOUNT_CHANGED'; payload: number }
  | { type: 'PAYMENT_METHOD_ID_CHANGED'; payload: number }
  | { type: 'CHARGE_PAYMENT_METHOD_STARTED' }
  | { type: 'CHARGE_PAYMENT_METHOD_SUCEEDED'; payload: CRMTransaction & { paymentMethod: CRMPaymentMethod; enrollment: CRMEnrollment } }
  | { type: 'CHARGE_PAYMENT_METHOD_DECLINED'; payload: CRMTransaction & { paymentMethod: CRMPaymentMethod; enrollment: CRMEnrollment } }
  | { type: 'CHARGE_PAYMENT_METHOD_FAILED'; payload?: string };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED': {
      const { discountedCost, balance, nextInstallment } = getMeta(action.payload);
      return {
        ...initialState,
        form: {
          ...initialState.form,
          data: {
            ...initialState.form.data,
            amount: Math.min(action.payload.installment, balance),
            paymentMethodId: action.payload.paymentMethods.find(p => p.primary)?.paymentMethodId ?? null,
          },
          processingState: 'idle',
          errorMessage: undefined,
        },
        crmEnrollment: { ...action.payload, meta: { discountedCost, balance, nextInstallment } },
      };
    }
    case 'LOAD_DATA_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'AMOUNT_CHANGED':
      return {
        ...state,
        form: { ...state.form, data: { ...state.form.data, amount: action.payload } },
      };
    case 'PAYMENT_METHOD_ID_CHANGED': {
      if (typeof state.crmEnrollment === 'undefined') {
        throw Error('crmEnrollment is undefined');
      }
      const paymentMethod = state.crmEnrollment.paymentMethods.find(p => p.paymentMethodId === action.payload);
      if (!paymentMethod) {
        return state;
      }
      if (paymentMethod.deleted || paymentMethod.disabled) {
        return state;
      }
      if (paymentMethod.expiryYear === null || paymentMethod.expiryMonth === null) {
        return state;
      }
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      if (paymentMethod.expiryYear < year || (paymentMethod.expiryYear === year && paymentMethod.expiryMonth < month)) { // expired
        return state;
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, paymentMethodId: action.payload },
        },
      };
    }
    case 'CHARGE_PAYMENT_METHOD_STARTED':
      return { ...state, form: { ...state.form, processingState: 'processing', errorMessage: undefined } };
    case 'CHARGE_PAYMENT_METHOD_SUCEEDED': {
      if (typeof state.crmEnrollment === 'undefined') {
        throw Error('crmEnrollment is undefined');
      }
      const crmEnrollment = { // updated enrollment
        ...state.crmEnrollment,
        ...action.payload.enrollment,
        transactions: [ ...state.crmEnrollment.transactions, action.payload ],
      };
      const { discountedCost, balance, nextInstallment } = getMeta(crmEnrollment);
      return {
        ...state,
        crmEnrollment: { ...crmEnrollment, meta: { discountedCost, balance, nextInstallment } },
        form: { ...initialState.form, processingState: 'success' },
      };
    }
    case 'CHARGE_PAYMENT_METHOD_DECLINED': {
      if (typeof state.crmEnrollment === 'undefined') {
        throw Error('crmEnrollment is undefined');
      }
      const crmEnrollment = { // updated enrollment
        ...state.crmEnrollment,
        ...action.payload.enrollment,
        transactions: [ ...state.crmEnrollment.transactions, action.payload ],
      };
      const { discountedCost, balance, nextInstallment } = getMeta(crmEnrollment);
      return {
        ...state,
        crmEnrollment: { ...crmEnrollment, meta: { discountedCost, balance, nextInstallment } },
        form: { ...state.form, processingState: 'declined' },
      };
    }
    case 'CHARGE_PAYMENT_METHOD_FAILED':
      return { ...state, form: { ...state.form, processingState: 'error', errorMessage: action.payload } };
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

const getMeta = (crmEnrollment: CRMEnrollmentWithCourse): { discountedCost: number; balance: number; nextInstallment: Date | null } => {
  const discountedCost = Big(crmEnrollment.cost).minus(crmEnrollment.discount);
  const amountPaid = crmEnrollment.transactions.filter(t => !t.extraCharge).reduce((prev, cur) => prev.plus(cur.amount), Big(0));
  const balance = discountedCost.minus(amountPaid);

  const paymentHour = 9;
  const paymentMinute = 45;

  const now = new Date();

  let nextInstallment: Date | null = null;
  if (crmEnrollment.paymentPlan !== 'full' && balance.gt(0)) {
    if (crmEnrollment.paymentFrequency === 'monthly') {
      const paymentDay = crmEnrollment.paymentDay ?? crmEnrollment.paymentStart?.getDate() ?? null;
      if (paymentDay !== null) {
        const thisYear = now.getFullYear();
        const thisMonth = now.getMonth();
        const lastDayOfThisMonth = new Date(thisYear, thisMonth + 1, 0).getDate();
        const thisMonthPaymentDay = Math.min(paymentDay, lastDayOfThisMonth);
        nextInstallment = new Date(thisYear, thisMonth, thisMonthPaymentDay, paymentHour, paymentMinute);
        while ((nextInstallment.getTime() < now.getTime()) || (crmEnrollment.paymentStart !== null && nextInstallment.getTime() < crmEnrollment.paymentStart.getTime())) {
          const lastDayOfNextMonth = new Date(thisYear, thisMonth + 2, 0).getDate();
          const nextMonthPaymentDay = Math.min(paymentDay, lastDayOfNextMonth);
          nextInstallment = new Date(thisYear, thisMonth + 1, nextMonthPaymentDay, paymentHour, paymentMinute);
        }
      }
    } else if (crmEnrollment.paymentFrequency === 'weekly') {
      if (crmEnrollment.paymentStart) {
        nextInstallment = new Date(crmEnrollment.paymentStart.getFullYear(), crmEnrollment.paymentStart.getMonth(), crmEnrollment.paymentStart.getDate(), paymentHour, paymentMinute);
        while (nextInstallment.getTime() < now.getTime() || nextInstallment.getTime() < crmEnrollment.paymentStart.getTime()) {
          nextInstallment.setDate(nextInstallment.getDate() + 7);
        }
      }
    } else if (crmEnrollment.paymentFrequency === 'biWeekly') {
      if (crmEnrollment.paymentStart) {
        nextInstallment = new Date(crmEnrollment.paymentStart.getFullYear(), crmEnrollment.paymentStart.getMonth(), crmEnrollment.paymentStart.getDate(), paymentHour, paymentMinute);
        while (nextInstallment.getTime() < now.getTime() || nextInstallment.getTime() < crmEnrollment.paymentStart.getTime()) {
          nextInstallment.setDate(nextInstallment.getDate() + 14);
        }
      }
    }
  }

  return { discountedCost: discountedCost.toNumber(), balance: balance.toNumber(), nextInstallment };
};
