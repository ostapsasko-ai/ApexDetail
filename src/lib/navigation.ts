export type NavigationItem = {
  href: string;
  label: string;
};

export const NAV_ITEMS: NavigationItem[] = [
  { href: "/", label: "Start" },
  { href: "/uslugi", label: "Usługi" },
  { href: "/kalkulator", label: "Kalkulator" },
  { href: "/rezerwacja", label: "Rezerwacja" },
  { href: "/sklep", label: "Sklep" },
  { href: "/koszyk", label: "Koszyk" },
  { href: "/zamowienie", label: "Zamówienie" },
  { href: "/galeria", label: "Galeria" },
  { href: "/o-nas", label: "O nas" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/admin", label: "Panel administracyjny" }
];

