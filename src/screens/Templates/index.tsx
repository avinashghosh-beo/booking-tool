import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ButtonComponent } from "../../components/common/Button";
import { IoReload } from "react-icons/io5";
import DataTable from "../../components/tables";
import { useTranslation } from "react-i18next";
import { SearchInput } from "../../components/common/SearchInput";

const Templates = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="pb-16">
      <div className="flex flex-row flex-wrap gap-2 pb-4">
        <div className="flex">
          <SearchInput
            placeholder={t("shortStrings.search")}
            onChange={handleSearch}
            fillColor="bg-white"
            showIcon={true}
            iconPosition="left"
            debounceDelay={1000}
          />
        </div>
        <div className="hidden sm:block">
          <ButtonComponent
            size="sm"
            colorScheme="light"
            icon={
              <div className="p-2">
                <IoReload size={16} />
              </div>
            }
            onClick={() => {
              queryClient.invalidateQueries(["templates"]);
              setSearch("");
            }}
          />
        </div>
      </div>

      <div className="">
        <DataTable
          showPagination
          name="templates"
          filters={{
            search
          }}
        />
      </div>
    </div>
  );
};

export default Templates;
