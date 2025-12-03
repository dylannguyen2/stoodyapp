import TaskList from '../TaskList';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof TaskList> = {
  title: 'Components/TaskList',
  component: TaskList,
};

export default meta;

type Story = StoryObj<typeof TaskList>;

export const Default: Story = {
  render: () => <TaskList />
};
