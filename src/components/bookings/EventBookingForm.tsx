"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Ticket, Users, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { cardStyles, buttonStyles, formStyles, badgeStyles } from "@/lib/ui-config";
import { StripeProvider } from "@/components/payments/StripeProvider";
import BookingPaymentForm from "@/components/payments/BookingPaymentForm";

interface EventBookingFormProps {
  eventId: Id<"events">;
  event: {
    title: string;
    date: string;
    time: string;
    location: string;
    price: number;
    hasMultipleTickets: boolean;
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

export function EventBookingForm({
  eventId,
  event,
  onBookingSuccess,
  className,
}: EventBookingFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedTicketId, setSelectedTicketId] = useState<Id<"eventTickets"> | undefined>();
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);

  // Get event tickets if available
  const tickets = useQuery(api.domains.events.queries.getEventTickets, {
    eventId,
  });

  // Calculate price
  const getPrice = () => {
    if (selectedTicketId && tickets) {
      const ticket = tickets.find(t => t._id === selectedTicketId);
      return ticket ? ticket.price * quantity : event.price * quantity;
    }
    return event.price * quantity;
  };

  const totalPrice = getPrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    setQuantity(1);
    setSelectedTicketId(undefined);
    setCustomerInfo({ name: "", email: "", phone: "" });
    setSpecialRequests("");
    setPaymentOpen(false);
    
    // Show booking status information
    setTimeout(() => {
      toast.success("Solicitação de ingresso enviada!", {
        description: "Aguardando confirmação do organizador. Você receberá um email quando a compra for confirmada.",
      });
    }, 2000);
  };

  // Parse event date for display
  const eventDate = new Date(event.date);
  const isEventPast = eventDate < new Date();

  return (
    <>
      <div className={cn(cardStyles.base, cardStyles.hover.default, className)}>
        <form onSubmit={handleSubmit} className={cardStyles.content.default}>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Reserve seu ingresso</h3>
              <p className="text-sm text-gray-500 mt-1">{event.title}</p>
            </div>

            {/* Event Details */}
            <div className="bg-blue-50 p-4 rounded-md space-y-3">
              <div className="flex items-center text-sm text-gray-700">
                <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                <span>{format(eventDate, "PPP", { locale: ptBR })} às {event.time}</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <MapPin className="mr-2 h-4 w-4 text-blue-600" />
                <span>{event.location}</span>
              </div>
              {isEventPast && (
                <div className={cn(badgeStyles.base, badgeStyles.variant.warning)}>
                  Este evento já aconteceu
                </div>
              )}
            </div>

            {/* Ticket Selection (if multiple tickets) */}
            {event.hasMultipleTickets && tickets && tickets.length > 0 && (
              <div className="space-y-2">
                <Label>Tipo de ingresso</Label>
                <Select
                  value={selectedTicketId || ""}
                  onValueChange={(value) => setSelectedTicketId(value as Id<"eventTickets">)}
                >
                  <SelectTrigger className={formStyles.select.base}>
                    <SelectValue placeholder="Selecione o tipo de ingresso" />
                  </SelectTrigger>
                  <SelectContent>
                    {tickets.map((ticket) => (
                      <SelectItem key={ticket._id} value={ticket._id}>
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <span className="font-medium">{ticket.name}</span>
                            <p className="text-xs text-gray-500">{ticket.description}</p>
                          </div>
                          <span className="text-sm font-semibold text-blue-600 ml-4">
                            R$ {ticket.price.toFixed(2)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade de ingressos</Label>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <div className="flex items-center justify-center w-12 h-10 border rounded-md">
                  <span className="text-sm font-medium">{quantity}</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= 10} // Max 10 tickets per order
                >
                  +
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Máximo 10 ingressos por pedido
              </p>
            </div>

            {/* Customer Information */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-semibold text-gray-900">Informações do comprador</h4>
              
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
              <Label htmlFor="requests">Observações (opcional)</Label>
              <Textarea
                id="requests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className={formStyles.textarea.base}
                placeholder="Alguma necessidade especial, acessibilidade, etc..."
              />
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 p-4 rounded-md space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {quantity} {quantity === 1 ? "ingresso" : "ingressos"}
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
              disabled={isEventPast}
            >
              {isEventPast ? (
                "Evento já realizado"
              ) : (
                <>
                  <Ticket className="mr-2 h-4 w-4" />
                  Comprar {quantity === 1 ? "ingresso" : "ingressos"}
                </>
              )}
            </Button>

            {isEventPast && (
              <p className="text-xs text-center text-gray-500">
                Este evento já aconteceu e não aceita mais reservas
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Payment dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogTitle>Pagamento do Ingresso</DialogTitle>
          <DialogDescription>Complete o pagamento para confirmar sua compra.</DialogDescription>
          <StripeProvider>
            <BookingPaymentForm 
              amountCents={totalPrice * 100}
              bookingType="event"
              bookingData={{
                eventId,
                ticketId: selectedTicketId,
                quantity,
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