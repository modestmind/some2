import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./main-screen.module.css";
import MainHeaderComponent from "../components/main-header-component";
import SideMenuComponent from "../components/side-menu-component";
import HeroSectionComponent from "../components/hero-section-component";
import WorryGallerySectionComponent from "../components/worry-gallery-section-component";
import PainPointSectionComponent from "../components/pain-point-section-component";
import SolutionSectionComponent from "../components/solution-section-component";
import PreviewSectionComponent from "../components/preview-section-component";
import BenefitSectionComponent from "../components/benefit-section-component";
import ReviewsSectionComponent from "../components/reviews-section-component";
import CtaSectionComponent from "../components/cta-section-component";
import InfoModalComponent from "../components/info-modal-component";

const MainScreen = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const scrollToCta = () => {
    ctaRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.app}>
      <MainHeaderComponent
        onLoginClick={() => navigate("/login")}
        onMenuOpen={() => setIsMenuOpen(true)}
      />
      <SideMenuComponent
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
      <HeroSectionComponent onCtaClick={scrollToCta} />
      <WorryGallerySectionComponent />
      <PainPointSectionComponent />
      <SolutionSectionComponent />
      <PreviewSectionComponent
        onTagClick={(info) => setModalMessage(info)}
        onCtaClick={scrollToCta}
      />
      <BenefitSectionComponent />
      <ReviewsSectionComponent />
      <CtaSectionComponent
        ctaRef={ctaRef}
        onFinalCtaClick={() => navigate("/my-info")}
      />
      <footer className={styles.appFooter}>
        <p>COPYRIGHTⓒ연애판별소. All rights reserved.</p>
      </footer>
      <InfoModalComponent
        message={modalMessage}
        onClose={() => setModalMessage(null)}
      />
    </div>
  );
};

export default MainScreen;
