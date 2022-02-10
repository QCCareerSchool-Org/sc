import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  margin-left: -${props => props.theme.gutterWidth / 2}rem;
  margin-right: -${props => props.theme.gutterWidth / 2}rem;
`;
