import React, { useEffect, useRef, useState } from "react";
import TemplateCard from "../../cards/TemplateCard";
import { useQuery } from "@tanstack/react-query";
import { getPrivateTemplates } from "../../../screens/BookingTool/api";
import { removeDuplicatesByID } from "../../../utils/array";

const LIMIT = 10;

const PrivateTemplates = ({ company, selectedTemplate, onSelect }) => {
  const [data, setData] = useState([]);
  const scrollContainerRef = useRef(null);
  const isLoadingMore = useRef(false);
  const [page, setPage] = useState(0);

  const privateTemplatesQuery = useQuery({
    queryKey: ["privateTemplates", company?.value, page],
    queryFn: () => getPrivateTemplates(company?.value, page),
    select: (data) => data.data,
    enabled: !!company?.value,
    onSuccess: (res) => {
      if (res?.records.length > 0) {
        let newData = [...data, ...res.records];
        newData = removeDuplicatesByID(newData);
        setData(newData);
      }
    },
  });

  // Safely access data for pagination
  const totalPages = privateTemplatesQuery.data?.totalPages ?? 0;
  const showLoadMore = totalPages > 0 && data.length < totalPages * LIMIT;

  // Modified scroll event handler
  useEffect(() => {
    let timeoutId;

    const handleScroll = (e) => {
      const element = e.target;

      // Clear any pending timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set new timeout to debounce the scroll event
      timeoutId = setTimeout(() => {
        if (
          element.scrollHeight - element.scrollTop - element.clientHeight <
            100 &&
          !privateTemplatesQuery.isLoading &&
          !privateTemplatesQuery.isFetching &&
          showLoadMore &&
          !isLoadingMore.current // Check if we're already loading
        ) {
          isLoadingMore.current = true; // Set loading flag
          setPage((current) => current + 1);
        }
      }, 300); // 300ms debounce
    };

    const currentRef = scrollContainerRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    privateTemplatesQuery.isLoading,
    privateTemplatesQuery.isFetching,
    showLoadMore,
  ]);

  // Reset loading flag when query completes
  useEffect(() => {
    if (!privateTemplatesQuery.isLoading && !privateTemplatesQuery.isFetching) {
      isLoadingMore.current = false;
    }
  }, [privateTemplatesQuery.isLoading, privateTemplatesQuery.isFetching]);

  return (
    <div ref={scrollContainerRef} className="grid grid-cols-1 md:grid-cols-2">
      {data?.map((item, index) => (
        <TemplateCard
          active={selectedTemplate === item?.ID}
          onClick={() => onSelect(item)}
          key={index}
          {...item}
        />
      ))}
    </div>
  );
};

export default PrivateTemplates;
