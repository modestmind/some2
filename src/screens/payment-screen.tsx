import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames/bind";
import styles from "./payment-screen.module.css";
import { toastActions } from "../store/toast-slice";
import type { StateType } from "../store/store";

const cx = classnames.bind(styles);

const trustItems = [
  "결제 즉시 카카오 알림톡으로 리포트 링크가 동시 발송되어 평생 소장할 수 있습니다.",
  "상대방에게는 사주 조회 및 리포트 열람 사실이 절대 알림으로 가지 않으니 안심하세요.",
];

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state: StateType) => state.token.token);

  if (token === null) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const handleActivate = () => {
    dispatch(
      toastActions.show({
        message: "카카오페이 / 토스페이 / 네이버페이 결제 모듈이 실행됩니다.",
        code: 200,
      })
    );
    // TODO: 실제 결제 모듈 연동
  };

  return (
    <div className={cx("paymentApp")}>
      <header className={cx("paymentHeader")}>
        <button type="button" className={cx("btnBack")} onClick={() => navigate(-1)}>
          ←
        </button>
        <div className={cx("logo")}>연애판별소</div>
        <div className={cx("spacer")} />
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
            className={cx("btnCta", "bounce")}
            onClick={handleActivate}
          >
            [ 클릭 한번으로 리포트 열람 권한 활성화 ➔ ]
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
