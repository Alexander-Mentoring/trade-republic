import type { Meta, StoryObj } from "@storybook/react";

import { Table } from "./Table";

const meta: Meta<typeof Table> = {
  title: "UI/Table",
  component: Table,
};

type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <Table headings={["Name", "Price"]} rows={[["US0378331005", "163 euro"]]} />
  ),
};

export default meta;
