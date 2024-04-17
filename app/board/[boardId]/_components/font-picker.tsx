"use client";

import { useState } from "react";

interface FontSizePickerProps {
  onChange: (fontSize: number) => void;
}

export const FontSizePicker = ({ onChange }: FontSizePickerProps) => {
  const [fontSizeInput, setFontSizeInput] = useState("");

  const handleFontSizeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFontSizeInput(value);
    onChange(parseInt(value));
  };

  return (
    <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200">
      
      <select name="fontSize" id="fontSize" defaultValue="16"
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="px-2 py-1 text-sm border border-neutral-300 rounded-md"
      >
        <option value="12">12</option>
        <option value="14">14</option>
        <option value="16">16</option>
        <option value="18">18</option>
        <option value="20">20</option>
        <option value="24">24</option>
        <option value="28">28</option>
        <option value="32">32</option>
        <option value="36">36</option>
        <option value="40">40</option>
        <option value="48">48</option>
        <option value="56">56</option>

      </select>
    </div>
  );
};
