"use client"

import * as React from "react"
import { useState, useEffect } from "react"
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
import PaymentWrapper from "@/components/payments/PaymentWrapper"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useCurrentUser } from "@/lib/hooks/useCurrentUser"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cardStyles, buttonStyles, formStyles } from "@/lib/ui-config"

export type AccommodationBookingFormProps = {
  accommodationId: string
  accommodationName: string
  pricePerNight: number
  maxGuests: number
  minimumStay?: number
  amenities: string[]
  address?: {
    city?: string
    state?: string
  }
  className?: string
  onSubmit?: (booking: {
    hotelId?: string
    hotelName?: string
    checkIn: Date
    checkOut: Date
    roomType: string
    guests: number
    specialRequests?: string
  }) => void
}

export function AccommodationBookingForm({
  accommodationId,
  accommodationName,
  pricePerNight,
  maxGuests,
  minimumStay,
  amenities,
  address,
  className,
  onSubmit
}: AccommodationBookingFormProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })
  const [guests, setGuests] = useState<number>(2)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [phoneInput, setPhoneInput] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [isSubmitting, _setIsSubmitting] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  
  // Get current user information
  const { user, isLoading: userLoading } = useCurrentUser()

  // Auto-fill customer info with user data
  useEffect(() => {
    if (user && !userLoading) {
      setCustomerInfo({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      })
      setPhoneInput("")
    }
  }, [user, userLoading])
  
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
    setPhoneInput("")
    setSpecialRequests("")
    setPaymentOpen(false)
    
    // Show booking status information
    setTimeout(() => {
      toast.success("Solicitação de hospedagem enviada!", {
        description: "Aguardando confirmação. Você receberá um email quando a reserva for confirmada.",
      });
    }, 2000);

    if (onSubmit && dateRange?.from && dateRange?.to) {
      onSubmit({
        hotelId: accommodationId,
        hotelName: accommodationName,
        checkIn: dateRange.from,
        checkOut: dateRange.to,
        roomType: "Standard", // Default room type
        guests,
        specialRequests: specialRequests || undefined,
      })
    }
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

    if (!user) {
      toast.error("Você precisa estar logado para fazer uma reserva")
      return
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast.error("Informações do usuário incompletas. Verifique seu perfil.")
      return
    }

    if (!phoneInput.trim()) {
      toast.error("Por favor, preencha seu telefone para continuar")
      return
    }

    if (nights < (minimumStay || 1)) {
      toast.error(`Estadia mínima de ${minimumStay || 1} noite(s)`)
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

  const isFormValid = dateRange?.from && dateRange?.to && guests >= 1 && guests <= maxGuests && customerInfo.name && customerInfo.email && customerInfo.phone && phoneInput.trim()

  if (userLoading) {
    return (
      <div className={cn(cardStyles.base, className)}>
        <div className={cardStyles.content.default}>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Carregando...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={cn(cardStyles.base, className)}>
        <div className={cardStyles.content.default}>
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Login necessário</h3>
            <p className="text-gray-600 mb-4">Você precisa estar logado para fazer uma reserva.</p>
            <Button onClick={() => window.location.href = '/sign-in'}>
              Fazer Login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={cn(cardStyles.base, cardStyles.hover.default, className)}>
        <form onSubmit={handleSubmit} className={cardStyles.content.default}>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Reserve sua hospedagem</h3>
              <p className="text-sm text-gray-500 mt-1">Garanta seu lugar em {accommodationName}</p>
              {address && (
                <p className="text-xs text-gray-400 mt-1">
                  {address.city}, {address.state}
                </p>
              )}
            </div>
            
            {/* User info display */}
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-semibold text-gray-900 mb-2">Reserva para:</h4>
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <p><strong>Nome:</strong> {customerInfo.name || "Não informado"}</p>
                  <p><strong>Email:</strong> {customerInfo.email || "Não informado"}</p>
                </div>
                
                {/* Campo editável para telefone */}
                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
                    Telefone para contato *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="bg-white border-gray-300 text-sm"
                    required
                  />
                </div>
              </div>
                             {(!customerInfo.name || !customerInfo.email) && (
                 <p className="text-amber-600 text-xs mt-2">
                   ⚠️ Complete suas informações no perfil para fazer reservas
                 </p>
               )}
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
            
            {/* Special Requests */}
            <div className="space-y-2">
              <Label htmlFor="requests">Solicitações especiais (opcional)</Label>
              <Textarea
                id="requests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className={formStyles.textarea.base}
                placeholder="Check-in antecipado, late check-out, preferências de quarto..."
              />
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
            
            {/* Amenities Preview */}
            {amenities && amenities.length > 0 && (
              <div className="bg-green-50 p-4 rounded-md">
                <h4 className="font-semibold text-gray-900 mb-2">Comodidades incluídas:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {amenities.slice(0, 6).map((amenity, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                      <Check className="h-3 w-3 mr-2 text-green-600" />
                      {amenity}
                    </div>
                  ))}
                  {amenities.length > 6 && (
                    <div className="text-sm text-gray-500 col-span-2">
                      +{amenities.length - 6} outras comodidades
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Submit button */}
            <Button
              type="submit"
              className={cn(buttonStyles.variant.default, "w-full")}
              disabled={!isFormValid}
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
                 guests < 1 ? "Selecione pelo menos 1 hóspede" :
                 !customerInfo.name || !customerInfo.email || !customerInfo.phone ? "Complete suas informações no perfil" :
                 !phoneInput.trim() ? "Complete seu telefone" : ""}
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Payment dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogTitle>Pagamento da Hospedagem</DialogTitle>
          <DialogDescription>Complete o pagamento para confirmar sua reserva.</DialogDescription>
          <PaymentWrapper 
            amountCents={totalPrice * 100}
            bookingType="accommodation"
            bookingData={{
              accommodationId,
              checkIn: dateRange?.from?.getTime() || 0,
              checkOut: dateRange?.to?.getTime() || 0,
              guests,
              customerInfo,
              specialRequests: specialRequests || undefined,
            }}
            onSuccess={handlePaymentSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
