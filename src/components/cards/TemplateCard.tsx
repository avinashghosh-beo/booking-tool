import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface TemplateCardProps {
  id: number;
  thumbnail: string;
  image: string;
  Title: string;
  description: string;
  onClick: Function;
  active: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  id,
  thumbnail,
  BannerImage,
  Title,
  description,
  onClick,
  active,
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false); // Set loading to false when the image successfully loads
  };

  const handleImageError = () => {
    setIsLoading(false); // Remove loading state even if image fails to load
  };

  return (
    <div
      onClick={() => onClick()}
      className={`flex flex-col items-center justify-center cursor-pointer p-1 rounded-md transition-transform transform`}
    >
      <div
        className={`relative w-full h-36 rounded-xl ${
          active
            ? "border-4 border-primary-500 bg-primary-500"
            : "border-4 border-white bg-white hover:shadow-lg"
        }`}
      >
        {/* Skeleton Loader */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 rounded-md animate-pulse" />
        )}

        {/* Image */}
        <img
          src={BannerImage}
          alt={t("ariaLabels.cardImage")}
          className={`object-cover w-full h-full rounded-md ${
            isLoading ? "hidden" : "block"
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>

      {/* Title */}
      <p className="mt-2 text-sm font-medium text-gray-700">{Title}</p>
    </div>
  );
};

export default TemplateCard;
