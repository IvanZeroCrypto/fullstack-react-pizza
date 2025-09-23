import React from "react";
import { useInView } from "react-intersection-observer";
import "./scrollanimate.css";

interface IScrollAnimateProps {
  type: string;
  children: React.ReactNode;
}

const ScrollAnimate: React.FC<IScrollAnimateProps> = ({ type, children }) => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const getAnimationClass = () => {
    switch (type) {
      case "fade":
        return inView ? "fade-in" : "fade-out";
      case "slide-left":
        return inView ? "slide-in-left" : "slide-out-right ";
      case "slide-right":
        return inView ? "slide-in-right" : "slide-out-left";
      case "scale":
        return inView ? "scale-in" : "scale-out";
      default:
        return inView ? "fade-in" : "";
    }
  };

  return (
    <div
      data-testid="scroll-animate"
      className={`className ${getAnimationClass()}`}
      ref={ref}
    >
      {children}
    </div>
  );
};

export default ScrollAnimate;
