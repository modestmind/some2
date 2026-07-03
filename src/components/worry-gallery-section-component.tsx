import styles from "./worry-gallery-section-component.module.css";

const galleryImages = [
  { src: "/img/card_1.jpg", alt: "고민 1" },
  { src: "/img/card_2.jpg", alt: "고민 2" },
  { src: "/img/card_3.jpg", alt: "고민 3" },
  { src: "/img/card_4.jpg", alt: "고민 4" },
];

const WorryGallerySectionComponent = () => {
  return (
    <section className={styles.worryGallery}>
      <h2 className={styles.sectionTitle}>썸남 때문에 고민이신가요?</h2>
      <div className={styles.galleryGrid}>
        {galleryImages.map((img) => (
          <div key={img.alt} className={styles.galleryCard}>
            <img src={img.src} alt={img.alt} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorryGallerySectionComponent;
