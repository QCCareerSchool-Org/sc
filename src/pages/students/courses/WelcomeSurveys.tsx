import type { FC } from 'react';
import { useMemo } from 'react';

import type { StudentWithCountryProvinceAndEnrollments } from '@/services/students/studentService';

type Props = {
  student: StudentWithCountryProvinceAndEnrollments;
};

export const WelcomeSurveys: FC<Props> = ({ student }) => {
  const urls = useMemo(() => {
    if (student.created >= new Date(Date.UTC(2023, 9, 5, 16))) {
      const enrollments = {
        makeup: student.enrollments.find(e => e.course.school.name === 'QC Makeup Academy'),
        design: student.enrollments.find(e => e.course.school.name === 'QC Design School'),
        event: student.enrollments.find(e => e.course.school.name === 'QC Event School'),
        pet: student.enrollments.find(e => e.course.school.name === 'QC Pet Studies'),
      };
      const studentNumbers = {
        makeup: enrollments.makeup && `${enrollments.makeup.course.code}${enrollments.makeup.studentNumber}`,
        event: enrollments.event && `${enrollments.event.course.code}${enrollments.event.studentNumber}`,
        design: enrollments.design && `${enrollments.design.course.code}${enrollments.design.studentNumber}`,
        pet: enrollments.pet && `${enrollments.pet.course.code}${enrollments.pet.studentNumber}`,
      };
      const welcomeSurveyCompletions = {
        makeup: student.surveyCompletions.findIndex(s => s.survey.name === 'Welcome - Makeup') !== -1,
        event: student.surveyCompletions.findIndex(s => s.survey.name === 'Welcome - Event') !== -1,
        design: student.surveyCompletions.findIndex(s => s.survey.name === 'Welcome - Design') !== -1,
        pet: student.surveyCompletions.findIndex(s => s.survey.name === 'Welcome - Pet') !== -1,
      };
      return {
        makeup: studentNumbers.makeup && !welcomeSurveyCompletions.makeup ? `https://ng295qu8zyk.typeform.com/to/Ke9XuFJb#student_number=${studentNumbers.makeup}&student_id=${student.studentId}` : undefined,
        event: studentNumbers.event && !welcomeSurveyCompletions.event ? `https://ng295qu8zyk.typeform.com/to/WLtTsKBJ#student_number=${studentNumbers.event}&student_id=${student.studentId}` : undefined,
        design: studentNumbers.design && !welcomeSurveyCompletions.design ? `https://ng295qu8zyk.typeform.com/to/SyK8rCNk#student_number=${studentNumbers.design}&student_id=${student.studentId}` : undefined,
        pet: studentNumbers.pet && !welcomeSurveyCompletions.pet ? `https://ng295qu8zyk.typeform.com/to/BlZ88NCf#student_number=${studentNumbers.pet}&student_id=${student.studentId}` : undefined,
      };
    }
    console.log('too old');
  }, [ student ]);

  return (
    <>
      {urls?.makeup && (
        <div className="alert alert-info">
          <p>Welcome to QC Makeup Academy! Before you get started, please fill out the <a href={urls?.makeup} target="_blank" rel="noreferrer" className="alert-link">Course Welcome Survey</a>.</p>
          <a href={urls?.makeup} target="_blank" rel="noreferrer"><button className="btn btn-info">Take the Survey</button></a>
        </div>
      )}
      {urls?.event && (
        <div className="alert alert-info">
          <p>Welcome to QC Event School! Before you get started, please fill out the <a href={urls?.event} target="_blank" rel="noreferrer" className="alert-link">Course Welcome Survey</a>.</p>
          <a href={urls?.event} target="_blank" rel="noreferrer"><button className="btn btn-info">Take the Survey</button></a>
        </div>
      )}
      {urls?.design && (
        <div className="alert alert-info">
          <p>Welcome to QC Design School! Before you get started, please fill out the <a href={urls?.design} target="_blank" rel="noreferrer" className="alert-link">Course Welcome Survey</a>.</p>
          <a href={urls?.design} target="_blank" rel="noreferrer"><button className="btn btn-info">Take the Survey</button></a>
        </div>
      )}
      {urls?.pet && (
        <div className="alert alert-info">
          <p>Welcome to QC Pet Studies! Before you get started, please fill out the <a href={urls?.pet} target="_blank" rel="noreferrer" className="alert-link">Course Welcome Survey</a>.</p>
          <a href={urls?.pet} target="_blank" rel="noreferrer"><button className="btn btn-info">Take the Survey</button></a>
        </div>
      )}
    </>
  );
};
