import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
html, body {
  padding: 0;
  margin: 0;
  font-family: Open Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-size: ${props => props.theme.fontSizes.normal};
  line-height: ${props => props.theme.lineHeight};
  color: ${props => props.theme.textColor.normal};
}

body {
  overflow-y: scroll;
  overscroll-behavior-y: none;
}

* {
  box-sizing: border-box;
}
`;
