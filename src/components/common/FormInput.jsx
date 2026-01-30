const FormInput = ({
  id,
  name,
  type = "text",
  value = "", // Default to empty string to ensure controlled input
  onChange,
  label,
  placeholder,
  required = false,
  pattern,
  title,
  helperText,
  rows,
}) => {
  const isTextarea = type === "textarea";
  const InputComponent = isTextarea ? "textarea" : "input";

  // Ensure value is never undefined
  const controlledValue = value ?? "";

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-900 mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <InputComponent
        type={isTextarea ? undefined : type}
        id={id}
        name={name}
        value={controlledValue}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        pattern={pattern}
        title={title}
        rows={rows}
        className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 ${
          isTextarea ? "resize-none" : ""
        }`}
      />
      {helperText && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

export default FormInput;
