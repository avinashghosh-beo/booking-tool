import React from "react";
import { format } from "date-fns";

interface NotificationItemCardProps {
  image?: string;
  title: string;
  description?: string;
  createdAt?: number | Date;
}

const NotificationItemCard: React.FC<NotificationItemCardProps> = ({
  title,
  image,
  description,
  createdAt = new Date(),
}) => {
  return (
    <div className="flex max-w-full p-2 mb-2 rounded-md bg-primary-50/70">
      <div className="flex items-center justify-center pr-2 min-w-20">
        <img
          src={image}
          alt="notification"
          className="w-16 h-16 rounded-md shadow-md"
        />
      </div>
      <div className="flex flex-col flex-grow overflow-hidden">
        {/* Title with ellipsis */}
        <p className="max-w-full font-semibold truncate text-md text-primary-700">
          {title}
        </p>
        {/* Description with two-line ellipsis */}
        <div className="flex-grow overflow-hidden">
          <p className="text-sm font-medium text-black-700 line-clamp-2">
            {description}
          </p>
        </div>
        <p className="text-xs text-black-500">
          {format(createdAt, "dd/MM/yyyy hh:mm")}
        </p>
      </div>
    </div>
  );
};

export default NotificationItemCard;
