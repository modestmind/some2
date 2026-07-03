import classnames from "classnames/bind";
import styles from "./sns-login-button-component.module.css";

const cx = classnames.bind(styles);

type SnsLoginButtonComponentProps = {
  type: "kakao" | "google";
  onClick: () => void;
};

const SnsLoginButtonComponent = (props: SnsLoginButtonComponentProps) => {
  const { type, onClick } = props;

  const label = type === "kakao" ? "카카오 간편 로그인" : "구글 간편 로그인";

  return (
    <button type="button" className={cx("btnSns", type)} onClick={onClick}>
      <span className={cx("icon", type === "kakao" ? "iconKakao" : "iconGoogle")} />
      {label}
    </button>
  );
};

export default SnsLoginButtonComponent;
