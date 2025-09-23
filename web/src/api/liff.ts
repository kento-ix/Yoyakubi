import liff from "@line/liff";

export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl: string | undefined;
  statusMessage: string | undefined;
}

export const initLiff = async (): Promise<void> => {
  try {
    const liffId = import.meta.env.VITE_LIFF_ID as string;
    if (!liffId) throw new Error("VITE_LIFF_ID is not defined");

    await liff.init({ liffId });
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  } catch (error) {
    console.error("LIFF init error:", error);
    throw error;
  }
};

export const getUserProfile = async (): Promise<LiffProfile> => {
  const profile = await liff.getProfile();
  return {
    userId: profile.userId,
    displayName: profile.displayName,
    pictureUrl: profile.pictureUrl,
    statusMessage: profile.statusMessage,
  };
};
