import styled from 'styled-components';

type Props = {
  cols: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
};

export const Col = styled.div<Props>`
  margin-left: ${props => props.theme.gutterWidth / 2}rem;
  margin-right: ${props => props.theme.gutterWidth / 2}rem;
  width: ${props => `calc(${props.cols / 12 * 100}% - ${props.theme.gutterWidth}rem)`};
`;
