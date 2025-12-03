import React, { useState } from 'react';
import FlatSlider from '../inputs/SessionInputs/FlatSlider';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof FlatSlider> = {
  title: 'Components/FlatSlider',
  component: FlatSlider,
};

export default meta;

type Story = StoryObj<typeof FlatSlider>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(50);
    return <FlatSlider value={value} onChange={setValue} />;
  },
};
