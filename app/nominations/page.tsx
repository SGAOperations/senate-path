import { getSettings } from '@/lib/data/settings';
import NominationsPageClient from './nominations-form';

export default async function NominationsPage() {
  const settings = await getSettings();
  
  return <NominationsPageClient nominationsOpen={settings.nominationsOpen} />;
}
