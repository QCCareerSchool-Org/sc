/**
 * Provides common helper functions
 */

/** determines the name for a country's subdivisions */
export function provinceState(countryCode: string | null): string {
  return countryCode === 'US' || countryCode === 'AU' ? 'state' : 'province';
}

/** determines the name for a postal codes */
export function postalZip(countryCode: string | null): string {
  if (countryCode === 'US') {
    return 'zip code';
  }
  if (countryCode === 'CA') {
    return 'postal code';
  }
  return 'postcode';
}

/** determines if we are able to ship to a country */
export function noShipCountry(countryCode: string | null): boolean {
  if (countryCode === null) {
    return false;
  }

  countryCode = countryCode.toUpperCase();

  // US embargo countries
  if ([ 'IR', 'KP', 'CU', 'MM', 'SD', 'SY' ].includes(countryCode)) {
    return true;
  }

  // Turkey
  if (countryCode === 'TR') { // can't ship makeup kit
    return true;
  }

  // India or Pakistan
  if (countryCode === 'IN' || countryCode === 'PK') {
    return true;
  }

  // Lebanon
  if (countryCode === 'LB') {
    return true;
  }

  // Africa
  const africanCountries = [
    'DZ',
    'AO',
    'BJ',
    'BW',
    'BF',
    'BI',
    'CM',
    'CV',
    'CF',
    'TD',
    'KM',
    'CD',
    'DJ',
    'GQ',
    'EG',
    'ER',
    'ET',
    'GA',
    'GH',
    'GN',
    'GW',
    'CI',
    'KE',
    'LS',
    'LR',
    'LY',
    'MG',
    'MW',
    'ML',
    'MR',
    'MU',
    'MA',
    'MZ',
    'NA',
    'NE',
    'NG',
    'CG',
    'RW',
    'ST',
    'SN',
    'SC',
    'SL',
    'SO',
    'SS',
    'SD',
    'SZ',
    'TZ',
    'GM',
    'TG',
    'TN',
    'UG',
    'ZA',
    'ZM',
    'ZW',
  ];
  if (africanCountries.includes(countryCode.toUpperCase())) {
    return true;
  }

  // additional FedEx restrictions
  const fedexCountries = [
    'CF',
    'KM',
    'CU',
    'GQ',
    'FK',
    'GW',
    'IR',
    'KI',
    'KP',
    'YT',
    'MM',
    'NR',
    'NU',
    'PM',
    'ST',
    'SL',
    'SB',
    'SO',
    'SH',
    'SD',
    'SY',
    'TJ',
    'TK',
    'TM',
    'TV',
    'UM',
  ];
  if (fedexCountries.includes(countryCode.toUpperCase())) {
    return true;
  }

  if (countryCode !== 'GB' && euCountry(countryCode)) { // EU makeup restriction (except GB)
    return true;
  }

  return false;

}

/** determines if a country is in the EU */
export function euCountry(countryCode: string | null): boolean {
  if (countryCode === null) {
    return false;
  }
  const countries = [
    'AT',
    'BE',
    'BG',
    'HR',
    'CY',
    'CZ',
    'DK',
    'EE',
    'FI',
    'FR',
    'DE',
    'GR',
    'HU',
    'IE',
    'IT',
    'LV',
    'LT',
    'LU',
    'MT',
    'NL',
    'PL',
    'PT',
    'RO',
    'SK',
    'SI',
    'ES',
    'SE',
    'GB',
  ];
  return countries.includes(countryCode.toUpperCase());
}

/** determines if a country is in the Eurozone */
export function eurozone(countryCode: string | null): boolean {
  if (countryCode === null) {
    return false;
  }
  const countries = [
    'AT',
    'BE',
    'CY',
    'EE',
    'FI',
    'FR',
    'DE',
    'GR',
    'IE',
    'IT',
    'LU',
    'MT',
    'NL',
    'PT',
    'SK',
    'SI',
    'ES',
  ];
  return countries.includes(countryCode.toUpperCase());
}

/** determines if county uses euros as its primary currency */
export function euroUsingCountry(countryCode: string | null): boolean {
  if (countryCode === null) {
    return false;
  }
  const countries = [ 'VA', 'MC', 'SM' ];
  return eurozone(countryCode) || countries.includes(countryCode.toUpperCase());
}

/** determines if we charge people from a country in euros */
export function euroCountry(countryCode: string | null): boolean {
  if (countryCode === null) {
    return false;
  }
  const countries = [
    'AL',
    'AD',
    'AM',
    'AZ',
    'BY',
    'BA',
    'BG',
    'HR',
    'CZ',
    'DK',
    'GE',
    'HU',
    'IS',
    'LV',
    'LU',
    'LT',
    'MK',
    'MD',
    'ME',
    'NO',
    'PL',
    'RO',
    'RU',
    'RS',
    'SE',
    'CH',
    'TR',
    'UA',
  ];
  return euroUsingCountry(countryCode) || countries.includes(countryCode.toUpperCase());
}

