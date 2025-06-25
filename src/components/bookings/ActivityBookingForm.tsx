"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Users, Clock, Ticket, MessageCircle } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import { useWhatsAppLink } from "@/lib/hooks/useSystemSettings";

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
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);

  // Get activity tickets if available
  const tickets = useQuery(api.domains.activities.queries.getActivityTickets, {
    activityId,
  });

  // Get WhatsApp link generator
  const { generateWhatsAppLink } = useWhatsAppLink();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast.error("Selecione uma data");
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast.error("Preencha todas as informações de contato");
      return;
    }

    // Open payment dialog instead of creating booking directly
    setPaymentOpen(true);
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    // Important: Payment approved but booking is created with "pending" status
    // Partner/Employee needs to confirm the booking
    
    toast.success("Pagamento aprovado!", {
      description: `${formatCurrency(totalPrice)} pagos com sucesso.`,
    });

    // Reset form
    setDate(undefined);
    setTime("");
    setParticipants(activity.minParticipants);
    setSelectedTicketId(undefined);
    setCustomerInfo({ name: "", email: "", phone: "" });
    setSpecialRequests("");
    setPaymentOpen(false);
    
    // Show booking status information
    setTimeout(() => {
      toast.success("Solicitação de atividade enviada!", {
        description: "Aguardando confirmação do organizador. Você receberá um email quando a reserva for confirmada.",
      });
    }, 2000);
  };

  return (
    <>
      <div className={cn(cardStyles.base, cardStyles.hover.default, className)}>
        <form onSubmit={handleSubmit} className={cardStyles.content.default}>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Reserve sua atividade</h3>
              <p className="text-sm text-gray-500 mt-1">{activity.title}</p>
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

            {/* Submit Button */}
            <Button
              type="submit"
              className={cn(buttonStyles.variant.default, "w-full")}
              disabled={!date}
            >
              Reservar atividade
            </Button>
          </div>
        </form>
      </div>

      {/* Payment dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogTitle>Pagamento da Atividade</DialogTitle>
          <DialogDescription>Complete o pagamento para confirmar sua reserva.</DialogDescription>
          <StripeProvider>
            <BookingPaymentForm 
              amountCents={totalPrice * 100}
              bookingType="activity"
              bookingData={{
                activityId,
                ticketId: selectedTicketId,
                date: date ? format(date, "yyyy-MM-dd") : "",
                time: time || undefined,
                participants,
                customerInfo,
                specialRequests: specialRequests || undefined,
              }}
              onSuccess={handlePaymentSuccess}
            />
          </StripeProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}