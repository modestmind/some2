import { useRef } from "react";

type TextareaComponentProps = {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  errorMessage: string;
};

const TextareaComponent = (props: TextareaComponentProps) => {
  const { label, id, placeholder, value, onChange, errorMessage } = props;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    if (textareaRef.current !== null) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    onChange(e);
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", marginBottom: 4 }} htmlFor={id}>
        {label}
      </label>
      <textarea
        ref={textareaRef}
        id={id}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          fontSize: 14,
          border: "1px solid #ccc",
          resize: "none",
          minHeight: 120,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      <div style={{ color: "red", fontSize: 14, padding: 4 }}>
        {errorMessage}
      </div>
    </div>
  );
};

export default TextareaComponent;
