import { getSettings } from '@/lib/data/settings';
import { NavbarClient } from './NavbarClient';

export async function Navbar() {
  const settings = await getSettings();
  return <NavbarClient settings={settings} />;
}
