import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { cachedRecommendationsTable } from "./domains/recommendations/schema";

export default defineSchema({
  authAccounts: defineTable({
    emailVerified: v.optional(v.string()),
    phoneVerified: v.optional(v.string()),
    provider: v.string(),
    providerAccountId: v.string(),
    secret: v.optional(v.string()),
    userId: v.id("users"),
  })
    .index("providerAndAccountId", ["provider", "providerAccountId"])
    .index("userIdAndProvider", ["userId", "provider"]),
  authRateLimits: defineTable({
    attemptsLeft: v.float64(),
    identifier: v.string(),
    lastAttemptTime: v.float64(),
  }).index("identifier", ["identifier"]),
  authRefreshTokens: defineTable({
    expirationTime: v.float64(),
    firstUsedTime: v.optional(v.float64()),
    parentRefreshTokenId: v.optional(v.id("authRefreshTokens")),
    sessionId: v.id("authSessions"),
  })
    .index("sessionId", ["sessionId"])
    .index("sessionIdAndParentRefreshTokenId", [
      "sessionId",
      "parentRefreshTokenId",
    ]),
  authSessions: defineTable({
    expirationTime: v.float64(),
    userId: v.id("users"),
  }).index("userId", ["userId"]),
  authVerificationCodes: defineTable({
    accountId: v.id("authAccounts"),
    code: v.string(),
    emailVerified: v.optional(v.string()),
    expirationTime: v.float64(),
    phoneVerified: v.optional(v.string()),
    provider: v.string(),
    verifier: v.optional(v.string()),
  })
    .index("accountId", ["accountId"])
    .index("code", ["code"]),
  authVerifiers: defineTable({
    sessionId: v.optional(v.id("authSessions")),
    signature: v.optional(v.string()),
  }).index("signature", ["signature"]),
  users: defineTable({
    clerkId: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.float64()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.float64()),
    role: v.optional(v.string()),
    partnerId: v.optional(v.id("users")),
    organizationId: v.optional(v.id("partnerOrganizations")),
    isActive: v.optional(v.boolean()),                  // Status ativo/inativo do usuário
    
    // Campos de onboarding para travelers
    fullName: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()), // Formato ISO string (YYYY-MM-DD)
    phoneNumber: v.optional(v.string()),
    onboardingCompleted: v.optional(v.boolean()),
    onboardingCompletedAt: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"])
    .index("clerkId", ["clerkId"])
    .index("by_partner", ["partnerId"])
    .index("by_organization", ["organizationId"]),
  assetPermissions: defineTable({
    employeeId: v.id("users"),
    assetId: v.string(), // Store as string for flexibility across different asset types
    assetType: v.string(),
    permissions: v.array(v.string()), // Array of permissions like ["view", "edit", "manage"]
    grantedAt: v.number(),
    grantedBy: v.id("users"), // Partner who granted the permissions
    partnerId: v.id("users"), // Add partnerId field for backwards compatibility
  })
    .index("by_employee_asset_type", ["employeeId", "assetType"])
    .index("by_asset_type", ["assetType", "assetId"])
    .index("by_partner", ["partnerId"]) // Add missing index
    .index("by_employee", ["employeeId"]) // Add missing index
    .index("by_employee_partner", ["employeeId", "partnerId"]), // Add missing index

  // Employee creation requests for partners
  employeeCreationRequests: defineTable({
    employeeId: v.id("users"),              // Reference to created employee record
    partnerId: v.id("users"),               // Partner who initiated the creation
    email: v.string(),                      // Employee email
    password: v.string(),                   // Temporary password storage
    name: v.string(),                       // Employee name
    phone: v.optional(v.string()),          // Employee phone
    organizationId: v.optional(v.id("partnerOrganizations")), // Organization assignment
    status: v.union(                        // Request status
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    clerkId: v.optional(v.string()),        // Clerk user ID when created
    errorMessage: v.optional(v.string()),   // Error message if creation failed
    createdAt: v.number(),                  // Creation timestamp
    processedAt: v.optional(v.number()),    // When processing completed
  })
    .index("by_partner", ["partnerId"])
    .index("by_status", ["status"])
    .index("by_employee", ["employeeId"])
    .index("by_email", ["email"]),
    
  // Mensagens de suporte do botão flutuante
  supportMessages: defineTable({
    userId: v.id("users"), // Usuário que enviou a mensagem
    userRole: v.union(v.literal("traveler"), v.literal("partner"), v.literal("employee"), v.literal("master")),
    subject: v.string(),
    category: v.union(
      v.literal("duvida"),
      v.literal("problema"), 
      v.literal("sugestao"),
      v.literal("cancelamento"),
      v.literal("outro")
    ),
    message: v.string(),
    contactEmail: v.string(),
    isUrgent: v.boolean(),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("resolved"),
      v.literal("closed")
    ),
    assignedToMasterId: v.optional(v.id("users")), // Master responsável
    responseMessage: v.optional(v.string()),
    respondedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_assigned_master", ["assignedToMasterId"])
    .index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"])
    .index("by_urgent", ["isUrgent"]),

  // Permissões sobre organizações/empreendimentos
  organizationPermissions: defineTable({
    // ID do employee
    employeeId: v.id("users"),
    
    // ID do partner que concedeu a permissão
    partnerId: v.id("users"),
    
    // ID da organização/empreendimento
    organizationId: v.id("partnerOrganizations"),
    
    // Permissões (view, edit, manage)
    permissions: v.array(v.string()),
    
    // Nota opcional sobre a permissão
    note: v.optional(v.string()),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_employee", ["employeeId"]) // Todas as permissões de um employee
    .index("by_partner", ["partnerId"]) // Todas as permissões concedidas por um partner
    .index("by_organization", ["organizationId"]) // Todas as permissões para uma organização específica
    .index("by_employee_partner", ["employeeId", "partnerId"]) // Permissões de um employee por partner
    .index("by_employee_organization", ["employeeId", "organizationId"]), // Permissões específicas employee-organização

  // Sistema de Chat
  chatRooms: defineTable({
    // Tipo de contexto do chat (asset ou booking)
    contextType: v.union(v.literal("asset"), v.literal("booking")),
    
    // ID do contexto (asset ID ou booking ID)
    contextId: v.string(),
    
    // Tipo do asset (se contextType for "asset")
    assetType: v.optional(v.string()), // "restaurants", "events", "activities", "vehicles", "accommodations"
    
    // Participantes do chat
    travelerId: v.id("users"), // O traveler que iniciou o chat
    partnerId: v.id("users"),  // O partner/employee responsável pelo asset
    
    // Status do chat
    status: v.union(
      v.literal("active"),
      v.literal("closed"),
      v.literal("archived")
    ),
    
    // Metadata
    title: v.string(), // Título do chat baseado no contexto
    lastMessageAt: v.optional(v.number()),
    lastMessagePreview: v.optional(v.string()),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_traveler", ["travelerId"])
    .index("by_partner", ["partnerId"])
    .index("by_context", ["contextType", "contextId"])
    .index("by_traveler_partner", ["travelerId", "partnerId"])
    .index("by_status", ["status"]),

  chatMessages: defineTable({
    // Referência à sala de chat
    chatRoomId: v.id("chatRooms"),
    
    // Autor da mensagem
    senderId: v.id("users"),
    senderRole: v.union(v.literal("traveler"), v.literal("partner"), v.literal("employee"), v.literal("master")),
    
    // Conteúdo da mensagem
    content: v.string(),
    messageType: v.union(
      v.literal("text"),
      v.literal("image"),
      v.literal("file"),
      v.literal("system") // Mensagens automáticas do sistema
    ),
    
    // Metadados da mensagem
    isRead: v.boolean(),
    readAt: v.optional(v.number()),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_chatroom", ["chatRoomId"])
    .index("by_chatroom_timestamp", ["chatRoomId", "createdAt"])
    .index("by_sender", ["senderId"])
    .index("by_unread", ["isRead"]),

  activities: defineTable({
    title: v.string(),
    description: v.string(),
    shortDescription: v.string(),
    price: v.float64(),
    category: v.string(),
    duration: v.string(),
    maxParticipants: v.int64(),
    minParticipants: v.int64(),
    difficulty: v.string(),
    rating: v.float64(),
    imageUrl: v.string(),
    galleryImages: v.array(v.string()),
    highlights: v.array(v.string()),
    includes: v.array(v.string()),
    itineraries: v.array(v.string()),
    excludes: v.array(v.string()),
    additionalInfo: v.array(v.string()),
    cancelationPolicy: v.array(v.string()),
    isFeatured: v.boolean(),
    isActive: v.boolean(),
    hasMultipleTickets: v.optional(v.boolean()),
    partnerId: v.id("users"),
  })
    .index("by_partner", ["partnerId"])
    .index("featured_activities", ["isFeatured", "isActive"])
    .index("active_activities", ["isActive"]),
    
  activityTickets: defineTable({
    activityId: v.id("activities"),           // Referência à atividade
    name: v.string(),                         // Nome do ingresso
    description: v.string(),                  // Descrição do ingresso
    price: v.float64(),                       // Preço do ingresso
    availableQuantity: v.int64(),             // Quantidade disponível
    maxPerOrder: v.int64(),                   // Quantidade máxima por pedido
    type: v.string(),                         // Tipo (ex: "regular", "vip", "discount", "free")
    benefits: v.array(v.string()),            // Benefícios incluídos neste ticket
    isActive: v.boolean(),                    // Se o ingresso está ativo/disponível
  })
    .index("by_activity", ["activityId"])
    .index("by_activity_and_active", ["activityId", "isActive"]),
  events: defineTable({
    title: v.string(),
    description: v.string(),
    shortDescription: v.string(),
    date: v.string(),        // ISO date string for the event date
    time: v.string(),        // Time string for the event
    location: v.string(),    // Location name
    address: v.string(),     // Full address
    price: v.float64(),      // Base price (pode ser o ingresso mais barato) 
    category: v.string(),
    maxParticipants: v.int64(),
    imageUrl: v.string(),
    galleryImages: v.array(v.string()),
    highlights: v.array(v.string()),
    includes: v.array(v.string()),
    additionalInfo: v.array(v.string()),
    speaker: v.optional(v.string()),     // Optional speaker/host name
    speakerBio: v.optional(v.string()),  // Optional speaker bio
    isFeatured: v.boolean(),
    isActive: v.boolean(),
    hasMultipleTickets: v.boolean(),     // Flag indicando se tem múltiplos ingressos
    partnerId: v.id("users"),
    symplaUrl: v.optional(v.string()),   // URL for Sympla event
    whatsappContact: v.optional(v.string()), // WhatsApp contact number for reservations
    // New Sympla fields
    symplaId: v.optional(v.string()),    // ID of the event in Sympla
    symplaHost: v.optional(v.object({    // Information about the host from Sympla
      name: v.string(),
      description: v.string(),
    })),
    sympla_private_event: v.optional(v.boolean()), // If the event is private on Sympla
    sympla_published: v.optional(v.boolean()),     // If the event is published on Sympla
    sympla_cancelled: v.optional(v.boolean()),     // If the event is cancelled on Sympla
    external_id: v.optional(v.string()),           // External ID (reference_id on Sympla)
    sympla_categories: v.optional(v.object({       // Categories from Sympla
      primary: v.optional(v.string()),
      secondary: v.optional(v.string()),
    })),
  })
    .index("by_partner", ["partnerId"])
    .index("by_date", ["date"])
    .index("featured_events", ["isFeatured", "isActive"])
    .index("active_events", ["isActive"]),
    
  eventTickets: defineTable({
    eventId: v.id("events"),              // Referência ao evento
    name: v.string(),                     // Nome do ingresso (ex: "VIP", "Standard")
    description: v.string(),              // Descrição do ingresso
    price: v.float64(),                   // Preço do ingresso
    availableQuantity: v.int64(),         // Quantidade disponível
    maxPerOrder: v.int64(),               // Quantidade máxima por pedido
    type: v.string(),                     // Tipo (ex: "regular", "vip", "discount", "free")
    benefits: v.array(v.string()),        // Benefícios incluídos neste ticket
    isActive: v.boolean(),                // Se o ingresso está ativo/disponível
  })
    .index("by_event", ["eventId"])
    .index("by_event_and_active", ["eventId", "isActive"]),
    
  restaurants: defineTable({
    name: v.string(),                                   // Nome do restaurante
    slug: v.string(),                                   // Slug para URL
    description: v.string(),                            // Descrição curta
    description_long: v.string(),                       // Descrição longa
    address: v.object({                                 // Objeto com informações de endereço
      street: v.string(),                               // Rua
      city: v.string(),                                 // Cidade
      state: v.string(),                                // Estado
      zipCode: v.string(),                              // CEP
      neighborhood: v.string(),                         // Bairro
      coordinates: v.object({                           // Coordenadas geográficas
        latitude: v.float64(),                          // Latitude
        longitude: v.float64(),                         // Longitude
      }),
    }),
    phone: v.string(),                                  // Telefone de contato
    website: v.optional(v.string()),                    // Website (opcional)
    cuisine: v.array(v.string()),                       // Array com tipos de cozinha
    priceRange: v.string(),                             // Faixa de preço (ex: "$", "$$", "$$$")
    diningStyle: v.string(),                            // Estilo (ex: "Casual", "Fine Dining")
    hours: v.object({                                   // Horário de funcionamento por dia
      Monday: v.array(v.string()),                      // Array com horários - pode ser vazio
      Tuesday: v.array(v.string()),
      Wednesday: v.array(v.string()),
      Thursday: v.array(v.string()),
      Friday: v.array(v.string()),
      Saturday: v.array(v.string()),
      Sunday: v.array(v.string()),
    }),
    features: v.array(v.string()),                      // Características especiais
    dressCode: v.optional(v.string()),                  // Código de vestimenta (opcional)
    paymentOptions: v.array(v.string()),                // Opções de pagamento
    parkingDetails: v.optional(v.string()),             // Informações sobre estacionamento (opcional)
    mainImage: v.string(),                              // Imagem principal
    galleryImages: v.array(v.string()),                 // Imagens da galeria
    menuImages: v.optional(v.array(v.string())),        // Imagens do menu (opcional)
    rating: v.object({                                  // Objeto com avaliações
      overall: v.float64(),                             // Nota geral
      food: v.float64(),                                // Nota para comida
      service: v.float64(),                             // Nota para serviço
      ambience: v.float64(),                            // Nota para ambiente
      value: v.float64(),                               // Nota para custo-benefício
      noiseLevel: v.string(),                           // Nível de barulho
      totalReviews: v.int64(),                          // Total de avaliações
    }),
    acceptsReservations: v.boolean(),                   // Aceita reservas
    maximumPartySize: v.int64(),                        // Tamanho máximo de grupo
    tags: v.array(v.string()),                          // Tags para busca
    executiveChef: v.optional(v.string()),              // Chef executivo (opcional)
    privatePartyInfo: v.optional(v.string()),           // Informações para eventos privados (opcional)
    isActive: v.boolean(),                              // Status ativo/inativo
    isFeatured: v.boolean(),                            // Status destacado
    partnerId: v.id("users"),                           // ID do parceiro/proprietário
  })
    .index("by_slug", ["slug"])                         // Índice por slug (URL)
    .index("by_partner", ["partnerId"])                 // Índice por parceiro
    .index("featured_restaurants", ["isFeatured", "isActive"])  // Índice para restaurantes destacados
    .index("active_restaurants", ["isActive"]),         // Índice para restaurantes ativos
    
  restaurantReservations: defineTable({
    restaurantId: v.id("restaurants"),                  // Referência ao restaurante
    userId: v.id("users"),                              // Usuário que fez a reserva
    date: v.string(),                                   // Data da reserva (YYYY-MM-DD)
    time: v.string(),                                   // Horário da reserva (HH:MM)
    partySize: v.number(),                              // Número de pessoas
    name: v.string(),                                   // Nome do responsável pela reserva
    email: v.string(),                                  // Email de contato
    phone: v.string(),                                  // Telefone de contato
    specialRequests: v.optional(v.string()),            // Solicitações especiais (opcional)
    partnerNotes: v.optional(v.string()),               // Notes from partner/employee
    status: v.string(),                                 // Status (ex: "pending", "confirmed", "canceled")
    confirmationCode: v.string(),                       // Código de confirmação
    tableId: v.optional(v.id("restaurantTables")),      // Mesa atribuída (opcional)
    paymentIntentId: v.optional(v.string()),        // Stripe PaymentIntent ID
    paymentCaptured: v.optional(v.boolean()),        // Se o pagamento foi capturado
    refundId: v.optional(v.string()),                // Stripe Refund ID se aplicável
    refundStatus: v.optional(v.string()),            // Status do refund: pending, succeeded, failed
    cancellationReason: v.optional(v.string()),      // Motivo do cancelamento
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_user", ["userId"])
    .index("by_date", ["date"])
    .index("by_status", ["status"])
    .index("by_table", ["tableId"]),

  // Tabelas do restaurante
  restaurantTables: defineTable({
    restaurantId: v.id("restaurants"),                  // Referência ao restaurante
    name: v.string(),                                   // Nome/número da mesa (ex: "Mesa 01", "VIP A")
    capacity: v.int64(),                                // Capacidade máxima de pessoas
    location: v.string(),                               // Localização (ex: "Interno", "Varanda", "VIP")
    type: v.string(),                                   // Tipo (ex: "Standard", "VIP", "Bar")
    shape: v.string(),                                  // Formato (ex: "Round", "Square", "Rectangular")
    isActive: v.boolean(),                              // Mesa disponível para reservas
    isVip: v.boolean(),                                 // Mesa VIP
    hasView: v.boolean(),                               // Mesa com vista
    notes: v.optional(v.string()),                      // Observações especiais
    position: v.optional(v.object({                     // Posição no layout (opcional)
      x: v.float64(),
      y: v.float64(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_restaurant_active", ["restaurantId", "isActive"])
    .index("by_capacity", ["capacity"]),

  // Categorias do cardápio
  menuCategories: defineTable({
    restaurantId: v.id("restaurants"),                  // Referência ao restaurante
    name: v.string(),                                   // Nome da categoria (ex: "Pratos Principais", "Sobremesas")
    description: v.optional(v.string()),                // Descrição da categoria
    order: v.int64(),                                   // Ordem de exibição
    isActive: v.boolean(),                              // Categoria ativa
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_restaurant_order", ["restaurantId", "order"]),

  // Itens do cardápio
  menuItems: defineTable({
    restaurantId: v.id("restaurants"),                  // Referência ao restaurante
    categoryId: v.id("menuCategories"),                 // Referência à categoria
    name: v.string(),                                   // Nome do prato
    description: v.string(),                            // Descrição do prato
    price: v.float64(),                                 // Preço
    image: v.optional(v.string()),                      // Imagem do prato (opcional)
    ingredients: v.array(v.string()),                   // Lista de ingredientes
    allergens: v.array(v.string()),                     // Alérgenos
    preparationTime: v.optional(v.int64()),             // Tempo de preparo em minutos (opcional)
    calories: v.optional(v.int64()),                    // Calorias (opcional)
    isVegetarian: v.boolean(),                          // Vegetariano
    isVegan: v.boolean(),                               // Vegano
    isGlutenFree: v.boolean(),                          // Sem glúten
    isSpicy: v.boolean(),                               // Picante
    spicyLevel: v.optional(v.int64()),                  // Nível de picância (1-5) (opcional)
    isSignature: v.boolean(),                           // Prato assinatura
    isAvailable: v.boolean(),                           // Disponível
    order: v.int64(),                                   // Ordem dentro da categoria
    tags: v.array(v.string()),                          // Tags (ex: "Popular", "Chef's Choice")
    notes: v.optional(v.string()),                      // Observações
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_category", ["categoryId"])
    .index("by_restaurant_available", ["restaurantId", "isAvailable"])
    .index("by_category_order", ["categoryId", "order"])
    .index("by_signature", ["isSignature"])             // Índice por pratos assinatura
    .index("by_spicy", ["isSpicy"])                     // Índice por pratos picantes
    .index("by_vegetarian", ["isVegetarian"])           // Índice por pratos vegetarianos
    .index("by_restaurant_signature", ["restaurantId", "isSignature"]), // Índice por restaurante e pratos assinatura
  media: defineTable({
    storageId: v.string(),          // Convex Storage ID
    fileName: v.string(),          // Original file name
    fileType: v.string(),          // MIME type (e.g., image/jpeg)
    fileSize: v.int64(),           // File size in bytes
    description: v.optional(v.string()), // Optional description
    category: v.optional(v.string()),   // Optional category for organization
    height: v.optional(v.int64()),      // Image height if applicable
    width: v.optional(v.int64()),       // Image width if applicable
    uploadedBy: v.id("users"),         // User who uploaded the file
    isPublic: v.boolean(),           // Is the file publicly accessible
    tags: v.optional(v.array(v.string())), // Optional tags for filtering
    url: v.string(),                 // URL to access the file
  })
    .index("by_uploadedBy", ["uploadedBy"])
    .index("by_category", ["category"])
    .index("by_isPublic", ["isPublic"])
    .index("by_storageId", ["storageId"]),
  invites: defineTable({
    employeeId: v.id("users"),  // ID do usuário placeholder
    email: v.string(),            // Email convidado
    token: v.string(),            // Token único de convite
    createdAt: v.number(),        // Timestamp de criação
    expiresAt: v.number(),        // Timestamp de expiração
    status: v.string(),           // 'pending', 'used', etc.
  })
    .index("by_token", ["token"])
    .index("by_employee", ["employeeId"])
    .index("by_email", ["email"]),
  userPreferences: defineTable({
    userId: v.id("users"),                          // ID do usuário
    tripDuration: v.string(),                       // Duração da viagem
    tripDate: v.string(),                           // Período da viagem
    companions: v.string(),                         // Acompanhantes
    interests: v.array(v.string()),                 // Interesses (praias, mergulho, etc)
    budget: v.number(),                             // Orçamento por pessoa
    preferences: v.object({                         // Preferências específicas
      accommodation: v.string(),                    // Tipo de hospedagem
      dining: v.array(v.string()),                  // Preferências gastronômicas
      activities: v.array(v.string()),              // Atividades preferidas
    }),
    specialRequirements: v.optional(v.string()),    // Requisitos especiais (opcional)
    updatedAt: v.number(),                          // Timestamp da última atualização
  })
    .index("by_user", ["userId"]),                  // Índice por usuário

  // Activity Bookings
  activityBookings: defineTable({
    activityId: v.id("activities"),
    userId: v.id("users"),
    ticketId: v.optional(v.id("activityTickets")), // If activity has multiple tickets
    date: v.string(),                              // Date for the activity (YYYY-MM-DD)
    time: v.optional(v.string()),                  // Specific time if applicable
    participants: v.number(),                      // Number of participants
    totalPrice: v.number(),                        // Total price for booking
    status: v.string(),                            // pending, confirmed, canceled, completed, refunded
    paymentStatus: v.optional(v.string()),         // pending, paid, refunded, failed
    paymentMethod: v.optional(v.string()),         // credit_card, pix, bank_transfer
    specialRequests: v.optional(v.string()),       // Special requests from customer
    partnerNotes: v.optional(v.string()),          // Notes from partner/employee
    confirmationCode: v.string(),                  // Unique confirmation code
    customerInfo: v.object({                       // Customer contact information
      name: v.string(),
      email: v.string(),
      phone: v.string(),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
    paymentIntentId: v.optional(v.string()),        // Stripe PaymentIntent ID
    paymentCaptured: v.optional(v.boolean()),        // Se o pagamento foi capturado
    refundId: v.optional(v.string()),                // Stripe Refund ID se aplicável
    refundStatus: v.optional(v.string()),            // Status do refund: pending, succeeded, failed
    cancellationReason: v.optional(v.string()),      // Motivo do cancelamento
  })
    .index("by_activity", ["activityId"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_date", ["date"])
    .index("by_confirmation_code", ["confirmationCode"]),

  // Event Bookings  
  eventBookings: defineTable({
    eventId: v.id("events"),
    userId: v.id("users"),
    ticketId: v.optional(v.id("eventTickets")),    // If event has multiple tickets
    quantity: v.number(),                          // Number of tickets
    totalPrice: v.number(),                        // Total price for booking
    status: v.string(),                            // pending, confirmed, canceled, completed, refunded
    paymentStatus: v.optional(v.string()),         // pending, paid, refunded, failed
    paymentMethod: v.optional(v.string()),         // credit_card, pix, bank_transfer
    specialRequests: v.optional(v.string()),       // Special requests from customer
    partnerNotes: v.optional(v.string()),          // Notes from partner/employee
    confirmationCode: v.string(),                  // Unique confirmation code
    customerInfo: v.object({                       // Customer contact information
      name: v.string(),
      email: v.string(),
      phone: v.string(),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
    paymentIntentId: v.optional(v.string()),        // Stripe PaymentIntent ID
    paymentCaptured: v.optional(v.boolean()),        // Se o pagamento foi capturado
    refundId: v.optional(v.string()),                // Stripe Refund ID se aplicável
    refundStatus: v.optional(v.string()),            // Status do refund: pending, succeeded, failed
    cancellationReason: v.optional(v.string()),      // Motivo do cancelamento
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_confirmation_code", ["confirmationCode"]),
  
  // Vehicle tables
  vehicles: defineTable({
    // Basic information
    name: v.string(),
    brand: v.string(),
    model: v.string(),
    category: v.string(), // economy, compact, sedan, suv, luxury, etc.
    year: v.number(),
    licensePlate: v.string(),
    color: v.string(),
    seats: v.number(),
    
    // Technical details
    fuelType: v.string(), // Gasolina, Etanol, Flex, Diesel, Elétrico, Híbrido
    transmission: v.string(), // Manual, Automático, CVT, Semi-automático
    
    // Business details
    pricePerDay: v.number(),
    description: v.optional(v.string()),
    features: v.array(v.string()),
    imageUrl: v.optional(v.string()),
    
    // Status
    status: v.string(), // available, rented, maintenance
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
    ownerId: v.optional(v.id("users")), // Reference to user who created/owns this vehicle
    organizationId: v.optional(v.string()), // For multi-tenant applications
  })
    .index("by_status", ["status"])
    .index("by_ownerId", ["ownerId"]),
  
  vehicleBookings: defineTable({
    vehicleId: v.id("vehicles"),
    userId: v.id("users"),
    startDate: v.number(), // Unix timestamp
    endDate: v.number(), // Unix timestamp
    totalPrice: v.number(),
    status: v.string(), // pending, confirmed, canceled, completed
    paymentMethod: v.optional(v.string()),
    paymentStatus: v.optional(v.string()),
    pickupLocation: v.optional(v.string()),
    returnLocation: v.optional(v.string()),
    additionalDrivers: v.optional(v.number()),
    additionalOptions: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    partnerNotes: v.optional(v.string()), // Notes from partner/employee
    createdAt: v.number(),
    updatedAt: v.number(),
    paymentIntentId: v.optional(v.string()),        // Stripe PaymentIntent ID
    paymentCaptured: v.optional(v.boolean()),        // Se o pagamento foi capturado
    refundId: v.optional(v.string()),                // Stripe Refund ID se aplicável
    refundStatus: v.optional(v.string()),            // Status do refund: pending, succeeded, failed
    cancellationReason: v.optional(v.string()),      // Motivo do cancelamento
  })
    .index("by_vehicleId", ["vehicleId"])
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_vehicleId_status", ["vehicleId", "status"])
    .index("by_dates", ["startDate", "endDate"]),

  // Accommodations/Hospedagens
  accommodations: defineTable({
    name: v.string(),                                   // Nome da hospedagem
    slug: v.string(),                                   // Slug para URL
    description: v.string(),                            // Descrição curta
    description_long: v.string(),                       // Descrição longa
    address: v.object({                                 // Objeto com informações de endereço
      street: v.string(),                               // Rua
      city: v.string(),                                 // Cidade
      state: v.string(),                                // Estado
      zipCode: v.string(),                              // CEP
      neighborhood: v.string(),                         // Bairro
      coordinates: v.object({                           // Coordenadas geográficas
        latitude: v.float64(),                          // Latitude
        longitude: v.float64(),                         // Longitude
      }),
    }),
    phone: v.string(),                                  // Telefone de contato
    website: v.optional(v.string()),                    // Website (opcional)
    type: v.string(),                                   // Tipo (Pousada, Hotel, Apartamento, Casa, Villa)
    checkInTime: v.string(),                            // Horário de check-in
    checkOutTime: v.string(),                           // Horário de check-out
    pricePerNight: v.float64(),                         // Preço por noite
    currency: v.string(),                               // Moeda (BRL)
    discountPercentage: v.optional(v.float64()),        // Porcentagem de desconto (opcional)
    taxes: v.optional(v.float64()),                     // Taxas adicionais (opcional)
    cleaningFee: v.optional(v.float64()),               // Taxa de limpeza (opcional)
    totalRooms: v.int64(),                              // Total de quartos
    maxGuests: v.int64(),                               // Número máximo de hóspedes
    bedrooms: v.int64(),                                // Número de quartos
    bathrooms: v.int64(),                               // Número de banheiros
    beds: v.object({                                    // Informações sobre camas
      single: v.int64(),                                // Camas de solteiro
      double: v.int64(),                                // Camas de casal
      queen: v.int64(),                                 // Camas queen
      king: v.int64(),                                  // Camas king
    }),
    area: v.float64(),                                  // Área em m²
    amenities: v.array(v.string()),                     // Comodidades
    houseRules: v.array(v.string()),                    // Regras da casa
    cancellationPolicy: v.string(),                     // Política de cancelamento
    petsAllowed: v.boolean(),                           // Animais permitidos
    smokingAllowed: v.boolean(),                        // Fumo permitido
    eventsAllowed: v.boolean(),                         // Eventos permitidos
    minimumStay: v.int64(),                             // Estadia mínima em noites
    mainImage: v.string(),                              // Imagem principal
    galleryImages: v.array(v.string()),                 // Imagens da galeria
    rating: v.object({                                  // Objeto com avaliações
      overall: v.float64(),                             // Nota geral
      cleanliness: v.float64(),                         // Nota para limpeza
      location: v.float64(),                            // Nota para localização
      checkin: v.float64(),                             // Nota para check-in
      value: v.float64(),                               // Nota para custo-benefício
      accuracy: v.float64(),                            // Nota para precisão
      communication: v.float64(),                       // Nota para comunicação
      totalReviews: v.int64(),                          // Total de avaliações
    }),
    isActive: v.boolean(),                              // Status ativo/inativo
    isFeatured: v.boolean(),                            // Status destacado
    tags: v.array(v.string()),                          // Tags para busca
    partnerId: v.id("users"),                           // ID do parceiro/proprietário
  })
    .index("by_slug", ["slug"])                         // Índice por slug (URL)
    .index("by_partner", ["partnerId"])                 // Índice por parceiro
    .index("featured_accommodations", ["isFeatured", "isActive"]) // Índice para hospedagens destacadas
    .index("active_accommodations", ["isActive"]),      // Índice para hospedagens ativas

  // Accommodation Bookings
  accommodationBookings: defineTable({
    accommodationId: v.id("accommodations"),            // Referência à hospedagem
    userId: v.id("users"),                              // Usuário que fez a reserva
    checkInDate: v.string(),                            // Data de check-in (YYYY-MM-DD)
    checkOutDate: v.string(),                           // Data de check-out (YYYY-MM-DD)
    guests: v.int64(),                                  // Número de hóspedes
    totalPrice: v.float64(),                            // Preço total da reserva
    status: v.string(),                                 // Status (pending, confirmed, canceled, completed, refunded)
    paymentStatus: v.optional(v.string()),              // Status do pagamento (pending, paid, refunded, failed)
    paymentMethod: v.optional(v.string()),              // Método de pagamento (credit_card, pix, bank_transfer)
    specialRequests: v.optional(v.string()),            // Solicitações especiais do cliente
    partnerNotes: v.optional(v.string()),               // Notas do parceiro/funcionário
    confirmationCode: v.string(),                       // Código único de confirmação
    customerInfo: v.object({                            // Informações de contato do cliente
      name: v.string(),
      email: v.string(),
      phone: v.string(),
    }),
    createdAt: v.number(),                              // Timestamp de criação
    updatedAt: v.number(),                              // Timestamp de atualização
    paymentIntentId: v.optional(v.string()),        // Stripe PaymentIntent ID
    paymentCaptured: v.optional(v.boolean()),        // Se o pagamento foi capturado
    refundId: v.optional(v.string()),                // Stripe Refund ID se aplicável
    refundStatus: v.optional(v.string()),            // Status do refund: pending, succeeded, failed
    cancellationReason: v.optional(v.string()),      // Motivo do cancelamento
  })
    .index("by_accommodation", ["accommodationId"])     // Índice por hospedagem
    .index("by_user", ["userId"])                       // Índice por usuário
    .index("by_status", ["status"])                     // Índice por status
    .index("by_check_in_date", ["checkInDate"])         // Índice por data de check-in
    .index("by_accommodation_dates", ["accommodationId", "checkInDate", "checkOutDate"]) // Índice por hospedagem e datas
    .index("by_confirmation_code", ["confirmationCode"]), // Índice por código de confirmação

  // Notifications System
  notifications: defineTable({
    userId: v.id("users"),                      // User who receives the notification
    type: v.string(),                           // Type: "booking_confirmed", "booking_canceled", "booking_updated", etc.
    title: v.string(),                          // Notification title
    message: v.string(),                        // Notification message
    relatedId: v.optional(v.string()),          // Related entity ID (booking, event, etc.)
    relatedType: v.optional(v.string()),        // Related entity type (activity_booking, event_booking, etc.)
    isRead: v.boolean(),                        // Whether the notification has been read
    data: v.optional(v.object({                 // Additional data for the notification
      confirmationCode: v.optional(v.string()),
      bookingType: v.optional(v.string()),
      assetName: v.optional(v.string()),
      partnerName: v.optional(v.string()),
      // Novos campos para chat
      senderName: v.optional(v.string()),
      messagePreview: v.optional(v.string()),
      contextType: v.optional(v.string()),
      assetType: v.optional(v.string()),
      bookingCode: v.optional(v.string()),
      travelerName: v.optional(v.string()),
    })),
    createdAt: v.number(),                      // When the notification was created
    readAt: v.optional(v.number()),             // When it was read (if applicable)
  })
    .index("by_user", ["userId"])
    .index("by_user_unread", ["userId", "isRead"])
    .index("by_user_type", ["userId", "type"])
    .index("by_created", ["createdAt"]),

  // Rate Limiting System
  rateLimits: defineTable({
    key: v.string(),                            // Unique identifier for the rate limit (userId_operation_identifier)
    userId: v.id("users"),                      // User ID
    operation: v.string(),                      // Type of operation being rate limited
    timestamp: v.number(),                      // When the attempt was made
    identifier: v.optional(v.string()),         // Additional identifier (e.g., IP address)
  })
    .index("by_key_timestamp", ["key", "timestamp"])
    .index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"]),

  // Packages System
  packages: defineTable({
    // Basic Information
    name: v.string(),                           // Nome do pacote
    slug: v.string(),                           // Slug para URL amigável
    description: v.string(),                    // Descrição curta
    description_long: v.string(),               // Descrição detalhada
    
    // Package Configuration
    duration: v.number(),                       // Duração em dias
    maxGuests: v.number(),                      // Número máximo de hóspedes
    
    // Pricing
    basePrice: v.number(),                      // Preço base do pacote
    discountPercentage: v.optional(v.number()), // Desconto aplicado sobre preços individuais
    currency: v.string(),                       // Moeda (BRL)
    
    // Included Services
    accommodationId: v.optional(v.id("accommodations")), // Hospedagem incluída (opcional)
    vehicleId: v.optional(v.id("vehicles")),    // Veículo incluído (opcional)
    includedActivityIds: v.array(v.id("activities")), // Atividades incluídas
    includedRestaurantIds: v.array(v.id("restaurants")), // Restaurantes incluídos
    includedEventIds: v.array(v.id("events")),  // Eventos incluídos
    
    // Package Details
    highlights: v.array(v.string()),            // Destaques do pacote
    includes: v.array(v.string()),              // O que está incluído
    excludes: v.array(v.string()),              // O que não está incluído
    itinerary: v.array(v.object({               // Itinerário dia a dia
      day: v.number(),                          // Dia (1, 2, 3...)
      title: v.string(),                        // Título do dia
      description: v.string(),                  // Descrição das atividades
      activities: v.array(v.string()),          // Atividades do dia
    })),
    
    // Media
    mainImage: v.string(),                      // Imagem principal
    galleryImages: v.array(v.string()),         // Galeria de imagens
    
    // Policies
    cancellationPolicy: v.string(),             // Política de cancelamento
    terms: v.array(v.string()),                 // Termos e condições
    
    // Availability
    availableFromDate: v.string(),              // Data de início da disponibilidade
    availableToDate: v.string(),                // Data de fim da disponibilidade
    blackoutDates: v.array(v.string()),         // Datas não disponíveis
    
    // Status
    isActive: v.boolean(),                      // Status ativo/inativo
    isFeatured: v.boolean(),                    // Status destacado
    
    // Metadata
    tags: v.array(v.string()),                  // Tags para busca
    category: v.string(),                       // Categoria do pacote (Aventura, Relaxamento, Cultural, etc.)
    partnerId: v.id("users"),                   // ID do parceiro criador
    createdAt: v.number(),                      // Timestamp de criação
    updatedAt: v.number(),                      // Timestamp de atualização
  })
    .index("by_slug", ["slug"])
    .index("by_partner", ["partnerId"])
    .index("by_category", ["category"])
    .index("featured_packages", ["isFeatured", "isActive"])
    .index("active_packages", ["isActive"])
    .index("by_accommodation", ["accommodationId"])
    .index("by_vehicle", ["vehicleId"]),

  // Package Bookings
  packageBookings: defineTable({
    packageId: v.id("packages"),
    userId: v.id("users"),
    startDate: v.string(),
    endDate: v.string(),
    guests: v.number(),
    totalPrice: v.number(),
    breakdown: v.object({
      accommodationPrice: v.number(),
      vehiclePrice: v.optional(v.number()),
      activitiesPrice: v.number(),
      restaurantsPrice: v.number(),
      eventsPrice: v.number(),
      discount: v.number(),
    }),
    status: v.string(),
    paymentStatus: v.optional(v.string()),
    paymentMethod: v.optional(v.string()),
    relatedBookings: v.object({
      accommodationBookingId: v.optional(v.id("accommodationBookings")),
      vehicleBookingId: v.optional(v.id("vehicleBookings")),
      activityBookingIds: v.array(v.id("activityBookings")),
      restaurantReservationIds: v.array(v.id("restaurantReservations")),
      eventBookingIds: v.array(v.id("eventBookings")),
    }),
    customerInfo: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
    }),
    specialRequests: v.optional(v.string()),
    partnerNotes: v.optional(v.string()),
    confirmationCode: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_package", ["packageId"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_start_date", ["startDate"])
    .index("by_confirmation_code", ["confirmationCode"])
    .index("by_package_dates", ["packageId", "startDate", "endDate"]),

  // Wishlist/Favorites System
  wishlistItems: defineTable({
    userId: v.id("users"),
    itemType: v.string(), // "package", "accommodation", "activity", "restaurant", "event", "vehicle"
    itemId: v.string(), // ID of the item (stored as string for flexibility)
    addedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_type", ["userId", "itemType"])
    .index("by_user_item", ["userId", "itemType", "itemId"]),

  // Package Comparison System
  packageComparisons: defineTable({
    userId: v.id("users"),
    packageIds: v.array(v.id("packages")), // Up to 3 packages for comparison
    name: v.optional(v.string()), // Optional name for saved comparison
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // Package Request System (Simplified)
  packageRequests: defineTable({
    // Customer Information
    customerInfo: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      age: v.optional(v.number()),
      occupation: v.optional(v.string()),
    }),
    
    // Trip Details
    tripDetails: v.object({
      destination: v.string(),
      originCity: v.optional(v.string()), // Where the traveler is departing from
      // For specific dates
      startDate: v.optional(v.string()),
      endDate: v.optional(v.string()),
      // For flexible dates
      startMonth: v.optional(v.string()),
      endMonth: v.optional(v.string()),
      flexibleDates: v.optional(v.boolean()),
      duration: v.number(), // in days
      groupSize: v.number(),
      companions: v.string(), // family, friends, couple, solo, business
      budget: v.number(),
      budgetFlexibility: v.string(), // strict, somewhat_flexible, very_flexible
    }),
    
    // Preferences
    preferences: v.object({
      accommodationType: v.array(v.string()), // hotel, pousada, resort, apartment, etc.
      activities: v.array(v.string()), // adventure, cultural, relaxation, food, etc.
      transportation: v.array(v.string()), // car, bus, plane, walking, etc.
      foodPreferences: v.array(v.string()), // local_cuisine, international, vegetarian, etc.
      accessibility: v.optional(v.array(v.string())), // wheelchair, visual_impairment, etc.
    }),
    
    // Special Requirements
    specialRequirements: v.optional(v.string()),
    previousExperience: v.optional(v.string()), // Have they traveled here before?
    expectedHighlights: v.optional(v.string()), // What are they most excited about?
    
    // Status and Management
    status: v.union(
      v.literal("pending"),
      v.literal("in_review"),
      v.literal("proposal_sent"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("completed")
    ),
    adminNotes: v.optional(v.string()),
    proposalSent: v.optional(v.boolean()),
    proposalDetails: v.optional(v.string()),
    
    // Metadata
    requestNumber: v.string(), // Unique request number for tracking
    createdAt: v.number(),
    updatedAt: v.number(),
    assignedTo: v.optional(v.id("users")), // Admin user assigned to this request
  })
    .index("by_status", ["status"])
    .index("by_email", ["customerInfo.email"])
    .index("by_request_number", ["requestNumber"])
    .index("by_assigned_to", ["assignedTo"])
    .index("by_created_date", ["createdAt"]),

  // Messages de contato para solicitações de pacotes
  packageRequestMessages: defineTable({
    packageRequestId: v.id("packageRequests"),
    userId: v.id("users"),
    senderName: v.string(),
    senderEmail: v.string(),
    subject: v.string(),
    message: v.string(),
    status: v.union(
      v.literal("sent"),
      v.literal("read"),
      v.literal("replied")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
    readAt: v.optional(v.number()),
    repliedAt: v.optional(v.number()),
  })
    .index("by_package_request", ["packageRequestId"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_created_date", ["createdAt"]),

  // Reviews System (for packages, accommodations, restaurants, activities, events)
  reviews: defineTable({
    userId: v.id("users"),
    itemType: v.string(), // "package", "accommodation", "activity", "restaurant", "event"
    itemId: v.string(), // ID of the item being reviewed
    rating: v.number(), // Overall rating 1-5
    title: v.string(),
    comment: v.string(),
    
    // Detailed ratings (optional based on item type)
    detailedRatings: v.optional(v.object({
      value: v.optional(v.number()), // Value for money
      service: v.optional(v.number()), // Service quality
      cleanliness: v.optional(v.number()), // Cleanliness (accommodations)
      location: v.optional(v.number()), // Location (accommodations/restaurants)
      food: v.optional(v.number()), // Food quality (restaurants)
      organization: v.optional(v.number()), // Organization (activities/events)
      guide: v.optional(v.number()), // Guide quality (activities)
    })),
    
    // Additional info
    visitDate: v.optional(v.string()), // When they experienced the service
    groupType: v.optional(v.string()), // Solo, Couple, Family, Friends, Business
    wouldRecommend: v.boolean(),
    photos: v.optional(v.array(v.string())), // Review photos
    
    // Helpful votes
    helpfulVotes: v.number(),
    unhelpfulVotes: v.number(),
    
    // Status
    isVerified: v.boolean(), // Whether this is a verified purchase/booking
    isApproved: v.boolean(), // Moderation status
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_item", ["itemType", "itemId"])
    .index("by_user", ["userId"])
    .index("by_item_approved", ["itemType", "itemId", "isApproved"])
    .index("by_rating", ["itemType", "itemId", "rating"]),

  // Review helpfulness votes
  reviewVotes: defineTable({
    reviewId: v.id("reviews"),
    userId: v.id("users"),
    voteType: v.string(), // "helpful" or "unhelpful"
    createdAt: v.number(),
  })
    .index("by_review", ["reviewId"])
    .index("by_user_review", ["userId", "reviewId"]),

  // Organizações/Empreendimentos de Partners
  partnerOrganizations: defineTable({
    name: v.string(),                        // Nome do empreendimento
    description: v.optional(v.string()),     // Descrição do empreendimento
    type: v.string(),                        // Tipo: "restaurant", "rental_service", "activity_service", "event_service"
    image: v.optional(v.string()),           // Logo/imagem do empreendimento
    partnerId: v.id("users"),                // ID do partner dono
    isActive: v.boolean(),                   // Se está ativo
    settings: v.optional(v.object({         // Configurações específicas do empreendimento
      theme: v.optional(v.string()),         // Tema/cor principal
      contactInfo: v.optional(v.object({    // Informações de contato
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        website: v.optional(v.string()),
      })),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_partner", ["partnerId"])
    .index("by_partner_type", ["partnerId", "type"])
    .index("by_type", ["type"]),

  // Tabela para relacionar assets com organizações
  partnerAssets: defineTable({
    organizationId: v.id("partnerOrganizations"), // ID da organização
    assetId: v.string(),                          // ID do asset (pode ser de qualquer tabela)
    assetType: v.string(),                        // Tipo do asset (restaurants, events, activities, vehicles)
    partnerId: v.id("users"),                     // ID do partner (para facilitar queries)
    isActive: v.boolean(),                        // Se o asset está ativo nesta organização
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_partner", ["partnerId"])
    .index("by_asset", ["assetId", "assetType"])
    .index("by_organization_type", ["organizationId", "assetType"])
    .index("by_partner_type", ["partnerId", "assetType"]),

  // Sistema de Logs de Auditoria
  auditLogs: defineTable({
    // Actor - Quem executou a ação
    actor: v.object({
      userId: v.id("users"),                    // ID do usuário que executou a ação
      role: v.union(
        v.literal("traveler"), 
        v.literal("partner"), 
        v.literal("employee"), 
        v.literal("master")
      ),                                        // Role do usuário no momento da ação
      name: v.string(),                         // Nome do usuário (snapshot para auditoria)
      email: v.optional(v.string()),            // Email do usuário (snapshot)
    }),
    
    // Event - O que aconteceu
    event: v.object({
      type: v.union(
        // CRUD Operations
        v.literal("create"),
        v.literal("update"), 
        v.literal("delete"),
        // Authentication Events
        v.literal("login"),
        v.literal("logout"),
        v.literal("password_change"),
        // Asset Management
        v.literal("asset_create"),
        v.literal("asset_update"),
        v.literal("asset_delete"),
        v.literal("asset_feature_toggle"),
        v.literal("asset_status_change"),
        // Permission Management
        v.literal("permission_grant"),
        v.literal("permission_revoke"),
        v.literal("permission_update"),
        v.literal("role_change"),
        // Booking Operations
        v.literal("booking_create"),
        v.literal("booking_update"),
        v.literal("booking_cancel"),
        v.literal("booking_confirm"),
        // Organization Management
        v.literal("organization_create"),
        v.literal("organization_update"),
        v.literal("organization_delete"),
        // System Operations
        v.literal("system_config_change"),
        v.literal("bulk_operation"),
        // Media Operations
        v.literal("media_upload"),
        v.literal("media_delete"),
        // Chat Operations
        v.literal("chat_room_create"),
        v.literal("chat_message_send"),
        v.literal("chat_status_change"),
        // Other
        v.literal("other")
      ),
      action: v.string(),                       // Descrição legível da ação
      category: v.union(
        v.literal("authentication"),
        v.literal("authorization"),
        v.literal("data_access"),
        v.literal("data_modification"),
        v.literal("system_admin"),
        v.literal("user_management"),
        v.literal("asset_management"),
        v.literal("booking_management"),
        v.literal("communication"),
        v.literal("security"),
        v.literal("compliance"),
        v.literal("other")
      ),                                        // Categoria do evento para agrupamento
      severity: v.union(
        v.literal("low"),
        v.literal("medium"), 
        v.literal("high"),
        v.literal("critical")
      ),                                        // Nível de severidade
    }),

    // Resource - Sobre o que a ação foi executada
    resource: v.optional(v.object({
      type: v.string(),                         // Tipo do recurso (restaurants, events, users, etc)
      id: v.string(),                           // ID do recurso
      name: v.optional(v.string()),             // Nome/título do recurso (snapshot)
      organizationId: v.optional(v.id("partnerOrganizations")), // Organização relacionada
      partnerId: v.optional(v.id("users")),     // Partner dono do recurso (se aplicável)
    })),

    // Source - De onde veio a ação
    source: v.object({
      ipAddress: v.string(),                    // Endereço IP
      userAgent: v.optional(v.string()),        // User agent do browser/app
      platform: v.union(
        v.literal("web"),
        v.literal("mobile"),
        v.literal("api"),
        v.literal("system"),
        v.literal("unknown")
      ),                                        // Plataforma de origem
      location: v.optional(v.object({           // Geolocalização (opcional)
        country: v.optional(v.string()),
        city: v.optional(v.string()),
        region: v.optional(v.string()),
      })),
    }),

    // Status - Resultado da operação
    status: v.union(
      v.literal("success"),
      v.literal("failure"),
      v.literal("partial"),
      v.literal("pending")
    ),

    // Metadata - Dados adicionais específicos do evento
    metadata: v.optional(v.object({
      // Dados antes/depois para operações de atualização
      before: v.optional(v.any()),             // Estado anterior (para updates)
      after: v.optional(v.any()),              // Estado posterior (para updates)
      
      // Informações específicas do contexto
      reason: v.optional(v.string()),          // Motivo da ação (para operações críticas)
      batchId: v.optional(v.string()),         // ID do lote (para operações em massa)
      duration: v.optional(v.number()),        // Duração da operação em ms
      errorMessage: v.optional(v.string()),    // Mensagem de erro (se status === "failure")
      
      // Dados específicos por tipo de evento
      bookingCode: v.optional(v.string()),     // Código de reserva
      amount: v.optional(v.number()),          // Valor monetário (para transações)
      quantity: v.optional(v.number()),        // Quantidade (para bookings)
      permissions: v.optional(v.array(v.string())), // Permissões concedidas/revogadas
      
      // Contexto adicional
      sessionId: v.optional(v.string()),       // ID da sessão
      referrer: v.optional(v.string()),        // Página/tela de origem
      feature: v.optional(v.string()),         // Feature específica usada
      experiment: v.optional(v.string()),      // Experimento A/B ativo
      
      // Arquivamento
      archived: v.optional(v.boolean()),       // Se o log foi arquivado
      archivedAt: v.optional(v.number()),      // Timestamp do arquivamento
    })),

    // Risk Assessment - Avaliação de risco automática
    riskAssessment: v.optional(v.object({
      score: v.number(),                        // Score de risco (0-100)
      factors: v.array(v.string()),             // Fatores que contribuíram para o score
      isAnomalous: v.boolean(),                 // Se a ação foi considerada anômala
      recommendation: v.optional(v.string()),   // Recomendação de ação
    })),

    // Compliance - Informações de conformidade
    compliance: v.optional(v.object({
      regulations: v.array(v.string()),         // Regulamentações aplicáveis (LGPD, GDPR, etc)
      retentionPeriod: v.number(),              // Período de retenção em dias
      isPersonalData: v.boolean(),              // Se envolve dados pessoais
      dataClassification: v.optional(v.union(
        v.literal("public"),
        v.literal("internal"),
        v.literal("confidential"),
        v.literal("restricted")
      )),
    })),

    // Timestamps
    timestamp: v.number(),                      // Timestamp preciso da ação
    expiresAt: v.optional(v.number()),          // Data de expiração do log (para limpeza automática)
  })
    .index("by_actor", ["actor.userId"])
    .index("by_actor_timestamp", ["actor.userId", "timestamp"])
    .index("by_event_type", ["event.type"])
    .index("by_event_category", ["event.category"])
    .index("by_timestamp", ["timestamp"])
    .index("by_resource", ["resource.type", "resource.id"])
    .index("by_partner", ["resource.partnerId"])
    .index("by_organization", ["resource.organizationId"])
    .index("by_status", ["status"])
    .index("by_severity", ["event.severity"])
    .index("by_platform", ["source.platform"])
    .index("by_ip", ["source.ipAddress"])
    .index("by_expires", ["expiresAt"])
    .index("by_partner_timestamp", ["resource.partnerId", "timestamp"])
    .index("by_organization_timestamp", ["resource.organizationId", "timestamp"]),

  // Cache de Recomendações
  cachedRecommendations: cachedRecommendationsTable,

  // Configurações Globais do Sistema
  systemSettings: defineTable({
    key: v.string(),                            // Chave única da configuração
    value: v.any(),                             // Valor da configuração (pode ser string, number, object, etc.)
    type: v.union(
      v.literal("string"),
      v.literal("number"),
      v.literal("boolean"),
      v.literal("object"),
      v.literal("array")
    ),                                          // Tipo do valor para validação
    category: v.union(
      v.literal("communication"),               // Configurações de comunicação
      v.literal("business"),                    // Configurações de negócio
      v.literal("system"),                      // Configurações do sistema
      v.literal("ui"),                         // Configurações de interface
      v.literal("integration"),                // Configurações de integrações
      v.literal("security")                    // Configurações de segurança
    ),
    description: v.string(),                    // Descrição da configuração
    isPublic: v.boolean(),                      // Se pode ser acessada por não-admins
    lastModifiedBy: v.id("users"),              // Último usuário que modificou
    lastModifiedAt: v.number(),                 // Timestamp da última modificação
    createdAt: v.number(),                      // Timestamp de criação
  })
    .index("by_key", ["key"])
    .index("by_category", ["category"])
    .index("by_public", ["isPublic"])
    .index("by_category_public", ["category", "isPublic"]),

  // Sistema de Logs de Email
  emailLogs: defineTable({
    type: v.union(
      v.literal("booking_confirmation"),
      v.literal("booking_cancelled"),
      v.literal("booking_reminder"),
      v.literal("package_request_received"),
      v.literal("package_request_status_update"),
      v.literal("partner_new_booking"),
      v.literal("welcome_new_user"),
      v.literal("new_partner_registration"),
      v.literal("employee_invitation"),
      v.literal("support_message"),
      v.literal("payment_confirmation"),
      v.literal("payment_failed"),
      v.literal("review_request")
    ),
    to: v.string(),                             // Email do destinatário
    subject: v.string(),                        // Assunto do email
    status: v.union(
      v.literal("sent"),
      v.literal("failed"),
      v.literal("pending")
    ),
    error: v.optional(v.string()),              // Mensagem de erro (se falhou)
    sentAt: v.optional(v.number()),             // Timestamp de quando foi enviado
    readAt: v.optional(v.number()),             // Timestamp de quando foi lido (se aplicável)
    retryAt: v.optional(v.number()),            // Timestamp de tentativa de reenvio
    createdAt: v.number(),                      // Timestamp de criação
    updatedAt: v.optional(v.number()),          // Timestamp de última atualização
  })
    .index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_recipient", ["to"])
    .index("by_created_at", ["createdAt"])
    .index("by_sent_at", ["sentAt"])
    .index("by_type_status", ["type", "status"])
    .index("by_recipient_type", ["to", "type"]),
});
