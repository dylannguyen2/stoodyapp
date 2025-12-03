import EditUI from '../inputs/EditUI';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof EditUI> = {
  title: 'Components/EditUI',
  component: EditUI,
};

export default meta;

type Story = StoryObj<typeof EditUI>;

export const Default: Story = {
  render: () => <EditUI />
};
