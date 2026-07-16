import cn from "classnames";
import styles from "./side-menu-component.module.css";
import { useDispatch, useSelector } from "react-redux";
import type { StateType } from "../store/store";
import ButtonComponent from "./button-component";
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/use-logout";
import { toastActions } from "../store/toast-slice";

type SideMenuComponentProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SideMenuComponent = (props: SideMenuComponentProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: StateType) => state.auth.token);
  const nickname = useSelector((state: StateType) => state.auth.nickname);
  const { isOpen, onClose } = props;

  const { mutate: logoutMutate } = useLogout();


  const handleWorking = () => {
    dispatch(toastActions.show({message: "준비중 입니다.", code: 200}));
  }

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSettled: () => {
        onClose();
        navigate("/");
      },
    });
  };

  return (
    <>
      <div
        className={cn(styles.menuOverlay, { [styles.menuOverlayActive]: isOpen })}
        onClick={onClose}
      />
      <div className={cn(styles.sideMenu, { [styles.sideMenuActive]: isOpen })}>
        <button type="button" className={styles.closeBtn} onClick={onClose}>✕</button>
        {token ? (
          <>
            <div className={styles.sideMenuHeader}>
              <div className={styles.userInfo}>
                <span className={styles.nickname}>{nickname}</span>님
              </div>
              <div className={styles.assetInfo}>
                <div className={styles.assetItem}>
                  <span className={styles.label}>보유 캐시</span>
                  <span className={styles.value}>0 C</span>
                </div>
                <div className={styles.assetItem}>
                  <span className={styles.label}>보유 포인트</span>
                  <span className={styles.value}>0 P</span>
                </div>
              </div>
            </div>
            <ul className={styles.sideMenuList}>
              <li>
                <button type="button" className={styles.logoutBtn} onClick={() => { navigate("/my-profile"); onClose(); }} >
                  썸 손절 리포트 받기
                </button>
              </li>
              <li>
                <button type="button" className={styles.logoutBtn} onClick={() => { navigate("/report-list"); onClose(); }} >
                  마이 리포트
                </button>
              </li>
              <li>
                <button type="button" className={styles.logoutBtn} onClick={handleWorking} >
                  캐시 내역
                </button>
              </li>
              <li>
                <button type="button" className={styles.logoutBtn} onClick={handleWorking} >
                  포인트 내역
                </button>
              </li>
              <li>
                <button type="button" className={styles.logoutBtn} onClick={handleLogout} >
                  로그아웃
                </button>
              </li>
            </ul>
          </>
        ) : (
          <div style={{ textAlign: "center", paddingTop: "50px" }}>
            <ButtonComponent
              text="로그인"
              type="button"
              style={{ width: "200px", backgroundColor: "var(--primary)" }}
              onClick={() => navigate("/login")}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SideMenuComponent;
