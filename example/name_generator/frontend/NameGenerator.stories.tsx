import { Meta } from "@storybook/react/types-6-0";
import React from "react";
import { NameGenerator } from "./NameGenerator";

export default {
  component: NameGenerator,
  title: "Examples / NameGenerator",
} as Meta<React.ComponentProps<typeof NameGenerator>>;

export const Component = (): JSX.Element => <NameGenerator />;
