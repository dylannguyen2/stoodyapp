import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import LastPresetCard from '../cards/LastPresetCard';

const meta: Meta<typeof LastPresetCard> = {
  title: 'Components/LastPresetCard',
  component: LastPresetCard,
};

export default meta;

type Story = StoryObj<typeof LastPresetCard>;

export const Default: Story = {
  render: () => {
    return <LastPresetCard 
    name="Dylan"
    stoody={25}
    shortBreak={5}
    longBreak={15}
    cycles={4}
    />;
  },
};
