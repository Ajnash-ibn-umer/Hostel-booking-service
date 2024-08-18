import React, { Children } from "react";
import Link from "next/link";

interface ButtonPropTypes {
  label: string;
  link: string;
  customClasses: string;
  children?: React.ReactNode;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactElement | string;
  buttonType:"square" | "rounded-corner" | "capsule" | "transparent",
  background: "red" | "primary" | "green" ,
  fontColor: "black" | "white"
  // showIcon: boolean;
}

const Button: React.FC<ButtonProps> = ({ fontColor,buttonType, children, background,...props }) => {

  let customClasses =`bg-${background} text-${fontColor} px-10 py-3.5 lg:px-8 xl:px-10`

  switch(buttonType){
    case "square":
      customClasses=`bg-${background} text-${fontColor} px-10 py-3.5 lg:px-8 xl:px-10`
      break;
      case "rounded-corner":
        customClasses=`bg-${background} text-${fontColor} rounded-[5px] px-10 py-3.5 lg:px-8 xl:px-10`
        break;
      case "capsule":
        customClasses=`bg-${background} text-${fontColor} rounded-full px-10 py-3.5 lg:px-8 xl:px-10`
      break;
      case "transparent":
        customClasses=`border border-${background} text-${background} rounded-[5px] px-10 py-3.5 lg:px-8 xl:px-10`
  }
  return (
    <button className={`inline-flex items-center justify-center gap-2.5 text-center font-medium hover:bg-opacity-90 ${customClasses}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
