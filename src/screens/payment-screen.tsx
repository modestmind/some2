import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames/bind";
import styles from "./payment-screen.module.css";
import type { StateType } from "../shared/store/store";
import { toastActions } from "../shared/store/toast-slice";
import useCreateOrder from "../hooks/use-create-order";
import { decodeJwtPayload } from "../shared/utils/jwt-decode";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

const cx = classnames.bind(styles);

const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY as string;
const PAYMENT_AMOUNT = 3300;

const trustItems = [
  "결제 즉시 카카오 알림톡으로 리포트 링크가 동시 발송되어 평생 소장할 수 있습니다.",
  "상대방에게는 사주 조회 및 리포트 열람 사실이 절대 알림으로 가지 않으니 안심하세요.",
];

const PaymentScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const token = useSelector((state: StateType) => state.auth.token);
  const sajuProfileId = (location.state as { saju_profile_id?: number } | null)?.saju_profile_id;

  const userId = token ? (decodeJwtPayload(token).userId as string) : null;

  const { isPending, mutate: createOrderMutate } = useCreateOrder();

  if (token === null) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const handleCreateReport = () => {
    if (sajuProfileId === undefined || userId === null) {
      dispatch(toastActions.show({ message: "프로필 정보를 찾을 수 없습니다.", code: 400 }));
      return;
    }
    createOrderMutate(
      { saju_profile_id: sajuProfileId, payment_amount: PAYMENT_AMOUNT },
      {
        onSuccess: async ({ order_id }) => {
          try {
            const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
            const payment = tossPayments.payment({ customerKey: userId });
            await payment.requestPayment({
              method: "CARD",
              amount: { currency: "KRW", value: PAYMENT_AMOUNT },
              orderId: order_id,
              orderName: "썸 손절 판별 리포트",
              successUrl: `${window.location.origin}/payment/success`,
              failUrl: `${window.location.origin}/payment/fail`,
            });
          } catch(err) {
            dispatch(toastActions.show({ message: "결제 창을 열 수 없습니다. 다시 시도해 주세요.", code: 500 }));
          }
        },
        onError: () => {
          dispatch(toastActions.show({ message: "주문 생성 중 오류가 발생했습니다. 다시 시도해 주세요.", code: 500 }));
        },
      },
    );
  };

  return (
    <div className={cx("paymentApp")}>
      <header className={cx("paymentHeader")}>
        <button type="button" className={cx("btnBack")} onClick={() => navigate(-1)}>
          ←
        </button>
        <div className={cx("logo")}>연애판별소</div>
        <button type="button" className={cx("btnBack")} onClick={() => navigate("/")}>
          🏠
        </button>
      </header>

      <section className={cx("paymentSection")}>
        {/* 1. 분석 완료 알림 */}
        <div className={cx("visualAlert")}>
          <div className={cx("iconWrap")}>
            <div className={cx("rippleWave")} />
            <span className={cx("iconCheck")}>✨</span>
          </div>
          <h1 className={cx("alertTitle")}>
            두 분의 사주 데이터 매핑 및 분석이 완벽하게 완료되었습니다!
          </h1>
          <p className={cx("alertDesc")}>
            입력하신 [본인 사주] ➔ [상대방 사주] 분석 엔진 가동 완료
          </p>
        </div>

        {/* 2. 리포트 열람 절차 */}
        <div className={cx("unlockingStep")}>
          <div className={cx("lockIcon", "pulse")}>🔒</div>
          <h3 className={cx("stepTitle")}>[안내] 리포트 최종 열람 절차</h3>
          <p className={cx("stepDesc")}>
            본 분석은 한국천문연구원의 정밀 역법 데이터를 기반으로 도출된 1:1 맞춤형 비밀
            리포트입니다. 유저님의 소중한 개인정보와 분석 보안을 위해{" "}
            <strong>'최종 열람 권한 활성화'</strong>가 필요합니다.
          </p>
        </div>

        {/* 3. 가격 */}
        <div className={cx("priceArea")}>
          <div className={cx("priceLabelWrap")}>
            <span className={cx("priceLabel")}>커피 한 잔보다 가벼운 투자</span>
          </div>
          <div className={cx("priceAmount")}>
            최종 열람 패키지 활성화 비용: <strong>3,300원</strong>
          </div>
          <p className={cx("priceDesc")}>
            <em>
              * 밤새 혼자 의미 부여하며 앓아누울 커피 한 잔 값으로, 속 시원한 정답지를 1초 만에
              확인하세요.
            </em>
          </p>
        </div>

        {/* 4. CTA */}
        <div className={cx("ctaArea")}>
          <button
            type="button"
            className={cx("btnCta", { bounce: !isPending })}
            disabled={isPending}
            onClick={handleCreateReport}
          >
            {isPending ? "주문 처리 중..." : "[ 클릭 한번으로 리포트 열람 권한 활성화 ➔ ]"}
          </button>
          <p className={cx("subBadge")}>
            (카카오페이 / 토스페이 / 네이버페이로 3초 만에 간편 인증 및 열람)
          </p>
        </div>

        {/* 5. 안심 문구 */}
        <ul className={cx("trustList")}>
          {trustItems.map((item) => (
            <li key={item}>
              <span className={cx("trustIcon")}>✔︎</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default PaymentScreen;
