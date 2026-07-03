import classnames from "classnames/bind";
import styles from "./custom-checkbox-component.module.css";

const cx = classnames.bind(styles);

type CustomCheckboxComponentProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const CustomCheckboxComponent = (props: CustomCheckboxComponentProps) => {
  const { label, checked, onChange } = props;

  return (
    <label className={cx("checkboxLabel")}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={cx("customCheckbox")} />
      {label}
    </label>
  );
};

export default CustomCheckboxComponent;
