export type CertificationData = {
  code?: string;
  name: string;
  filename: string;
  url: string;
  codeRegistered?: boolean;
  nameTrademarked?: boolean;
  displayCode?: boolean;
};

export const certificationDataDictionary: Record<string, CertificationData> = {
  // Pet
  DG: {
    code: 'IDGP',
    name: 'International Dog Grooming Professional',
    filename: '2019/standard/idgp',
    url: 'https://www.qcpetstudies.com/',
  },
  DD: {
    code: 'IDCP',
    name: 'International Dog Care Professional',
    filename: '2019/standard/idcp',
    url: 'https://www.qcpetstudies.com/',
  },
  DT: {
    code: 'IDTP',
    name: 'International Dog Training Professional',
    filename: '2019/standard/idtp',
    url: 'https://www.qcpetstudies.com/',
  },
  // Makeup
  MZ: {
    code: 'MIMP',
    name: 'Master International Makeup Professional',
    filename: '2019/standard/mimp',
    url: 'https://www.qcmakeupacademy.com/',
    nameTrademarked: true,
  },
  MM: {
    code: 'MIMP',
    name: 'Master International Makeup Professional',
    filename: '2019/standard/mimp',
    url: 'https://www.qcmakeupacademy.com/',
    nameTrademarked: true,
  },
  CM: {
    code: 'MIMP',
    name: 'Master International Makeup Professional',
    filename: '2019/standard/mimp',
    url: 'https://www.qcmakeupacademy.com/',
    nameTrademarked: true,
  },
  MA: {
    code: 'CIMP',
    name: 'Certified International Makeup Professional',
    filename: '2019/standard/cimp',
    url: 'https://www.qcmakeupacademy.com/',
    nameTrademarked: true,
  },
  MK: {
    code: 'CIMP',
    name: 'Certified International Makeup Professional',
    filename: '2019/standard/cimp',
    url: 'https://www.qcmakeupacademy.com/',
    nameTrademarked: true,
  },
  MW: {
    code: 'PMWG',
    name: 'Pro Makeup Workshop Graduate',
    filename: '2019/standard/pmwg',
    url: 'https://www.qcmakeupacademy.com/',
  },
  SK: {
    code: 'ISC',
    name: 'International Skincare Consultant',
    filename: '2019/standard/isc',
    url: 'https://www.qcmakeupacademy.com/',
    nameTrademarked: true,
  },
  SF: {
    code: 'ISMP',
    name: 'International Special FX Makeup Professional',
    filename: '2019/standard/ismp',
    url: 'https://www.qcmakeupacademy.com/',
    nameTrademarked: true,
  },
  HS: {
    name: 'Hair Styling Essentials Graduate',
    filename: '2019/standard/hse',
    url: 'https://www.qcmakeupacademy.com/',
  },
  AB: {
    name: 'Specialization in Airbrush Makeup',
    filename: '2019/standard/abm',
    url: 'https://www.qcmakeupacademy.com/',
  },
  GB: {
    name: 'Specialization in Global Beauty',
    filename: '2019/standard/gbe',
    url: 'https://www.qcmakeupacademy.com/',
  },
  PW: {
    code: 'PDG',
    filename: '2019/standard/pdg',
    name: 'Portfolio Development Graduate',
    url: 'https://www.qcmakeupacademy.com/',
  },
  PF: {
    code: 'CISP',
    filename: '2019/standard/cisp',
    name: 'Certified International Styling Professional',
    url: 'https://www.qcmakeupacademy.com/',
  },
  VM: {
    code: 'VMCG',
    filename: '2019/standard/vmcg',
    name: 'Virtual Makeup Consultation Graduate',
    url: 'https://www.qcmakeupacademy.com/',
  },
  // Event
  EP: {
    code: 'IEWP',
    name: 'International Event & Wedding Planning Professional',
    filename: '2019/standard/iewp',
    url: 'https://www.qceventplanning.com/',
    nameTrademarked: true,
  },
  WP: {
    code: 'IWPP',
    name: 'International Wedding Planning Professional',
    filename: '2019/standard/iwpp',
    url: 'https://www.qceventplanning.com/',
    nameTrademarked: true,
  },
  CE: {
    code: 'IEPP',
    name: 'International Event Planning Professional',
    filename: '2019/standard/iepp',
    url: 'https://www.qceventplanning.com/',
    nameTrademarked: true,
  },
  ED: {
    code: 'IEDP',
    name: 'International Event Decor Professional',
    filename: '2019/standard/iedp',
    url: 'https://www.qceventplanning.com/',
    nameTrademarked: true,
  },
  DW: {
    code: 'DWS',
    name: 'Destination Wedding Specialist',
    filename: '2019/standard/dws',
    url: 'https://www.qceventplanning.com/',
    displayCode: false,
  },
  LW: {
    code: 'LWS',
    name: 'Luxury Wedding & Event Specialist',
    filename: '2019/standard/lws',
    url: 'https://www.qceventplanning.com/',
    displayCode: false,
  },
  MP: {
    code: 'IEPP',
    name: 'International Event & Wedding Planning Professional',
    filename: '2019/standard/iepp',
    url: 'https://www.qceventplanning.com/',
    nameTrademarked: true,
  },
  CP: {
    code: 'ICPP',
    name: 'International Corporate Event Planning Professional',
    filename: '2019/standard/icpp',
    url: 'https://www.qceventplanning.com/',
    nameTrademarked: true,
  },
  FL: {
    code: 'IFLP',
    name: 'International Festival and Live Events Professional',
    filename: '2019/standard/iflp',
    url: 'https://www.qceventplanning.com/',
    nameTrademarked: true,
  },
  FD: {
    code: 'IFDP',
    name: 'International Floral Design Professional',
    filename: '2019/standard/ifdp',
    url: 'https://www.qceventplanning.com/',
  },
  // Design
  A: {
    code: 'IDDP',
    name: 'International Design and Decorating Professional',
    filename: '2019/standard/iddp',
    url: 'https://www.qcdesignschool.com/',
    codeRegistered: true,
    nameTrademarked: true,
  },
  MI: {
    code: 'IDDP',
    name: 'International Design and Decorating Professional',
    filename: '2019/standard/iddp',
    url: 'https://www.qcdesignschool.com/',
    codeRegistered: true,
    nameTrademarked: true,
  },
  T: {
    code: 'ISRP',
    name: 'International Staging and Redesign Professional',
    filename: '2019/standard/isrp',
    url: 'https://www.qcdesignschool.com/',
    codeRegistered: true,
    nameTrademarked: true,
  },
  M: {
    code: 'ISRP',
    name: 'International Staging and Redesign Professional',
    filename: '2019/standard/isrp',
    url: 'https://www.qcdesignschool.com/',
    codeRegistered: true,
    nameTrademarked: true,
  },
  /*
    'X: {
            code: 'IRP',
            name: 'International Redesign Professional',
            filename: 'IRP',
            url: 'https://www.qcdesignschool.com/',
            codeRegistered: true,
            nameTrademarked: true,
    },
  */
  PO: {
    code: 'AIOP',
    name: 'Advanced International Organizing Professional',
    filename: '2019/standard/aiop',
    url: 'https://www.qcdesignschool.com/',
    codeRegistered: true,
    nameTrademarked: true,
  },
  J: {
    code: 'AFDP',
    name: 'Advanced Feng Shui Design Professional',
    filename: '2019/standard/afdp',
    url: 'https://www.qcdesignschool.com/',
    nameTrademarked: true,
  },
  CC: {
    code: 'ICCP',
    name: 'International Color Consulting Professional',
    filename: '2019/standard/iccp',
    url: 'https://www.qcdesignschool.com/',
    nameTrademarked: true,
  },
  AP: {
    code: 'APDP',
    name: 'Aging in Place Design Professional',
    filename: '2019/standard/apdp',
    url: 'https://www.qcdesignschool.com/',
  },
  LD: {
    code: 'ILDP',
    name: 'International Landscape Design Professional',
    filename: '2019/standard/ildp',
    url: 'https://www.qcdesignschool.com/',
  },
  // Wellness
  SL: {
    code: 'ISCP',
    name: 'International Sleep Consultant Professional',
    filename: '2019/standard/iscp',
    url: 'https://www.qcwellnessstudies.com/',
  },
};
