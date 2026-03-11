const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });

export const segmentByCharacter = (input: string): Intl.Segments => segmenter.segment(input);

export const getLength = (input: string): number => [ ...segmentByCharacter(input) ].length;
