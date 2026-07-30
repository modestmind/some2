import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginRequest } from "../api/login-api";
import { tokenActions } from "../shared/store/auth-slice";
import { toastActions } from "../shared/store/toast-slice";

const KakaoCallbackScreen = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
      dispatch(toastActions.show({ message: "카카오 로그인에 실패했습니다.", code: 201 }));
      navigate("/login", { replace: true });
      return;
    }

    if (sessionStorage.getItem("kakao_code") === code) return;
    sessionStorage.setItem("kakao_code", code);

    loginRequest({ sns_provider_code: "kakao", credential: code })
      .then((res) => {
        sessionStorage.removeItem("kakao_code");
        dispatch(tokenActions.set({ token: res.token, nickname: res.nickname }));
        navigate("/", { replace: true });
      })
      .catch(() => {
        sessionStorage.removeItem("kakao_code");
        dispatch(toastActions.show({ message: "로그인에 실패했습니다. 다시 시도해 주세요!", code: 201 }));
        navigate("/login", { replace: true });
      });
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      카카오 로그인 처리 중...
    </div>
  );
};

export default KakaoCallbackScreen;
