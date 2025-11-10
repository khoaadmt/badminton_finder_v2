export const disabledDate = (current: any) => {
  const today = new Date();
  return current && current < today.setHours(0, 0, 0, 0);
};

export const filterOption = (
  input: string,
  option?: { label: string; value: string },
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
