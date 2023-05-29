// Button.stories.ts|tsx

import type { Meta, StoryObj } from "@storybook/react";

import { ErrorsList } from "./ErrorsList";

const meta: Meta<typeof ErrorsList> = {
  title: "UI/ErrorsList",
  component: ErrorsList,
};

type Story = StoryObj<typeof ErrorsList>;

export const Warning: Story = {
  render: () => <ErrorsList errors={["ISIN should be 12 length"]} />,
};

export default meta;
