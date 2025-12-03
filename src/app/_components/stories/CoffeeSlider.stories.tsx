import React, { useState } from 'react';
import CoffeeSlider from '../inputs/SessionInputs/CoffeeSlider';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof CoffeeSlider> = {
  title: 'Components/CoffeeSlider',
  component: CoffeeSlider,
};

export default meta;

type Story = StoryObj<typeof CoffeeSlider>;

export const Default: Story = {
  render: () => {
    const [coffee, setCoffee] = useState(15);
    return <CoffeeSlider value={coffee} onChange={setCoffee} />;
  },
};
