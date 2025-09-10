import ShortBreakInput from '../inputs/ShortBreakInput';
import type { Meta, StoryObj } from '@storybook/react';
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
    const sessionCreationStates = ['name', 'stoody', 'shortBreak', 'longBreak', 'cycles'] as const;
    return (
      <ShortBreakInput
        onChange={setCoffee}
        value={coffee}
      />
    );
  },
};
