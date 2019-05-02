export const SAVE_SETTINGS = 'SAVE_SETTINGS';

export const saveSettings = settings => {
  return {
    type: SAVE_SETTINGS,
    settings,
  };
};
