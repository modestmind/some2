import { useNavigate, useSearchParams } from "react-router-dom";
import classnames from "classnames/bind";
import styles from "./payment-fail-screen.module.css";

const cx = classnames.bind(styles);

const PaymentFailScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const message = searchParams.get("message") ?? "결제가 취소되었습니다.";

  return (
    <div className={cx("pageWrapper")}>
      <div className={cx("container")}>
        <div className={cx("card")}>
          <span className={cx("icon")}>✕</span>
          <h2 className={cx("title")}>결제 실패</h2>
          <p className={cx("message")}>{message}</p>
          <div className={cx("buttons")}>
            <button type="button" className={cx("btnRetry")} onClick={() => navigate(-1)}>
              다시 시도하기
            </button>
            <button type="button" className={cx("btnHome")} onClick={() => navigate("/")}>
              홈으로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailScreen;
