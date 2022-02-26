const dateFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export const formatDate = (d: Date): string => {
  return dateFormatter.format(d);
};
