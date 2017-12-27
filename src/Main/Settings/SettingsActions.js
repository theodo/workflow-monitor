export const SAVE_SETTINGS = 'SAVE_SETTINGS';

export function saveSettings(settings) {
  return {
    type: SAVE_SETTINGS,
    settings
  };
}
