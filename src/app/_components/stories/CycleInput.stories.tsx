import CycleInput from '../inputs/CycleInput';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta<typeof CycleInput> = {
  title: 'Components/CycleInput',
  component: CycleInput,
};

export default meta;

type Story = StoryObj<typeof CycleInput>;

export const Default: Story = {
  render: () => {
    const [coffee, setCoffee] = useState(0);
    const sessionCreationStates = ['name', 'stoody', 'shortBreak', 'longBreak', 'cycles'] as const;
    return (
      <div>
      <CycleInput
        onChange={setCoffee}
        value={coffee}
      />
      {coffee}
      </div>
    );
  },
};
