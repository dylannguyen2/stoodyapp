import Navbar from '../Navbar';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navbar',
  component: Navbar,
};

export default meta;

type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  render: () => <Navbar />
};
