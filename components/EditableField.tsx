import React, { useState } from "react";

interface EditableFieldProps {
  value: string;
  placeholder?: string;
  onUpdate: (fieldKey: number, fieldSubKey: string, value: string) => void;
  fieldKey: number;
  fieldSubKey: string;
  link?: boolean; // Optional link property
  textareaEdit?: boolean; // New optional prop to toggle textarea editing
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  placeholder = "",
  onUpdate,
  fieldKey,
  fieldSubKey,
  link = false,
  textareaEdit = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey && !textareaEdit) {
      onUpdate(fieldKey, fieldSubKey, inputValue);
      setIsEditing(false);
      event.preventDefault();
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="flex items-center">
      {isEditing ? (
        <input
          type="text"
          className="input border border-gray-300 p-2 rounded"
          value={inputValue || ""}
          onChange={handleChange}
          onKeyDown={
            handleKeyDown as React.KeyboardEventHandler<HTMLInputElement>
          }
          onBlur={() => setIsEditing(false)}
          autoFocus
          placeholder={placeholder}
        />
      ) : link && value ? (
        <div className="flex group hover:bg-gray-100 p-2">
          <span
            className="hidden mr-2 group-hover:block text-sky-600"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </span>
          <a
            href={value}
            className="cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
          >
            {value}
          </a>
        </div>
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className="cursor-pointer hover:bg-gray-100 p-2"
        >
          {value || placeholder}
        </span>
      )}
    </div>
  );
};

export default EditableField;
