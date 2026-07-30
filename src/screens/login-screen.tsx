import { useNavigate, useLocation } from "react-router-dom";
import classnames from "classnames/bind";
import styles from "./login-screen.module.css";
import SnsLoginButtonComponent from "../components/sns-login-button-component";
import useLogin from "../hooks/use-login";
import { toastActions } from "../shared/store/toast-slice";
import { useDispatch } from "react-redux";
import { GOOGLE_CLIENT_ID, KAKAO_JS_APP_KEY, KAKAO_REDIRECT_URI } from "../shared/config";

type LoginLocationState = {
  from?: string;
};

const cx = classnames.bind(styles);

const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { mutate: loginMutate } = useLogin();

  const from = (location.state as LoginLocationState)?.from ?? "/";

  const handleKakaoLogin = () => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_JS_APP_KEY);
    }
    window.Kakao.Auth.authorize({ redirectUri: KAKAO_REDIRECT_URI });
  };

  const handleGoogleLogin = () => {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        loginMutate(
          { sns_provider_code: "google", credential: response.credential },
          {
            onSuccess: () => navigate(from, { replace: true }),
            onError: () => {
              dispatch(toastActions.show({ message: "로그인에 실패했습니다. 다시 시도해 주세요!", code: 201 }));
            },
          }
        );
      },
    });
    window.google.accounts.id.prompt();
  };

  return (
    <div className={cx("loginApp")}>
      <header className={cx("loginHeader")}>
        <button type="button" className={cx("btnBack")} onClick={() => navigate(-1)}>
          ←
        </button>
        <div className={cx("logo")}>연애판별소</div>
        <div className={cx("spacer")} />
      </header>

      <section className={cx("loginSection")}>
        <div className={cx("loginTitleWrap")}>
          <div className={cx("iconHeart")}>💖</div>
          <h1 className={cx("loginTitle")}>다시 만나서 반가워요!</h1>
          <p className={cx("loginDesc")}>
            당신의 썸 판별 리포트를
            <br />
            지금 바로 확인해보세요.
          </p>
        </div>

        <div className={cx("loginBtnWrap")}>
          <SnsLoginButtonComponent type="kakao" onClick={handleKakaoLogin} />
          <SnsLoginButtonComponent type="google" onClick={handleGoogleLogin} />
        </div>

        <div className={cx("loginFooter")}>
          <p>
            로그인 시 연애판별소의 <a href="#">이용약관</a> 및{" "}
            <a href="#">개인정보처리방침</a>에 동의하게 됩니다.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LoginScreen;
