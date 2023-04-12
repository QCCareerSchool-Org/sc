import type { ChangeEventHandler, FC, FormEventHandler } from 'react';

type Props = {
  username: string;
  onUsernameChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export const UsernameForm: FC<Props> = props => (
  <form onSubmit={props.onSubmit}>
    <input onChange={props.onUsernameChange} value={props.username} />
    <button>Request Password Reset</button>
  </form>
);
