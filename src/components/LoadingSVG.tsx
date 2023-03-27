import React from "react";

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ margin: "auto" }}
      width="120"
      height="120"
      display="block"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 100 100"
    >
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="none"
        stroke="#ab2f3d"
        strokeDasharray="54.97787143782138 54.97787143782138"
        strokeLinecap="round"
        strokeWidth="10"
      >
        <animateTransform
          attributeName="transform"
          dur="0.641025641025641s"
          keyTimes="0;1"
          repeatCount="indefinite"
          type="rotate"
          values="0 50 50;360 50 50"
        ></animateTransform>
      </circle>
      <circle
        cx="50"
        cy="50"
        r="24"
        fill="none"
        stroke="#f8b93a"
        strokeDasharray="37.69911184307752 37.69911184307752"
        strokeDashoffset="37.699"
        strokeLinecap="round"
        strokeWidth="10"
      >
        <animateTransform
          attributeName="transform"
          dur="0.641025641025641s"
          keyTimes="0;1"
          repeatCount="indefinite"
          type="rotate"
          values="0 50 50;-360 50 50"
        ></animateTransform>
      </circle>
    </svg>
  );
}

export default Icon;
