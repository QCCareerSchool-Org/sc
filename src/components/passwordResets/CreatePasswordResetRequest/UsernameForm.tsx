import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';

type Props = {
  username: string;
  onUsernameChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export const UsernameForm = (props: Props): ReactElement => (
  <form onSubmit={props.onSubmit}>
    <input onChange={props.onUsernameChange} value={props.username} />
    <button>Request Password Reset</button>
  </form>
);
