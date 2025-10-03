/* eslint-disable @typescript-eslint/no-unused-vars */

import Image from "next/image";
import Link from "next/link";
import React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { IProduct } from "@/lib/db/models/product.model";

import Rating from "./rating";
import { formatNumber, generateId, round2 } from "@/lib/utils";
import ProductPrice from "./product-price";
import ImageHover from "./image-hover";
import AddToCart from "./add-to-cart";
import { useTranslations, useLocale } from "next-intl";

const ProductCard = ({
  product,
  hideBorder = false,
  hideDetails = false,
  hideAddToCart = false,
}: {
  product: IProduct;
  hideDetails?: boolean;
  hideBorder?: boolean;
  hideAddToCart?: boolean;
}) => {
  const t = useTranslations();
  const locale = useLocale();

  // Try to get translated product name if available
  const getTranslatedName = (name: string) => {
    try {
      // Check if we're using a non-English locale
      if (locale !== "en-US") {
        // First try to find exact match in ProductNames
        const exactKey = `ProductNames.${name.replace(/'/g, "")}`;

        // Check for specific product names
        if (name.includes("Fossil Men's Machine")) {
          return t("ProductNames.Fossil Men's Machine Stainless Steel Watch", {
            fallback: name,
          });
        }
        if (name.includes("Mens Wearbreeze")) {
          return t(
            "ProductNames.Mens Wearbreeze Shoes, Urban - Ultra Lightweight",
            { fallback: name }
          );
        }
        if (name.includes("DLWKIPV Mens")) {
          return t("ProductNames.DLWKIPV Mens Running Shoes", {
            fallback: name,
          });
        }
        if (name.includes("Casio Classic")) {
          return t("ProductNames.Casio Men's Heavy Duty Design Watch", {
            fallback: name,
          });
        }

        // Try general category names
        for (const category of [
          "Jeans",
          "Shoes",
          "T-Shirts",
          "Wrist Watches",
        ]) {
          if (name.includes(category)) {
            return t(`ProductNames.${category}`, { fallback: name });
          }
        }

        // Fallback to original name
        return name;
      }
      return name;
    } catch (error) {
      return name;
    }
  };

  const ProductImage = () => (
    <Link href={`/product/${product.slug}`}>
      <div className="relative h-52 rounded-2xl bg-white p-4 neumorphic-inset-light dark:bg-white group-hover:scale-105 transition-transform duration-300 overflow-hidden">
        {product.images.length > 1 ? (
          <ImageHover
            src={product.images[0]}
            hoverSrc={product.images[1]}
            alt={product.name}
          />
        ) : (
          <div className="relative h-44 flex items-center justify-center">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="80vw"
              className="object-contain animate-fade-in"
              style={{
                objectFit: "contain",
                maxHeight: "100%",
                maxWidth: "100%",
              }}
            />
          </div>
        )}
      </div>
    </Link>
  );

  const ProductDetails = () => (
    <div
      className="flex-1 space-y-3 p-2 animate-fade-in"
      style={{ animationDelay: "0.2s" }}
    >
      <p className="font-bold text-primary neumorphic-text dark:neumorphic-text-dark">
        {product.brand}
      </p>
      <Link
        href={`/product/${product.slug}`}
        className="line-clamp-2 min-h-[2.5rem] hover:text-primary transition-colors neumorphic-text dark:neumorphic-text-dark"
      >
        {getTranslatedName(product.name)}
      </Link>
      <div className="flex items-center gap-1">
        <Rating value={product.avgRating} />
        <span className="text-xs text-muted-foreground">
          ({formatNumber(product.numReviews)})
        </span>
      </div>
      <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <ProductPrice
          isDeal={product.tags.includes("todays-deal")}
          price={product.price}
          listPrice={product.listPrice}
          forListing
          product={product}
        />
      </div>
    </div>
  );

  const AddButton = () => (
    <div className="w-full animate-fade-in" style={{ animationDelay: "0.4s" }}>
      <AddToCart
        minimal
        item={{
          clientId: generateId(),
          product: product._id,
          size: product.sizes[0],
          color: product.colors[0],
          countInStock: product.countInStock,
          name: getTranslatedName(product.name),
          slug: product.slug,
          category: product.category,
          price: round2(product.price),
          quantity: 1,
          image: product.images[0],
        }}
      />
    </div>
  );

  return hideBorder ? (
    <div className="flex flex-col">
      <ProductImage />
      {!hideDetails && (
        <>
          <div className="p-3 flex-1 text-center">
            <ProductDetails />
          </div>
          {!hideAddToCart && <AddButton />}
        </>
      )}
    </div>
  ) : (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 neumorphic-hover-light dark:neumorphic-hover-dark animate-fade-in">
      <CardHeader className="p-0">
        <ProductImage />
      </CardHeader>
      {!hideDetails && (
        <>
          <CardContent className="p-4">
            <ProductDetails />
          </CardContent>
          <CardFooter className="p-4 pt-0">
            {!hideAddToCart && <AddButton />}
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default ProductCard;
