// Helper function for translated form errors
import type { TranslationKey } from './translations';

/**
 * Utility to simplify error message translation in forms
 * Instead of: errors.field?.message ? t(errors.field.message as any) : undefined
 * Use: translateError(errors.field?.message, t)
 */
export const translateError = (
  errorMessage: string | undefined,
  t: (key: TranslationKey) => string
): string | undefined => {
  return errorMessage ? t(errorMessage as TranslationKey) : undefined;
};
