export const CUSTOMTHEMECOLORS = "CUSTOMTHEMECOLORS";
export const MODE = "MODE";
export const CURRENTUSER = "CURRENTUSER";

export function setTheme(theme: {
  primaryColor: string;
  secondaryColor: string;
}): Action {
  return {
    type: CUSTOMTHEMECOLORS,
    payload: theme,
  };
}

export function setMode(mode: string): Action {
  return {
    type: MODE,
    payload: mode,
  };
}

export function setCurrentUser(mode: string): Action {
  return {
    type: CURRENTUSER,
    payload: mode,
  };
}
