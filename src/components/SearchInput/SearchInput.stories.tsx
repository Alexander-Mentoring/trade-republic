import type { Meta, StoryObj } from "@storybook/react";

import { SearchInput } from "./SearchInput";

const meta: Meta<typeof SearchInput> = {
  title: "UI/SearchInput",
  component: SearchInput,
};

type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  render: () => <SearchInput placeholder="Provide ISIN" />,
};

export default meta;