/** determines if we charge people from a country in pounds sterling */
export function gbpCountry(countryCode: string | null): boolean {
  if (countryCode === null) {
    return false;
  }
  const countries = [ 'GB', 'IM', 'GG', 'JE', 'GS' ];
  return countries.includes(countryCode.toUpperCase());
}

/** determines if we charge people from a country in Australian dollars */
export function audCountry(countryCode: string | null): boolean {
  if (countryCode === null) {
    return false;
  }
  const countries = [ 'AU', 'CX', 'CC', 'NR', 'NF', 'HM' ];
  return countries.includes(countryCode.toUpperCase());
}

/** determines if we charge people from a country in Australian dollars */
export function nzdCountry(countryCode: string | null): boolean {
  if (countryCode === null) {
    return false;
  }
  const countries = [ 'NZ', 'TK', 'NU', 'PN' ];
  return countries.includes(countryCode.toUpperCase());
}

export function needsPostal(countryCode: string | null): boolean {
  if (countryCode === null) {
    return false;
  }
  const countries = [
    'AO',
    'AG',
    'AW',
    'BS',
    'BZ',
    'BJ',
    'BW',
    'BF',
    'BI',
    'CM',
    'TD',
    'KM',
    'CD',
    'CG',
    'CK',
    'CW',
    'DJ',
    'DM',
    'GQ',
    'ER',
    'FJ',
    'GA',
    'GM',
    'GH',
    'GD',
    'GY',
    'HM',
    'HK',
    'CI',
    'JM',
    'KI',
    'LY',
    'MO',
    'MW',
    'ML',
    'MR',
    'MS',
    'NA',
    'NR',
    'NU',
    'KP',
    'PA',
    'QA',
    'RE',
    'RW',
    'KN',
    'LC',
    'WS',
    'ST',
    'SC',
    'SL',
    'MF',
    'SB',
    'GS',
    'SR',
    'SY',
    'TZ',
    'TG',
    'TK',
    'TO',
    'TT',
    'TV',
    'UG',
    'AE',
    'VU',
    'YE',
    'ZW',
  ];
  return !countries.includes(countryCode.toUpperCase());
}

export function needsProvince(countryCode?: string | null): boolean {
  return countryCode === 'CA' || countryCode === 'US' || countryCode === 'AU';
}

export function naTelephoneNumber(countryCode: string | null): boolean {
  if (countryCode === null) {
    return false;
  }
  const countries = [
    'CA',
    'US',
    'VI',
    'MP',
    'GU',
    'AS',
    'PR',
    'BS',
    'BB',
    'AI',
    'AG',
    'VG',
    'KY',
    'BM',
    'GD',
    'TC',
    'MS',
    'SX',
    'LC',
    'DM',
    'VC',
    'DO',
    'TT',
    'KN',
    'JM',
  ];
  return countries.includes(countryCode.toUpperCase());
}

export function fixTelephoneNumber(t: string): string {

  // e.g.: "6137498248"
  if (/^\d{10}$/u.test(t)) {
    return t.substring(0, 3) + '-' + t.substring(3, 6) + '-' + t.substring(6, 10);
  }

  // e.g.: "16137498248"
  if (/^1\d{10}$/u.test(t)) {
    return t.substring(1, 4) + '-' + t.substring(4, 7) + '-' + t.substring(7, 11);
  }

  // e.g.: "613-7498248" or "'613 7498248"
  if (/^\d{3}[-. ]\d{7}$/u.test(t)) {
    return t.substring(0, 3) + '-' + t.substring(4, 7) + '-' + t.substring(7, 11);
  }

  // e.g.: "613 749 8248" or "613-749 8248" or "613 749-8248"
  if (/^\d{3}[-. ]\d{3}[-. ]\d{4}$/u.test(t)) {
    return t.substring(0, 3) + '-' + t.substring(4, 7) + '-' + t.substring(8, 12);
  }

  // e.g.: "1-613-749-8248" or "1 613 749 8248"
  if (/^1[-. ]\d{3}[-. ]\d{3}[-. ]\d{4}$/u.test(t)) {
    return t.substring(2, 5) + '-' + t.substring(6, 9) + '-' + t.substring(10, 14);
  }

  // e.g.: "(613) 749-8248" or "(613) 749 8248"
  if (/^\(\d{3}\)[-. ]\d{3}[-. ]\d{4}$/u.test(t)) {
    return t.substring(1, 4) + '-' + t.substring(6, 9) + '-' + t.substring(10, 14);
  }

  // e.g.: "1 (613) 749-8248" or "1 (613) 749 8248"
  if (/^1[-. ]\(\d{3}\)[-. ]\d{3}[-. ]\d{4}$/u.test(t)) {
    return t.substring(3, 6) + '-' + t.substring(8, 11) + '-' + t.substring(12, 16);
  }

  // e.g.: "(613)749-8248" or "(613)749 8248"
  if (/^\(\d{3}\)\d{3}[-. ]\d{4}$/u.test(t)) {
    return t.substring(1, 4) + '-' + t.substring(5, 8) + '-' + t.substring(9, 13);
  }

  // e.g.: "1(613)749-8248" or "1(613)749 8248"
  if (/^1\(\d{3}\)\d{3}[-. ]\d{4}$/u.test(t)) {
    return t.substring(2, 5) + '-' + t.substring(6, 9) + '-' + t.substring(10, 14);
  }

  // e.g.: "(613)7498248"
  if (/^\(\d{3}\)\d{7}$/u.test(t)) {
    return t.substring(1, 4) + '-' + t.substring(5, 8) + '-' + t.substring(8, 12);
  }

  // e.g.: "+16137498248"
  if (/^\+1\d{10}$/u.test(t)) {
    return t.substring(2, 5) + '-' + t.substring(5, 8) + '-' + t.substring(8, 12);
  }

  // e.g.: "+1(613)7498248"
  if (/^\+1\(\d{3}\)\d{7}$/u.test(t)) {
    return t.substring(3, 6) + '-' + t.substring(7, 10) + '-' + t.substring(10, 14);
  }

  // e.g.: "+1 613 749 8248" or "+1-613-749-8248"
  if (/^\+1[-. ]\d{3}[-. ]\d{3}[-. ]\d{4}$/u.test(t)) {
    return t.substring(3, 6) + '-' + t.substring(7, 10) + '-' + t.substring(11, 15);
  }

  return t;
}

