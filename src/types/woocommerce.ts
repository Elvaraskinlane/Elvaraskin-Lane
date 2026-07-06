export interface WCCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string;
  short_description: string;
  stock_status: string;
  categories: WCCategory[];
  images: WCImage[];
}

export interface WCImage {
  id: number;
  src: string;
  alt: string;
  name?: string;
}
