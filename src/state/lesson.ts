export type LessonState = {
  currentLesson?: {
    window: Window;
    materialId: string;
  };
};

export type LessonAction =
  | { type: 'SET_LESSON'; payload: { window: Window; materialId: string } }
  | { type: 'CLEAR_LESSON' };

export const lessonReducer = (state: LessonState, action: LessonAction): LessonState => {
  switch (action.type) {
    case 'SET_LESSON':
      return { ...state, currentLesson: action.payload };
    case 'CLEAR_LESSON':
      return { ...state, currentLesson: undefined };
  }
};

export const lessonInitialState: LessonState = {};
