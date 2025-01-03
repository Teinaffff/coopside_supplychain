import { createAppSelector } from "../..";

export const usersPageSelector = createAppSelector(
  [(state) => state.user.usersList.slice()],
  (users) => ({
    users,
  })
);
