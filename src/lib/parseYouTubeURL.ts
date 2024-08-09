export type YouTubeURLParseResult = {
  isYouTube: false;
} | {
  isYouTube: true;
  isCorrect: false;
  videoId?: string;
} | {
  isYouTube: true;
  isCorrect: true;
  videoId: string;
};

export const parseYouTubeURL = (url: string): YouTubeURLParseResult => {
  const possibleYouTubeLink = /https:\/\/(?:.*\.)?youtube\.com/ui;
  const goodYouTubeLink = /^https:\/\/www\.youtube\.com\/watch\?v=([0-9A-Za-z_-]{10}[048AEIMQUYcgkosw])/u;
  const youTubeShortLink = /https:\/\/(?:.*\.)?youtube\.com\/shorts\/([0-9A-Za-z_-]{10}[048AEIMQUYcgkosw])/ui;
  const youTubeStudioLink = /https:\/\/(?:.*\.)?youtube\.com\/video\/([0-9A-Za-z_-]{10}[048AEIMQUYcgkosw])/ui;

  if (!possibleYouTubeLink.test(url)) {
    return { isYouTube: false };
  }

  const goodParts = goodYouTubeLink.exec(url);
  if (goodParts) {
    return { isYouTube: true, isCorrect: true, videoId: goodParts[1] };
  }

  const shortParts = youTubeShortLink.exec(url);
  if (shortParts) {
    return { isYouTube: true, isCorrect: false, videoId: shortParts[1] };
  }

  const studioParts = youTubeStudioLink.exec(url);
  if (studioParts) {
    return { isYouTube: true, isCorrect: false, videoId: studioParts[1] };
  }

  return { isYouTube: true, isCorrect: false };
};
