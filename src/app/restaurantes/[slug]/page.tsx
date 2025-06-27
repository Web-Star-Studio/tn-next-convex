"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Clock,
  Phone,
  Globe,
  ArrowLeft,
  Heart,
  Share2,
  Star,
  UtensilsCrossed,
  BookOpen,
  Info,
} from "lucide-react";
import { type Restaurant } from "@/lib/store/restaurantsStore";
import { useRestaurantBySlug } from "@/lib/services/restaurantService";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Id } from "@/../convex/_generated/dataModel";

// Shadcn components
import { Button } from "@/components/ui/button";
import { ChatButton } from "@/components/chat/ChatButton";
import { WishlistButton } from "@/components/ui/wishlist-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ImprovedRestaurantReservationForm } from "@/components/bookings/ImprovedRestaurantReservationForm";

export default function RestaurantPage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const { restaurant, isLoading } = useRestaurantBySlug(params.slug);


  // Handle 404 case
  if (!isLoading && !restaurant) {
    notFound();
  }

  if (isLoading || !restaurant) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="animate-pulse space-y-8">
          {/* Loading skeleton */}
          <div className="h-10 w-40 bg-gray-200 rounded" />
          <div className="h-96 w-full bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 bg-gray-200 rounded" />
            <div className="h-6 w-1/2 bg-gray-200 rounded" />
            <div className="h-6 w-1/3 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Format operation hours for display
  const getOperationHoursForToday = () => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = daysOfWeek[new Date().getDay()];
    return restaurant.hours[today]?.join(" e ") || "Fechado hoje";
  };

  return (
    <>
      <main className="pb-20">
        {/* Hero Image Section */}
        <div className="relative w-full h-[70vh] overflow-hidden">
          <Image
            src={restaurant.mainImage}
            alt={restaurant.name}
            fill
            className="object-cover brightness-[0.85]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white container mx-auto">
            <div className="max-w-3xl">
              <Link
                href="/restaurantes"
                className={cn(
                  "inline-flex absolute -top-12 left-10 items-center text-sm gap-1 transition-colors font-medium",
                  "text-white hover:text-white/90 hover:underline hover:underline-offset-2"
                )}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Voltar para Restaurantes</span>
              </Link>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge
                  variant="secondary"
                  className="bg-white/20 backdrop-blur-sm"
                >
                  {restaurant.cuisine[0]}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-white/20 backdrop-blur-sm"
                >
                  {restaurant.priceRange}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-shadow-sm">
                {restaurant.name}
              </h1>
              <div className="flex items-center gap-1 text-yellow-400 mb-4">
                <Star className="h-5 w-5 fill-yellow-400" />
                <span className="font-medium">{restaurant.rating.overall.toFixed(1)}</span>
                <span className="text-white/80 text-sm">({restaurant.rating.totalReviews} avaliações)</span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/90">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{restaurant.address.neighborhood}, {restaurant.address.city}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{getOperationHoursForToday()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UtensilsCrossed className="h-4 w-4" />
                  <span>{restaurant.diningStyle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Sticky Sidebar */}
        <div className="container mx-auto px-4 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="mb-6 w-full justify-start bg-transparent border-b rounded-none p-0 h-auto">
                  <TabsTrigger
                    value="info"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent text-gray-600 data-[state=active]:text-blue-600 pb-3 pt-3 px-4 flex items-center justify-center"
                  >
                    Detalhes
                  </TabsTrigger>
                  <TabsTrigger
                    value="menu"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent text-gray-600 data-[state=active]:text-blue-600 pb-3 pt-3 px-4 flex items-center justify-center"
                  >
                    Cardápio
                  </TabsTrigger>
                  <TabsTrigger
                    value="photos"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent text-gray-600 data-[state=active]:text-blue-600 pb-3 pt-3 px-4 flex items-center justify-center"
                  >
                    Fotos
                  </TabsTrigger>
                </TabsList>

                {/* Info tab */}
                <TabsContent value="info" className="space-y-10 mt-2">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">
                      Sobre o restaurante
                    </h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {restaurant.description_long}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Especialidades culinárias</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {restaurant.cuisine.map((type, index) => (
                        <Badge key={`${restaurant.id}-cuisine-${index}`} variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 px-3 py-1">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Comodidades e recursos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                      {restaurant.features.map((feature, index) => (
                        <div key={`${restaurant.id}-feature-${index}`} className="flex items-center gap-3 text-gray-700">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Detalhes adicionais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Chef Executivo</h4>
                        <p className="text-gray-600">{restaurant.executiveChef}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Código de vestimenta</h4>
                        <p className="text-gray-600">{restaurant.dressCode}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Formas de pagamento</h4>
                        <p className="text-gray-600">{restaurant.paymentOptions.join(", ")}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Estacionamento</h4>
                        <p className="text-gray-600">{restaurant.parkingDetails}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Horário de funcionamento</h3>
                    <div className="space-y-2">
                      {Object.entries(restaurant.hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between items-center py-1.5 border-b border-gray-100">
                          <span className="font-medium">{day}</span>
                          <span className="text-gray-600">
                            {hours.length > 0 ? hours.join(" e ") : "Fechado"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Localização</h3>
                    <Card>
                      <CardContent className="p-4">
                        <div className="aspect-video relative rounded-lg overflow-hidden mb-4 bg-gray-100">
                          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                            <span>Mapa indisponível</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <p className="font-medium">{restaurant.name}</p>
                          <p className="text-gray-600">{restaurant.address.street}</p>
                          <p className="text-gray-600">{restaurant.address.neighborhood}, {restaurant.address.city} - {restaurant.address.state}</p>
                          <p className="text-gray-600">{restaurant.address.zipCode}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Menu tab */}
                <TabsContent value="menu" className="space-y-6 mt-2">
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-5 w-5 text-blue-600" />
                    <AlertTitle className="text-blue-800 font-medium">
                      Informação sobre o cardápio
                    </AlertTitle>
                    <AlertDescription className="text-blue-700">
                      O cardápio apresentado é uma amostra e pode variar de acordo com a sazonalidade e disponibilidade dos ingredientes. Recomendamos verificar as opções atuais diretamente com o restaurante.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-8">
                    {restaurant.menuImages && restaurant.menuImages.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {restaurant.menuImages.map((img, index) => (
                          <div key={`${restaurant.id}-menu-${index}`} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-gray-200">
                            <Image 
                              src={img} 
                              alt={`Menu do ${restaurant.name} - página ${index + 1}`} 
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Cardápio digital não disponível</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Photos tab */}
                <TabsContent value="photos" className="space-y-8 mt-2">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Galeria de fotos</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[restaurant.mainImage, ...restaurant.galleryImages].map((img, index) => (
                        <div key={`${restaurant.id}-photo-${index}`} className="relative aspect-square rounded-lg overflow-hidden">
                          <Image 
                            src={img} 
                            alt={`${restaurant.name} - foto ${index + 1}`} 
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:row-start-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Reservation Card */}
                <Card className="overflow-hidden border-gray-200">
                  <CardContent className="p-0">
                    <ImprovedRestaurantReservationForm 
                      restaurantId={(restaurant._id || restaurant.id) as Id<"restaurants">}
                      restaurant={{
                        name: restaurant.name,
                        cuisine: restaurant.cuisine || [],
                        priceRange: restaurant.priceRange || "$$",
                        rating: {
                          overall: restaurant.rating?.overall || 0,
                          totalReviews: restaurant.rating?.totalReviews || 0
                        },
                        address: {
                          street: restaurant.address?.street || "",
                          neighborhood: restaurant.address?.neighborhood || "",
                          city: restaurant.address?.city || "",
                          zipCode: restaurant.address?.zipCode || ""
                        },
                        contact: {
                          phone: restaurant.phone || "",
                          email: undefined
                        },
                        operatingHours: restaurant.hours ? Object.fromEntries(
                          Object.entries(restaurant.hours).map(([day, hours]) => [
                            day,
                            Array.isArray(hours) && hours.length > 0 
                              ? { open: hours[0].split('-')[0]?.trim() || "09:00", close: hours[0].split('-')[1]?.trim() || "22:00" }
                              : { open: "09:00", close: "22:00" }
                          ])
                        ) : {},
                        features: {
                          hasReservation: restaurant.acceptsReservations ?? true,
                          hasDelivery: restaurant.features?.includes("Delivery") ?? false,
                          hasTakeout: restaurant.features?.includes("Takeout") ?? false,
                          acceptsCreditCard: restaurant.paymentOptions?.includes("Cartão de Crédito") ?? true,
                          hasWifi: restaurant.features?.includes("Wi-Fi") ?? false,
                          hasParking: restaurant.features?.includes("Estacionamento") ?? false,
                          isAccessible: restaurant.features?.includes("Acessível") ?? false,
                          allowsPets: restaurant.features?.includes("Pet-friendly") ?? false,
                          hasOutdoorSeating: restaurant.features?.includes("Área externa") ?? false,
                          hasLiveMusic: restaurant.features?.includes("Música ao vivo") ?? false
                        },
                        capacity: {
                          totalSeats: 50, // Default value
                          maxTableSize: restaurant.maximumPartySize || 8
                        }
                      }}
                      onReservationSuccess={(reservation) => {
                        console.log("Reservation submitted:", reservation);
                        toast.success(`Reserva realizada com sucesso! Código: ${reservation.confirmationCode}`);
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Contact Card */}
                <Card className="bg-white border-none outline-none">
                  <CardContent className="p-6 space-y-4 bg-blue-50">
                    <h3 className="font-semibold text-lg">Informações de contato</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm text-gray-500">Telefone</h4>
                          <p className="text-gray-900">{restaurant.phone}</p>
                        </div>
                      </div>
                      
                      { restaurant.website && (
                        <div className="flex items-start gap-3">
                          <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-sm text-gray-500">Website</h4>
                            <a 
                              href={restaurant.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {restaurant.website.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm text-gray-500">Endereço</h4>
                          <p className="text-gray-900">{restaurant.address.street}</p>
                          <p className="text-gray-900">{restaurant.address.neighborhood}, {restaurant.address.city} - {restaurant.address.state}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action buttons */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <WishlistButton
                      itemType="restaurant"
                      itemId={(restaurant._id || restaurant.id) as string}
                      variant="outline"
                      className="flex-1 border-gray-200"
                    />
                    <Button variant="outline" className="flex-1 border-gray-200">
                      <Share2 className="h-5 w-5 mr-2 text-gray-600" />
                      Compartilhar
                    </Button>
                  </div>

                  {/* Chat Button */}
                  <ChatButton
                    assetId={(restaurant._id || restaurant.id) as string}
                    assetType="restaurants"
                    assetName={restaurant.name}
                    partnerId={restaurant.partnerId as any}
                    variant="default"
                    size="md"
                    className="w-full"
                  />
                </div>

                {/* Rating Card */}
                <Card className="overflow-hidden border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Avaliações</h3>
                    <div className="flex items-center mb-4">
                      <div className="text-3xl font-bold text-gray-900 mr-3">
                        {restaurant.rating.overall.toFixed(1)}
                      </div>
                      <div>
                        <div className="flex text-yellow-400 mb-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "h-4 w-4",
                                star <= Math.round(restaurant.rating.overall)
                                  ? "fill-yellow-400"
                                  : "fill-gray-200"
                              )}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-500">
                          {restaurant.rating.totalReviews} avaliações
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 w-20">Comida</span>
                        <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{
                              width: `${(restaurant.rating.food / 5) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">{restaurant.rating.food.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 w-20">Serviço</span>
                        <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{
                              width: `${(restaurant.rating.service / 5) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">{restaurant.rating.service.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 w-20">Ambiente</span>
                        <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{
                              width: `${(restaurant.rating.ambience / 5) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">{restaurant.rating.ambience.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 w-20">Custo-benefício</span>
                        <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{
                              width: `${(restaurant.rating.value / 5) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">{restaurant.rating.value.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Nível de ruído</span>
                        <span className="text-sm font-medium">{restaurant.rating.noiseLevel}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
