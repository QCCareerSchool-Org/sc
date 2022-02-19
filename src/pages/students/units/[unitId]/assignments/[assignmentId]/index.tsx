import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ReactElement, ReactEventHandler, useEffect, useState } from 'react';

import type { NewAssignment, NewPart, NewTextBox, NewUploadSlot } from '@/domain/students';
import { useAuthState } from '@/hooks/useAuthState';
import { newAssignmentService } from '@/services/students';

type Props = {
  unitId: string | null;
  assignmentId: string | null;
};

type Data = NewAssignment & {
  parts: Array<NewPart & {
    textBoxes: Array<NewTextBox>;
    uploadSlots: Array<NewUploadSlot>;
  }>;
};

type UploadFileFunction = (partId: string, uploadSlotId: string, file: File) => Promise<void>;
type SaveTextFunction = (partId: string, textBoxId: string, text: string) => Promise<void>;

const UnitViewPage: NextPage<Props> = ({ unitId, assignmentId }: Props) => {
  const router = useRouter();
  const authState = useAuthState();
  const [ assignment, setAssignment ] = useState<Data>();
  const [ error, setError ] = useState<number | undefined>();

  const uploadFile: UploadFileFunction = async (partId, uploadSlotId, file) => {
    console.log(partId, uploadSlotId, file);
  };

  const saveText: SaveTextFunction = async (partId, textBoxId, text) => {
    console.log(partId, textBoxId, text);
  };

  useEffect(() => {
    if (typeof authState.studentId !== 'undefined' && unitId && assignmentId) {
      newAssignmentService.getAssignment(authState.studentId, unitId, assignmentId).then(response => {
        if (response.refresh) {
          return router.push({ pathname: '/login', query: { returnUrl: router.asPath } });
        }
        if (response.code === 200) {
          setAssignment(response.data);
        } else {
          setError(response.code);
        }
      }).catch(err => {
        console.error(err);
      });
    }
  }, [ authState.studentId, unitId, assignmentId, router ]);

  if (error) {
    return <>{error}</>;
  }

  if (!assignment) {
    return null;
  }

  return (
    <>
      <section>
        <div className="container">
          <h1>Assignment {assignment.assignmentNumber}{assignment.title && <>: {assignment.title}</>}</h1>
          {assignment.description && <p className="lead">{assignment.description}</p>}
        </div>
      </section>
      {assignment.parts.map(p => (
        <Part key={p.partId} part={p} saveText={saveText} uploadFile={uploadFile} />
      ))}
    </>
  );
};

type PartProps = {
  part: NewPart;
  saveText: SaveTextFunction;
  uploadFile: UploadFileFunction;
};

const Part = ({ part, saveText, uploadFile }: PartProps): ReactElement => (
  <section>
    <div className="container">
      <div className="row">
        <div className="col col-md-10 col-lg-8">
          <p>{part.description}</p>
          {part.textBoxes.map(t => <TextBox key={t.textBoxId} textBox={t} saveText={saveText} />)}
          {part.uploadSlots.map(u => <UploadSlot key={u.uploadSlotId} uploadSlot={u} uploadFile={uploadFile} />)}
        </div>
      </div>
    </div>
  </section>
);

type TextBoxProps = {
  textBox: NewTextBox;
  saveText: SaveTextFunction;
};

const TextBox = ({ textBox, saveText }: TextBoxProps): ReactElement => {
  const onChange: ReactEventHandler<HTMLTextAreaElement> = e => {
    const target = e.target as HTMLTextAreaElement;
    saveText(textBox.partId, textBox.textBoxId, target.value)
      .then(() => { /* empty */ })
      .catch(() => { /* empty */ });
  };

  return (
    <>
      <div className="textBox">
        {textBox.description && <label htmlFor={textBox.textBoxId}>{textBox.description}</label>}
        <textarea onChange={onChange} id={textBox.textBoxId} className="form-control" rows={textBox.lines ?? 7} />
      </div>
      <style jsx>{`
      .textBox {
        margin-bottom: 1rem;
      }
      .textBox:last-of-type {
        margin-bottom: 0;
      }
      `}</style>
    </>
  );
};

type UploadSlotProps = {
  uploadSlot: NewUploadSlot;
  uploadFile: UploadFileFunction;
};

const UploadSlot = ({ uploadSlot, uploadFile }: UploadSlotProps): ReactElement => {
  const onChange: ReactEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (files?.length !== 1) {
      return;
    }
    uploadFile(uploadSlot.partId, uploadSlot.uploadSlotId, files[0])
      .then(() => { /* empty */ })
      .catch(() => { /* empty */ });
  };

  return (
    <>
      <div className="uploadSlot">
        <label htmlFor={uploadSlot.uploadSlotId} className="form-label">{uploadSlot.label}</label>
        <input onChange={onChange} type="file" className="form-control" id={uploadSlot.uploadSlotId} />
      </div>
      <style jsx>{`
      .uploadSlot {
        margin-bottom: 1rem;
      }
      .uploadSlot:last-of-type {
        margin-bottom: 0;
      }
      `}</style>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const unitIdParam = ctx.params?.unitId;
  const assignmentIdParam = ctx.params?.assignmentId;
  const unitId = typeof unitIdParam === 'string' ? unitIdParam : null;
  const assignmentId = typeof assignmentIdParam === 'string' ? assignmentIdParam : null;
  console.log(ctx.params);
  return { props: { unitId, assignmentId } };
};

export default UnitViewPage;
