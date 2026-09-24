export type AssistantProduct = {
  id: number;
  name: string;
  slug: string;
  price: string;
  image: string;
  shortDescription: string;
  stockStatus: string;
};

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();
}

export function formatNaira(amount: string) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

export function toAssistantProduct(product: {
  id: number;
  name: string;
  slug: string;
  price: string;
  stock_status: string;
  short_description?: string;
  images?: Array<{ src: string }>;
}): AssistantProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    image: product.images?.[0]?.src || "/hero-2-fixed.png",
    shortDescription: stripHtml(product.short_description || "").slice(0, 220),
    stockStatus: product.stock_status,
  };
}

export function getMessageText(message: {
  parts?: Array<{ type: string; text?: string }>;
  content?: string;
}) {
  if (Array.isArray(message.parts)) {
    return message.parts
      .map((part) => (part.type === "text" ? part.text || "" : ""))
      .join("");
  }
  return message.content || "";
}

export function extractProductSlugs(text: string) {
  const matches = [...text.matchAll(/\]\(\/product\/([^)\s]+)\)/g)];
  return [...new Set(matches.map((match) => match[1]))];
}

export function stripProductLinks(text: string) {
  return text.replace(/\[([^\]]+)\]\(\/product\/[^)]+\)/g, "**$1**");
}

export function productsFromMessage(text: string, catalog: AssistantProduct[]) {
  return extractProductSlugs(text)
    .map((slug) => catalog.find((product) => product.slug === slug))
    .filter((product): product is AssistantProduct => Boolean(product));
}
