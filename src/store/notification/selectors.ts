import { createAppSelector } from "..";

export const usersPageSelector = createAppSelector(
  [(state) => state.notification.notifications.slice()],
  (notifications) => ({
    notifications,
  })
);
