# REVERT INSTRUCTIONS - Issue #148

This document explains how to revert the temporary requirements changes back to the original values.

## Quick Revert Steps

### 1. Update Configuration File
Edit `/home/runner/work/senate-path/senate-path/lib/config/requirements.ts`:

```typescript
// Change these values:
export const REQUIRED_NOMINATIONS = 30;  // Currently 15
export const MAX_COMMUNITY_NOMINATIONS = 15;  // Currently 7
export const ENDORSEMENT_REQUIRED = true;  // Currently false
export const SHOW_TEMPORARY_NOTICE = false;  // Currently true
```

### 2. Optional: Remove Temporary Notice
If you want to completely remove the temporary notice banner from the home page, edit `app/page.tsx` and remove the Alert block (lines with `SHOW_TEMPORARY_NOTICE`).

### 3. Test the Changes
After updating the configuration:
- Run `npm run lint` to check for issues
- Run `npm run build` to ensure the app builds
- Test the application to ensure all UI updates correctly

## Files Modified (for reference)

1. **lib/config/requirements.ts** (NEW FILE)
   - Central configuration for requirements
   - Change values here to revert

2. **app/page.tsx**
   - Imports requirements constants
   - Shows temporary notice banner
   - Updated Step 2 text with dynamic values
   - Conditionally hides Step 3 (endorsement) and Endorse button
   - Renumbers Step 4 based on endorsement requirement

3. **components/UserDashboard.tsx**
   - Imports requirements constants
   - Updated badge color thresholds
   - Updated missing nominations calculation
   - Updated community nomination warning threshold
   - Updated all hardcoded "30" and "15" references

4. **components/AdminDashboard.tsx**
   - Imports requirements constants
   - Updated badge color thresholds
   - Updated hardcoded "30" reference in PDF description

5. **components/NominationsManager.tsx**
   - Imports MAX_COMMUNITY_NOMINATIONS
   - Updated community nomination warning threshold

6. **components/Navbar.tsx**
   - Imports ENDORSEMENT_REQUIRED
   - Conditionally shows/hides Endorse link

7. **lib/actions/applications.ts**
   - Updated comment to reflect temporary change

## What Changed

### Before (Original Requirements)
- 30 nominations required
- Maximum 15 from community constituency
- Endorsement form required
- Endorse button visible on home page and navbar

### After (Temporary Requirements - Issue #148)
- 15 nominations required
- Maximum 7 from community constituency
- Endorsement form NOT required
- Endorse button hidden
- Temporary notice displayed on home page
- Step 3 (Secure an Endorsement) hidden
- Step 4 renumbered to Step 3

## Comments Added

All changes include comments like:
- `// TEMPORARY: Updated for Issue #148`
- `// TEMPORARY: Reduced from X to Y`
- `// TO REVERT TO NORMAL REQUIREMENTS:`

Search for "TEMPORARY" or "Issue #148" in the codebase to find all modified sections.

## Testing After Revert

1. Check home page displays correct requirements (30 nominations, max 15 community)
2. Verify temporary notice is gone (or hidden)
3. Verify Endorse button is visible on home page and navbar
4. Verify Step 3 "Secure an Endorsement" is visible
5. Check UserDashboard shows correct thresholds (30 for green badge)
6. Check AdminDashboard shows correct thresholds
7. Verify warnings appear at correct thresholds (>15 community nominations)
