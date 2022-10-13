export type Video = {
  /** uuid */
  videoId: string;
  src: string;
  posterSrc: string;
  captionSrc: string | null;
  title: string;
  description: string;
};
