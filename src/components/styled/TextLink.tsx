import styled from 'styled-components';
import { Color } from '../../styled';

type Props = {
  variant?: Color;
};

export const TextLink = styled.a<Props>`
  color: ${props => props.theme.colors[props.variant ?? 'primary']};
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.hoverColors[props.variant ?? 'primary']};
    text-decoration: underline;
  }
`;
