import React, { useMemo } from "react";
import { ButtonComponent } from "../common/Button";
import Skeleton from "react-loading-skeleton";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  FileText,
  Edit,
  Hourglass,
  CheckCircle,
  Edit3,
  CheckCircle2,
  Briefcase,
  Check,
  Globe,
  PowerOff,
} from "lucide-react";
import { Phase, getPhasesList } from "../../constants/phaseConfig";

interface OrderApprovalStatusCardProps {
  data: {
    ID: string;
    Titel: string;
    EndDate: Date;
    StellenanzeigenPhase: {
      SortID: number;
    };
  };
}

interface PhaseItemProps {
  isLastItem?: boolean;
  phaseData?: Phase;
  sortID?: number;
}

const PhaseItem: React.FC<PhaseItemProps> = ({
  isLastItem,
  phaseData,
  sortID,
}) => {
  const status = useMemo(() => {
    if (!phaseData?.sort || !sortID) return "pending";
    if (phaseData.sort === sortID) return "inProgress";
    if (phaseData.sort < sortID) return "completed";
    return "pending";
  }, [phaseData, sortID]);

  const icon = {
    pencil: <Pencil className="h-6" />,
    "file-text": <FileText className="h-6" />,
    edit: <Edit className="h-6" />,
    hourglass: <Hourglass className="h-6" />,
    "check-circle": <CheckCircle className="h-6" />,
    "edit-3": <Edit3 className="h-6" />,
    "check-circle-2": <CheckCircle2 className="h-6" />,
    briefcase: <Briefcase className="h-6" />,
    check: <Check className="h-6" />,
    globe: <Globe className="h-6" />,
    "power-off": <PowerOff className="h-6" />,
  };

  return (
    <div
      className={`flex flex-row items-center ${
        !!phaseData?.title ? "pb-24" : "pb-24"
      }`}
    >
      <div
        className={`relative flex justify-center items-center border-8 rounded-full w-12 h-12 bg-gray ${
          status === "completed"
            ? "border-primary-600"
            : status === "pending"
            ? "border-gray-200"
            : "border-secondary-200"
        }
      ${
        status === "completed"
          ? "bg-primary-600"
          : status === "pending"
          ? "bg-gray-200"
          : "bg-secondary-200"
      }`}
      >
        <div
          className={`${
            status === "completed" ? "text-primary-50" : "text-black-800"
          }`}
        >
          {phaseData?.icon && icon[phaseData.icon as keyof typeof icon]}
        </div>
        {phaseData?.title && (
          <div className="absolute text-center w-28 inset-y-12">
            {phaseData.title}
          </div>
        )}
      </div>
      {!isLastItem && (
        <div
          className={`w-32 h-3 mx-[-5px] ${
            status === "completed" ? "bg-primary-600" : "bg-gray-200"
          }`}
        />
      )}
    </div>
  );
};

const OrderApprovalStatusCard: React.FC<OrderApprovalStatusCardProps> = ({
  data,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const phasesList = useMemo(() => getPhasesList(t), [t]);

  // when iterating over phasesList, access and return relevant step-
  // let it be inner or outer
  const getPhaseData = (phaseItem: Phase) => {
    // check if inner steps exists
    if (phaseItem?.multiple && phaseItem.steps) {
      // if there are inner steps, check if there is a step present-
      // corresponding to the SortID of the current item
      let currentInnerStepArray = phaseItem.steps.filter(
        (item) => item.sort === data?.StellenanzeigenPhase?.SortID
      );
      // if so, return the item
      if (currentInnerStepArray.length > 0) {
        return currentInnerStepArray[0];
      } else {
        // if there is no SortID item present, return a random one,
        // preferably the first item
        return phaseItem.steps[0];
      }
    } else {
      //if there is no inner step, return the item itself
      return phaseItem;
    }
  };

  // returns current phase's data
  const currentPhaseData = useMemo(() => {
    // iterate over phaseslist inner steps and outer steps
    // return the actual step corresponding to the SortID
    let result = phasesList.reduce<Phase[]>((acc, item) => {
      const phaseData = getPhaseData(item);
      if (phaseData?.sort === data?.StellenanzeigenPhase?.SortID) {
        acc.push(phaseData);
      }
      return acc;
    }, []);

    //if found, return the item
    if (result.length > 0) return result[0];
    else return null;
  }, [data, phasesList]);

  function handleRedirect(actionName: string) {
    switch (actionName) {
      case "Job Ad Builder":
        navigate(`/approval-tool/${data?.ID}`);
        break;

      case "Review Ad":
        navigate(`/approval-tool/${data?.ID}`);
        break;

      default:
        navigate(`/approval-tool/${data?.ID}`);
        break;
    }
  }

  return (
    <div className="w-full p-4 mb-2 bg-white rounded-xl">
      <div className="flex flex-row w-full">
        <div className="">
          <img
            src="https://picsum.photos/200/300"
            className="object-cover w-16 h-16 rounded-md shadow"
            alt={data?.Titel}
          />
        </div>
        <div className="flex items-center flex-grow px-8 text-left">
          <div>
            <div className="pb-1 font-semibold">{data?.Titel}</div>
            <div>
              {t("strings.releaseDate")}{" "}
              <span className="font-semibold text-primary-600">
                {format(data?.EndDate, "dd.MM.yyyy")}
              </span>
            </div>
          </div>
        </div>
        <div className="">
          {currentPhaseData?.action && (
            <ButtonComponent
              size="sm"
              colorScheme="primary"
              title={currentPhaseData.action.label}
              onClick={() => handleRedirect(currentPhaseData.action!.name)}
            />
          )}
        </div>
      </div>
      <div className="flex flex-row items-center justify-center pt-4 w-100">
        <div className="flex flex-row">
          {phasesList.map((item, index) => (
            <PhaseItem
              sortID={data?.StellenanzeigenPhase?.SortID}
              phaseData={getPhaseData(item)}
              key={index}
              isLastItem={index === phasesList.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const OrderApprovalStatusCardSkeleton = () => {
  const statusArray = [
    {
      id: 0,
      status: "pending",
    },
    {
      id: 0,
      status: "pending",
    },
    {
      id: 0,
      status: "pending",
    },
    {
      id: 0,
      status: "pending",
    },
    {
      id: 0,
      status: "pending",
    },
  ];
  return (
    <div className="w-full p-4 mb-2 bg-white rounded-xl">
      <div className="flex flex-row w-full">
        <div className="min-h-16 min-w-16">
          <Skeleton className="w-16 h-16 rounded-md" />
        </div>
        <div className="flex items-center flex-grow px-8 text-left">
          <div>
            <div className="w-48 pb-1 font-semibold">
              <Skeleton className="w-48 h-6" />
            </div>
            <div className="w-32 max-w-64">
              <Skeleton />
            </div>
          </div>
        </div>
        <div className="min-w-24">
          <Skeleton className="w-24 h-8" />
        </div>
      </div>
      <div className="flex flex-row items-center justify-center pt-4 w-100">
        <div className="flex flex-row">
          {statusArray.map((item, index) => (
            <PhaseItem
              key={index}
              sortID={0}
              phaseData={{
                sort: 9,
                multiple: false,
                name: "",
                title: "",
                action: null,
                icon: "question",
              }}
              isLastItem={index === statusArray.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderApprovalStatusCard;
