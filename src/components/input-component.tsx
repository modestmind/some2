type InputComponentProps = {
  label: string;
  id: string;
  type: React.HTMLInputTypeAttribute;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement, HTMLInputElement>;
  errorMessage: string;
};

const InputComponent = (props: InputComponentProps) => {
  const { label, id, type, placeholder, value, onChange, errorMessage } = props;

  return (
    <div style={{ height: 90, marginBottom: 14 }}>
      <label style={{ display: "block", marginBottom: 4 }} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          fontSize: 14,
          border: "1px solid #ccc",
        }}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <div style={{ color: "red", fontSize: 14, padding: 4 }}>
        {errorMessage}
      </div>
    </div>
  );
};

export default InputComponent;
