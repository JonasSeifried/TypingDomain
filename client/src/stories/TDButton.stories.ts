import type { Meta, StoryObj } from "@storybook/vue3";
import TDButton from "@/components/TDButton.vue";

const meta = {
  title: "Controls/Button",
  component: TDButton,
} satisfies Meta<typeof TDButton>;
export default meta;

type Story = StoryObj<typeof TDButton>;

export const Primary: Story = {
  args: {},
};
