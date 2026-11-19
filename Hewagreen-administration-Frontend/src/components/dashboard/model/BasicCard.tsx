import React from "react";
const BasicCard = ({
  title,
  icon,
  value,
  percent,
  tag,
  color,
}: {
  title?: string;
  icon?: React.ReactNode;
  value?: number;
  percent?: number;
  tag?: string;
  color?: string;
}) => {
  return (
    <div className=" p-2">
      <a
        className="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white"
        href="#"
      >
        <div className="px-4 py-2 flex flex-col gap-4">
          <div className="flex justify-between mb-2">{icon}</div>
          <p className=" text-[14px] mb-[-12px]">{title}</p>
          <div className="ml-0 w-full flex justify-between items-end">
            <div className=" flex items-end gap-4">
              <div className="text-2xl font-bold leading-8 w-[100%]">
                {`${value}`}
              </div>

              {/* <div className=" text-base text-gray-600">{tag}</div> */}
            </div>
            <div className=" w-full flex justify-end">
              <div
                className={`${color} rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-[12px]`}
              >
                <span className="flex items-center">{`${percent} %`}</span>
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default BasicCard;
