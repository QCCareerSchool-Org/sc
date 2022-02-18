import { ReactElement } from 'react';
import { useAuthDispatch } from '../hooks/useAuthDispatch';
import { useAuthState } from '../hooks/useAuthState';
import { useScreenWidth } from '../hooks/useScreenWidth';

export const DebugWindow = (): ReactElement => {
  const screenWidth = useScreenWidth();
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();

  return (
    <>
      <div id="debugWindow">
        <table>
          <tbody>
            <tr><th scope="row">Screen Width</th><td>{screenWidth}</td></tr>
            <tr><th scope="row">Student Id</th><td>{authState.studentId}</td></tr>
            <tr><th scope="row">Tutor Id</th><td>{authState.tutorId}</td></tr>
            <tr><th scope="row">Administrator Id</th><td>{authState.administratorId}</td></tr>
          </tbody>
        </table>
      </div>
      <style jsx>{`
        #debugWindow {
          position: absolute;
          bottom: 0.5rem;
          left: 0.5rem;
          background: white;
          box-shadow: 0 0 0.25rem 0.25rem #00000020;
          padding: 0.5rem;
        }
      `}</style>
    </>
  );
};
