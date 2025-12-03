import CycleInput from '../inputs/SessionInputs/CycleInput';
import type { Meta, StoryObj } from '@storybook/nextjs';
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
