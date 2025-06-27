"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Users, Clock, Plus, Minus } from "lucide-react";
import type { Id } from "@/../convex/_generated/dataModel";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PaymentLinkBookingButton } from "@/components/payments/PaymentLinkBookingButton";
import { useAssetPaymentLink } from "@/hooks/useAssetPaymentLink";

interface RestaurantReservationFormProps {
  restaurantId: Id<"restaurants">;
  restaurant: {
    name: string;
    address?: {
      street?: string;
      city?: string;
      zipCode?: string;
    };
    maxTableSize?: number;
    minAdvanceReservation?: number;
    maxAdvanceReservation?: number;
  };
  onReservationSuccess?: (reservation: { confirmationCode: string; }) => void;
  className?: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Restaurants typically charge a small reservation fee (like R$ 10-20)
const RESERVATION_FEE = 15.00;

export function RestaurantReservationForm({
  restaurantId,
  restaurant,
  onReservationSuccess,
  className,
}: RestaurantReservationFormProps) {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [guests, setGuests] = useState(2);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [phoneInput, setPhoneInput] = useState(""); // Campo separado para telefone editável
  const [specialRequests, setSpecialRequests] = useState("");

  // Get current user information
  const { user, isLoading: userLoading } = useCurrentUser();

  // Get asset payment link info
  const { 
    asset, 
    isLoading: assetLoading, 
    hasPaymentLink, 
    paymentLinkUrl,
    isAssetActive 
  } = useAssetPaymentLink("restaurant", restaurantId);
  
  // Gerar horários disponíveis entre 18h e 22h com intervalo de 30min
  const availableTimes = [
    "18:00", "18:30", "19:00", "19:30", 
    "20:00", "20:30", "21:00", "21:30", "22:00"
  ];
  
  const totalPrice = RESERVATION_FEE;

  // Auto-fill customer info with user data
  useEffect(() => {
    if (user && !userLoading) {
      setCustomerInfo({
        name: user.name || "",
        email: user.email || "",
        phone: "",
      });
      setPhoneInput(""); // Campo sempre editável
    }
  }, [user, userLoading]);
  
  const validateForm = () => {
    if (!date) {
      toast.error("Selecione uma data");
      return false;
    }

    if (!time) {
      toast.error("Selecione um horário");
      return false;
    }

    if (!user) {
      toast.error("Você precisa estar logado para fazer uma reserva");
      return false;
    }

    if (!customerInfo.name || !customerInfo.email) {
      toast.error("Informações do usuário incompletas. Verifique seu perfil.");
      return false;
    }

    if (!phoneInput.trim()) {
      toast.error("Por favor, preencha seu telefone para continuar");
      return false;
    }

    if (!hasPaymentLink) {
      toast.error("Sistema de pagamento não configurado para este restaurante");
      return false;
    }

    return true;
  };

  const getBookingData = () => {
    return {
      restaurantId,
      userId: user?._id,
      date: date ? format(date, "yyyy-MM-dd") : "",
      time,
      guests,
      totalPrice,
      customerInfo: {
        ...customerInfo,
        phone: phoneInput,
      },
      specialRequests: specialRequests || undefined,
    };
  };

  const handleBookingCreate = (reservationId: string) => {
    // Reset form after successful booking creation
    setDate(undefined);
    setTime("");
    setGuests(2);
    setSpecialRequests("");
    setPhoneInput("");

    if (onReservationSuccess) {
      onReservationSuccess({
        confirmationCode: reservationId,
      });
    }

    toast.success("Reserva criada com sucesso!", {
      description: "Aguardando confirmação do restaurante.",
    });
  };

  const incrementGuests = () => {
    const maxTableSize = restaurant.maxTableSize || 8;
    if (guests < maxTableSize) {
      setGuests(guests + 1);
    }
  };

  const decrementGuests = () => {
    if (guests > 1) {
      setGuests(guests - 1);
    }
  };

  if (userLoading || assetLoading) {
    return (
      <div className={cn("rounded-xl overflow-hidden bg-blue-50 shadow-sm border border-gray-100", className)}>
        <div className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cn("rounded-xl overflow-hidden bg-blue-50 shadow-sm border border-gray-100", className)}>
        <div className="p-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Login necessário</h3>
            <p className="text-gray-600 mb-4">Você precisa estar logado para fazer uma reserva.</p>
            <Button onClick={() => window.location.href = '/sign-in'}>
              Fazer Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const maxGuests = restaurant.maxTableSize || 8;
  const isFormValid = date && time && customerInfo.name && customerInfo.email && phoneInput.trim();

  return (
    <div className={cn("rounded-xl overflow-hidden bg-blue-50 shadow-sm border border-gray-100", className)}>
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Faça sua reserva</h3>
          <p className="text-sm text-gray-500 mt-1">Garanta seu lugar em {restaurant.name}</p>
        </div>

        {/* User info display */}
        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="font-semibold text-gray-900 mb-2">Informações da reserva:</h4>
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
        
        {/* Data picker */}
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between bg-white border-gray-200 hover:bg-gray-50 h-14 px-4"
              >
                <div className="flex items-center">
                  <CalendarIcon className="mr-3 h-5 w-5 text-blue-600" />
                  <span className={cn(!date && "text-gray-400")}>
                    {date ? format(date, "PPP", { locale: ptBR }) : "Data"}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  {!date && "Selecionar"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0 border-none" side="bottom">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => {
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  return date < today
                }}
                locale={ptBR}
                className="bg-white rounded-md border-none"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Horário selector */}
        <div>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger 
              className="w-full justify-between bg-white border-gray-200 hover:bg-gray-50 h-14 px-4"
            >
              <div className="flex items-center">
                <Clock className="mr-3 h-5 w-5 text-blue-600" />
                <span className={cn(!time && "text-gray-400")}>
                  {time || "Horário"}
                </span>
              </div>
              <span className="text-sm text-gray-400">
                {!time && "Selecionar"}
              </span>
            </SelectTrigger>
            <SelectContent className="bg-white border-none">
              {availableTimes.map((timeOption) => (
                <SelectItem 
                  key={timeOption} 
                  value={timeOption}
                  className="text-gray-900 hover:bg-blue-100 font-semibold hover:text-gray-900"
                >
                  {timeOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Pessoas selector */}
        <div>
          <div className="flex items-center justify-between border border-gray-200 rounded-md h-14 px-4 bg-white hover:bg-gray-50">
            <div className="flex items-center">
              <Users className="mr-3 h-5 w-5 text-blue-600" />
              <span className="text-gray-900">Pessoas</span>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full border-gray-200"
                onClick={decrementGuests}
                disabled={guests <= 1}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Diminuir</span>
              </Button>
              <span className="w-5 text-center font-medium">{guests}</span>
              <Button
                type="button"
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full border-gray-200"
                onClick={incrementGuests}
                disabled={guests >= maxGuests}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Aumentar</span>
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
            className="bg-white border-gray-200"
            placeholder="Aniversário, alergia alimentar, preferência de mesa..."
          />
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 p-4 rounded-md space-y-2">
          <div className="flex justify-between text-sm">
            <span>Taxa de reserva</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
          <p className="text-xs text-gray-500">
            *Taxa será deduzida da conta final
          </p>
        </div>

        {/* Payment Link Button */}
        {isFormValid && hasPaymentLink ? (
          <PaymentLinkBookingButton
            assetType="restaurant"
            assetId={restaurantId}
            assetName={restaurant.name}
            price={totalPrice}
            stripePaymentLinkUrl={paymentLinkUrl}
            bookingData={getBookingData()}
            onBookingCreate={handleBookingCreate}
            disabled={!isFormValid}
          />
        ) : (
          <Button 
            type="button"
            className="w-full bg-gray-400 text-white h-12 font-medium cursor-not-allowed"
            disabled
          >
            {!isFormValid ? "Preencha todos os campos obrigatórios" : "Sistema de pagamento não disponível"}
          </Button>
        )}
      </div>
    </div>
  );
}