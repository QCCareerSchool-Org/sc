export type Video = {
  /** uuid */
  videoId: string;
  src: string;
  posterSrc: string | null;
  captionSrc: string | null;
  title: string;
  description: string;
};
