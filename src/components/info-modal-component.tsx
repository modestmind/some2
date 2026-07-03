import cn from "classnames";
import styles from "./info-modal-component.module.css";

type InfoModalComponentProps = {
  message: string | null;
  onClose: () => void;
};

const InfoModalComponent = (props: InfoModalComponentProps) => {
  const { message, onClose } = props;

  return (
    <div className={cn(styles.modal, { [styles.modalActive]: message !== null })}>
      <div className={styles.modalContent}>
        <div className={styles.modalTitle}>상세 설명</div>
        <div className={styles.modalBody}>{message}</div>
        <button className={styles.modalClose} type="button" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
};

export default InfoModalComponent;
