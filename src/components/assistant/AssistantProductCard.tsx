"use client";

import Image from "next/image";
import { Check, ShoppingBag } from "@material-symbols-svg/react";
import { AssistantProduct, formatNaira } from "@/lib/assistant-catalog";

type AssistantProductCardProps = {
  product: AssistantProduct;
  isAdding: boolean;
  isAdded: boolean;
  onAdd: () => void;
  onOpen: () => void;
};

export default function AssistantProductCard({
  product,
  isAdding,
  isAdded,
  onAdd,
  onOpen,
}: AssistantProductCardProps) {
  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-sm overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={onOpen}
        className="w-full flex gap-3 p-3 text-left hover:bg-surface-container-low/60 transition-colors"
      >
        <div className="relative w-16 h-20 flex-shrink-0 bg-white overflow-hidden rounded-sm border border-outline-variant/15">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover mix-blend-multiply p-1"
            sizes="64px"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h4
            className="font-label-md text-[11px] uppercase tracking-[0.12em] text-on-surface leading-relaxed line-clamp-2"
            dangerouslySetInnerHTML={{ __html: product.name }}
          />
          <p className="font-headline-sm text-[15px] text-on-surface mt-1">
            {formatNaira(product.price)}
          </p>
        </div>
      </button>
      <div className="px-3 pb-3">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onAdd();
          }}
          disabled={isAdding || isAdded}
          className={`w-full h-9 rounded-full font-label-md text-[10px] uppercase tracking-[0.16em] flex items-center justify-center gap-1.5 transition-all duration-300 disabled:cursor-not-allowed ${
            isAdded
              ? "bg-surface-container text-on-surface"
              : "bg-on-background text-background hover:bg-primary hover:text-on-primary"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="text-[14px]" />
              Added
            </>
          ) : (
            <>
              <ShoppingBag className="text-[14px]" />
              {isAdding ? "Adding…" : "Add to bag"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
