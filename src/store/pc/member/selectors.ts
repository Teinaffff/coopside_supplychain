import { createAppSelector } from "../..";

export const membersPageSelector = createAppSelector(
  [(state) => state.member.membersList.slice()],
  (members) => ({
    members,
  })
);
