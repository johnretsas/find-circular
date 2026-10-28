export const DEFAULT_REPLACE_TOKEN = "[Circular]";

// Called for each circular reference; its return value is used as the replacement.
// `path` is the list of keys from the root to the circular reference,
// `target` is the ancestor object the reference points back to.
export type CircularReplacer = (path: unknown[], target: object) => unknown;

export type Configuration = {
  replaceToken?: unknown;
  replacer?: CircularReplacer;
};
