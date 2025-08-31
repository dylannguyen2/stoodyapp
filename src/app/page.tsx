import PageClient from './PageClient';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stoody — Start',
  description: 'Create a Stoody Pomodoro session and focus with friends.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function Page() {
  return <PageClient />;
}
