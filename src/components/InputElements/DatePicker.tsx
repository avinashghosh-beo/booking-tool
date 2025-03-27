import React, { useMemo, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Popover from "../common/PopoverActions";
import { Calendar, DateRangePicker } from "react-date-range";
import { useTranslation } from "react-i18next";
import { ButtonComponent } from "../common/Button";
import Chip from "../common/Chip";
import { COLORS } from "../../assets/theme/colors";
import { CalendarIcon, CloseCircleIcon } from "../icons";
import { format, addDays } from "date-fns";

interface DatePickerProps {
  date: Date;
  onChange: Function;
  popverPlacement?: string;
  placeholder?: string;
  onClear?: Function;
  minDate?: Date;
}

export const CustomDatePicker: React.FC<DatePickerProps> = ({
  date,
  onChange,
  popverPlacement = "bottom",
  placeholder = "Select Date",
  onClear = () => {},
  minDate = new Date(),
}) => {
  return (
    <Popover
      wrapperClassName="w-full"
      mode="select"
      containerStyle="w-auto"
      title="Date Picker"
      content={
        <Calendar date={new Date(date)} minDate={minDate} onChange={onChange} />
      }
      placement={popverPlacement}
    >
      <ButtonComponent
        buttonStyle="w-full"
        colorScheme="default"
        onClick={() => {}}
        size="md"
        icon={
          <div className="flex">
            {date && (
              <div
                className="flex items-center justify-center pr-2 group"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClear();
                }}
              >
                <CloseCircleIcon className="text-gray-500 group-hover:text-primary-600 transition-colors" />
              </div>
            )}
            <CalendarIcon className="h-6 text-gray-500 hover:text-primary-600 transition-colors" />
          </div>
        }
        title={date === null ? placeholder : format(date, "dd/MM/yyyy")}
      />
    </Popover>
  );
};

const RangePickerTitle = ({ options, active, setActive }) => {
  return (
    <div className="flex flex-row gap-2">
      {options.map((item, index) => (
        <Chip
          type={item?.type}
          key={index}
          selected={active === item?.alias}
          onClick={() => setActive(item?.alias)}
          showDot={false}
        >
          {item.title}
        </Chip>
      ))}
    </div>
  );
};

interface DateRangerPickerProps {
  dateRanges: { startDate: Date; endDate: Date | null; key: string }[];
  onChange: Function;
  rangePickerOptions: {}[];
}

export const CustomDateRangePicker: React.FC<DateRangerPickerProps> = ({
  dateRanges,
  rangePickerOptions,
  onChange,
}) => {
  const { t } = useTranslation();
  const [active, setActive] = useState("all");

  const staticRanges = [
    {
      label: t("shortStrings.lastMonth"),
      range: () => ({
        startDate: new Date(
          new Date().getFullYear(),
          new Date().getMonth() - 1,
          1
        ),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      }),
      isSelected: (ranges) => {},
    },
    {
      label: t("shortStrings.thisMonth"),
      range: () => ({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(),
      }),
      isSelected: (ranges) => {},
    },
    {
      label: t("shortStrings.last30Days"),
      range: () => {
        const endDate = new Date();
        const startDate = new Date(new Date().setDate(endDate.getDate() - 30));
        return {
          startDate,
          endDate,
        };
      },
      isSelected: (ranges) => {},
    },
    {
      label: t("shortStrings.last90Days"),
      range: () => {
        const endDate = new Date();
        const startDate = new Date(new Date().setDate(endDate.getDate() - 90));
        return {
          startDate,
          endDate,
        };
      },
      isSelected: (ranges) => {},
    },
    {
      label: t("shortStrings.last180Days"),
      range: () => {
        const endDate = new Date();
        const startDate = new Date(new Date().setDate(endDate.getDate() - 180));
        return {
          startDate,
          endDate,
        };
      },
      isSelected: (ranges) => {},
    },
    {
      label: t("shortStrings.last365Days"),
      range: () => {
        const endDate = new Date();
        const startDate = new Date(new Date().setDate(endDate.getDate() - 365));
        return {
          startDate,
          endDate,
        };
      },
      isSelected: (ranges) => {},
    },
  ];

  const rangeColor = {
    all: [COLORS.primary[600], COLORS.primary[600]],
    online: [COLORS.success[400], COLORS.success[400]],
    offline: [COLORS.danger[400], COLORS.danger[400]],
  };

  const activeRangeColor = useMemo(() => {
    const activeItem = rangePickerOptions.find(
      (item) => item?.alias === active
    );
    return activeItem?.color || ""; // Assuming there's a `color` property in the item
  }, [rangePickerOptions, active]);

  return (
    <Popover
      mode="select"
      containerStyle="w-auto"
      title={
        <RangePickerTitle
          options={rangePickerOptions}
          active={active}
          setActive={setActive}
        />
      }
      content={
        <div className="flex flex-row ">
          <div>
            <DateRangePicker
              staticRanges={staticRanges}
              color={COLORS.primary[600]}
              rangeColors={[activeRangeColor, activeRangeColor]}
              editableDateInputs={true}
              onChange={(item) => onChange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={dateRanges}
              months={1}
              showDateDisplay={false}
            />
          </div>
        </div>
      }
      placement="bottom"
    >
      <ButtonComponent
        buttonStyle="w-full"
        colorScheme="light"
        onClick={() => {}}
        size="md"
        icon={<CalendarIcon className="h-6 ml-2" />}
        title={
          format(dateRanges[0]?.startDate, "dd/MM/yyyy") +
          " - " +
          format(dateRanges[0]?.endDate, "dd/MM/yyyy")
        }
      />
      {/* <ButtonComponent
        colorScheme="light"
        onClick={() => {}}
        size="sm"
        title={"Jan 1 - Jan 30"}
      /> */}
    </Popover>
  );
};
