import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    label: 'Añadir al carrito',
    styleType: 'primary',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Sin stock',
    disabled: true,
  },
};