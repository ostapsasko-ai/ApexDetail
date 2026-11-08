export const PRODUCT_CATEGORIES = [
  { id: "car-care", label: "Kosmetyki samochodowe" },
  { id: "shampoos", label: "Szampony" },
  { id: "microfibers", label: "Mikrofibry" },
  { id: "accessories", label: "Akcesoria detailingowe" },
  { id: "wheel-care", label: "Preparaty do felg" },
  { id: "interior-care", label: "Pielęgnacja wnętrza" }
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]["id"];

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: ProductCategory;
  stock: number;
  featured: number;
  imagePosition: string;
};

export const PRODUCTS: Product[] = [
  { id: "microfiber-pro", name: "Mikrofibra Pro 600", price: 39, description: "Bezszwowa mikrofibra 600 GSM do finalnego docierania.", category: "microfibers", stock: 24, featured: 3, imagePosition: "58% center" },
  { id: "interior-brush", name: "Pędzel wnętrzarski Soft", price: 49, description: "Delikatne włosie do ekranów, nawiewów i piano black.", category: "interior-care", stock: 12, featured: 6, imagePosition: "78% center" },
  { id: "neutral-shampoo", name: "Szampon Neutral 500 ml", price: 59, description: "Śliska piana bez wosków, bezpieczna dla powłok.", category: "shampoos", stock: 18, featured: 1, imagePosition: "8% center" },
  { id: "interior-mist", name: "Interior Satin 500 ml", price: 69, description: "Naturalne, matowe wykończenie tworzyw i ochrona UV.", category: "interior-care", stock: 9, featured: 7, imagePosition: "25% center" },
  { id: "wheel-cleaner", name: "Wheel Reactor 750 ml", price: 79, description: "Preparat o neutralnym pH do pyłu i zabrudzeń metalicznych.", category: "wheel-care", stock: 16, featured: 4, imagePosition: "27% center" },
  { id: "wash-mitt", name: "Rękawica Wash Core", price: 89, description: "Gęste, miękkie włókna minimalizujące ryzyko mikrorys.", category: "accessories", stock: 7, featured: 5, imagePosition: "94% center" },
  { id: "ceramic-spray", name: "Ceramic Quick Coat", price: 119, description: "Hydrofobowy topper do szybkiego odświeżenia zabezpieczenia.", category: "car-care", stock: 11, featured: 2, imagePosition: "41% center" },
  { id: "coating-kit", name: "Apex Ceramic Kit", price: 189, description: "Demonstracyjny zestaw aplikacyjny powłoki do użytku świadomego.", category: "car-care", stock: 0, featured: 8, imagePosition: "41% center" }
];

export type CatalogFilters = { query: string; category: ProductCategory | "all"; sort: "featured" | "price-asc" | "price-desc" };

export function filterProducts(products: Product[], filters: CatalogFilters): Product[] {
  const query = filters.query.trim().toLocaleLowerCase("pl");
  const result = products.filter((product) => {
    const matchesCategory = filters.category === "all" || product.category === filters.category;
    const searchable = `${product.name} ${product.description}`.toLocaleLowerCase("pl");
    return matchesCategory && (!query || searchable.includes(query));
  });
  return [...result].sort((a, b) => {
    if (filters.sort === "price-asc") return a.price - b.price;
    if (filters.sort === "price-desc") return b.price - a.price;
    return a.featured - b.featured;
  });
}

