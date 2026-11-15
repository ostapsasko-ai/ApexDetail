"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useCart } from "./cart-provider";

export function WheelCart() {
  const { totals, revision, setOpen } = useCart();
  const [isDriving, setIsDriving] = useState(false);

  const driveToCart = () => {
    if (!isDriving) setIsDriving(true);
  };

  return (
    <motion.button
      type="button"
      className="wheel-cart"
      aria-label={`Otwórz koszyk, liczba pozycji: ${totals.itemCount}`}
      onClick={driveToCart}
      disabled={isDriving}
      animate={{ x: isDriving ? [0, 90, 260] : 0, y: isDriving ? [0, -7, 0] : 0, opacity: isDriving ? [1, 1, 0] : 1 }}
      transition={{ duration: .72, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        if (!isDriving) return;
        setIsDriving(false);
        setOpen(true);
      }}
    >
      <motion.span key={revision} className="wheel-cart__rim" animate={{ rotate: isDriving ? 1080 : revision ? [0, 360] : 0 }} transition={{ duration: isDriving ? .72 : .55, ease: "easeOut" }}>
        <i /><i /><i /><i /><i />
        <b />
      </motion.span>
      {totals.itemCount > 0 && <span className="wheel-cart__count">{totals.itemCount > 99 ? "99+" : totals.itemCount}</span>}
    </motion.button>
  );
}

