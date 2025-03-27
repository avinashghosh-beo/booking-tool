import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RightIcon } from "../icons";
import { useSelector } from "react-redux";

const Breadcrumb = () => {
  const location = useLocation();
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  const navigate = useNavigate();
  const { route, title } = useSelector(
    (state) => state.appdata.breadCrumbTitle.customTitle
  );

  const formatBreadcrumb = (str) => {
    // Replace - or _ with spaces and capitalize the first letter
    return str.replace(/[-_]/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  };

  const generateBreadcrumbItems = () => {
    const pathnames = location.pathname.split("/").filter((path) => path);
    if (title && route === location?.pathname) {
      pathnames[1] = title;
    }

    const breadcrumbs = pathnames.map((value, index) => {
      const route = `/${pathnames.slice(0, index + 1).join("/")}`;
      const isLastItem = index === pathnames.length - 1;

      return {
        name: formatBreadcrumb(value), // Convert to readable name
        alias: value, // Use raw path segment
        route, // Construct full route
        isLastItem, // Mark if it's the last breadcrumb
      };
    });
    setBreadcrumbItems(breadcrumbs);
  };

  useEffect(() => {
    generateBreadcrumbItems();
  }, [location, route]);

  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center space-x-2"> 
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <li
              onClick={() => (!item?.isLastItem ? navigate(item?.route) : {})}
              className={`font-semibold ${
                item?.isLastItem
                  ? "text-primary-600"
                  : "cursor-pointer text-black-600 hover:text-primary-800"
              }`}
              aria-current={item?.isLastItem ? "page" : undefined}
            >
              {item?.name}
            </li>

            {!item?.isLastItem && (
              <li className="mx-2 text-black-500" aria-hidden="true">
                <RightIcon />
              </li>
            )}
          </React.Fragment>
        ))}
        {/* {location?.pathname === route && title && (
          <>
            <li className="mx-2 text-black-500" aria-hidden="true">
              <RightIcon />
            </li>
            <li className="font-semibold text-primary-600"> {title}</li>
          </>
        )} */}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
