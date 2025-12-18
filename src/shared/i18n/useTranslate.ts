// Custom Hook - useTranslate
import { useAppSelector } from '../../store/hooks';
import { useTranslation } from './translations';

/**
 * Custom hook that combines language selection and translation
 * Eliminates the need to repeat this pattern in every component:
 * ```
 * const language = useAppSelector((state) => state.preferences.language);
 * const t = useTranslation(language);
 * ```
 */
export const useTranslate = () => {
  const language = useAppSelector((state) => state.preferences.language);
  return useTranslation(language);
};
