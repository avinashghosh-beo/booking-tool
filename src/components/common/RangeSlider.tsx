import React, { useEffect } from "react";
import { Range } from "react-range";
import { COLORS } from "../../assets/theme/colors";

enum Direction {
  Right = "to right",
  Left = "to left",
  Down = "to bottom",
  Up = "to top",
}

function getTrackBackground({
  values,
  colors,
  min,
  max,
  direction = Direction.Right,
  rtl = false,
}) {
  if (rtl && direction === Direction.Right) {
    direction = Direction.Left;
  } else if (rtl && Direction.Left) {
    direction = Direction.Right;
  }
  // sort values ascending
  const progress = values
    .slice(0)
    .sort((a, b) => a - b)
    .map((value) => ((value - min) / (max - min)) * 100);
  const middle = progress.reduce(
    (acc, point, index) =>
      `${acc}, ${colors[index]} ${point}%, ${colors[index + 1]} ${point}%`,
    ""
  );
  return `linear-gradient(${direction}, ${colors[0]} 0%${middle}, ${
    colors[colors.length - 1]
  } 100%)`;
}

interface RangeSlideProps {
  value: number[];
  setValue?: Function;
  step?: number;
  min?: number;
  max: number;
}

const RangeSlider = ({ step = 1, min = 0, max = 100, setValue, value }) => {
  useEffect(() => {
    // console.log(value);
  }, [value]);

  return (
    <Range
      values={value}
      step={step}
      min={min}
      max={max}
      rtl={false}
      onChange={(values) => setValue(values)}
      renderTrack={({ props, children }) => (
        <div
          onMouseDown={props.onMouseDown}
          onTouchStart={props.onTouchStart}
          style={{
            ...props.style,
            height: "36px",
            display: "flex",
            width: "100%",
          }}
        >
          <div
            ref={props.ref}
            style={{
              height: "8px",
              width: "100%",
              borderRadius: "4px",
              background: getTrackBackground({
                values: value,
                colors: [COLORS.primary[600], COLORS.gray[200]],
                min: min,
                max: max,
                rtl: false,
              }),
              alignSelf: "center",
            }}
          >
            {children}
          </div>
        </div>
      )}
      renderThumb={({ props, isDragged }) => (
        <div
          {...props}
          key={props.key}
          style={{
            ...props.style,
            height: "20px",
            width: "20px",
            borderRadius: "20px",
            backgroundColor: COLORS.primary[700],
            display: "grid",
            placeItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-30px",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "14px",
              padding: "4px",
              borderRadius: "4px",
              backgroundColor: COLORS.primary[600],
            }}
          >
            {value[0].toFixed(0)}
          </div>
        </div>
      )}
    />
  );
};

export default RangeSlider;
