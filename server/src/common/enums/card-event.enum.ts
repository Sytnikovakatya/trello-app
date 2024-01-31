const CardEvent = {
  CREATE: "card:create",
  REORDER: "card:reorder",
  RENAME: "card:rename",
  CHANGE_DESCRIPTION: "card:change-description",
} as const;

export { CardEvent };
