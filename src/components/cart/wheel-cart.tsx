"use client";

import { motion } from "framer-motion";
import { useCart } from "./cart-provider";

export function WheelCart() {
  const { totals, revision, setOpen } = useCart();
  return (
    <button type="button" className="wheel-cart" aria-label={`Otwórz koszyk, liczba pozycji: ${totals.itemCount}`} onClick={() => setOpen(true)}>
      <motion.span key={revision} className="wheel-cart__rim" animate={{ rotate: revision ? [0, 360] : 0 }} transition={{ duration: .55, ease: "easeOut" }}>
        <i /><i /><i /><i /><i />
        <b />
      </motion.span>
      {totals.itemCount > 0 && <span className="wheel-cart__count">{totals.itemCount > 99 ? "99+" : totals.itemCount}</span>}
    </button>
  );
}

