/**
 * TEMPORARY CONFIGURATION - Issue #148
 * 
 * These values have been temporarily reduced for the current election cycle.
 * 
 * TO REVERT TO NORMAL REQUIREMENTS:
 * 1. Change REQUIRED_NOMINATIONS from 15 to 30
 * 2. Change MAX_COMMUNITY_NOMINATIONS from 7 to 15
 * 3. Change ENDORSEMENT_REQUIRED from false to true
 * 4. Update the temporary notices in app/page.tsx
 * 5. Re-enable endorsement button in components/Navbar.tsx
 * 
 * Original requirements (pre-Issue #148):
 * - REQUIRED_NOMINATIONS: 30
 * - MAX_COMMUNITY_NOMINATIONS: 15
 * - ENDORSEMENT_REQUIRED: true
 */

// TEMPORARY: Reduced from 30 to 15
export const REQUIRED_NOMINATIONS = 15;

// TEMPORARY: Reduced from 15 to 7
export const MAX_COMMUNITY_NOMINATIONS = 7;

// TEMPORARY: Set to false, originally true
export const ENDORSEMENT_REQUIRED = false;

// Flag to show temporary notice on the site
export const SHOW_TEMPORARY_NOTICE = true;
