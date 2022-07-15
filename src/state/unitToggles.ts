export type UnitToggleState = {
  [courseId: number]: {
    [unitLetter: string]: boolean;
  };
};

export type UnitToggleAction =
| { type: 'TOGGLE'; payload: { courseId: number; unitLetter: string } };

export const unitToggleInitialState = {};

export const unitToggleInitializer = (state: UnitToggleState): UnitToggleState => {
  if (typeof window !== 'undefined' && 'localStorage' in window && window.navigator.cookieEnabled) {
    const storedState = window.localStorage.getItem('unitToggles');
    if (storedState) {
      try {
        return JSON.parse(storedState) as UnitToggleState;
      } catch (err) {
        console.error(err);
      }
    }
  }
  return state;
};

export const unitToggleReducer = (state: UnitToggleState, action: UnitToggleAction): UnitToggleState => {
  switch (action.type) {
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
  if (typeof window !== 'undefined' && 'localStorage' in window && window.navigator.cookieEnabled) {
    window.localStorage.setItem('unitToggles', JSON.stringify(state));
  }
};
