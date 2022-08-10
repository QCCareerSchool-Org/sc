export type UnitToggleState = {
  [courseId: number]: {
    [unitLetter: string]: boolean;
  };
};

export type UnitToggleAction =
| { type: 'INITIALIZE'; payload: UnitToggleState }
| { type: 'TOGGLE'; payload: { courseId: number; unitLetter: string } };

export const unitToggleInitialState = {};

export const unitToggleInitializer = (state: UnitToggleState): UnitToggleState => {
  if (typeof window !== 'undefined' && 'localStorage' in window && window.navigator.cookieEnabled) {
    const storedState = window.localStorage.getItem('unitToggles');
    if (storedState) {
      try {
        const parsed: unknown = JSON.parse(storedState);
        if (parsed !== null && typeof parsed === 'object') {
          return parsed as UnitToggleState;
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
  return state;
};

export const unitToggleReducer = (state: UnitToggleState, action: UnitToggleAction): UnitToggleState => {
  switch (action.type) {
    case 'INITIALIZE':
      return action.payload;
    case 'TOGGLE': {
      if (typeof state[action.payload.courseId] === 'undefined') {
        return {
          ...state,
          [action.payload.courseId]: {
            [action.payload.unitLetter]: true,
          },
        };
      }
      const newState: UnitToggleState = {
        ...state,
        [action.payload.courseId]: {
          ...state[action.payload.courseId],
          [action.payload.unitLetter]: !state[action.payload.courseId][action.payload.unitLetter],
        },
      };
      storeState(newState);
      return newState;
    }
  }
};

const storeState = (state: UnitToggleState): void => {
  console.log(JSON.parse(JSON.stringify(state)));
  if (typeof window !== 'undefined' && 'localStorage' in window && window.navigator.cookieEnabled) {
    window.localStorage.setItem('unitToggles', JSON.stringify(state));
  }
};
