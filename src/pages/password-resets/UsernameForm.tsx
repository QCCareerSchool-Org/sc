import type { ChangeEventHandler, FC, SubmitEventHandler } from 'react';

interface Props {
  username: string;
  onUsernameChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
}

export const UsernameForm: FC<Props> = props => (
  <form onSubmit={props.onSubmit}>
    <input onChange={props.onUsernameChange} value={props.username} />
    <button>Request Password Reset</button>
  </form>
);
