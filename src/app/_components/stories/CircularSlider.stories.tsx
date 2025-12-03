import CircularSlider from '../inputs/SessionInputs/CircularSlider';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof CircularSlider> = {
  title: 'Components/CircularSlider',
  component: CircularSlider,
};

export default meta;

type Story = StoryObj<typeof CircularSlider>;

export const Default: Story = {
  render: () => <CircularSlider />
};
