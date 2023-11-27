import React from 'react';
import { Tooltip } from '@mui/material';

type ButtonsPropsType = {
  spanItem: string | JSX.Element;
  disabled?: boolean;
  hidden?: boolean;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  spanClassName?: string;
  tooltip?: string | false;
  error?: boolean;
};

export const Buttons = ({ size = 'md', className, spanClassName, spanItem, disabled, hidden, tooltip, error }: ButtonsPropsType) => {
  const widthHeightXS = 'w-[calc(7vw+5vh)] h-[calc(4vh)] mobile:w-[calc(7vw+5vh)]';
  const widthHeightSM = 'w-[calc(9vw+5vh)] h-[calc(4.6vh)] mobile:w-[calc(9vw+6vh)]';
  const widthHeightMD = 'w-[calc(9vw+7vh)] h-[calc(6vh)] mobile:w-[calc(9vw+8vh)]';
  const widthHeight = size === 'md' ? widthHeightMD : size === 'sm' ? widthHeightSM : widthHeightXS;
  const color = error ? 'bg-red-600 text-white' : 'bg-white text-slate-700';

  return (
    <>
      {!hidden && (
        <div className={`${className} ${color} ${widthHeight} flex justify-center items-center border-[2px] border-slate-500 ml-5`}>
          <button className={`flex items-center justify-center ${widthHeight} cursor-pointer disabled:cursor-default`} disabled={disabled}>
            <Tooltip title={tooltip}>
              <div className={spanClassName}>{spanItem}</div>
            </Tooltip>
          </button>
        </div>
      )}
    </>
  );
};
