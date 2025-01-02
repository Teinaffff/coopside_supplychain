import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../constants/interface/notification';

interface NotificationProps {
  notifications: Notification[];
}

const initialState: NotificationProps = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    fetchNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
    },
    updateNotifications(state, action: PayloadAction<string>) {
      const id = action.payload;
      const notification = state.notifications.find((n) => n._id === id);
      if (notification) {
        notification.seen = true;
      }
    },
  },
});

export const { fetchNotifications, updateNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
