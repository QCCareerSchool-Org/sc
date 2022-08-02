export const capitalizeFirstLetter = ([ first, ...rest ]: string, locale = navigator.language): string => {
  return first === undefined ? '' : first.toLocaleUpperCase(locale) + rest.join('');
};
