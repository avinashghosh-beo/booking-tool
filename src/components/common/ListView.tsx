import React, { ReactElement } from "react";

interface ListViewProps {
  items: {
    type?: "item" | "separator";
    color?: "normal" | "danger";
    title: string;
    icon?: string;
    onClick?: Function;
    selected?: boolean;
  }[];
  style?: string;
  renderItem?: Function;
}

const ListView: React.FC<ListViewProps> = ({
  items,
  style = "",
  renderItem,
}) => {
  return (
    <ul
      className={`flex flex-col *:cursor-pointer *:transition-colors text-primary-800 ${style} overflow-hidden overflow-y-auto`}
    >
      {items?.map((item, index) =>
        item?.type === "separator" ? (
          <li key={index} className="h-px my-2 bg-primary-50"></li>
        ) : renderItem ? (
          renderItem(item)
        ) : (
          <li
            onClick={item?.onClick ? () => item.onClick() : () => {}}
            className={`flex items-center text-sm gap-2 px-2 py-1 my-1 rounded-md hover:bg-primary-100 ${
              item?.selected ? "bg-primary-50" : "bg-white"
            } ${item?.color === "danger" ? "text-danger-600" : ""}`}
            key={index}
          >
            {item?.icon && (
              <span className="text-gray-500 min-w-10">{item?.icon}</span>
            )}
            {item?.title}
          </li>
        )
      )}
    </ul>
  );
};

export default ListView;
