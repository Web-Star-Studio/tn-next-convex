"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Users, Clock, Plus, Minus } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
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
import { cardStyles, buttonStyles, formStyles } from "@/lib/ui-config";

interface ImprovedRestaurantReservationFormProps {
  restaurantId: Id<"restaurants">;
  restaurant: {
    name: string;
    cuisine: string[];
    priceRange: string;
    rating: {
      overall: number;
      totalReviews: number;
    };
    address: {
      street: string;
      neighborhood: string;
      city: string;
      zipCode: string;
    };
    contact: {
      phone: string;
      email?: string;
    };
    operatingHours: {
      [key: string]: {
        open: string;
        close: string;
      };
    };
    features: {
      hasReservation: boolean;
      hasDelivery: boolean;
      hasTakeout: boolean;
      acceptsCreditCard: boolean;
      hasWifi: boolean;
      hasParking: boolean;
      isAccessible: boolean;
      allowsPets: boolean;
      hasOutdoorSeating: boolean;
      hasLiveMusic: boolean;
    };
    capacity: {
      totalSeats: number;
      maxTableSize: number;
    };
  };
  onReservationSuccess?: (reservation: { confirmationCode: string }) => void;
  className?: string;
}

export function ImprovedRestaurantReservationForm({
  restaurantId,
  restaurant,
  onReservationSuccess,
  className,
}: ImprovedRestaurantReservationFormProps) {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current user information
  const { user, isLoading: userLoading } = useCurrentUser();

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

  const createReservation = useMutation(api.domains.restaurants.mutations.createReservation);

  // Generate available times based on operating hours
  const getAvailableTimes = () => {
    if (!date) return [];

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = daysOfWeek[date.getDay()]; // Get day name
    const todayKey = Object.keys(restaurant.operatingHours)[0]; // Fallback to first available day
    const hours = restaurant.operatingHours[dayName] || restaurant.operatingHours[todayKey];

    if (!hours) return [];

    const times: string[] = [];
    const openTime = parseInt(hours.open.split(':')[0]);
    const closeTime = parseInt(hours.close.split(':')[0]);

    for (let hour = openTime; hour < closeTime; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    return times;
  };

  const availableTimes = getAvailableTimes();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast.error("Selecione uma data");
      return;
    }

    if (!time) {
      toast.error("Selecione um horário");
      return;
    }

    if (!user) {
      toast.error("Você precisa estar logado para fazer uma reserva");
      return;
    }

    if (!customerInfo.name || !customerInfo.email) {
      toast.error("Informações do usuário incompletas. Verifique seu perfil.");
      return;
    }

    if (!phoneInput.trim()) {
      toast.error("Por favor, preencha seu telefone para continuar");
      return;
    }

    if (!restaurant.features.hasReservation) {
      toast.error("Este restaurante não aceita reservas");
      return;
    }

    setIsSubmitting(true);

    try {
      const reservationData = {
        restaurantId,
        date: format(date, "yyyy-MM-dd"),
        time,
        guests,
        customerInfo: {
          ...customerInfo,
          phone: phoneInput, // Usa o telefone do campo editável
        },
        specialRequests: specialRequests || undefined,
      };

      const reservation = await createReservation(reservationData);

      toast.success("Reserva realizada com sucesso!", {
        description: `Código de confirmação: ${reservation.confirmationCode}`,
      });

      // Reset form
      setDate(undefined);
      setTime("");
      setGuests(2);
      setSpecialRequests("");
      setPhoneInput("");

      onReservationSuccess?.(reservation);
    } catch (error) {
      console.error("Erro ao criar reserva:", error);
      toast.error("Erro ao realizar reserva", {
        description: "Tente novamente ou entre em contato conosco.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
    );
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
    );
  }

  if (!restaurant.features.hasReservation) {
    return (
      <div className={cn(cardStyles.base, className)}>
        <div className={cardStyles.content.default}>
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reservas não disponíveis</h3>
            <p className="text-gray-600 mb-4">Este restaurante não aceita reservas no momento.</p>
            <p className="text-sm text-gray-500">
              Entre em contato diretamente: {restaurant.contact.phone}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(cardStyles.base, cardStyles.hover.default, className)}>
      <form onSubmit={handleSubmit} className={cardStyles.content.default}>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Reserve sua mesa</h3>
            <p className="text-sm text-gray-500 mt-1">{restaurant.name}</p>
            <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
              <span>{restaurant.cuisine.join(", ")}</span>
              <span>{restaurant.priceRange}</span>
            </div>
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

          {/* Date selection */}
          <div className="space-y-2">
            <Label>Data da reserva</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time selection */}
          <div className="space-y-2">
            <Label>Horário</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className={formStyles.select.base}>
                <SelectValue placeholder="Selecione um horário" />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.length > 0 ? (
                  availableTimes.map((timeOption) => (
                    <SelectItem key={timeOption} value={timeOption}>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {timeOption}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    Nenhum horário disponível para esta data
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Number of guests */}
          <div className="space-y-2">
            <Label htmlFor="guests">Número de pessoas</Label>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                disabled={guests <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex items-center justify-center w-12 h-10 border rounded-md">
                <span className="text-sm font-medium">{guests}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setGuests(Math.min(restaurant.capacity.maxTableSize, guests + 1))}
                disabled={guests >= restaurant.capacity.maxTableSize}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Máximo: {restaurant.capacity.maxTableSize} pessoas por mesa
            </p>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="requests">Solicitações especiais (opcional)</Label>
            <Textarea
              id="requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className={formStyles.textarea.base}
              placeholder="Aniversário, dieta especial, localização preferida..."
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className={cn(buttonStyles.variant.default, "w-full")}
            disabled={!date || !time || !customerInfo.name || !customerInfo.email || !phoneInput.trim() || isSubmitting}
          >
            {isSubmitting ? "Reservando..." : "Confirmar reserva"}
          </Button>
        </div>
      </form>
    </div>
  );
}