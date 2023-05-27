// Button.stories.ts|tsx

import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
};

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  render: () => <Button />,
};

export default meta;
