"use client";

import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { toast } from "sonner";
import { useCustomerInfo } from "@/lib/hooks/useCustomerInfo";
import type { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface UseBookingFormProps<T extends (...args: any) => any> {
  assetId: Id<any>;
  assetType: "activity" | "event" | "vehicle" | "restaurant";
  createBookingMutation: T;
  getPrice: () => number;
  onBookingSuccess?: (result: any) => void;
}

export function useBookingForm<T extends (...args: any) => any>({
  assetId,
  assetType,
  createBookingMutation,
  getPrice,
  onBookingSuccess,
}: UseBookingFormProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const { customerInfo, setCustomerInfo } = useCustomerInfo();
  const createCheckoutSession = useAction(api.domains.stripe.actions.createCheckoutSession);

  const getFinalPrice = () => {
    const basePrice = getPrice();
    return appliedCoupon ? appliedCoupon.finalAmount : basePrice;
  };

  const getDiscountAmount = () => {
    return appliedCoupon ? appliedCoupon.discountAmount : 0;
  };

  const handleCouponApplied = (coupon: any) => {
    setAppliedCoupon(coupon);
  };

  const handleCouponRemoved = () => {
    setAppliedCoupon(null);
  };

  const handleSubmit = async (bookingArgs: Parameters<T>[0]) => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast.error("Preencha todas as informações de contato");
      return;
    }

    setIsSubmitting(true);

    try {
      const result: { bookingId?: Id<any>, reservationId?: Id<any>, confirmationCode: string } = await createBookingMutation({
        ...bookingArgs,
        customerInfo,
        couponCode: appliedCoupon?.code,
        discountAmount: getDiscountAmount(),
        finalAmount: getFinalPrice(),
      });

      toast.success("Reserva criada com sucesso!", {
        description: `Código de confirmação: ${result.confirmationCode}`,
      });

      const finalPrice = getFinalPrice();
      if (finalPrice > 0) {
        const checkoutSession = await createCheckoutSession({
          bookingId: (result.bookingId ?? result.reservationId)!,
          assetType,
          successUrl: `${window.location.origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/booking/cancel`,
          couponCode: appliedCoupon?.code,
          discountAmount: getDiscountAmount(),
          originalAmount: getPrice(),
          finalAmount: finalPrice,
        });

        if (checkoutSession.success && checkoutSession.sessionUrl) {
          toast.success("Redirecionando para pagamento...");
          setTimeout(() => {
            window.location.href = checkoutSession.sessionUrl;
          }, 1500);
          return;
        } else {
          throw new Error(checkoutSession.error || "Erro ao criar sessão de pagamento");
        }
      }

      if (onBookingSuccess) {
        onBookingSuccess(result);
      }
    } catch (error) {
      toast.error("Erro ao criar reserva", {
        description: error instanceof Error ? error.message : "Tente novamente",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    appliedCoupon,
    customerInfo,
    setCustomerInfo,
    getFinalPrice,
    getDiscountAmount,
    handleCouponApplied,
    handleCouponRemoved,
    handleSubmit,
  };
}
