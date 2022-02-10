import styled from 'styled-components';

export const Input = styled.input`
  display: block;
  width: 100%;
  padding: ${props => `${props.theme.padding.y} ${props.theme.padding.x}`};
  font-size: ${props => props.theme.fontSizes.normal};
  font-weight: 400;
  line-height: ${props => props.theme.lineHeight};
  color: ${props => props.theme.textColor.normal};
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: ${props => props.theme.borderRadius};
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 0.25rem ${props => props.theme.buttonBoxShadowColors.primary};
  }
`;
