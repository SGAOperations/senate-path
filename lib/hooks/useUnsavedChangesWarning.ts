'use client';

import { useEffect } from 'react';

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
  useEffect(() => {
    // Handle browser navigation (back button, refresh, close tab)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only warn if form is dirty and not submitting and hasn't been successfully submitted
      const hasUnsavedChanges = isDirty && !isSubmitting && !submitSuccess;
      
      if (hasUnsavedChanges) {
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
  }, [isDirty, isSubmitting, submitSuccess]);

  // Note: This hook only handles browser navigation events (refresh, close, back button).
  // It does NOT intercept client-side navigation via Next.js <Link> components or router.push().
  // This is a limitation of Next.js App Router which doesn't currently provide navigation guards.
}
