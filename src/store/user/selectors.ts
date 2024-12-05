import { createAppSelector } from "../../store";

export const usersPageSelector = createAppSelector(
  [(state) => state.user.usersList.slice()],
  (users) => ({
    users,
  })
);
