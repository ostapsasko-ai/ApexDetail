import type { VehicleType } from "./pricing";

export type CartItem = {
  id: string;
  kind: "product" | "service";
  name: string;
  unitPrice: number;
  quantity: number;
  image?: string;
  vehicle?: VehicleType;
};

export type CartState = { items: CartItem[] };
export const EMPTY_CART: CartState = { items: [] };

export type CartAction =
  | { type: "add"; item: CartItem }
  | { type: "remove"; id: string }
  | { type: "setQuantity"; id: string; quantity: number }
  | { type: "hydrate"; items: CartItem[] }
  | { type: "clear" };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { items: action.items.filter((item) => item.quantity > 0 && item.unitPrice >= 0) };
    case "clear":
      return EMPTY_CART;
    case "remove":
      return { items: state.items.filter((item) => item.id !== action.id) };
    case "setQuantity":
      if (action.quantity < 0) return state;
      if (action.quantity === 0) return { items: state.items.filter((item) => item.id !== action.id) };
      return { items: state.items.map((item) => item.id === action.id ? { ...item, quantity: item.kind === "service" ? 1 : Math.floor(action.quantity) } : item) };
    case "add": {
      const existing = state.items.find((item) => item.id === action.item.id);
      if (!existing) return { items: [...state.items, { ...action.item, quantity: action.item.kind === "service" ? 1 : Math.max(1, action.item.quantity) }] };
      if (action.item.kind === "service") return { items: state.items.map((item) => item.id === action.item.id ? { ...action.item, quantity: 1 } : item) };
      return { items: state.items.map((item) => item.id === action.item.id ? { ...item, quantity: item.quantity + Math.max(1, action.item.quantity) } : item) };
    }
  }
}

export function getCartTotals(items: CartItem[]) {
  const productSubtotal = items.filter(({ kind }) => kind === "product").reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const serviceSubtotal = items.filter(({ kind }) => kind === "service").reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  return {
    productSubtotal,
    serviceSubtotal,
    subtotal: productSubtotal + serviceSubtotal,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    needsShipping: items.some(({ kind }) => kind === "product")
  };
}

