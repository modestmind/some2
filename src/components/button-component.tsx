type ButtonComponentProps = {
  text: string;
  type: "submit" | "reset" | "button";
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};
const ButtonComponent = (props: ButtonComponentProps) => {
  const { text, type, style, onClick } = props;
  return (
    <button
      style={{
        padding: 12,
        cursor: "pointer",
        borderRadius: 8,
        border: "0",
        backgroundColor: "#3a6bfe",
        color: "#fff",
        fontSize: 16,
        ...style,
      }}
      type={type}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default ButtonComponent;
