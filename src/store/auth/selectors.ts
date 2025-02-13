import { createAppSelector } from '..';

export const userSelector = createAppSelector(
  [(state) => state.auth.user],
  (user) => user,
);
