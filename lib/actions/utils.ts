export type ActionError = { error: string };

export function isActionError(result: unknown): result is ActionError {
  return typeof result === 'object' && result !== null && 'error' in result;
}
