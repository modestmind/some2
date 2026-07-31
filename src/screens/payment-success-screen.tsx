import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import classnames from "classnames/bind";
import styles from "./payment-success-screen.module.css";
import { confirmOrderRequest } from "../api/order-api";
import { toastActions } from "../shared/store/toast-slice";

const cx = classnames.bind(styles);

const PaymentSuccessScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const calledRef = useRef(false);

  const paymentKey = searchParams.get("paymentKey") ?? "";
  const orderId = searchParams.get("orderId") ?? "";
  const amount = Number(searchParams.get("amount") ?? "0");

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    confirmOrderRequest({ paymentKey, orderId, amount })
      .then(({ order_id, report_id }) => {
        navigate(`/report-creating?orderId=${order_id}&reportId=${report_id}`, { replace: true });
      })
      .catch(() => {
        dispatch(toastActions.show({ message: "결제 확인 중 오류가 발생했습니다. 고객센터에 문의해주세요.", code: 500 }));
        navigate("/", { replace: true });
      });
  }, []);

  return (
    <div className={cx("pageWrapper")}>
      <div className={cx("container")}>
        <div className={cx("spinner")} />
        <p className={cx("message")}>결제 확인 중...</p>
        <p className={cx("subMessage")}>잠시만 기다려 주세요.</p>
      </div>
    </div>
  );
};

export default PaymentSuccessScreen;
