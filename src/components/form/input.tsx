
import React, { FC, InputHTMLAttributes } from "react";

const PrimaryInput: FC<InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  ...props
}) => {
  return (
    <input
      {...props}
      className={`
        w-full mb-2 rounded-[10px] overflow-hidden
        border border-solid border-[#351052]
        bg-[#100525]
        px-8 py-3 text-sm text-[#e8c8ff]
        outline-none
        shadow-[0px_2px_0px_#080014]
        placeholder:text-[#a78abf]
        placeholder:font-normal
        transition-all duration-200
        focus:border-[#d946ef]
        focus:ring-1 focus:ring-[#70269c]
        focus:shadow-[0px_2px_8px_#70269c]
        disabled:cursor-not-allowed disabled:opacity-50
        ${className || ""}
      `}
    />
  );
};

export default PrimaryInput;
