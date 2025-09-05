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
        sessionCreateState={sessionCreationStates[4]}
        nextSessionState={() => console.log('Next session')}
        prevSessionState={() => console.log('Previous session')}
      />
      {coffee}
      </div>
    );
  },
};
