import { useState, memo } from "react";
import AddToCartButton from "./AddToCartButton";
import PriceConfigsBottomSheet from "./PriceConfigsBottomSheet";
import ProductDetailOverlay from "./ProductDetailOverlay";

const ProductCard = ({ product, activeConfig }) => {
  const [showSheet, setShowSheet] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const isMultiConfig = product.priceConfigs?.length > 1;
  const isAvailable = product.available !== false;

  const getPrice = (c) => c?.sellingPrice ?? 0;

  const displayConfig =
    activeConfig ??
    product.priceConfigs?.reduce(
      (min, c) => (getPrice(c) < getPrice(min) ? c : min),
      product.priceConfigs[0],
    );

  const price = getPrice(displayConfig);
  const discount =
    displayConfig?.mrp > price
      ? Math.round(((displayConfig.mrp - price) / displayConfig.mrp) * 100)
      : 0;

  const openDetail = () => setShowDetail(true);

  const openSheet = (e) => {
    e.stopPropagation();
    if (!isAvailable) return;
    setShowSheet(true);
  };

  return (
    <>
      <div
        className={`bg-white rounded-[9px] border border-slate-200 overflow-hidden transition-all ${
          !isAvailable ? "opacity-60 grayscale" : ""
        }`}
      >
        {/* Image with overlaid ADD button — matches Flutter app layout */}
        <div
          className="relative aspect-square overflow-hidden cursor-pointer bg-[#F5F5F5]"
          onClick={openDetail}
          role="button"
          tabIndex={0}
          aria-label={`View ${product.name} details`}
        >
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Discount badge — top left like Flutter app */}
          {discount > 0 && isAvailable && (
            <div className="absolute top-0 left-0 bg-blue-600 text-white text-[6px] font-extrabold px-1 py-0.5 rounded-tl-[9px] rounded-br-md leading-[1.1] text-center">
              {discount}%
              <br />
              OFF
            </div>
          )}

          {/* ADD / Stepper — bottom right overlay like Flutter app */}
          <div
            className="absolute bottom-1 right-1"
            onClick={(e) => e.stopPropagation()}
          >
            {activeConfig && (
              <AddToCartButton
                config={activeConfig}
                product={product}
                compact
              />
            )}

            {!activeConfig && !isMultiConfig && (
              <AddToCartButton
                config={product.priceConfigs[0]}
                product={product}
                disabled={!isAvailable}
                compact
              />
            )}

            {!activeConfig && isMultiConfig && (
              <button
                onClick={openSheet}
                disabled={!isAvailable}
                className="w-6 h-6 text-[13px] font-extrabold text-brand bg-white border border-brand rounded-md shadow-md active:scale-90 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                +
              </button>
            )}
          </div>

          {/* Out of stock overlay */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-t-xl">
              <span className="text-[10px] font-bold text-slate-500">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info — compact like Flutter app */}
        <div className="px-1.5 pt-1 pb-1.5">
          <h3
            className="font-semibold text-slate-800 text-[11px] leading-tight line-clamp-2 cursor-pointer"
            onClick={openDetail}
          >
            {product.name}
          </h3>
          <p className="text-[9px] text-slate-400 truncate mt-0.5">
            {activeConfig
              ? activeConfig.label
              : displayConfig?.label}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            {!activeConfig && isMultiConfig && (
              <span className="text-[9px] text-slate-400">from</span>
            )}
            <span className="text-slate-800 font-extrabold text-xs">
              ₹{price}
            </span>
            {displayConfig?.mrp > price && (
              <span className="text-slate-400 line-through text-[9px]">
                ₹{displayConfig.mrp}
              </span>
            )}
          </div>
        </div>
      </div>

      {showSheet && (
        <PriceConfigsBottomSheet
          product={product}
          onClose={() => setShowSheet(false)}
        />
      )}

      {showDetail && !showSheet && (
        <ProductDetailOverlay
          product={product}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
};

export default memo(ProductCard);
