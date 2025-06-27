"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export interface AssetWithPaymentLink {
  _id: string;
  title?: string;
  name?: string;
  price?: number;
  pricePerDay?: number;
  pricePerNight?: number;
  stripeProductId?: string;
  stripePaymentLinkId?: string;
  stripePaymentLinkUrl?: string;
  isActive?: boolean;
  partnerId?: Id<"users">;
}

export function useAssetPaymentLink(
  assetType: "activity" | "event" | "restaurant" | "vehicle" | "accommodation",
  assetId: string | undefined
) {
  // Query for activities
  const activity = useQuery(
    api.domains.activities.queries.getById,
    assetType === "activity" && assetId ? { id: assetId as Id<"activities"> } : "skip"
  );

  // Query for events
  const event = useQuery(
    api.domains.events.queries.getById,
    assetType === "event" && assetId ? { id: assetId as Id<"events"> } : "skip"
  );

  // Query for restaurants
  const restaurant = useQuery(
    api.domains.restaurants.queries.getById,
    assetType === "restaurant" && assetId ? { id: assetId as Id<"restaurants"> } : "skip"
  );

  // Query for vehicles
  const vehicle = useQuery(
    api.domains.vehicles.queries.getById,
    assetType === "vehicle" && assetId ? { id: assetId as Id<"vehicles"> } : "skip"
  );

  // Query for accommodations
  const accommodation = useQuery(
    api.domains.accommodations.queries.getById,
    assetType === "accommodation" && assetId ? { id: assetId as Id<"accommodations"> } : "skip"
  );

  // Get the correct asset based on type
  const asset = (() => {
    switch (assetType) {
      case "activity":
        return activity;
      case "event":
        return event;
      case "restaurant":
        return restaurant;
      case "vehicle":
        return vehicle;
      case "accommodation":
        return accommodation;
      default:
        return undefined;
    }
  })();

  // Normalize the asset data
  const normalizedAsset: AssetWithPaymentLink | undefined = asset ? {
    _id: asset._id,
    title: asset.title || asset.name,
    name: asset.name || asset.title,
    price: asset.price || asset.pricePerDay || asset.pricePerNight,
    pricePerDay: asset.pricePerDay,
    pricePerNight: asset.pricePerNight,
    stripeProductId: asset.stripeProductId,
    stripePaymentLinkId: asset.stripePaymentLinkId,
    stripePaymentLinkUrl: asset.stripePaymentLinkUrl,
    isActive: asset.isActive,
    partnerId: asset.partnerId,
  } : undefined;

  // Calculate loading and error states
  const isLoading = (() => {
    switch (assetType) {
      case "activity":
        return activity === undefined;
      case "event":
        return event === undefined;
      case "restaurant":
        return restaurant === undefined;
      case "vehicle":
        return vehicle === undefined;
      case "accommodation":
        return accommodation === undefined;
      default:
        return false;
    }
  })();

  const hasPaymentLink = Boolean(normalizedAsset?.stripePaymentLinkUrl);
  const isAssetActive = Boolean(normalizedAsset?.isActive);

  return {
    asset: normalizedAsset,
    isLoading,
    hasPaymentLink,
    isAssetActive,
    paymentLinkUrl: normalizedAsset?.stripePaymentLinkUrl,
    price: normalizedAsset?.price || 0,
    assetName: normalizedAsset?.title || normalizedAsset?.name || "Item",
  };
} 