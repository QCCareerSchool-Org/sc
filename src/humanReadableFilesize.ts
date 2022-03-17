export const humanReadableFileSize = (filesize: number): string => {
  if (filesize < 1024) {
    return `${filesize} B`;
  }
  if (filesize < 1_048_576) {
    return `${Math.round(filesize / 1024)} KB`;
  }
  if (filesize < 1_073_741_824) {
    return `${Math.round(filesize / 1_048_576)} MB`;
  }
  return `${Math.round(filesize / 1_073_741_824)} GB`;
};
