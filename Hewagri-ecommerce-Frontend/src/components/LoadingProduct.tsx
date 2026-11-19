import React from "react";

const LoadingProduct = () => {
  return (
    <div className="animate-pulse group bg-light/50 drop-shadow-md rounded-lg overflow-hidden">
      <div className="relative w-full h-[100px] bg-gray-500/10"></div>
      <div className="p-2 lg:p-3 relative space-y-2">
        <p className="inline-flex items-center justify-start text-start space-x-2 text-[14px]">
          <span className="font-semibold bg-gray-500/10 p-1 w-[100px]"></span>
        </p>

        <div className="flex items-center justify-start space-x-1">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className="p-1 bg-gray-500/10 rounded-full"
            ></span>
          ))}
        </div>

        <div className="absolute inset-y-0 right-0 flex flex-col items-center justify-center px-2 lg:px-5">
          <span className="w-6 h-6 bg-gray-500/20 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default LoadingProduct;