/**
   * Determines whether the country of the visitor uses the +44 country dialing code. E.g., United Kingdom
   * @param   {string}  countryCode the two-character iso-3166-1 alpha-2 country code of the visitor
   * @returns {boolean}
   */
export function isCallingCode44(countryCode: string): boolean {
  return [ 'GB', 'IM', 'GG', 'JE' ].includes(countryCode);
}

/**
   * Determines whether the country of the visitor uses the +61 country dialing code. E.g., Australia
   * @param   {string}  countryCode the two-character iso-3166-1 alpha-2 country code of the visitor
   * @returns {boolean}
   */
export function isCallingCode61(countryCode: string): boolean {
  return [ 'AU', 'CX', 'CC' ].includes(countryCode);
}

/**
   * Determines whether the country of the visitor uses the +64 country dialing code. E.g., New Zealand
   * @param   {string}  countryCode the two-character iso-3166-1 alpha-2 country code of the visitor
   * @returns {boolean}
   */
export function isCallingCode64(countryCode: string): boolean {
  return [ 'NZ', 'PN' ].includes(countryCode);
}

/**
   * Determines whether the country of the visitor uses the +1 country dialing code. E.g., Canada, United States, Jamaica
   * @param   {string}  countryCode the two-character iso-3166-1 alpha-2 country code of the visitor
   * @returns {boolean}
   */
export function isCallingCode1(countryCode: string): boolean {
  return [
    'CA',
    'US',
    'AG',
    'AI',
    'AS',
    'BB',
    'BM',
    'BS',
    'DM',
    'DO',
    'GD',
    'GU',
    'JM',
    'KN',
    'KY',
    'LC',
    'MP',
    'MS',
    'PR',
    'SX',
    'TC',
    'TT',
    'VC',
    'VG',
    'VI',
    'UM',
  ].includes(countryCode);
}

/**
   * Determines the appropriate telephone number based on the country of the visitor.
   * @param   {string} countryCode the two-character iso-3166-1 alpha-2 country code of the visitor
   * @returns {string} the telephone number
   */
export function getTelephoneNumber(countryCode: string): string {
  if (isCallingCode1(countryCode)) { return '1-833-600-3751'; }
  if (isCallingCode44(countryCode)) { return '0800 066 4734'; }
  if (isCallingCode61(countryCode)) { return '1800 531 923'; }
  if (isCallingCode64(countryCode)) { return '0800 451 979'; }
  return '+1 613 749 8248';
}

/**
   * Determines the appropriate mailing address based on the country of the visitor.
   * @param   {string} countryCode the two-character iso-3166-1 alpha-2 country code of the visitor
   * @returns {string} the telephone number
   */
export function getAddress(countryCode: string): string[] {
  // if (gbpCountry(countryCode)) { return [ 'Suite 18', '186 St. Albans Road', 'Watford WD24 4AS' ]; }
  if (audCountry(countryCode)) { return [ 'Suite 23', '78 Williams Street', 'Sydney NSW 2011' ]; }
  if (nzdCountry(countryCode)) { return [ 'Suite 23', '78 Williams Street', 'Sydney NSW 2011', 'Australia' ]; }
  if (countryCode === 'US') { return [ 'Suite 450', '1 Research Court', 'Rockville MD 20850' ]; }
  if (countryCode === 'CA') { return [ '38 McArthur Avenue', 'Ottawa ON K1L 6R2' ]; }
  return [ '38 McArthur Avenue', 'Ottawa ON K1L 6R2', 'Canada' ];
}
