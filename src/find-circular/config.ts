export const DEFAULT_REPLACE_TOKEN = "[Circular]";

export type Configuration = {
  replaceToken?: string;
};

export const DEFAULT_CONFIGURATION: Configuration = {
  replaceToken: DEFAULT_REPLACE_TOKEN,
};
