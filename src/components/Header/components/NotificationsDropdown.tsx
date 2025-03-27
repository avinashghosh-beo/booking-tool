import React from "react";
import Popover from "../../common/PopoverActions";
import ListView from "../../common/ListView";
import { MaximizeIcon, NotificationIcon, TrashIcon } from "../../icons";
import NotificationItemCard from "../../cards/NotificationItemCard";
import { useNavigate } from "react-router-dom";

const notificationItems = [
  {
    image: "https://picsum.photos/id/237/200/300",
    title: "Notification",
    description: "Notification Description ",
    createdAt: new Date().toISOString(),
  },
  {
    image: "https://picsum.photos/id/237/200/300",
    title: "Notification",
    description: "Notification Description",
    createdAt: new Date().toISOString(),
  },
  {
    image: "https://picsum.photos/id/237/200/300",
    title: "Notification",
    description: "Notification Description",
    createdAt: new Date().toISOString(),
  },
  {
    image: "https://picsum.photos/id/237/200/300",
    title: "Notification",
    description: "Notification Description",
    createdAt: new Date().toISOString(),
  },
  {
    image: "https://picsum.photos/id/237/200/300",
    title: "Notification",
    description: "Notification Description",
    createdAt: new Date().toISOString(),
  },
  {
    image: "https://picsum.photos/id/237/200/300",
    title: "Notification",
    description: "Notification Description",
    createdAt: new Date().toISOString(),
  },
  {
    image: "https://picsum.photos/id/237/200/300",
    title: "Notification",
    description: "Notification Description",
    createdAt: new Date().toISOString(),
  },
  {
    image: "https://picsum.photos/id/237/200/300",
    title: "Notification",
    description: "Notification Description",
    createdAt: new Date().toISOString(),
  },
  {
    image: "https://picsum.photos/id/237/200/300",
    title: "Notification",
    description: "Notification Description",
    createdAt: new Date().toISOString(),
  },
];

const NotificationsDropdown = () => {
  const navigate = useNavigate();

  const handleClearNotification = () => {};

  const titleComponent = (
    <div className="flex justify-between pb-4 pr-2">
      <p className="text-primary-700">Notifications</p>
      <button
        onClick={() => navigate("/notifications")}
        className="flex items-center justify-between font-medium text-black-500 gap-x-2 hover:text-primary-700"
      >
        <MaximizeIcon />
        Maximize
      </button>
    </div>
  );
  return (
    <Popover
      footer={
        <div
          onClick={handleClearNotification}
          className="flex items-center justify-end pt-2 text-sm font-medium cursor-pointer gap-x-1 text-danger-700 hover:text-danger-500"
        >
          <TrashIcon className="h-4" />
          Clear all
        </div>
      }
      containerStyle="w-[80vw] sm:w-96"
      mode="select"
      title={titleComponent}
      content={
        <ListView
          renderItem={(data) => <NotificationItemCard {...data} />}
          style="max-h-[80vh] overflow-hidden overflow-y-auto pr-2"
          items={notificationItems}
        />
      }
      placement="bottomRight"
    >
      <div className="px-2 cursor-pointer text-primary-700 hover:text-primary">
        <NotificationIcon />
      </div>
    </Popover>
  );
};

export default NotificationsDropdown;
