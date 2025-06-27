"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Users, Clock, Ticket, MessageCircle } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import { useWhatsAppLink } from "@/lib/hooks/useSystemSettings";
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
import { PaymentLinkBookingButton } from "@/components/payments/PaymentLinkBookingButton";
import { useAssetPaymentLink } from "@/hooks/useAssetPaymentLink";

interface ActivityBookingFormProps {
  activityId: Id<"activities">;
  activity: {
    title: string;
    price: number;
    minParticipants: number;
    maxParticipants: number;
    hasMultipleTickets?: boolean;
  };
  onBookingSuccess?: (booking: { confirmationCode: string; totalPrice: number }) => void;
  className?: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export function ActivityBookingForm({
  activityId,
  activity,
  onBookingSuccess,
  className,
}: ActivityBookingFormProps) {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [participants, setParticipants] = useState(activity.minParticipants);
  const [selectedTicketId, setSelectedTicketId] = useState<Id<"activityTickets"> | undefined>();
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [phoneInput, setPhoneInput] = useState("");
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
  } = useAssetPaymentLink("activity", activityId);

  // Get activity tickets if available
  const tickets = useQuery(api.domains.activities.queries.getActivityTickets, {
    activityId,
  });

  // Get WhatsApp link generator
  const { generateWhatsAppLink } = useWhatsAppLink();

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

  // Available times (customize based on activity)
  const availableTimes = [
    "08:00", "09:00", "10:00", "11:00",
    "14:00", "15:00", "16:00", "17:00",
  ];

  // Calculate price
  const getPrice = () => {
    if (selectedTicketId && tickets) {
      const ticket = tickets.find(t => t._id === selectedTicketId);
      return ticket ? ticket.price * participants : activity.price * participants;
    }
    return activity.price * participants;
  };

  const totalPrice = getPrice();

  const validateForm = () => {
    if (!date) {
      toast.error("Selecione uma data");
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
      toast.error("Sistema de pagamento não configurado para esta atividade");
      return false;
    }

    return true;
  };

  const getBookingData = () => {
    return {
      activityId,
      userId: user?._id,
      ticketId: selectedTicketId,
      date: date ? format(date, "yyyy-MM-dd") : "",
      time: time || undefined,
      participants,
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
    setParticipants(activity.minParticipants);
    setSelectedTicketId(undefined);
    setSpecialRequests("");
    setPhoneInput("");

    if (onBookingSuccess) {
      onBookingSuccess({
        confirmationCode: reservationId,
        totalPrice,
      });
    }

    toast.success("Reserva criada com sucesso!", {
      description: "Aguardando confirmação do organizador.",
    });
  };

  if (userLoading || assetLoading) {
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

  const isFormValid = date && customerInfo.name && customerInfo.email && phoneInput.trim();

  return (
    <div className={cn(cardStyles.base, cardStyles.hover.default, className)}>
      <div className={cardStyles.content.default}>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Reserve sua atividade</h3>
            <p className="text-sm text-gray-500 mt-1">{activity.title}</p>
          </div>

          {/* User info display */}
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-semibold text-gray-900 mb-2">Informações da reserva:</h4>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <p><strong>Nome:</strong> {customerInfo.name || "Não informado"}</p>
                <p><strong>Email:</strong> {customerInfo.email || "Não informado"}</p>
              </div>
              
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
            <Label>Data da atividade</Label>
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

          <div className="space-y-2">
            <Label>Horário (opcional)</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className={formStyles.select.base}>
                <SelectValue placeholder="Selecione um horário" />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map((timeOption) => (
                  <SelectItem key={timeOption} value={timeOption}>
                    {timeOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ticket Selection (if multiple tickets) */}
          {activity.hasMultipleTickets && tickets && tickets.length > 0 && (
            <div className="space-y-2">
              <Label>Tipo de ingresso</Label>
              <Select
                value={selectedTicketId || ""}
                onValueChange={(value) => setSelectedTicketId(value as Id<"activityTickets">)}
              >
                <SelectTrigger className={formStyles.select.base}>
                  <SelectValue placeholder="Selecione o tipo de ingresso" />
                </SelectTrigger>
                <SelectContent>
                  {tickets.map((ticket) => (
                    <SelectItem key={ticket._id} value={ticket._id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{ticket.name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          R$ {ticket.price.toFixed(2)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Participants */}
          <div className="space-y-2">
            <Label htmlFor="participants">Número de participantes</Label>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setParticipants(Math.max(activity.minParticipants, participants - 1))}
                disabled={participants <= activity.minParticipants}
              >
                -
              </Button>
              <div className="flex items-center justify-center w-12 h-10 border rounded-md">
                <span className="text-sm font-medium">{participants}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setParticipants(Math.min(activity.maxParticipants, participants + 1))}
                disabled={participants >= activity.maxParticipants}
              >
                +
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Mín: {activity.minParticipants} | Máx: {activity.maxParticipants}
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
              placeholder="Alguma necessidade especial ou preferência..."
            />
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                {participants} {participants === 1 ? "participante" : "participantes"}
              </span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          {/* Payment Link Button */}
          {isFormValid && hasPaymentLink ? (
            <PaymentLinkBookingButton
              assetType="activity"
              assetId={activityId}
              assetName={activity.title}
              price={totalPrice}
              stripePaymentLinkUrl={paymentLinkUrl}
              bookingData={getBookingData()}
              onBookingCreate={handleBookingCreate}
              disabled={!isFormValid}
              className="w-full"
            >
              Reservar atividade por {formatCurrency(totalPrice)}
            </PaymentLinkBookingButton>
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
    </div>
  );
}