import TimeButton from '../inputs/TimeButton';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof TimeButton> = {
  title: 'Components/TimeButton',
  component: TimeButton,
};

export default meta;

type Story = StoryObj<typeof TimeButton>;

export const Default: Story = {
  render: () => (
    <TimeButton
      text="45m"
      value={45}
      currentTime={30}
    />
  ),
};
