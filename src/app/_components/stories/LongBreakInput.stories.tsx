import LongBreakInput from '../inputs/SessionInputs/LongBreakInput';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const meta: Meta<typeof LongBreakInput> = {
  title: 'Components/LongBreakInput',
  component: LongBreakInput,
};

export default meta;

type Story = StoryObj<typeof LongBreakInput>;

export const Default: Story = {
  render: () => {
    const [coffee, setCoffee] = useState(15);
    return (
      <LongBreakInput
        onChange={setCoffee}
        value={coffee}
      />
    );
  },
};
