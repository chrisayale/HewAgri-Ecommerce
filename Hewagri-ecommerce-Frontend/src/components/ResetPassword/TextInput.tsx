"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";

interface InputProps {
  label?: string;
  type: string;
  name: string;
  id?: string;
  value?: string | any;
  required?: boolean;
  placeholder?: string;
  error?: string | any;
  minLength?: number;
  maxLength?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  props?: any;
}

const TextInput = ({
  label,
  type,
  name,
  id,
  value,
  required,
  placeholder,
  error,
  minLength,
  maxLength,
  onChange,
  props,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor="phone"
          className="block text-[13px] font-medium leading-6 text-dark space-x-2"
        >
          <span>{label} </span>{" "}
          {required ? (
            <span className="text-red-500">*</span>
          ) : (
            <span className="text-gray-500">(Optional)</span>
          )}{" "}
          {error && <span className="text-red-400 text-sm">{error}</span>}
        </label>
      )}

      <div className="mt-1 relative rounded-md overflow-hidden">
        <input
          id={id}
          name={name}
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={onChange}
          minLength={minLength}
          maxLength={maxLength}
          {...props}
          className={`outline-none block w-full rounded-md py-1.5 text-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-green text-[14px] px-4 ${
            error ? "border border-red-500" : "border-0"
          }`}
        />
        {type === "password" && (
          <div
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 bg-gray-300 px-2 flex items-center justify-center right-0"
          >
            {showPassword ? (
              <EyeIcon className="w-5 h-5 text-black/60" />
            ) : (
              <EyeSlashIcon className="w-5 h-5 text-black/60" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextInput;
