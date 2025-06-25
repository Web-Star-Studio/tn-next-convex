"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Users, Clock, Plus, Minus, MapPin } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { cardStyles, buttonStyles, formStyles } from "@/lib/ui-config";
import { StripeProvider } from "@/components/payments/StripeProvider";
import BookingPaymentForm from "@/components/payments/BookingPaymentForm";

interface RestaurantReservationFormProps {
  restaurantId: Id<"restaurants">;
  restaurant: {
    name: string;
    address: {
      street: string;
      neighborhood: string;
      city: string;
    };
    maximumPartySize: number;
    acceptsReservations: boolean;
  };
  onReservationSuccess?: (reservation: { confirmationCode: string }) => void;
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
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [partySize, setPartySize] = useState(2);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  
  // Gerar horários disponíveis entre 18h e 22h com intervalo de 30min
  const availableTimes = [
    "18:00", "18:30", "19:00", "19:30", 
    "20:00", "20:30", "21:00", "21:30", "22:00"
  ]
  
  const totalPrice = RESERVATION_FEE;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time) {
      toast.error("Selecione data e horário");
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast.error("Preencha todas as informações de contato");
      return;
    }

    if (!restaurant.acceptsReservations) {
      toast.error("Este restaurante não aceita reservas");
      return;
    }

    // Open payment dialog instead of creating reservation directly
    setPaymentOpen(true);
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    // Important: Payment approved but reservation is created with "pending" status
    // Partner/Employee needs to confirm the reservation
    
    toast.success("Pagamento aprovado!", {
      description: `${formatCurrency(totalPrice)} pagos com sucesso.`,
    });

    // Reset form
    setDate(undefined);
    setTime("");
    setPartySize(2);
    setCustomerInfo({ name: "", email: "", phone: "" });
    setSpecialRequests("");
    setPaymentOpen(false);
    
    // Show reservation status information
    setTimeout(() => {
      toast.success("Solicitação de reserva enviada!", {
        description: "Aguardando confirmação do restaurante. Você receberá um email quando a reserva for confirmada.",
      });
    }, 2000);
  };

  const incrementGuests = () => {
    if (partySize < restaurant.maximumPartySize) {
      setPartySize(partySize + 1);
    }
  };

  const decrementGuests = () => {
    if (partySize > 1) {
      setPartySize(partySize - 1);
    }
  };

  return (
    <>
      <div className={cn("rounded-xl overflow-hidden bg-blue-50 shadow-sm border border-gray-100", className)}>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Faça sua reserva</h3>
            <p className="text-sm text-gray-500 mt-1">Garanta seu lugar em {restaurant.name}</p>
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
            <Select value={time} onValueChange={setTime} >
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
                  disabled={partySize <= 1}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Diminuir</span>
                </Button>
                <span className="w-5 text-center font-medium">{partySize}</span>
                <Button
                  type="button"
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-full border-gray-200"
                  onClick={incrementGuests}
                  disabled={partySize >= restaurant.maximumPartySize}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Aumentar</span>
                </Button>
              </div>
            </div>
          </div>

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
                className="bg-white border-gray-200"
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
                className="bg-white border-gray-200"
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
                className="bg-white border-gray-200"
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

          <Button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 font-medium"
            disabled={!date || !time}
          >
            Confirmar reserva
          </Button>
        </form>
      </div>

      {/* Payment dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogTitle>Pagamento da Reserva</DialogTitle>
          <DialogDescription>Complete o pagamento para confirmar sua reserva.</DialogDescription>
          <StripeProvider>
            <BookingPaymentForm 
              amountCents={totalPrice * 100}
              bookingType="restaurant"
              bookingData={{
                restaurantId,
                date: date ? format(date, "yyyy-MM-dd") : "",
                time,
                partySize,
                customerInfo,
                specialRequests: specialRequests || undefined,
              }}
              onSuccess={handlePaymentSuccess}
            />
          </StripeProvider>
        </DialogContent>
      </Dialog>
    </>
  )
}