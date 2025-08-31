import Notepad from './Notepad';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Notepad> = {
  title: 'Components/Notepad',
  component: Notepad,
};

export default meta;

type Story = StoryObj<typeof Notepad>;

export const Default: Story = {
  render: () => (
    <Notepad
    />
  ),
};
