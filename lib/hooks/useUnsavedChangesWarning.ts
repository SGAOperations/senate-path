'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Hook to warn users about unsaved changes when they try to leave the page.
 * 
 * @param isDirty - Whether the form has unsaved changes
 * @param isSubmitting - Whether the form is currently being submitted
 * @param submitSuccess - Whether the form was successfully submitted
 */
export function useUnsavedChangesWarning(
  isDirty: boolean,
  isSubmitting: boolean,
  submitSuccess: boolean
) {
  const router = useRouter();
  const hasUnsavedChanges = useRef(false);

  useEffect(() => {
    // Update the ref when form state changes
    // Don't warn if form is submitting or was successfully submitted
    hasUnsavedChanges.current = isDirty && !isSubmitting && !submitSuccess;
  }, [isDirty, isSubmitting, submitSuccess]);

  useEffect(() => {
    // Handle browser navigation (back button, refresh, close tab)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges.current) {
        e.preventDefault();
        // Modern browsers require returnValue to be set
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Note: Next.js App Router doesn't provide a way to intercept client-side navigation
  // The beforeunload event handles browser navigation (refresh, close, back button)
  // For in-app navigation via Next.js router, users would need to implement
  // custom Link components or use the experimental navigation guards when available
}
