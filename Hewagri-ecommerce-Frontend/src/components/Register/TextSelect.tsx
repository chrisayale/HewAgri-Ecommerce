import PageLoader from "next/dist/client/page-loader";
import React from "react";

interface SelectProps {
  label?: string;
  name: string;
  id?: string;
  value?: string | any;
  required?: boolean;
  placeholder?: string;
  error?: string | any;
  props?: any;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  data: any[];
  disabled?: boolean;
}

const TextSelect = ({
  label,
  onChange,
  name,
  id,
  value,
  required,
  placeholder,
  error,
  data,
  props,
  disabled: disable,
}: SelectProps) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor="phone"
          className="block text-[13px] font-medium leading-6 text-dark space-x-2"
        >
          <span className="peer-disabled:text-gray-300">{label} </span>{" "}
          {required ? (
            <span className="text-red-500">*</span>
          ) : (
            <span className="text-gray-500">(Optional)</span>
          )}{" "}
          {error && <span className="text-red-400 text-sm">{error}</span>}
        </label>
      )}

      <div className="mt-1">
        <select
          disabled={disable}
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          {...props}
          className={`outline-none block w-full rounded-md py-1.5 text-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-green text-[14px] px-4 disabled:ring-gray-100 disabled:bg-gray-200 disabled:text-gray-500 peer ${
            error ? "border border-red-500" : "border-0"
          }`}
        >
          <option value="">{placeholder}</option>
          {data.map((item: { id: string; name: string }, index: number) => (
            <option key={index} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TextSelect;
