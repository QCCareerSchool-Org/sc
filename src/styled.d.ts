import 'styled-components';

type Colors = {
  primary: string;
  secondary: string;
  success: string;
  info: string;
  warning: string;
  danger: string;
};

export type Color = keyof Colors;

declare module 'styled-components' {
  export interface DefaultTheme {
    textColor: {
      normal: string;
      muted: string;
    };
    /** number in rem */
    gutterWidth: number;
    borderRadius: string;
    padding: { x: string; y: string };
    fontSizes: {
      small: string;
      normal: string;
      large: string;
    };
    lineHeight: string;
    colors: Colors;
    buttonTextColors: Colors;
    buttonBoxShadowColors: Colors;
    hoverColors: Colors;
  }
}
