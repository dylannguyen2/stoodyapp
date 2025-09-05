import PageClient from './PageClient';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stoody — Timer',
  description: 'Create a Stoody Pomodoro session and focus with friends.',
  icons: [{ rel: 'icon', url: '/public/logo.svg' }],
};

export default function Page() {
  return <PageClient />;
}
