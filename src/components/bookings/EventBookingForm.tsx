"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Ticket, Users, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

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
import PaymentWrapper from "@/components/payments/PaymentWrapper";

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
  const [phoneInput, setPhoneInput] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);

  // Get current user information
  const { user, isLoading: userLoading } = useCurrentUser();

  // Get event tickets if available
  const tickets = useQuery(api.domains.events.queries.getEventTickets, {
    eventId,
  });

  // Auto-fill customer info with user data
  useEffect(() => {
    if (user && !userLoading) {
      setCustomerInfo({
        name: user.name || "",
        email: user.email || "",
        phone: "",
      });
      setPhoneInput("");
    }
  }, [user, userLoading]);

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

    // Open payment dialog
    setPaymentOpen(true);
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    toast.success("Pagamento aprovado!", {
      description: `${formatCurrency(totalPrice)} pagos com sucesso.`,
    });

    // Reset form
    setQuantity(1);
    setSelectedTicketId(undefined);
    setSpecialRequests("");
    setPhoneInput("");
    setPaymentOpen(false);
    
    // Show booking status information
    setTimeout(() => {
      toast.success("Ingresso(s) adquirido(s)!", {
        description: "Aguardando confirmação. Você receberá os ingressos por email.",
      });
    }, 2000);
  };

  // Parse event date for display
  const eventDate = new Date(event.date);
  const isEventPast = eventDate < new Date();

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

            {/* User info display */}
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-semibold text-gray-900 mb-2">Informações da compra:</h4>
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
                  ⚠️ Complete suas informações no perfil para comprar ingressos
                </p>
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
              disabled={isEventPast || !customerInfo.name || !customerInfo.email || !phoneInput.trim()}
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
          <PaymentWrapper 
            amountCents={totalPrice * 100}
            bookingType="event"
            bookingData={{
              eventId,
              ticketId: selectedTicketId,
              quantity,
              customerInfo: {
                ...customerInfo,
                phone: phoneInput,
              },
              specialRequests: specialRequests || undefined,
            }}
            onSuccess={handlePaymentSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}