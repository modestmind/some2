import { useSelector } from "react-redux";
import styles from "./main-header-component.module.css";
import type { StateType } from "../store/store";
import { useNavigate } from "react-router-dom";

type MainHeaderComponentProps = {
  onLoginClick: () => void;
  onMenuOpen: () => void;
};

const MainHeaderComponent = (props: MainHeaderComponentProps) => {
  const navigate = useNavigate();
  
  const token = useSelector((state: StateType) => state.auth.token);
  const { onLoginClick, onMenuOpen } = props;

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => navigate("/")}>연애판별소</div>
      <div className={styles.headerActions}>
        {token === null
        ? <button className={styles.btnLogin} type="button" onClick={onLoginClick}>로그인</button>
        : <button className={styles.btnHamburger} type="button" onClick={onMenuOpen}> ☰ </button>
        }
      </div>
    </header>
  );
};

export default MainHeaderComponent;
