import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ButtonComponent } from "../../components/common/Button";
import { IoReload } from "react-icons/io5";
import DataTable from "../../components/tables";
import { useTranslation } from "react-i18next";
import { SearchInput } from "../../components/common/SearchInput";
import { useSelector } from "react-redux";

interface CompaniesState {
  selectedCompanies: string[];
}

interface RootState {
  companies: CompaniesState;
}

const Invoice = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const { selectedCompanies } = useSelector((state: RootState) => state.companies);

  // Set language to German
  React.useEffect(() => {
    i18n.changeLanguage("de");
  }, [i18n]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="pb-16">
      <div className="flex flex-row flex-wrap gap-2 pb-4">
        <div className="flex">
          <SearchInput placeholder={t("strings.search")} onChange={handleSearch} fillColor="bg-white" showIcon={true} iconPosition="left" debounceDelay={1000} />
        </div>
        <div className="hidden sm:block">
          <ButtonComponent
            size="md"
            colorScheme="light"
            icon={<IoReload size={16} />}
            onClick={() => {
              queryClient.invalidateQueries(["invoices"]);
              setSearch("");
            }}
          />
        </div>
      </div>

      {/* Invoice Table */}
      <div>
        <DataTable
          showPagination
          name="invoices"
          filters={{
            search,
            company: selectedCompanies,
          }}
        />
      </div>
    </div>
  );
};

export default Invoice;
