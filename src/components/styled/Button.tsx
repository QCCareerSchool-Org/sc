import styled from 'styled-components';
import { Color } from '../../styled';

type Props = {
  variant?: Color;
  size?: 'sm' | 'lg';
};

export const Button = styled.button<Props>`
  background-color: ${props => props.theme.colors[props.variant ?? 'primary']};
  transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  font-size: ${props => props.theme.fontSizes.normal};
  line-height: ${props => props.theme.lineHeight};
  padding: ${props => `${props.theme.padding.y} ${props.theme.padding.x}`};
  border: 1px solid ${props => props.theme.colors[props.variant ?? 'primary']};
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.buttonTextColors[props.variant ?? 'primary']};
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.hoverColors[props.variant ?? 'primary']};
  }
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 0.25rem ${props => props.theme.buttonBoxShadowColors[props.variant ?? 'primary']};
  }
`;
