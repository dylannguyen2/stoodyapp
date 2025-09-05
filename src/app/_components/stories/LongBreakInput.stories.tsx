import LongBreakInput from '../inputs/LongBreakInput';
import type { Meta, StoryObj } from '@storybook/react';
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
    const sessionCreationStates = ['name', 'stoody', 'shortBreak', 'longBreak', 'cycles'] as const;
    return (
      <LongBreakInput
        onChange={setCoffee}
        value={coffee}
        sessionCreateState={sessionCreationStates[3]}
        nextSessionState={() => console.log('Next session')}
        prevSessionState={() => console.log('Previous session')}
      />
    );
  },
};
