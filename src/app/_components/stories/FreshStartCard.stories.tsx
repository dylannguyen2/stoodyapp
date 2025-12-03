import type { Meta, StoryObj } from '@storybook/nextjs';
import FreshStartCard from '../cards/FreshStartCard';

const meta: Meta<typeof FreshStartCard> = {
  title: 'Components/FreshStartCard',
  component: FreshStartCard,
};

export default meta;

type Story = StoryObj<typeof FreshStartCard>;

export const Default: Story = {
  render: () => {
    return <FreshStartCard 
    onClick={() => {alert("Fresh Start Clicked!");}}
    />;
  },
};
