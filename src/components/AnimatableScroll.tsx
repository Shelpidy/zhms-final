"use client";
import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation, Variants } from "framer-motion";

type AnimatableScrollProps = {
  children: JSX.Element;
  width?: "100%" | "fit-content";
};

const scrollVariant: Variants = {
  hidden: {
    y: 75,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.25, duration: 1, ease: "easeIn" },
  },
};

export default function AnimatableScroll({
  children,
  width = "fit-content",
}: AnimatableScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const scrollControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      console.log(isInView);
      scrollControls.start("visible");
    }
  }, [isInView, scrollControls]);

  return (
    <div
      ref={ref}
      style={{ width: width, position: "relative", overflow: "hidden" }}
    >
      <motion.div
        initial="hidden"
        variants={scrollVariant}
        animate={scrollControls}
      >
        {children}
      </motion.div>
    </div>
  );
}
