'use client';

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { CalendarDays, Clock, Users, MapPin, Phone, Mail, DollarSign, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PartnerBookingsDashboardProps {
  partnerId: string;
}

export default function PartnerBookingsDashboard({ partnerId }: PartnerBookingsDashboardProps) {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [confirmingBooking, setConfirmingBooking] = useState<string | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);

  // Queries
  const pendingBookings = useQuery(api.domains.bookings.queries.getPendingBookingsForPartner, {
    partnerId: partnerId as any,
  });

  const bookingHistory = useQuery(api.domains.bookings.queries.getBookingHistoryForPartner, {
    partnerId: partnerId as any,
    status: selectedTab === "confirmed" ? "confirmed" : selectedTab === "cancelled" ? "cancelled" : undefined,
    limit: 20,
  });

  const paymentSummary = useQuery(api.domains.bookings.queries.getPaymentSummaryForPartner, {
    partnerId: partnerId as any,
  });

  // Mutations
  const confirmBooking = useMutation(api.domains.bookings.mutations.confirmBookingByPartner);
  const cancelBooking = useMutation(api.domains.bookings.mutations.cancelBookingByPartner);

  const handleConfirmBooking = async (bookingId: string, bookingType: string) => {
    try {
      setConfirmingBooking(bookingId);
      
      await confirmBooking({
        bookingId,
        bookingType,
        partnerId: partnerId as any,
      });

      toast.success("Reserva confirmada com sucesso! O pagamento foi capturado.");
    } catch (error) {
      console.error("Error confirming booking:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao confirmar reserva");
    } finally {
      setConfirmingBooking(null);
    }
  };

  const handleCancelBooking = async (bookingId: string, bookingType: string, reason: string) => {
    try {
      setCancellingBooking(bookingId);
      
      await cancelBooking({
        bookingId,
        bookingType,
        partnerId: partnerId as any,
        cancellationReason: reason,
      });

      toast.success("Reserva cancelada com sucesso! O reembolso será processado automaticamente.");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao cancelar reserva");
    } finally {
      setCancellingBooking(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "authorized": return "bg-blue-100 text-blue-800 border-blue-200";
      case "paid": return "bg-green-100 text-green-800 border-green-200";
      case "refunded": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(paymentSummary?.totalRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {paymentSummary?.completedPayments || 0} pagamentos concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBookings?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {paymentSummary?.pendingPayments || 0} pagamentos aguardando confirmação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reembolsos</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(paymentSummary?.refundedAmount || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {paymentSummary?.refundCount || 0} reembolsos processados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Management */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pendentes ({pendingBookings?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="confirmed">Confirmadas</TabsTrigger>
          <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <div className="space-y-4">
            {pendingBookings?.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold text-center">Nenhuma reserva pendente!</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Todas as suas reservas estão atualizadas.
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingBookings?.map((booking) => (
                <Card key={booking.bookingId} className="relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{booking.assetName}</CardTitle>
                        <CardDescription>
                          Confirmação: {booking.confirmationCode}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor("pending")}>
                          Pendente
                        </Badge>
                        <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                          {booking.paymentStatus === "authorized" ? "Autorizado" : booking.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Informações do Cliente</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {booking.customerName}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {booking.customerEmail}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {booking.customerPhone}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Detalhes da Reserva</h4>
                        <div className="space-y-1 text-sm">
                          {booking.bookingDetails.date && (
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4" />
                              {booking.bookingDetails.date}
                            </div>
                          )}
                          {booking.bookingDetails.time && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {booking.bookingDetails.time}
                            </div>
                          )}
                          {booking.bookingDetails.participants && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {booking.bookingDetails.participants} participantes
                            </div>
                          )}
                          {booking.bookingDetails.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {booking.bookingDetails.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    {booking.specialRequests && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Solicitações Especiais</h4>
                        <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                          {booking.specialRequests}
                        </p>
                      </div>
                    )}

                    {/* Payment Info */}
                    <div className="bg-blue-50 p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-sm">Valor Total</h4>
                          <p className="text-2xl font-bold text-blue-600">{formatCurrency(booking.totalPrice)}</p>
                          {booking.paymentIntentId && (
                            <p className="text-xs text-muted-foreground">
                              PaymentIntent: {booking.paymentIntentId}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Criada {formatDistanceToNow(new Date(booking.createdAt), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleConfirmBooking(booking.bookingId, booking.bookingType)}
                        disabled={confirmingBooking === booking.bookingId}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {confirmingBooking === booking.bookingId ? "Confirmando..." : "Confirmar Reserva"}
                      </Button>
                      
                      <Button
                        variant="destructive"
                        onClick={() => handleCancelBooking(booking.bookingId, booking.bookingType, "Cancelado pelo parceiro")}
                        disabled={cancellingBooking === booking.bookingId}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        {cancellingBooking === booking.bookingId ? "Cancelando..." : "Cancelar Reserva"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          <div className="space-y-4">
            {bookingHistory?.filter(b => b.status === "confirmed").map((booking) => (
              <Card key={booking.bookingId}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">{booking.assetName}</CardTitle>
                      <CardDescription>{booking.confirmationCode}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      Confirmada
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{booking.customerName}</p>
                      <p className="text-sm text-muted-foreground">{booking.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(booking.totalPrice)}</p>
                      <p className="text-xs text-green-600">Pagamento capturado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          <div className="space-y-4">
            {bookingHistory?.filter(b => b.status === "cancelled").map((booking) => (
              <Card key={booking.bookingId}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">{booking.assetName}</CardTitle>
                      <CardDescription>{booking.confirmationCode}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      Cancelada
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{booking.customerName}</p>
                      <p className="text-sm text-muted-foreground">{booking.customerEmail}</p>
                      {booking.cancellationReason && (
                        <p className="text-xs text-red-600 mt-1">
                          Motivo: {booking.cancellationReason}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(booking.totalPrice)}</p>
                      {booking.refundStatus && (
                        <p className="text-xs text-purple-600">
                          Reembolso: {booking.refundStatus}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 