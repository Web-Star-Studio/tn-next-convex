"use client"

import * as React from "react"
import { useState } from "react"
import { format, differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon, Users, Check, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"  
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { DateRange } from "react-day-picker"
import StripeProvider from "@/lib/providers/StripeProvider"
import BookingPaymentForm from "@/components/payments/BookingPaymentForm"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export type AccommodationBookingFormProps = {
  accommodationId: string
  accommodationName: string
  pricePerNight: number
  maxGuests: number
  className?: string
  onSubmit?: (booking: {
    hotelId?: string
    hotelName?: string
    checkIn: Date
    checkOut: Date
    roomType: string
    guests: number
  }) => void
}

export function AccommodationBookingForm({
  accommodationId,
  accommodationName,
  pricePerNight,
  maxGuests,
  className,
  onSubmit
}: AccommodationBookingFormProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })
  const [guests, setGuests] = useState<number>(2)
  const [isSubmitting, _setIsSubmitting] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  
  // Formatar preço para moeda brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }
  
  // Calcular número de noites e preço total
  const calculateNights = () => {
    if (dateRange?.from && dateRange?.to) {
      return differenceInDays(dateRange.to, dateRange.from)
    }
    return 0
  }
  
  const nights = calculateNights()
  const totalPrice = pricePerNight * nights
  
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    // Important: Payment approved but booking is created with "pending" status
    // Partner/Employee needs to confirm the booking
    
    toast.success("Pagamento aprovado!", {
      description: `${formatCurrency(totalPrice)} pagos com sucesso.`,
    });

    // Reset form
    setDateRange({ from: undefined, to: undefined })
    setGuests(2)
    setPaymentOpen(false)
    
    // Show booking status information
    setTimeout(() => {
      toast.success("Solicitação de reserva enviada!", {
        description: "Aguardando confirmação do estabelecimento. Você receberá um email quando a reserva for confirmada.",
      });
    }, 2000);
  }

  const handleSubmit = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Selecione as datas de check-in e check-out")
      return
    }
    
    if (guests > maxGuests) {
      toast.error(`Número máximo de hóspedes: ${maxGuests}`)
      return
    }

    // Open payment modal
    setPaymentOpen(true)
  }

  const incrementGuests = () => {
    if (guests < maxGuests) {
      setGuests(guests + 1)
    }
  }

  const decrementGuests = () => {
    if (guests > 1) {
      setGuests(guests - 1)
    }
  }

  const isFormValid = dateRange?.from && dateRange?.to && guests >= 1 && guests <= maxGuests

  return (
    <div className={cn("rounded-xl overflow-hidden bg-white shadow-sm border border-gray-200", className)}>
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Reserve sua hospedagem</h3>
          <p className="text-sm text-gray-500 mt-1">Garanta seu lugar em {accommodationName}</p>
        </div>
        
        {/* Date range picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Período da estadia
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between bg-white border-gray-200 hover:bg-gray-50 h-14 px-4"
              >
                <div className="flex items-center">
                  <CalendarIcon className="mr-3 h-5 w-5 text-blue-600" />
                  <span className={cn(!dateRange?.from && "text-gray-400")}>
                    {dateRange?.from && dateRange?.to 
                      ? `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}` 
                      : "Selecionar datas"}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0 border-none" side="bottom">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                initialFocus
                numberOfMonths={2}
                disabled={(date) => {
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  return date < today
                }}
                locale={ptBR}
                className="rounded-md bg-white border-none"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Guest counter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de hóspedes (máx. {maxGuests})
          </label>
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="mr-3 h-5 w-5 text-blue-600" />
              <span className="font-medium">{guests} {guests === 1 ? "hóspede" : "hóspedes"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={decrementGuests}
                disabled={guests <= 1}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center text-sm font-medium">{guests}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={incrementGuests}
                disabled={guests >= maxGuests}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Price summary */}
        {nights > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{formatCurrency(pricePerNight)} x {nights} {nights === 1 ? "noite" : "noites"}</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Submit button */}
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg font-medium"
        >
          {paymentOpen ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Processando pagamento...
            </>
          ) : (
            <>
              <Check className="mr-2 h-5 w-5" />
              Confirmar reserva
            </>
          )}
        </Button>
        
        {!isFormValid && (dateRange?.from || dateRange?.to || guests !== 2) && (
          <p className="text-sm text-red-600 text-center">
            {!dateRange?.from || !dateRange?.to ? "Selecione as datas de check-in e check-out" :
             guests > maxGuests ? `Número máximo de hóspedes: ${maxGuests}` :
             guests < 1 ? "Selecione pelo menos 1 hóspede" : ""}
          </p>
        )}
      </div>

      {/* Payment dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogTitle>Pagamento da Reserva</DialogTitle>
          <DialogDescription>Complete o pagamento para confirmar a reserva.</DialogDescription>
          <StripeProvider>
            <BookingPaymentForm 
              amountCents={totalPrice * 100} 
              bookingType="accommodation"
              bookingData={{
                accommodationId,
                accommodationName,
                checkInDate: dateRange?.from?.toISOString(),
                checkOutDate: dateRange?.to?.toISOString(),
                guests,
                roomType: "Standard",
                totalPrice,
              }}
              onSuccess={handlePaymentSuccess} 
            />
          </StripeProvider>
        </DialogContent>
      </Dialog>
    </div>
  )
}
