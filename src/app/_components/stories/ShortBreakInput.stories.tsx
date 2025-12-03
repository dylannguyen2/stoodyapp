import ShortBreakInput from '../inputs/SessionInputs/ShortBreakInput';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const meta: Meta<typeof ShortBreakInput> = {
  title: 'Components/ShortBreakInput',
  component: ShortBreakInput,
};

export default meta;

type Story = StoryObj<typeof ShortBreakInput>;

export const Default: Story = {
  render: () => {
    const [coffee, setCoffee] = useState(15);
    return (
      <ShortBreakInput
        onChange={setCoffee}
        value={coffee}
      />
    );
  },
};
