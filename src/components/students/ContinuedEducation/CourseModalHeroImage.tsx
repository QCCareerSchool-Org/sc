import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import type { FC } from 'react';

import AB from '../../../images/course-suggestions/heroes/ab.jpg';
import AP from '../../../images/course-suggestions/heroes/ap.jpg';
import BS from '../../../images/course-suggestions/heroes/bs.jpg';
import CC from '../../../images/course-suggestions/heroes/cc.jpg';
import CE from '../../../images/course-suggestions/heroes/ce.jpg';
import CP from '../../../images/course-suggestions/heroes/cp.jpg';
import DB from '../../../images/course-suggestions/heroes/db.jpg';
import DD from '../../../images/course-suggestions/heroes/dd.jpg';
import DG from '../../../images/course-suggestions/heroes/dg.jpg';
import DT from '../../../images/course-suggestions/heroes/dt.jpg';
import DW from '../../../images/course-suggestions/heroes/dw.jpg';
import EB from '../../../images/course-suggestions/heroes/eb.jpg';
import ED from '../../../images/course-suggestions/heroes/ed.jpg';
import EP from '../../../images/course-suggestions/heroes/ep.jpg';
import FCImage from '../../../images/course-suggestions/heroes/fc.jpg';
import FD from '../../../images/course-suggestions/heroes/fd.jpg';
import FL from '../../../images/course-suggestions/heroes/fl.jpg';
import FS from '../../../images/course-suggestions/heroes/fs.jpg';
import GB from '../../../images/course-suggestions/heroes/gb.jpg';
import HS from '../../../images/course-suggestions/heroes/hs.jpg';
import I2 from '../../../images/course-suggestions/heroes/i2.jpg';
import IC from '../../../images/course-suggestions/heroes/ic.jpg';
import LD from '../../../images/course-suggestions/heroes/ld.jpg';
import LW from '../../../images/course-suggestions/heroes/lw.jpg';
import MK from '../../../images/course-suggestions/heroes/mk.jpg';
import MS from '../../../images/course-suggestions/heroes/ms.jpg';
import MW from '../../../images/course-suggestions/heroes/mw.jpg';
import MZ from '../../../images/course-suggestions/heroes/mz.jpg';
import PE from '../../../images/course-suggestions/heroes/pe.jpg';
import PF from '../../../images/course-suggestions/heroes/pf.jpg';
import PO from '../../../images/course-suggestions/heroes/po.jpg';
import PW from '../../../images/course-suggestions/heroes/pw.jpg';
import SF from '../../../images/course-suggestions/heroes/sf.jpg';
import SK from '../../../images/course-suggestions/heroes/sk.jpg';
import SL from '../../../images/course-suggestions/heroes/sl.jpg';
import ST from '../../../images/course-suggestions/heroes/st.jpg';
import TT from '../../../images/course-suggestions/heroes/tt.jpg';
// import VE from '../../../images/course-suggestions/heroes/ve.jpg';
import WP from '../../../images/course-suggestions/heroes/wp.jpg';

import type { CourseSuggestion } from './courseSuggestions';

type Props = {
  course: CourseSuggestion;
};

const getSrc = (courseCode: string): StaticImageData => {
  switch (courseCode) {
    // design
    case 'I2':
      return I2;
    case 'ST':
      return ST;
    case 'LD':
      return LD;
    case 'DB':
      return DB;
    case 'PO':
      return PO;
    case 'FS':
      return FS;
    case 'CC':
      return CC;
    case 'AP':
      return AP;
    case 'MS':
      return MS;

    // event
    case 'EP':
      return EP;
    case 'WP':
      return WP;
    case 'CE':
      return CE;
    case 'CP':
      return CP;
    case 'DW':
      return DW;
    case 'LW':
      return LW;
    case 'FD':
      return FD;
    case 'ED':
      return ED;
    case 'PE':
      return PE;
    case 'FL':
      return FL;
    case 'EB':
      return EB;
    case 'TT':
      return TT;
      // case 'VE':
      //   return VE;

    // makeup
    case 'MZ':
      return MZ;
    case 'MK':
      return MK;
    case 'MW':
      return MW;
    case 'HS':
      return HS;
    case 'AB':
      return AB;
    case 'GB':
      return GB;
    case 'SK':
      return SK;
    case 'PW':
      return PW;
    case 'SF':
      return SF;
    case 'PF':
      return PF;

    // wellness
    case 'SL':
      return SL;
    case 'IC':
      return IC;
    case 'FC':
      return FCImage;

    // pet
    case 'DG':
      return DG;
    case 'DT':
      return DT;
    case 'DD':
      return DD;
    case 'BS':
      return BS;

    default:
      console.warn(`unsupported course hero ${courseCode}`);
      return LD;
  }
};

export const CourseModalHeroImage: FC<Props> = ({ course }) => (
  <Image
    src={getSrc(course.code)} placeholder="blur"
    layout="fill"
    objectFit="cover"
    objectPosition="center"
    alt={course.name}
  />
);
