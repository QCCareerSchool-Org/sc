import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import type { FC } from 'react';

import type { CourseSuggestion } from '@/domain/courseSuggestion';
import AB from '@/images/course-suggestions/thumbnails/ab.jpg';
import AP from '@/images/course-suggestions/thumbnails/ap.jpg';
import BS from '@/images/course-suggestions/thumbnails/bs.jpg';
import CC from '@/images/course-suggestions/thumbnails/cc.jpg';
import CE from '@/images/course-suggestions/thumbnails/ce.jpg';
import CP from '@/images/course-suggestions/thumbnails/cp.jpg';
import DB from '@/images/course-suggestions/thumbnails/db.jpg';
import DC from '@/images/course-suggestions/thumbnails/dc.jpg';
import DD from '@/images/course-suggestions/thumbnails/dd.jpg';
import DG from '@/images/course-suggestions/thumbnails/dg.jpg';
import DT from '@/images/course-suggestions/thumbnails/dt.jpg';
import DW from '@/images/course-suggestions/thumbnails/dw.jpg';
import EB from '@/images/course-suggestions/thumbnails/eb.jpg';
import ED from '@/images/course-suggestions/thumbnails/ed.jpg';
import EP from '@/images/course-suggestions/thumbnails/ep.jpg';
import FCImage from '@/images/course-suggestions/thumbnails/fc.jpg';
import FD from '@/images/course-suggestions/thumbnails/fd.jpg';
import FL from '@/images/course-suggestions/thumbnails/fl.jpg';
import FS from '@/images/course-suggestions/thumbnails/fs.jpg';
import GB from '@/images/course-suggestions/thumbnails/gb.jpg';
import HS from '@/images/course-suggestions/thumbnails/hs.jpg';
import I2 from '@/images/course-suggestions/thumbnails/i2.jpg';
import IC from '@/images/course-suggestions/thumbnails/ic.jpg';
import LD from '@/images/course-suggestions/thumbnails/ld.jpg';
import LW from '@/images/course-suggestions/thumbnails/lw.jpg';
import MK from '@/images/course-suggestions/thumbnails/mk.jpg';
import MS from '@/images/course-suggestions/thumbnails/ms.jpg';
import MW from '@/images/course-suggestions/thumbnails/mw.jpg';
import MZ from '@/images/course-suggestions/thumbnails/mz.jpg';
import PE from '@/images/course-suggestions/thumbnails/pe.jpg';
import PF from '@/images/course-suggestions/thumbnails/pf.jpg';
import PO from '@/images/course-suggestions/thumbnails/po.jpg';
import PW from '@/images/course-suggestions/thumbnails/pw.jpg';
import SF from '@/images/course-suggestions/thumbnails/sf.jpg';
import SK from '@/images/course-suggestions/thumbnails/sk.jpg';
import SL from '@/images/course-suggestions/thumbnails/sl.jpg';
import ST from '@/images/course-suggestions/thumbnails/st.jpg';
import TT from '@/images/course-suggestions/thumbnails/tt.jpg';
import VE from '@/images/course-suggestions/thumbnails/ve.jpg';
import VM from '@/images/course-suggestions/thumbnails/vm.jpg';
import WP from '@/images/course-suggestions/thumbnails/wp.jpg';

type Props = {
  course: CourseSuggestion;
  size: number;
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
    case 'VE':
      return VE;

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
    case 'VM':
      return VM;

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
    case 'DC':
      return DC;

    default:
      console.warn(`unsupported course thumbnail ${courseCode}`);
      return LD;
  }
};

export const CourseThumbnailImage: FC<Props> = ({ course, size }) => (
  <>
    <div className="wrapper">
      <Image
        src={getSrc(course.code)} placeholder="blur"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        alt={course.name}
      />
    </div>
    <style jsx>{`
    .wrapper {
      position: relative;
      overflow: hidden;
      width: ${size}px;
      height: ${size}px;
    }
    `}</style>
  </>
);
