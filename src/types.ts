export interface Product {
  name: string;
  spec: string;
  price: string;
}

export interface Supplier {
  id: string;
  businessName: string;
  contactName: string;
  phone: string;
  telegramUsername?: string;
  location: string;
  categories: string[];
  products: Product[];
  minOrder: string;
  delivery: "Yes" | "No" | "Negotiable";
  photoUrl: string;
  registeredAt: string;
  paymentStatus?: "unpaid" | "paid";
  paymentProvider?: "telebirr" | "cbe_birr" | "chapa" | "telegram_stars";
  paymentAmount?: string;
  paymentTxRef?: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
}

export type ThemeMode = "telegram-light" | "telegram-dark";
