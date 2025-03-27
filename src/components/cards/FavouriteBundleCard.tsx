import React from "react";
import { ButtonComponent } from "../common/Button";
import { NoFavBundle, TrashIcon } from "../icons";
import { getFavouriteBundle } from "../../screens/Settings/api";
import { useQuery } from "@tanstack/react-query";
import { dateFormat } from "../../utils/dateformat";

const FavouriteBundleCard = ({ company }) => {
  const { data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ["favourite-bundle", company?.id],
    queryFn: () => getFavouriteBundle({ companyId: company?.id }),
    select: (data) => data?.data,
  });

  return (
    <div className="bg-primary-100 rounded-md p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-primary-700 font-bold">{company?.value}</h3>
        {isSuccess && (
          <ButtonComponent
            disabled={data?.canSetNewFavorite === false}
            size="sm"
            icon={<TrashIcon className="w-4 h-4" />}
            colorScheme="danger"
            onClick={() => {}}
          />
        )}
      </div>
      <div className="pt-3">
        {isError && (
          <div className="h-64 bg-white rounded-md flex items-center justify-center flex-col gap-4">
            <NoFavBundle className="w-32 h-32" />
            <ButtonComponent
              size="md"
              colorScheme="primary"
              title={"Create Favourite Bundle"}
              onClick={() => {}}
            />
          </div>
        )}
        {isFetching && (
          <div className="h-64 animate-pulse w-full pulse bg-gray-400 rounded-md" />
        )}
        {!isFetching && !isError && isSuccess && (
          <div className="h-64 bg-white rounded-md p-4 flex flex-col gap-4">
            {console.log(data)}
            <div className="flex items-center justify-between">
              <p className="text-primary-700 text-lg font-medium">
                {data?.favoriteBundle?.name}
              </p>
              <p className="text-black-700 text-md font-medium">
                Days Remaining:{" "}
                <span className="font-semibold">{data?.daysRemaining}</span>
              </p>
            </div>
            <div>
              <p className="text-black-700 text-md">
                Added Date:{" "}
                <span className="font-semibold">
                  {dateFormat(data?.addedDate)}
                </span>
              </p>
            </div>
          </div>
        )}
        {/* {isSuccess && (
          <PresetBundleCard
            type="PUBLIC"
            Name={"bundle.Name"}
            onClick={() => {}}
            selected={false}
            Products={[]}
            pricing={[]}
          />
        )} */}
      </div>
    </div>
  );
};

export default FavouriteBundleCard;
