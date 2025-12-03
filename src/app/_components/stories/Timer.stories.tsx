// Timer.stories.tsx
import Timer from '../Timer';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof Timer> = {
  title: 'Components/Timer',
  component: Timer,
};

export default meta;

type Story = StoryObj<typeof Timer>;

export const Default: Story = {
  args: {
    stoody: 25,
    shortBreak: 5,
    longBreak: 15,
    cycles: 4,
  },
};
