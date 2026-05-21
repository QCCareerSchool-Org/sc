const textEncoder = new TextEncoder();

export const getByteLength = (input: string): number => textEncoder.encode(input).length;
