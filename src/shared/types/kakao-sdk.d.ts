declare global {
  interface Window {
    Kakao: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Auth: {
        authorize: (settings: { redirectUri: string; scope?: string }) => void;
      };
    };
  }
}

export {};
