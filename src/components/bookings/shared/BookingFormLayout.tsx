"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { formStyles } from "@/lib/ui-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CouponValidator from "@/components/coupons/CouponValidator";
import { StripeFeesDisplay } from "@/components/payments/StripeFeesDisplay";
import type { Id } from "../../../../convex/_generated/dataModel";

interface BookingFormLayoutProps extends React.PropsWithChildren {
  isSubmitting: boolean;
  customerInfo: { name: string; email: string; phone: string };
  setCustomerInfo: (info: { name: string; email: string; phone: string }) => void;
  specialRequests: string;
  setSpecialRequests: (requests: string) => void;
  getPrice: () => number;
  getFinalPrice: () => number;
  getDiscountAmount: () => number;
  assetId: Id<any>;
  assetType: "activity" | "event" | "vehicle" | "restaurant";
  handleCouponApplied: (coupon: any) => void;
  handleCouponRemoved: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  submitButtonText: string;
  className?: string;
  isFormValid?: boolean;
}

export function BookingFormLayout({
  children,
  isSubmitting,
  customerInfo,
  setCustomerInfo,
  specialRequests,
  setSpecialRequests,
  getPrice,
  getFinalPrice,
  getDiscountAmount,
  assetId,
  assetType,
  handleCouponApplied,
  handleCouponRemoved,
  handleSubmit,
  submitButtonText,
  className,
  isFormValid = true,
}: BookingFormLayoutProps) {
  return (
    <div className={cn("bg-white border border-gray-200 rounded-lg shadow-sm", className)}>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {children}

          {/* Customer Information */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold text-gray-900">Informações de contato</h4>
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className={formStyles.input.base}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                className={formStyles.input.base}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className={formStyles.input.base}
                placeholder="(81) 99999-9999"
                required
              />
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="requests">Solicitações especiais (opcional)</Label>
            <Textarea
              id="requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className={formStyles.textarea.base}
              placeholder="Alguma necessidade especial ou preferência..."
            />
          </div>

          {/* Coupon Validation */}
          {getPrice() > 0 && (
            <CouponValidator
              assetType={assetType}
              assetId={assetId}
              orderValue={getPrice()}
              onCouponApplied={handleCouponApplied}
              onCouponRemoved={handleCouponRemoved}
            />
          )}

          {/* Price summary with Stripe fees */}
          {getFinalPrice() > 0 && (
            <StripeFeesDisplay
              baseAmount={getPrice()}
              discountAmount={getDiscountAmount()}
              className="mt-4"
            />
          )}

          {/* Payment Info */}
          {getFinalPrice() > 0 && (
            <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-700">
              Seu pagamento será autorizado e cobrado apenas após aprovação da reserva pelo parceiro.
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? "Processando..." : submitButtonText}
          </Button>
        </form>
      </div>
    </div>
  );
}
