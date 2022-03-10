import sanitizeHtml from 'sanitize-html';

export const sanitize = (input: string): string => {
  return sanitizeHtml(input, {
    allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, '*': [ 'class' ] },
  });
};
