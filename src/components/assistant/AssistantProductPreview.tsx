"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Close, Remove, Add, Check, ShoppingBag, ArrowForward } from "@material-symbols-svg/react";
import { AssistantProduct, formatNaira } from "@/lib/assistant-catalog";

type AssistantProductPreviewProps = {
  product: AssistantProduct;
  isAdding: boolean;
  isAdded: boolean;
  onAdd: (quantity: number) => void;
  onClose: () => void;
};

export default function AssistantProductPreview({
  product,
  isAdding,
  isAdded,
  onAdd,
  onClose,
}: AssistantProductPreviewProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="absolute inset-0 bg-surface z-20 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/15">
        <p className="font-label-md text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
          The details
        </p>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label="Close product details"
        >
          <Close className="text-[20px]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar p-4">
        <div className="relative w-full aspect-[4/5] bg-white rounded-sm overflow-hidden border border-outline-variant/15 mb-4">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover mix-blend-multiply p-6"
            sizes="400px"
          />
        </div>
        <h3
          className="font-headline-sm text-lg text-on-surface leading-tight mb-1"
          dangerouslySetInnerHTML={{ __html: product.name }}
        />
        <p className="font-headline-sm text-xl text-on-surface mb-3">
          {formatNaira(product.price)}
        </p>
        {product.shortDescription && (
          <p className="font-body-md text-[13px] text-on-surface-variant/80 leading-relaxed mb-5">
            {product.shortDescription}
          </p>
        )}
      </div>

      <div className="p-4 border-t border-outline-variant/15 flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="flex items-center border border-outline-variant/30 rounded-full h-11 w-[108px] flex-shrink-0 overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="flex-1 h-full text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center"
              aria-label="Decrease quantity"
            >
              <Remove className="text-[16px]" />
            </button>
            <span className="font-label-md text-[12px] w-7 text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((value) => value + 1)}
              className="flex-1 h-full text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center"
              aria-label="Increase quantity"
            >
              <Add className="text-[16px]" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => onAdd(quantity)}
            disabled={isAdding}
            className={`flex-1 h-11 rounded-full font-label-md text-[10px] uppercase tracking-[0.16em] flex items-center justify-center gap-1.5 transition-all duration-300 disabled:opacity-50 ${
              isAdded
                ? "bg-surface-container text-on-surface"
                : "bg-on-background text-background hover:bg-primary hover:text-on-primary"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="text-[16px]" />
                Added
              </>
            ) : (
              <>
                <ShoppingBag className="text-[16px]" />
                {isAdding ? "Adding…" : "Add to bag"}
              </>
            )}
          </button>
        </div>
        <Link
          href={`/product/${product.slug}`}
          className="h-10 rounded-full border border-outline-variant/40 text-on-surface font-label-md text-[10px] uppercase tracking-[0.16em] flex items-center justify-center gap-1.5 hover:bg-surface-container-low transition-colors"
        >
          View full details
          <ArrowForward className="text-[14px]" />
        </Link>
      </div>
    </div>
  );
}
