// Button.stories.ts|tsx

import type { Meta, StoryObj } from "@storybook/react";

import { ErrorBanner } from "./ErrorBanner";

const meta: Meta<typeof ErrorBanner> = {
  title: "UI/Button",
  component: ErrorBanner,
};

type Story = StoryObj<typeof ErrorBanner>;

export const Warning: Story = {
  render: () => (
    <ErrorBanner
      message="Connection lost"
      title="Network problem"
      type="warning"
    />
  ),
};

export const Error: Story = {
  render: () => (
    <ErrorBanner
      message="Connection lost"
      title="Network problem"
      type="error"
    />
  ),
};

export default meta;
