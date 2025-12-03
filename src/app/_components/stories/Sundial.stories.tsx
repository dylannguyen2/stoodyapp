import React, { useState } from 'react';
import Sundial from '../inputs/SessionInputs/Sundial';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof Sundial> = {
  title: 'Components/Sundial',
  component: Sundial,
};

export default meta;

type Story = StoryObj<typeof Sundial>;

export const Default: Story = {
  render: () => {
    const [coffee, setCoffee] = useState(15);
    return <Sundial value={coffee} onChange={setCoffee} />;
  },
};
