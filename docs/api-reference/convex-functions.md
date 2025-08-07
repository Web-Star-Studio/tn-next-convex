## Convex Functions

### convex/admin_functions.ts

- mutation toggleUserActive(args: userId, isActive)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.admin_functions.toggleUserActive);
await mutate({ userId: /* value */, isActive: /* value */ });
```

- mutation updateUserRole(args: userId, role)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.admin_functions.updateUserRole);
await mutate({ userId: /* value */, role: /* value */ });
```

### convex/auth.ts

- query getUser()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.auth.getUser, {});
```

- query getUserByClerkId(args: clerkId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.auth.getUserByClerkId, { clerkId: /* value */ });
```

### convex/domains/activities/queries.ts

- query getActiveActivityTickets(args: activityId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.activities.queries.getActiveActivityTickets, { activityId: /* value */ });
```

- query getActivitiesWithCreators()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.activities.queries.getActivitiesWithCreators, {});
```

- query getActivityTickets(args: activityId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.activities.queries.getActivityTickets, { activityId: /* value */ });
```

- query getAll()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.activities.queries.getAll, {});
```

- query getById(args: id)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.activities.queries.getById, { id: /* value */ });
```

- query getByPartnerId(args: partnerId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.activities.queries.getByPartnerId, { partnerId: /* value */ });
```

- query getByUser(args: userId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.activities.queries.getByUser, { userId: /* value */ });
```

- query getFeatured()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.activities.queries.getFeatured, {});
```

- query getPublicActivitiesWithCreators()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.activities.queries.getPublicActivitiesWithCreators, {});
```

- query getPublicActivityById(args: id)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.activities.queries.getPublicActivityById, { id: /* value */ });
```

- query getPublicFeaturedActivities()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.activities.queries.getPublicFeaturedActivities, {});
```

- query getUserById(args: userId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.activities.queries.getUserById, { userId: /* value */ });
```

### convex/domains/adminReservations/mutations.ts

- mutation cancelAdminReservation(args: id, reason, notifyCustomer)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.adminReservations.mutations.cancelAdminReservation);
await mutate({ id: /* value */, reason: /* value */, notifyCustomer: /* value */ });
```

- mutation confirmAdminReservation(args: id)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.adminReservations.mutations.confirmAdminReservation);
await mutate({ id: /* value */ });
```

- mutation createAdminReservation()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.adminReservations.mutations.createAdminReservation);
await mutate({});
```

- mutation createAutoConfirmationSettings(args: id, enabled, name, priority, conditions, notifications, overrideSettings)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.adminReservations.mutations.createAutoConfirmationSettings);
await mutate({ id: /* value */, enabled: /* value */, name: /* value */, priority: /* value */, conditions: /* value */, notifications: /* value */, overrideSettings: /* value */ });
```

- mutation deleteAutoConfirmationSettings(args: id)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.adminReservations.mutations.deleteAutoConfirmationSettings);
await mutate({ id: /* value */ });
```

- mutation updateAdminReservation()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.adminReservations.mutations.updateAdminReservation);
await mutate({});
```

- mutation updateAutoConfirmationSettings(args: id, enabled, name, priority, conditions, notifications, overrideSettings)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.adminReservations.mutations.updateAutoConfirmationSettings);
await mutate({ id: /* value */, enabled: /* value */, name: /* value */, priority: /* value */, conditions: /* value */, notifications: /* value */, overrideSettings: /* value */ });
```

### convex/domains/adminReservations/queries.ts

- query checkAdminReservationAvailability(args: assetId, assetType, startDate, endDate, guests)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.adminReservations.queries.checkAdminReservationAvailability, { assetId: /* value */, assetType: /* value */, startDate: /* value */, endDate: /* value */, guests: /* value */ });
```

- query getAdminReservation(args: id)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.adminReservations.queries.getAdminReservation, { id: /* value */ });
```

- query getAdminReservationById(args: id)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.adminReservations.queries.getAdminReservationById, { id: /* value */ });
```

- query getAdminReservationStats(args: partnerId, organizationId, dateRange, startDate, endDate)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.adminReservations.queries.getAdminReservationStats, { partnerId: /* value */, organizationId: /* value */, dateRange: /* value */, startDate: /* value */, endDate: /* value */ });
```

- query getAutoConfirmationSettings(args: assetId, assetType)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.adminReservations.queries.getAutoConfirmationSettings, { assetId: /* value */, assetType: /* value */ });
```

- query getUserAdminReservations(args: paginationOpts, status)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.adminReservations.queries.getUserAdminReservations, { paginationOpts: /* value */, status: /* value */ });
```

- query listAdminReservations()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.adminReservations.queries.listAdminReservations, {});
```

- query listAssetsForAdminReservation(args: assetType, searchTerm, paginationOpts)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.adminReservations.queries.listAssetsForAdminReservation, { assetType: /* value */, searchTerm: /* value */, paginationOpts: /* value */ });
```

- query listAutoConfirmationSettings(args: assetType, partnerId, organizationId, enabled)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.adminReservations.queries.listAutoConfirmationSettings, { assetType: /* value */, partnerId: /* value */, organizationId: /* value */, enabled: /* value */ });
```

### convex/domains/audit/mutations.ts

- mutation archiveOldAuditLogs(args: olderThanDays, dryRun)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.audit.mutations.archiveOldAuditLogs);
await mutate({ olderThanDays: /* value */, dryRun: /* value */ });
```

- mutation bulkDeleteAuditLogs(args: logIds, reason)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.audit.mutations.bulkDeleteAuditLogs);
await mutate({ logIds: /* value */, reason: /* value */ });
```

- mutation cleanExpiredAuditLogs(args: dryRun, maxToDelete)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.audit.mutations.cleanExpiredAuditLogs);
await mutate({ dryRun: /* value */, maxToDelete: /* value */ });
```

- mutation createManualAuditLog(args: eventType, action, resourceType, resourceId, resourceName, metadata, severity)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.audit.mutations.createManualAuditLog);
await mutate({ eventType: /* value */, action: /* value */, resourceType: /* value */, resourceId: /* value */, resourceName: /* value */, metadata: /* value */, severity: /* value */ });
```

- mutation exportAuditLogs(args: startDate, endDate, format, includeMetadata, categories)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.audit.mutations.exportAuditLogs);
await mutate({ startDate: /* value */, endDate: /* value */, format: /* value */, includeMetadata: /* value */, categories: /* value */ });
```

- mutation updateRetentionPolicy(args: category, severity, retentionDays, reason)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.audit.mutations.updateRetentionPolicy);
await mutate({ category: /* value */, severity: /* value */, retentionDays: /* value */, reason: /* value */ });
```

### convex/domains/audit/queries.ts

- query getAuditLogById(args: auditLogId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.audit.queries.getAuditLogById, { auditLogId: /* value */ });
```

- query getAuditLogs(args: paginationOpts, searchTerm, eventType, userRole, timeRange)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.audit.queries.getAuditLogs, { paginationOpts: /* value */, searchTerm: /* value */, eventType: /* value */, userRole: /* value */, timeRange: /* value */ });
```

- query getAuditLogsForResource(args: resourceType, resourceId, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.audit.queries.getAuditLogsForResource, { resourceType: /* value */, resourceId: /* value */, limit: /* value */ });
```

- query getAuditLogStats(args: timeRange)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.audit.queries.getAuditLogStats, { timeRange: /* value */ });
```

- query getAuditLogSummary(args: startDate, endDate, includePersonalData)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.audit.queries.getAuditLogSummary, { startDate: /* value */, endDate: /* value */, includePersonalData: /* value */ });
```

- query getMyAuditLogs(args: paginationOpts, eventType)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.audit.queries.getMyAuditLogs, { paginationOpts: /* value */, eventType: /* value */ });
```

- query searchAuditLogs(args: searchTerm, filters, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.audit.queries.searchAuditLogs, { searchTerm: /* value */, filters: /* value */, limit: /* value */ });
```

### convex/domains/bookings/mutations.ts

- mutation cancelActivityBooking(args: bookingId, reason)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.cancelActivityBooking);
await mutate({ bookingId: /* value */, reason: /* value */ });
```

- mutation cancelActivityBookingInternal(args: bookingId, userId, reason)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.cancelActivityBookingInternal);
await mutate({ bookingId: /* value */, userId: /* value */, reason: /* value */ });
```

- mutation cancelBooking(args: reservationId, reservationType, reason)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.cancelBooking);
await mutate({ reservationId: /* value */, reservationType: /* value */, reason: /* value */ });
```

- mutation cancelEventBooking(args: bookingId, reason)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.cancelEventBooking);
await mutate({ bookingId: /* value */, reason: /* value */ });
```

- mutation cancelEventBookingInternal(args: bookingId, userId, reason)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.cancelEventBookingInternal);
await mutate({ bookingId: /* value */, userId: /* value */, reason: /* value */ });
```

- mutation cancelRestaurantReservation(args: reservationId, reason)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.cancelRestaurantReservation);
await mutate({ reservationId: /* value */, reason: /* value */ });
```

- mutation cancelRestaurantReservationInternal(args: reservationId, userId, reason)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.cancelRestaurantReservationInternal);
await mutate({ reservationId: /* value */, userId: /* value */, reason: /* value */ });
```

- mutation cancelVehicleBooking(args: bookingId, reason)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.cancelVehicleBooking);
await mutate({ bookingId: /* value */, reason: /* value */ });
```

- mutation cancelVehicleBookingInternal(args: bookingId, userId, reason)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.cancelVehicleBookingInternal);
await mutate({ bookingId: /* value */, userId: /* value */, reason: /* value */ });
```

- mutation confirmActivityBooking(args: bookingId, partnerNotes, assetInfo)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.confirmActivityBooking);
await mutate({ bookingId: /* value */, partnerNotes: /* value */, assetInfo: /* value */ });
```

- mutation confirmEventBooking(args: bookingId, partnerNotes, assetInfo)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.confirmEventBooking);
await mutate({ bookingId: /* value */, partnerNotes: /* value */, assetInfo: /* value */ });
```

- mutation confirmRestaurantReservation(args: bookingId, partnerNotes, assetInfo)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.confirmRestaurantReservation);
await mutate({ bookingId: /* value */, partnerNotes: /* value */, assetInfo: /* value */ });
```

- mutation confirmVehicleBooking(args: bookingId, partnerNotes, assetInfo)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.confirmVehicleBooking);
await mutate({ bookingId: /* value */, partnerNotes: /* value */, assetInfo: /* value */ });
```

- mutation createActivityBooking()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.createActivityBooking);
await mutate({});
```

- mutation createEventBooking()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.createEventBooking);
await mutate({});
```

- mutation createRestaurantReservation()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.createRestaurantReservation);
await mutate({});
```

- mutation createVehicleBooking()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.createVehicleBooking);
await mutate({});
```

- mutation expireIncompletedBookings()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.expireIncompletedBookings);
await mutate({});
```

- mutation markNoShowBookings()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.markNoShowBookings);
await mutate({});
```

- mutation seedTestReservations(args: travelerEmail)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.seedTestReservations);
await mutate({ travelerEmail: /* value */ });
```

- mutation updateActivityBooking(args: bookingId, reason)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.updateActivityBooking);
await mutate({ bookingId: /* value */, reason: /* value */ });
```

- mutation updateBookingPaymentFailed()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.updateBookingPaymentFailed);
await mutate({});
```

- mutation updateBookingPaymentInitiated()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.updateBookingPaymentInitiated);
await mutate({});
```

- mutation updateBookingPaymentSuccess()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.updateBookingPaymentSuccess);
await mutate({});
```

- mutation updateBookingStatus()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.updateBookingStatus);
await mutate({});
```

- mutation updateBookingStatusesByDate()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.bookings.mutations.updateBookingStatusesByDate);
await mutate({});
```

### convex/domains/bookings/queries.ts

- query getActivityBookingById(args: bookingId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.bookings.queries.getActivityBookingById, { bookingId: /* value */ });
```

- query getActivityBookings(args: paginationOpts, status, organizationId, activityId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.bookings.queries.getActivityBookings, { paginationOpts: /* value */, status: /* value */, organizationId: /* value */, activityId: /* value */ });
```

- query getBookingByConfirmationCode(args: confirmationCode, type)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.bookings.queries.getBookingByConfirmationCode, { confirmationCode: /* value */, type: /* value */ });
```

- query getBookingsByStatusGroup()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.bookings.queries.getBookingsByStatusGroup, {});
```

- query getBookingStatusStatistics()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.bookings.queries.getBookingStatusStatistics, {});
```

- query getBookingsWithRBAC(args: paginationOpts, status, bookingType)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.bookings.queries.getBookingsWithRBAC, { paginationOpts: /* value */, status: /* value */, bookingType: /* value */ });
```

- query getEventBookingById(args: bookingId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.bookings.queries.getEventBookingById, { bookingId: /* value */ });
```

- query getEventBookings(args: paginationOpts, status, organizationId, eventId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.bookings.queries.getEventBookings, { paginationOpts: /* value */, status: /* value */, organizationId: /* value */, eventId: /* value */ });
```

- query getPartnerBookings(args: paginationOpts, assetType, status)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.bookings.queries.getPartnerBookings, { paginationOpts: /* value */, assetType: /* value */, status: /* value */ });
```

- query getReservationWithPartnerDetails(args: reservationId, reservationType)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.bookings.queries.getReservationWithPartnerDetails, { reservationId: /* value */, reservationType: /* value */ });
```

- query getRestaurantReservationById(args: reservationId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.bookings.queries.getRestaurantReservationById, { reservationId: /* value */ });
```

- query getRestaurantReservations(args: paginationOpts, status, organizationId, restaurantId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.bookings.queries.getRestaurantReservations, { paginationOpts: /* value */, status: /* value */, organizationId: /* value */, restaurantId: /* value */ });
```

- query getUserActivityBookings(args: paginationOpts, status)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.bookings.queries.getUserActivityBookings, { paginationOpts: /* value */, status: /* value */ });
```

- query getUserEventBookings(args: paginationOpts, status)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.bookings.queries.getUserEventBookings, { paginationOpts: /* value */, status: /* value */ });
```

- query getUserReservations()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.bookings.queries.getUserReservations, {});
```

- query getUserRestaurantReservations(args: paginationOpts, status)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.bookings.queries.getUserRestaurantReservations, { paginationOpts: /* value */, status: /* value */ });
```

- query getUserStats()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.bookings.queries.getUserStats, {});
```

- query getUserVehicleBookings(args: paginationOpts, status)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.bookings.queries.getUserVehicleBookings, { paginationOpts: /* value */, status: /* value */ });
```

- query getVehicleBookingById(args: bookingId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.bookings.queries.getVehicleBookingById, { bookingId: /* value */ });
```

- query getVehicleBookings(args: paginationOpts, status, organizationId, vehicleId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.bookings.queries.getVehicleBookings, { paginationOpts: /* value */, status: /* value */, organizationId: /* value */, vehicleId: /* value */ });
```

### convex/domains/chat/mutations.ts

- mutation createChatRoom(args: contextType, contextId, assetType, partnerId, title, initialMessage, reservationId, reservationType, priority)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.chat.mutations.createChatRoom);
await mutate({ contextType: /* value */, contextId: /* value */, assetType: /* value */, partnerId: /* value */, title: /* value */, initialMessage: /* value */, reservationId: /* value */, reservationType: /* value */, priority: /* value */ });
```

- mutation createChatRoomAsPartner(args: contextType, contextId, assetType, travelerId, title, initialMessage, reservationId, reservationType, priority)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.chat.mutations.createChatRoomAsPartner);
await mutate({ contextType: /* value */, contextId: /* value */, assetType: /* value */, travelerId: /* value */, title: /* value */, initialMessage: /* value */, reservationId: /* value */, reservationType: /* value */, priority: /* value */ });
```

- mutation createFileCollection(args: chatRoomId, title, description, files, fileId, fileName, fileType, fileSize, category)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.chat.mutations.createFileCollection);
await mutate({ chatRoomId: /* value */, title: /* value */, description: /* value */, files: /* value */, fileId: /* value */, fileName: /* value */, fileType: /* value */, fileSize: /* value */, category: /* value */ });
```

- mutation executeQuickAction(args: chatRoomId, action, actionData, newDate, newTime, newGuests, reason, priority, assignTo, note)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.chat.mutations.executeQuickAction);
await mutate({ chatRoomId: /* value */, action: /* value */, actionData: /* value */, newDate: /* value */, newTime: /* value */, newGuests: /* value */, reason: /* value */, priority: /* value */, assignTo: /* value */, note: /* value */ });
```

- mutation markMessagesAsRead(args: chatRoomId, messageIds)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.chat.mutations.markMessagesAsRead);
await mutate({ chatRoomId: /* value */, messageIds: /* value */ });
```

- mutation sendFileMessage(args: chatRoomId, fileId, fileName, fileType, fileSize, caption, category)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.chat.mutations.sendFileMessage);
await mutate({ chatRoomId: /* value */, fileId: /* value */, fileName: /* value */, fileType: /* value */, fileSize: /* value */, caption: /* value */, category: /* value */ });
```

- mutation sendMessage(args: chatRoomId, content, messageType)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.chat.mutations.sendMessage);
await mutate({ chatRoomId: /* value */, content: /* value */, messageType: /* value */ });
```

- mutation sendMultipleFiles(args: chatRoomId, files, fileId, fileName, fileType, fileSize, category)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.chat.mutations.sendMultipleFiles);
await mutate({ chatRoomId: /* value */, files: /* value */, fileId: /* value */, fileName: /* value */, fileType: /* value */, fileSize: /* value */, category: /* value */ });
```

- mutation sendTemplateMessage(args: chatRoomId, templateId, variables, customSubject, customContent)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.chat.mutations.sendTemplateMessage);
await mutate({ chatRoomId: /* value */, templateId: /* value */, variables: /* value */, customSubject: /* value */, customContent: /* value */ });
```

- mutation updateChatRoomStatus(args: chatRoomId, status)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.chat.mutations.updateChatRoomStatus);
await mutate({ chatRoomId: /* value */, status: /* value */ });
```

### convex/domains/chat/queries.ts

- query findOrCreateChatRoom(args: contextType, contextId, assetType, partnerId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.chat.queries.findOrCreateChatRoom, { contextType: /* value */, contextId: /* value */, assetType: /* value */, partnerId: /* value */ });
```

- query getChatRoom(args: chatRoomId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.chat.queries.getChatRoom, { chatRoomId: /* value */ });
```

- query listChatMessages(args: chatRoomId, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.chat.queries.listChatMessages, { chatRoomId: /* value */, limit: /* value */ });
```

- query listChatRooms(args: status)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.chat.queries.listChatRooms, { status: /* value */ });
```

### convex/domains/chat/templates.ts

- mutation createMessageTemplate()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.chat.templates.createMessageTemplate);
await mutate({});
```

- mutation deleteMessageTemplate(args: id)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.chat.templates.deleteMessageTemplate);
await mutate({ id: /* value */ });
```

- query getMessageTemplate(args: id)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.chat.templates.getMessageTemplate, { id: /* value */ });
```

- query listMessageTemplates()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.chat.templates.listMessageTemplates, {});
```

- query processTemplate(args: templateId, variables)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.chat.templates.processTemplate, { templateId: /* value */, variables: /* value */ });
```

- mutation updateMessageTemplate()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.chat.templates.updateMessageTemplate);
await mutate({});
```

### convex/domains/coupons/actions.ts

- action applyAutomaticCoupons(args: userId, assetType, assetId, orderValue)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.coupons.actions.applyAutomaticCoupons);
const result = await run({ userId: /* value */, assetType: /* value */, assetId: /* value */, orderValue: /* value */ });
```

- action applyCouponToBooking(args: couponCode, bookingId, bookingType, userId, originalAmount, appliedBy)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.coupons.actions.applyCouponToBooking);
const result = await run({ couponCode: /* value */, bookingId: /* value */, bookingType: /* value */, userId: /* value */, originalAmount: /* value */, appliedBy: /* value */ });
```

- action calculateCouponDiscount(args: couponCode, orderValue, assetType, assetId)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.coupons.actions.calculateCouponDiscount);
const result = await run({ couponCode: /* value */, orderValue: /* value */, assetType: /* value */, assetId: /* value */ });
```

- action createStripePromotionCode(args: couponId, stripeCustomerId, maxRedemptions, expiresAt)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.coupons.actions.createStripePromotionCode);
const result = await run({ couponId: /* value */, stripeCustomerId: /* value */, maxRedemptions: /* value */, expiresAt: /* value */ });
```

- action generateCouponReport(args: partnerId, organizationId, startDate, endDate, reportType)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.coupons.actions.generateCouponReport);
const result = await run({ partnerId: /* value */, organizationId: /* value */, startDate: /* value */, endDate: /* value */, reportType: /* value */ });
```

- action generateCouponUsageReport(args: partnerId, organizationId, startDate, endDate)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.coupons.actions.generateCouponUsageReport);
const result = await run({ partnerId: /* value */, organizationId: /* value */, startDate: /* value */, endDate: /* value */ });
```

- action processExpiredCoupons()
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.coupons.actions.processExpiredCoupons);
const result = await run({});
```

- action sendExpirationNotifications()
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.coupons.actions.sendExpirationNotifications);
const result = await run({});
```

- action syncCouponUsageWithStripe(args: couponUsageId, stripeSessionId, paymentIntentId)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.coupons.actions.syncCouponUsageWithStripe);
const result = await run({ couponUsageId: /* value */, stripeSessionId: /* value */, paymentIntentId: /* value */ });
```

- action validateCouponRealTime(args: couponCode, userId, assetType, assetId, orderValue)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.coupons.actions.validateCouponRealTime);
const result = await run({ couponCode: /* value */, userId: /* value */, assetType: /* value */, assetId: /* value */, orderValue: /* value */ });
```

- action validateMultipleCoupons(args: couponCodes, userId, assetType, assetId, orderValue)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.coupons.actions.validateMultipleCoupons);
const result = await run({ couponCodes: /* value */, userId: /* value */, assetType: /* value */, assetId: /* value */, orderValue: /* value */ });
```

### convex/domains/coupons/mutations.ts

- mutation applyCoupon(args: couponCode, userId, bookingId, bookingType, originalAmount, assetType, assetId)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.coupons.mutations.applyCoupon);
await mutate({ couponCode: /* value */, userId: /* value */, bookingId: /* value */, bookingType: /* value */, originalAmount: /* value */, assetType: /* value */, assetId: /* value */ });
```

- mutation assignCouponToUsers(args: couponId, userIds)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.coupons.mutations.assignCouponToUsers);
await mutate({ couponId: /* value */, userIds: /* value */ });
```

- mutation bulkUpdateCoupons(args: couponIds, action)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.coupons.mutations.bulkUpdateCoupons);
await mutate({ couponIds: /* value */, action: /* value */ });
```

- mutation createAuditLog(args: couponId, actionType, performedBy, reason, metadata)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.coupons.mutations.createAuditLog);
await mutate({ couponId: /* value */, actionType: /* value */, performedBy: /* value */, reason: /* value */, metadata: /* value */ });
```

- mutation createCoupon(args: code, name, description, discountType, discountValue, maxDiscountAmount, minimumOrderValue, maximumOrderValue, usageLimit, userUsageLimit, validFrom, validUntil, type, applicableAssets, assetType, assetId, isActive)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.coupons.mutations.createCoupon);
await mutate({ code: /* value */, name: /* value */, description: /* value */, discountType: /* value */, discountValue: /* value */, maxDiscountAmount: /* value */, minimumOrderValue: /* value */, maximumOrderValue: /* value */, usageLimit: /* value */, userUsageLimit: /* value */, validFrom: /* value */, validUntil: /* value */, type: /* value */, applicableAssets: /* value */, assetType: /* value */, assetId: /* value */, isActive: /* value */ });
```

- mutation createCouponUsage(args: couponId, userId, bookingId, bookingType, originalAmount, discountAmount, finalAmount, appliedBy, metadata)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.coupons.mutations.createCouponUsage);
await mutate({ couponId: /* value */, userId: /* value */, bookingId: /* value */, bookingType: /* value */, originalAmount: /* value */, discountAmount: /* value */, finalAmount: /* value */, appliedBy: /* value */, metadata: /* value */ });
```

- mutation createNotification(args: userId, type, title, message, data)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.coupons.mutations.createNotification);
await mutate({ userId: /* value */, type: /* value */, title: /* value */, message: /* value */, data: /* value */ });
```

- mutation deleteCoupon(args: couponId)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.coupons.mutations.deleteCoupon);
await mutate({ couponId: /* value */ });
```

- mutation duplicateCoupon(args: couponId, newCode)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.coupons.mutations.duplicateCoupon);
await mutate({ couponId: /* value */, newCode: /* value */ });
```

- mutation refundCouponUsage(args: usageId, reason)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.coupons.mutations.refundCouponUsage);
await mutate({ usageId: /* value */, reason: /* value */ });
```

- mutation removeCouponUsers(args: couponId, userIds)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.coupons.mutations.removeCouponUsers);
await mutate({ couponId: /* value */, userIds: /* value */ });
```

- mutation toggleCouponStatus(args: couponId, isActive)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.coupons.mutations.toggleCouponStatus);
await mutate({ couponId: /* value */, isActive: /* value */ });
```

- mutation updateCoupon(args: couponId, code, name, description, discountType, discountValue, maxDiscountAmount, minimumOrderValue, maximumOrderValue, usageLimit, userUsageLimit, validFrom, validUntil, type, applicableAssets, assetType, assetId, isActive)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.coupons.mutations.updateCoupon);
await mutate({ couponId: /* value */, code: /* value */, name: /* value */, description: /* value */, discountType: /* value */, discountValue: /* value */, maxDiscountAmount: /* value */, minimumOrderValue: /* value */, maximumOrderValue: /* value */, usageLimit: /* value */, userUsageLimit: /* value */, validFrom: /* value */, validUntil: /* value */, type: /* value */, applicableAssets: /* value */, assetType: /* value */, assetId: /* value */, isActive: /* value */ });
```

- mutation updateCouponAssets(args: couponId, applicableAssets, assetType, assetId, isActive)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.coupons.mutations.updateCouponAssets);
await mutate({ couponId: /* value */, applicableAssets: /* value */, assetType: /* value */, assetId: /* value */, isActive: /* value */ });
```

- mutation updateCouponStripeInfo(args: couponId, stripePromotionCodeId, stripeCouponId)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.coupons.mutations.updateCouponStripeInfo);
await mutate({ couponId: /* value */, stripePromotionCodeId: /* value */, stripeCouponId: /* value */ });
```

- mutation updateCouponUsage(args: usageId, status, metadata)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.coupons.mutations.updateCouponUsage);
await mutate({ usageId: /* value */, status: /* value */, metadata: /* value */ });
```

### convex/domains/coupons/queries.ts

- query checkCouponEligibility(args: couponId, userId, assetType, assetId, orderValue)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.coupons.queries.checkCouponEligibility, { couponId: /* value */, userId: /* value */, assetType: /* value */, assetId: /* value */, orderValue: /* value */ });
```

- query getAvailableUsers(args: searchTerm, excludeIds, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.coupons.queries.getAvailableUsers, { searchTerm: /* value */, excludeIds: /* value */, limit: /* value */ });
```

- query getCouponAnalytics(args: partnerId, organizationId, dateRange, start, end)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.coupons.queries.getCouponAnalytics, { partnerId: /* value */, organizationId: /* value */, dateRange: /* value */, start: /* value */, end: /* value */ });
```

- query getCouponByCode(args: code)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.coupons.queries.getCouponByCode, { code: /* value */ });
```

- query getCouponById(args: couponId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.coupons.queries.getCouponById, { couponId: /* value */ });
```

- query getCouponsByAsset(args: assetType, assetId, isActive)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.coupons.queries.getCouponsByAsset, { assetType: /* value */, assetId: /* value */, isActive: /* value */ });
```

- query getCouponStats(args: couponId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.coupons.queries.getCouponStats, { couponId: /* value */ });
```

- query getCouponUsageById(args: usageId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.coupons.queries.getCouponUsageById, { usageId: /* value */ });
```

- query getCouponUsageHistory(args: couponId, limit, offset)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.coupons.queries.getCouponUsageHistory, { couponId: /* value */, limit: /* value */, offset: /* value */ });
```

- query getPartnerAssets(args: partnerId, assetType, searchTerm, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.coupons.queries.getPartnerAssets, { partnerId: /* value */, assetType: /* value */, searchTerm: /* value */, limit: /* value */ });
```

- query getPublicCoupons(args: assetType, assetId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.coupons.queries.getPublicCoupons, { assetType: /* value */, assetId: /* value */ });
```

- query getTravelersForCoupon(args: searchTerm, excludeIds, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.coupons.queries.getTravelersForCoupon, { searchTerm: /* value */, excludeIds: /* value */, limit: /* value */ });
```

- query getUser(args: userId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.coupons.queries.getUser, { userId: /* value */ });
```

- query listCoupons(args: partnerId, organizationId, isActive, type, limit, offset)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.coupons.queries.listCoupons, { partnerId: /* value */, organizationId: /* value */, isActive: /* value */, type: /* value */, limit: /* value */, offset: /* value */ });
```

### convex/domains/email/actions.ts

- action testEmailService(args: testEmail)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.email.actions.testEmailService);
const result = await run({ testEmail: /* value */ });
```

### convex/domains/email/mutations.ts

- mutation markEmailAsRead(args: emailLogId)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.email.mutations.markEmailAsRead);
await mutate({ emailLogId: /* value */ });
```

- mutation retryFailedEmail(args: emailLogId)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.email.mutations.retryFailedEmail);
await mutate({ emailLogId: /* value */ });
```

### convex/domains/email/queries.ts

- query getEmailLogs(args: limit, cursor, type, status)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.email.queries.getEmailLogs, { limit: /* value */, cursor: /* value */, type: /* value */, status: /* value */ });
```

- query getEmailLogsByRecipient(args: email, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.email.queries.getEmailLogsByRecipient, { email: /* value */, limit: /* value */ });
```

- query getEmailStats(args: period)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.email.queries.getEmailStats, { period: /* value */ });
```

- query getFailedEmails(args: limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.email.queries.getFailedEmails, { limit: /* value */ });
```

### convex/domains/events/actions.ts

- action syncFromSympla(args: symplaToken, partnerId)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.events.actions.syncFromSympla);
const result = await run({ symplaToken: /* value */, partnerId: /* value */ });
```

### convex/domains/events/queries.ts

- query getActiveEventTickets(args: eventId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.events.queries.getActiveEventTickets, { eventId: /* value */ });
```

- query getAll()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.events.queries.getAll, {});
```

- query getById(args: id)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.events.queries.getById, { id: /* value */ });
```

- query getByUser(args: userId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.events.queries.getByUser, { userId: /* value */ });
```

- query getEventsForAdmin()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.events.queries.getEventsForAdmin, {});
```

- query getEventsWithCreators()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.events.queries.getEventsWithCreators, {});
```

- query getEventTickets(args: eventId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.events.queries.getEventTickets, { eventId: /* value */ });
```

- query getFeatured()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.events.queries.getFeatured, {});
```

- query getPublicEventsWithCreators()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.events.queries.getPublicEventsWithCreators, {});
```

- query getUpcoming()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.events.queries.getUpcoming, {});
```

- query getUserById(args: userId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.events.queries.getUserById, { userId: /* value */ });
```

### convex/domains/media/mutations.ts

- mutation createMedia(args: storageId, fileName, fileType, fileSize, description, category, height, width, uploadedBy, isPublic, tags)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.media.mutations.createMedia);
await mutate({ storageId: /* value */, fileName: /* value */, fileType: /* value */, fileSize: /* value */, description: /* value */, category: /* value */, height: /* value */, width: /* value */, uploadedBy: /* value */, isPublic: /* value */, tags: /* value */ });
```

- mutation deleteMedia(args: id)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.media.mutations.deleteMedia);
await mutate({ id: /* value */ });
```

- mutation generateUploadUrl()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.media.mutations.generateUploadUrl);
await mutate({});
```

- action getImageDimensions(args: storageId)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.media.mutations.getImageDimensions);
const result = await run({ storageId: /* value */ });
```

- mutation refreshMediaUrl(args: id)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.media.mutations.refreshMediaUrl);
await mutate({ id: /* value */ });
```

- mutation updateMedia(args: id, description, category, isPublic, tags)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.media.mutations.updateMedia);
await mutate({ id: /* value */, description: /* value */, category: /* value */, isPublic: /* value */, tags: /* value */ });
```

### convex/domains/media/queries.ts

- query getAllMedia()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.media.queries.getAllMedia, {});
```

- query getByUser(args: userId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.media.queries.getByUser, { userId: /* value */ });
```

- query getMediaByCategory(args: category)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.media.queries.getMediaByCategory, { category: /* value */ });
```

- query getMediaById(args: id)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.media.queries.getMediaById, { id: /* value */ });
```

- query getMediaUrl(args: storageId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.media.queries.getMediaUrl, { storageId: /* value */ });
```

- query getPublicMedia()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.media.queries.getPublicMedia, {});
```

### convex/domains/notifications/mutations.ts

- mutation createBookingCanceledNotification(args: userId, confirmationCode, bookingType, assetName, reason, relatedId, relatedType)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.notifications.mutations.createBookingCanceledNotification);
await mutate({ userId: /* value */, confirmationCode: /* value */, bookingType: /* value */, assetName: /* value */, reason: /* value */, relatedId: /* value */, relatedType: /* value */ });
```

- mutation createBookingConfirmationNotification(args: userId, confirmationCode, bookingType, assetName, partnerName, relatedId, relatedType)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.notifications.mutations.createBookingConfirmationNotification);
await mutate({ userId: /* value */, confirmationCode: /* value */, bookingType: /* value */, assetName: /* value */, partnerName: /* value */, relatedId: /* value */, relatedType: /* value */ });
```

- mutation createChatMessageNotification(args: recipientId, senderId, senderName, chatRoomId, messagePreview, contextType, contextData, assetName, assetType, bookingCode)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.notifications.mutations.createChatMessageNotification);
await mutate({ recipientId: /* value */, senderId: /* value */, senderName: /* value */, chatRoomId: /* value */, messagePreview: /* value */, contextType: /* value */, contextData: /* value */, assetName: /* value */, assetType: /* value */, bookingCode: /* value */ });
```

- mutation createChatRoomCreatedNotification(args: partnerId, travelerId, travelerName, chatRoomId, contextType, contextData, assetName, assetType, bookingCode)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.notifications.mutations.createChatRoomCreatedNotification);
await mutate({ partnerId: /* value */, travelerId: /* value */, travelerName: /* value */, chatRoomId: /* value */, contextType: /* value */, contextData: /* value */, assetName: /* value */, assetType: /* value */, bookingCode: /* value */ });
```

- mutation createNotification(args: userIds, type, title, message, data)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.notifications.mutations.createNotification);
await mutate({ userIds: /* value */, type: /* value */, title: /* value */, message: /* value */, data: /* value */ });
```

- mutation deleteNotification(args: userId, confirmationCode, bookingType, assetName, partnerName, relatedId, relatedType)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.notifications.mutations.deleteNotification);
await mutate({ userId: /* value */, confirmationCode: /* value */, bookingType: /* value */, assetName: /* value */, partnerName: /* value */, relatedId: /* value */, relatedType: /* value */ });
```

- mutation markAllAsRead()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.notifications.mutations.markAllAsRead);
await mutate({});
```

- mutation markAsRead()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.notifications.mutations.markAsRead);
await mutate({});
```

- mutation sendBulkNotification(args: userIds, type, title, message, data)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.notifications.mutations.sendBulkNotification);
await mutate({ userIds: /* value */, type: /* value */, title: /* value */, message: /* value */, data: /* value */ });
```

### convex/domains/notifications/queries.ts

- query getNotificationById(args: notificationId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.notifications.queries.getNotificationById, { notificationId: /* value */ });
```

- query getNotificationsByType(args: type, paginationOpts, numItems, cursor)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.notifications.queries.getNotificationsByType, { type: /* value */, paginationOpts: /* value */, numItems: /* value */, cursor: /* value */ });
```

- query getNotificationsSummary()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.notifications.queries.getNotificationsSummary, {});
```

- query getRecentNotifications()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.notifications.queries.getRecentNotifications, {});
```

- query getUnreadNotificationCount()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.notifications.queries.getUnreadNotificationCount, {});
```

- query getUserNotifications(args: limit, includeRead, type, paginationOpts)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.notifications.queries.getUserNotifications, { limit: /* value */, includeRead: /* value */, type: /* value */, paginationOpts: /* value */ });
```

- query getUserNotificationsPaginated(args: paginationOpts, includeRead, type)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.notifications.queries.getUserNotificationsPaginated, { paginationOpts: /* value */, includeRead: /* value */, type: /* value */ });
```

### convex/domains/packageProposals/actions.ts

- action analyzePackageRequest(args: packageRequestId)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.packageProposals.actions.analyzePackageRequest);
const result = await run({ packageRequestId: /* value */ });
```

- action duplicateProposal(args: sourceProposalId, newPackageRequestId, modifications, title, adjustPricing, updateValidUntil)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.packageProposals.actions.duplicateProposal);
const result = await run({ sourceProposalId: /* value */, newPackageRequestId: /* value */, modifications: /* value */, title: /* value */, adjustPricing: /* value */, updateValidUntil: /* value */ });
```

- action exportProposalsData(args: partnerId, startDate, endDate, format, includeDetails)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.packageProposals.actions.exportProposalsData);
const result = await run({ partnerId: /* value */, startDate: /* value */, endDate: /* value */, format: /* value */, includeDetails: /* value */ });
```

- action generateProposalDocument(args: proposalId, template, options, includeTerms, includePricing, includeItinerary, logoUrl, brandingColors, primary, secondary)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.packageProposals.actions.generateProposalDocument);
const result = await run({ proposalId: /* value */, template: /* value */, options: /* value */, includeTerms: /* value */, includePricing: /* value */, includeItinerary: /* value */, logoUrl: /* value */, brandingColors: /* value */, primary: /* value */, secondary: /* value */ });
```

### convex/domains/packageProposals/documents.ts

- action generateProposalPDF()
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.packageProposals.documents.generateProposalPDF);
const result = await run({});
```

- query getAttachmentDownloadUrl(args: proposalId, storageId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageProposals.documents.getAttachmentDownloadUrl, { proposalId: /* value */, storageId: /* value */ });
```

- query getProposalAttachments(args: proposalId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageProposals.documents.getProposalAttachments, { proposalId: /* value */ });
```

- mutation removeProposalAttachment()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packageProposals.documents.removeProposalAttachment);
await mutate({});
```

- mutation uploadProposalAttachment()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packageProposals.documents.uploadProposalAttachment);
await mutate({});
```

### convex/domains/packageProposals/mutations.ts

- mutation acceptProposal(args: proposalId, customerFeedback)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packageProposals.mutations.acceptProposal);
await mutate({ proposalId: /* value */, customerFeedback: /* value */ });
```

- mutation approvePackageProposal()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packageProposals.mutations.approvePackageProposal);
await mutate({});
```

- mutation convertProposalToBooking()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packageProposals.mutations.convertProposalToBooking);
await mutate({});
```

- mutation createPackageProposal()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packageProposals.mutations.createPackageProposal);
await mutate({});
```

- mutation deletePackageProposal(args: id, reason)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packageProposals.mutations.deletePackageProposal);
await mutate({ id: /* value */, reason: /* value */ });
```

- mutation markProposalAsViewed(args: id)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packageProposals.mutations.markProposalAsViewed);
await mutate({ id: /* value */ });
```

- mutation sendPackageProposal()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packageProposals.mutations.sendPackageProposal);
await mutate({});
```

- mutation sendProposalQuestion(args: proposalId, message)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packageProposals.mutations.sendProposalQuestion);
await mutate({ proposalId: /* value */, message: /* value */ });
```

- mutation updatePackageProposal()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packageProposals.mutations.updatePackageProposal);
await mutate({});
```

- mutation uploadProposalAttachment()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packageProposals.mutations.uploadProposalAttachment);
await mutate({});
```

### convex/domains/packageProposals/queries.ts

- query getPackageProposal(args: id)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageProposals.queries.getPackageProposal, { id: /* value */ });
```

- query getPackageProposalWithAuth(args: id)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageProposals.queries.getPackageProposalWithAuth, { id: /* value */ });
```

- query getPendingApprovals(args: partnerId, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageProposals.queries.getPendingApprovals, { partnerId: /* value */, limit: /* value */ });
```

- query getProposalActivity(args: proposalId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageProposals.queries.getProposalActivity, { proposalId: /* value */ });
```

- query getProposalsForRequest(args: packageRequestId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageProposals.queries.getProposalsForRequest, { packageRequestId: /* value */ });
```

- query getProposalStatistics(args: partnerId, organizationId, timeRange)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageProposals.queries.getProposalStatistics, { partnerId: /* value */, organizationId: /* value */, timeRange: /* value */ });
```

- query getProposalStats(args: partnerId, organizationId, timeRange)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageProposals.queries.getProposalStats, { partnerId: /* value */, organizationId: /* value */, timeRange: /* value */ });
```

- query getProposalTemplates(args: category, partnerId, isActive)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageProposals.queries.getProposalTemplates, { category: /* value */, partnerId: /* value */, isActive: /* value */ });
```

- query listPackageProposals()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageProposals.queries.listPackageProposals, {});
```

- query searchProposals(args: searchTerm, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageProposals.queries.searchProposals, { searchTerm: /* value */, limit: /* value */ });
```

### convex/domains/packageProposals/templates.ts

- query applyProposalTemplate(args: templateId, packageRequestId, variables)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageProposals.templates.applyProposalTemplate, { templateId: /* value */, packageRequestId: /* value */, variables: /* value */ });
```

- mutation createPackageProposalTemplate()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packageProposals.templates.createPackageProposalTemplate);
await mutate({});
```

- mutation deletePackageProposalTemplate(args: id, reason)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packageProposals.templates.deletePackageProposalTemplate);
await mutate({ id: /* value */, reason: /* value */ });
```

- query getPackageProposalTemplate(args: id)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageProposals.templates.getPackageProposalTemplate, { id: /* value */ });
```

- query listPackageProposalTemplates()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageProposals.templates.listPackageProposalTemplates, {});
```

- mutation updatePackageProposalTemplate()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packageProposals.templates.updatePackageProposalTemplate);
await mutate({});
```

### convex/domains/packageRequests/queries.ts

- query getAssignedPackageRequests(args: assignedTo, paginationOpts)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageRequests.queries.getAssignedPackageRequests, { assignedTo: /* value */, paginationOpts: /* value */ });
```

- query getPackageRequest(args: id)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageRequests.queries.getPackageRequest, { id: /* value */ });
```

- query getPackageRequestByNumber(args: requestNumber)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageRequests.queries.getPackageRequestByNumber, { requestNumber: /* value */ });
```

- query getPackageRequestDetails(args: requestId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageRequests.queries.getPackageRequestDetails, { requestId: /* value */ });
```

- query getPackageRequestsByEmail(args: email)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageRequests.queries.getPackageRequestsByEmail, { email: /* value */ });
```

- query getRecentPackageRequests()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageRequests.queries.getRecentPackageRequests, {});
```

- query listPackageRequests(args: paginationOpts, status)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageRequests.queries.listPackageRequests, { paginationOpts: /* value */, status: /* value */ });
```

- query listPendingRequests(args: limit, offset)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packageRequests.queries.listPendingRequests, { limit: /* value */, offset: /* value */ });
```

### convex/domains/packages/conversionApi.ts

- action calculateConversionPricing(args: sessionId, option, type, packageId, customComponents, modifications)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.packages.conversionApi.calculateConversionPricing);
const result = await run({ sessionId: /* value */, option: /* value */, type: /* value */, packageId: /* value */, customComponents: /* value */, modifications: /* value */ });
```

- action executeConversionToBooking(args: sessionId, customerApproval, paymentMethod)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.packages.conversionApi.executeConversionToBooking);
const result = await run({ sessionId: /* value */, customerApproval: /* value */, paymentMethod: /* value */ });
```

- action executePackageMatching(args: sessionId, algorithm, filters, minScore, maxResults, priceRange, min, max)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.packages.conversionApi.executePackageMatching);
const result = await run({ sessionId: /* value */, algorithm: /* value */, filters: /* value */, minScore: /* value */, maxResults: /* value */, priceRange: /* value */, min: /* value */, max: /* value */ });
```

- query getConversionAnalytics(args: timeRange, partnerId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.conversionApi.getConversionAnalytics, { timeRange: /* value */, partnerId: /* value */ });
```

- query getConversionStatus(args: sessionId, requestId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.conversionApi.getConversionStatus, { sessionId: /* value */, requestId: /* value */ });
```

- mutation selectConversionOption(args: sessionId, selectedOption, type, packageId, customPackageId, finalPrice, adjustments, adminNotes)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.conversionApi.selectConversionOption);
await mutate({ sessionId: /* value */, selectedOption: /* value */, type: /* value */, packageId: /* value */, customPackageId: /* value */, finalPrice: /* value */, adjustments: /* value */, adminNotes: /* value */ });
```

- action startConversionProcess(args: requestId, conversionType)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.packages.conversionApi.startConversionProcess);
const result = await run({ requestId: /* value */, conversionType: /* value */ });
```

### convex/domains/packages/customPackageBuilder.ts

- mutation addPackageComponent(args: builderId, component)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.customPackageBuilder.addPackageComponent);
await mutate({ builderId: /* value */, component: /* value */ });
```

- action convertToActualPackage(args: builderId, packageData, name, slug, category, makePublic)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.packages.customPackageBuilder.convertToActualPackage);
const result = await run({ builderId: /* value */, packageData: /* value */, name: /* value */, slug: /* value */, category: /* value */, makePublic: /* value */ });
```

- action generatePackagePreview(args: builderId)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.packages.customPackageBuilder.generatePackagePreview);
const result = await run({ builderId: /* value */ });
```

- query getAvailableComponents(args: type, destination, dateRange, startDate, endDate)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.customPackageBuilder.getAvailableComponents, { type: /* value */, destination: /* value */, dateRange: /* value */, startDate: /* value */, endDate: /* value */ });
```

- action initializeCustomPackageBuilder(args: requestId)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.packages.customPackageBuilder.initializeCustomPackageBuilder);
const result = await run({ requestId: /* value */ });
```

- mutation removePackageComponent(args: builderId, componentId)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.customPackageBuilder.removePackageComponent);
await mutate({ builderId: /* value */, componentId: /* value */ });
```

- mutation updatePackageComponent(args: builderId, componentId, updates, name, description, quantity, adjustedPrice, isOptional, day, timeSlot, notes)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.customPackageBuilder.updatePackageComponent);
await mutate({ builderId: /* value */, componentId: /* value */, updates: /* value */, name: /* value */, description: /* value */, quantity: /* value */, adjustedPrice: /* value */, isOptional: /* value */, day: /* value */, timeSlot: /* value */, notes: /* value */ });
```

### convex/domains/packages/matchingEngine.ts

- action executeMatching(args: requestId, algorithm, maxResults, minScore)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.packages.matchingEngine.executeMatching);
const result = await run({ requestId: /* value */, algorithm: /* value */, maxResults: /* value */, minScore: /* value */ });
```

- query getMatchingStatistics(args: timeRange)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.matchingEngine.getMatchingStatistics, { timeRange: /* value */ });
```

### convex/domains/packages/mutations.ts

- mutation addAdminNote(args: requestId, note)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.addAdminNote);
await mutate({ requestId: /* value */, note: /* value */ });
```

- mutation assignPackageRequest(args: requestId, assignedTo)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.assignPackageRequest);
await mutate({ requestId: /* value */, assignedTo: /* value */ });
```

- mutation calculatePackagePricing(args: vehicleId, includedActivityIds, includedRestaurantIds, includedEventIds, duration, guests, discountPercentage)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.calculatePackagePricing);
await mutate({ vehicleId: /* value */, includedActivityIds: /* value */, includedRestaurantIds: /* value */, includedEventIds: /* value */, duration: /* value */, guests: /* value */, discountPercentage: /* value */ });
```

- mutation confirmPackageBooking(args: bookingId, partnerNotes)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.confirmPackageBooking);
await mutate({ bookingId: /* value */, partnerNotes: /* value */ });
```

- mutation createPackage(args: name, slug, description, description_long, duration, maxGuests, basePrice, discountPercentage, currency, vehicleId, includedActivityIds, includedRestaurantIds, includedEventIds, highlights, includes, excludes, itinerary, day, title, activities)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.createPackage);
await mutate({ name: /* value */, slug: /* value */, description: /* value */, description_long: /* value */, duration: /* value */, maxGuests: /* value */, basePrice: /* value */, discountPercentage: /* value */, currency: /* value */, vehicleId: /* value */, includedActivityIds: /* value */, includedRestaurantIds: /* value */, includedEventIds: /* value */, highlights: /* value */, includes: /* value */, excludes: /* value */, itinerary: /* value */, day: /* value */, title: /* value */, activities: /* value */ });
```

- mutation createPackageBooking(args: packageId, userId, startDate, endDate, guests, totalPrice, breakdown, vehiclePrice, activitiesPrice, restaurantsPrice, eventsPrice, discount)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.createPackageBooking);
await mutate({ packageId: /* value */, userId: /* value */, startDate: /* value */, endDate: /* value */, guests: /* value */, totalPrice: /* value */, breakdown: /* value */, vehiclePrice: /* value */, activitiesPrice: /* value */, restaurantsPrice: /* value */, eventsPrice: /* value */, discount: /* value */ });
```

- mutation createPackageRequest(args: customerInfo, tripDetails, preferences, specialRequirements, previousExperience, expectedHighlights)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.createPackageRequest);
await mutate({ customerInfo: /* value */, tripDetails: /* value */, preferences: /* value */, specialRequirements: /* value */, previousExperience: /* value */, expectedHighlights: /* value */ });
```

- mutation createPackageRequestMessage(args: packageRequestId, subject, message, priority)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.createPackageRequestMessage);
await mutate({ packageRequestId: /* value */, subject: /* value */, message: /* value */, priority: /* value */ });
```

- mutation deletePackage(args: id)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.deletePackage);
await mutate({ id: /* value */ });
```

- mutation deletePackageRequest(args: id)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.deletePackageRequest);
await mutate({ id: /* value */ });
```

- mutation duplicatePackage(args: id, newName, newSlug)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.duplicatePackage);
await mutate({ id: /* value */, newName: /* value */, newSlug: /* value */ });
```

- mutation markPackageRequestMessageAsRead(args: messageId)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.markPackageRequestMessageAsRead);
await mutate({ messageId: /* value */ });
```

- mutation markPackageRequestMessageAsReplied(args: messageId)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.markPackageRequestMessageAsReplied);
await mutate({ messageId: /* value */ });
```

- mutation sendPackageRequestReply(args: packageRequestId, originalMessageId, subject, message, priority)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.sendPackageRequestReply);
await mutate({ packageRequestId: /* value */, originalMessageId: /* value */, subject: /* value */, message: /* value */, priority: /* value */ });
```

- mutation togglePackageFeatured(args: id, isFeatured)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.togglePackageFeatured);
await mutate({ id: /* value */, isFeatured: /* value */ });
```

- mutation togglePackageStatus(args: id, isActive)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.togglePackageStatus);
await mutate({ id: /* value */, isActive: /* value */ });
```

- mutation updateCustomerInfo(args: requestId, customerInfo)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.updateCustomerInfo);
await mutate({ requestId: /* value */, customerInfo: /* value */ });
```

- mutation updatePackage(args: id, name, slug, description, description_long, duration, maxGuests, basePrice, discountPercentage, currency, vehicleId, includedActivityIds, includedRestaurantIds, includedEventIds, highlights, includes, excludes, itinerary, day, title, activities)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.updatePackage);
await mutate({ id: /* value */, name: /* value */, slug: /* value */, description: /* value */, description_long: /* value */, duration: /* value */, maxGuests: /* value */, basePrice: /* value */, discountPercentage: /* value */, currency: /* value */, vehicleId: /* value */, includedActivityIds: /* value */, includedRestaurantIds: /* value */, includedEventIds: /* value */, highlights: /* value */, includes: /* value */, excludes: /* value */, itinerary: /* value */, day: /* value */, title: /* value */, activities: /* value */ });
```

- mutation updatePackageBookingPayment(args: id, paymentStatus, paymentMethod)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.updatePackageBookingPayment);
await mutate({ id: /* value */, paymentStatus: /* value */, paymentMethod: /* value */ });
```

- mutation updatePackageBookingStatus(args: id, status, partnerNotes)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.updatePackageBookingStatus);
await mutate({ id: /* value */, status: /* value */, partnerNotes: /* value */ });
```

- mutation updatePackageRequestStatus(args: id, status, note)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.packages.mutations.updatePackageRequestStatus);
await mutate({ id: /* value */, status: /* value */, note: /* value */ });
```

### convex/domains/packages/pricingEngine.ts

- action calculateDynamicPricing(args: requestId, packageComponents, type, basePrice, quantity)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.packages.pricingEngine.calculateDynamicPricing);
const result = await run({ requestId: /* value */, packageComponents: /* value */, type: /* value */, basePrice: /* value */, quantity: /* value */ });
```

- action calculatePricingSensitivity(args: requestId, pricePoints)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.packages.pricingEngine.calculatePricingSensitivity);
const result = await run({ requestId: /* value */, pricePoints: /* value */ });
```

- query getPricingRecommendations(args: requestId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.pricingEngine.getPricingRecommendations, { requestId: /* value */ });
```

- query getPricingTrends(args: destination, timeRange)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.pricingEngine.getPricingTrends, { destination: /* value */, timeRange: /* value */ });
```

### convex/domains/packages/queries.ts

- query getAllPackageRequests()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getAllPackageRequests, {});
```

- query getAllPackages()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getAllPackages, {});
```

- query getAssignedPackageRequests(args: assignedTo, paginationOpts)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getAssignedPackageRequests, { assignedTo: /* value */, paginationOpts: /* value */ });
```

- query getFeaturedPackages(args: limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getFeaturedPackages, { limit: /* value */ });
```

- query getMyPackageRequests()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getMyPackageRequests, {});
```

- query getMyPackageRequestsByUserMatch()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getMyPackageRequestsByUserMatch, {});
```

- query getPackageAvailability(args: packageId, startDate, endDate)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getPackageAvailability, { packageId: /* value */, startDate: /* value */, endDate: /* value */ });
```

- query getPackageBookingByConfirmationCode(args: confirmationCode)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getPackageBookingByConfirmationCode, { confirmationCode: /* value */ });
```

- query getPackageBookingById(args: id)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getPackageBookingById, { id: /* value */ });
```

- query getPackageBookings(args: status, userId, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getPackageBookings, { status: /* value */, userId: /* value */, limit: /* value */ });
```

- query getPackageById(args: id)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getPackageById, { id: /* value */ });
```

- query getPackageBySlug(args: slug)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getPackageBySlug, { slug: /* value */ });
```

- query getPackageCategories()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getPackageCategories, {});
```

- query getPackageRequestByNumber(args: requestNumber)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getPackageRequestByNumber, { requestNumber: /* value */ });
```

- query getPackageRequestDetails(args: requestId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getPackageRequestDetails, { requestId: /* value */ });
```

- query getPackageRequestMessages(args: packageRequestId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getPackageRequestMessages, { packageRequestId: /* value */ });
```

- query getPackageRequestsByEmail(args: email)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getPackageRequestsByEmail, { email: /* value */ });
```

- query getPackageRequestStats()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getPackageRequestStats, {});
```

- query getPackages(args: filters, category, priceMin, priceMax, duration, maxGuests, isActive, isFeatured, partnerId, searchTerm, tags)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getPackages, { filters: /* value */, category: /* value */, priceMin: /* value */, priceMax: /* value */, duration: /* value */, maxGuests: /* value */, isActive: /* value */, isFeatured: /* value */, partnerId: /* value */, searchTerm: /* value */, tags: /* value */ });
```

- query getPackagesByPartner(args: partnerId, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getPackagesByPartner, { partnerId: /* value */, limit: /* value */ });
```

- query getPackageStats(args: partnerId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getPackageStats, { partnerId: /* value */ });
```

- query getPartnerPackages(args: partnerId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getPartnerPackages, { partnerId: /* value */ });
```

- query getRecentPackageRequests()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.getRecentPackageRequests, {});
```

- query list(args: limit, offset, filters, category, priceMin, priceMax, duration, maxGuests, isActive, isFeatured, partnerId, searchTerm, tags)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.list, { limit: /* value */, offset: /* value */, filters: /* value */, category: /* value */, priceMin: /* value */, priceMax: /* value */, duration: /* value */, maxGuests: /* value */, isActive: /* value */, isFeatured: /* value */, partnerId: /* value */, searchTerm: /* value */, tags: /* value */ });
```

- query listPackageRequests(args: paginationOpts, status)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.queries.listPackageRequests, { paginationOpts: /* value */, status: /* value */ });
```

### convex/domains/packages/requestAnalysis.ts

- action analyzePackageRequest(args: requestId, includeCustomSuggestions)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.packages.requestAnalysis.analyzePackageRequest);
const result = await run({ requestId: /* value */, includeCustomSuggestions: /* value */ });
```

- query getConversionCandidates(args: minScore, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.requestAnalysis.getConversionCandidates, { minScore: /* value */, limit: /* value */ });
```

- query getRequestAnalysis(args: requestId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.packages.requestAnalysis.getRequestAnalysis, { requestId: /* value */ });
```

- action markForAutoConversion(args: requestId, selectedPackageId, conversionNotes)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.packages.requestAnalysis.markForAutoConversion);
const result = await run({ requestId: /* value */, selectedPackageId: /* value */, conversionNotes: /* value */ });
```

### convex/domains/partners/actions.ts

- action calculateApplicationFee(args: partnerId, totalAmount)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.partners.actions.calculateApplicationFee);
const result = await run({ partnerId: /* value */, totalAmount: /* value */ });
```

- action createDashboardLink(args: stripeAccountId)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.partners.actions.createDashboardLink);
const result = await run({ stripeAccountId: /* value */ });
```

- action createStripeConnectedAccount(args: userId, email, country, businessType, businessName)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.partners.actions.createStripeConnectedAccount);
const result = await run({ userId: /* value */, email: /* value */, country: /* value */, businessType: /* value */, businessName: /* value */ });
```

- action refreshOnboardingLink(args: stripeAccountId)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.partners.actions.refreshOnboardingLink);
const result = await run({ stripeAccountId: /* value */ });
```

- action syncPartnerStatus(args: stripeAccountId)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.partners.actions.syncPartnerStatus);
const result = await run({ stripeAccountId: /* value */ });
```

### convex/domains/partners/mutations.ts

- mutation createTestPartner(args: userId, name, email, feePercentage)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.partners.mutations.createTestPartner);
await mutate({ userId: /* value */, name: /* value */, email: /* value */, feePercentage: /* value */ });
```

- mutation togglePartnerActive(args: partnerId, isActive)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.partners.mutations.togglePartnerActive);
await mutate({ partnerId: /* value */, isActive: /* value */ });
```

### convex/domains/partners/queries.ts

- query getPartnerAnalytics(args: partnerId, startDate, endDate)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.partners.queries.getPartnerAnalytics, { partnerId: /* value */, startDate: /* value */, endDate: /* value */ });
```

- query getPartnerBalance(args: partnerId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.partners.queries.getPartnerBalance, { partnerId: /* value */ });
```

- query getPartnerById(args: partnerId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.partners.queries.getPartnerById, { partnerId: /* value */ });
```

- query getPartnerByUserId(args: userId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.partners.queries.getPartnerByUserId, { userId: /* value */ });
```

- query getPartnerFeeHistory(args: partnerId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.partners.queries.getPartnerFeeHistory, { partnerId: /* value */ });
```

- query getPartnerFinancialAnalytics(args: partnerId, dateRange, startDate, endDate)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.partners.queries.getPartnerFinancialAnalytics, { partnerId: /* value */, dateRange: /* value */, startDate: /* value */, endDate: /* value */ });
```

- query getPartnerTransactions(args: partnerId, paginationOpts, status)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.partners.queries.getPartnerTransactions, { partnerId: /* value */, paginationOpts: /* value */, status: /* value */ });
```

- query listPartners(args: filterStatus, onlyActive)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.partners.queries.listPartners, { filterStatus: /* value */, onlyActive: /* value */ });
```

- query listPartnersPaginated(args: paginationOpts, filterStatus, onlyActive)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.partners.queries.listPartnersPaginated, { paginationOpts: /* value */, filterStatus: /* value */, onlyActive: /* value */ });
```

- query listPartnerTransactions()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.partners.queries.listPartnerTransactions, {});
```

### convex/domains/rbac/queries.ts

- query getCurrentUser()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.rbac.queries.getCurrentUser, {});
```

- query getInvite(args: token)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.rbac.queries.getInvite, { token: /* value */ });
```

### convex/domains/rbac/test.ts

- query testEmployeeOrganizationAccess(args: employeeId, organizationId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.rbac.test.testEmployeeOrganizationAccess, { employeeId: /* value */, organizationId: /* value */ });
```

### convex/domains/recommendations/cacheQueries.ts

- query getCacheLimitStats()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.recommendations.cacheQueries.getCacheLimitStats, {});
```

- query getCacheStats()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.recommendations.cacheQueries.getCacheStats, {});
```

- query listUserCaches(args: includeExpired)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.recommendations.cacheQueries.listUserCaches, { includeExpired: /* value */ });
```

### convex/domains/recommendations/mutations.ts

- mutation cacheRecommendations(args: userPreferences, recommendations, id, type, title, description, reasoning, matchScore, category, priceRange, features, location, imageUrl, estimatedPrice, aiGenerated, partnerId, partnerName, rating, tags, isActive, adventureLevel, luxuryLevel, socialLevel, duration, difficulty, interests, hasRealPrice, hasRealRating, realPrice, realRating, aiInsights)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.recommendations.mutations.cacheRecommendations);
await mutate({ userPreferences: /* value */, recommendations: /* value */, id: /* value */, type: /* value */, title: /* value */, description: /* value */, reasoning: /* value */, matchScore: /* value */, category: /* value */, priceRange: /* value */, features: /* value */, location: /* value */, imageUrl: /* value */, estimatedPrice: /* value */, aiGenerated: /* value */, partnerId: /* value */, partnerName: /* value */, rating: /* value */, tags: /* value */, isActive: /* value */, adventureLevel: /* value */, luxuryLevel: /* value */, socialLevel: /* value */, duration: /* value */, difficulty: /* value */, interests: /* value */, hasRealPrice: /* value */, hasRealRating: /* value */, realPrice: /* value */, realRating: /* value */, aiInsights: /* value */ });
```

- mutation cleanCacheWithCriteria(args: maxEntriesPerUser, maxEntriesPerCategory, olderThanHours, onlyExpired, dryRun)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.recommendations.mutations.cleanCacheWithCriteria);
await mutate({ maxEntriesPerUser: /* value */, maxEntriesPerCategory: /* value */, olderThanHours: /* value */, onlyExpired: /* value */, dryRun: /* value */ });
```

- mutation cleanExpiredCache()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.recommendations.mutations.cleanExpiredCache);
await mutate({});
```

- mutation getCachedRecommendations(args: userPreferences, category)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.recommendations.mutations.getCachedRecommendations);
await mutate({ userPreferences: /* value */, category: /* value */ });
```

- mutation invalidateUserCache(args: category)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.recommendations.mutations.invalidateUserCache);
await mutate({ category: /* value */ });
```

### convex/domains/recommendations/queries.ts

- query getAssetsForRecommendations(args: limit, assetType)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.recommendations.queries.getAssetsForRecommendations, { limit: /* value */, assetType: /* value */ });
```

- query getAssetsStats()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.recommendations.queries.getAssetsStats, {});
```

### convex/domains/reports/actions.ts

- action generatePDFReport(args: reportType, startDate, endDate, options, includeCharts, includeDetails, format)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.reports.actions.generatePDFReport);
const result = await run({ reportType: /* value */, startDate: /* value */, endDate: /* value */, options: /* value */, includeCharts: /* value */, includeDetails: /* value */, format: /* value */ });
```

- action processAdvancedAnalytics(args: startDate, endDate, analysisType)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.reports.actions.processAdvancedAnalytics);
const result = await run({ startDate: /* value */, endDate: /* value */, analysisType: /* value */ });
```

- action scheduleAutomaticReport(args: reportConfig, type, frequency, recipients, format, includeCharts)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.reports.actions.scheduleAutomaticReport);
const result = await run({ reportConfig: /* value */, type: /* value */, frequency: /* value */, recipients: /* value */, format: /* value */, includeCharts: /* value */ });
```

### convex/domains/reports/queries.ts

- query exportReportData(args: reportType, startDate, endDate, format)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.reports.queries.exportReportData, { reportType: /* value */, startDate: /* value */, endDate: /* value */, format: /* value */ });
```

- query getAssetTypePerformance(args: startDate, endDate)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.reports.queries.getAssetTypePerformance, { startDate: /* value */, endDate: /* value */ });
```

- query getConversionFunnel(args: startDate, endDate, partnerId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.reports.queries.getConversionFunnel, { startDate: /* value */, endDate: /* value */, partnerId: /* value */ });
```

- query getDestinationPerformance(args: startDate, endDate, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.reports.queries.getDestinationPerformance, { startDate: /* value */, endDate: /* value */, limit: /* value */ });
```

- query getExecutiveDashboard(args: period)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.reports.queries.getExecutiveDashboard, { period: /* value */ });
```

- query getRevenueAnalytics(args: startDate, endDate, partnerId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.reports.queries.getRevenueAnalytics, { startDate: /* value */, endDate: /* value */, partnerId: /* value */ });
```

- query getUserGrowthAnalytics(args: startDate, endDate)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.reports.queries.getUserGrowthAnalytics, { startDate: /* value */, endDate: /* value */ });
```

### convex/domains/restaurants/queries.ts

- query getActive()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.restaurants.queries.getActive, {});
```

- query getAll()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.restaurants.queries.getAll, {});
```

- query getAvailableTablesForReservation(args: restaurantId, date, time, partySize, excludeReservationId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.restaurants.queries.getAvailableTablesForReservation, { restaurantId: /* value */, date: /* value */, time: /* value */, partySize: /* value */, excludeReservationId: /* value */ });
```

- query getById(args: id)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.restaurants.queries.getById, { id: /* value */ });
```

- query getBySlug(args: slug)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.restaurants.queries.getBySlug, { slug: /* value */ });
```

- query getFeatured()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.restaurants.queries.getFeatured, {});
```

- query getRestaurantReservationsWithTables(args: restaurantId, date, status)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.restaurants.queries.getRestaurantReservationsWithTables, { restaurantId: /* value */, date: /* value */, status: /* value */ });
```

- query getWithCreator(args: id)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.restaurants.queries.getWithCreator, { id: /* value */ });
```

- query search(args: query, cuisines, priceRange, features)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.restaurants.queries.search, { query: /* value */, cuisines: /* value */, priceRange: /* value */, features: /* value */ });
```

### convex/domains/reviews/queries.ts

- query getModerationSettings()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.reviews.queries.getModerationSettings, {});
```

- query getReviewsStats(args: dateRange, start, end)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.reviews.queries.getReviewsStats, { dateRange: /* value */, start: /* value */, end: /* value */ });
```

- query listAllReviewsAdmin(args: paginationOpts, filters, itemType, isApproved, rating, min, max)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.reviews.queries.listAllReviewsAdmin, { paginationOpts: /* value */, filters: /* value */, itemType: /* value */, isApproved: /* value */, rating: /* value */, min: /* value */, max: /* value */ });
```

### convex/domains/shared/queries.ts

- query getAssetDetails(args: assetId, assetType)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.shared.queries.getAssetDetails, { assetId: /* value */, assetType: /* value */ });
```

- query getAssetsByType(args: assetType, isActive, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.shared.queries.getAssetsByType, { assetType: /* value */, isActive: /* value */, limit: /* value */ });
```

### convex/domains/stripe/actions.ts

- action createCheckoutSession()
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.stripe.actions.createCheckoutSession);
const result = await run({});
```

- action createPaymentLinkForBooking()
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.stripe.actions.createPaymentLinkForBooking);
const result = await run({});
```

### convex/domains/stripe/bookingActions.ts

- action approveBookingAndCapturePayment(args: bookingId, assetType, partnerNotes)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.stripe.bookingActions.approveBookingAndCapturePayment);
const result = await run({ bookingId: /* value */, assetType: /* value */, partnerNotes: /* value */ });
```

- action rejectBookingAndCancelPayment(args: bookingId, assetType, partnerNotes, cancellationReason)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.stripe.bookingActions.rejectBookingAndCancelPayment);
const result = await run({ bookingId: /* value */, assetType: /* value */, partnerNotes: /* value */, cancellationReason: /* value */ });
```

### convex/domains/stripe/mutations.ts

- mutation updateBookingStatus()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.stripe.mutations.updateBookingStatus);
await mutate({});
```

### convex/domains/stripe/queries.ts

- query getBookingByConfirmationCode(args: confirmationCode)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.stripe.queries.getBookingByConfirmationCode, { confirmationCode: /* value */ });
```

- query getBookingBySessionId(args: sessionId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.stripe.queries.getBookingBySessionId, { sessionId: /* value */ });
```

- query getPartnerBookingsWithPayments(args: partnerId, limit, status)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.stripe.queries.getPartnerBookingsWithPayments, { partnerId: /* value */, limit: /* value */, status: /* value */ });
```

### convex/domains/subscriptions/actions.ts

- action createCheckoutSession(args: userId, userEmail, userName, successUrl, cancelUrl)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.subscriptions.actions.createCheckoutSession);
const result = await run({ userId: /* value */, userEmail: /* value */, userName: /* value */, successUrl: /* value */, cancelUrl: /* value */ });
```

- action createPortalSession(args: userId, returnUrl)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.subscriptions.actions.createPortalSession);
const result = await run({ userId: /* value */, returnUrl: /* value */ });
```

### convex/domains/subscriptions/queries.ts

- query getByStripeSubscriptionId(args: stripeSubscriptionId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.subscriptions.queries.getByStripeSubscriptionId, { stripeSubscriptionId: /* value */ });
```

- query getCurrentSubscription()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.subscriptions.queries.getCurrentSubscription, {});
```

- query getPaymentHistory()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.subscriptions.queries.getPaymentHistory, {});
```

- query hasActiveSubscription()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.subscriptions.queries.hasActiveSubscription, {});
```

### convex/domains/support/mutations.ts

- mutation sendContactMessage(args: name, email, subject, message)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.support.mutations.sendContactMessage);
await mutate({ name: /* value */, email: /* value */, subject: /* value */, message: /* value */ });
```

### convex/domains/support/queries.ts

- query getSupportMessage(args: supportMessageId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.support.queries.getSupportMessage, { supportMessageId: /* value */ });
```

- query getSupportStatistics()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.support.queries.getSupportStatistics, {});
```

- query listMasterUsers()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.support.queries.listMasterUsers, {});
```

- query listSupportMessages(args: status, assignedToMe, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.support.queries.listSupportMessages, { status: /* value */, assignedToMe: /* value */, limit: /* value */ });
```

### convex/domains/systemSettings/actions.ts

- action updateSystemContactSettings()
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.systemSettings.actions.updateSystemContactSettings);
const result = await run({});
```

### convex/domains/systemSettings/mutations.ts

- mutation createSetting()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.systemSettings.mutations.createSetting);
await mutate({});
```

- mutation deleteSetting(args: key)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.systemSettings.mutations.deleteSetting);
await mutate({ key: /* value */ });
```

- mutation initializeDefaultSettings()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.systemSettings.mutations.initializeDefaultSettings);
await mutate({});
```

- mutation initializeMissingSettings()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.systemSettings.mutations.initializeMissingSettings);
await mutate({});
```

- mutation toggleMaintenanceMode(args: enabled)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.systemSettings.mutations.toggleMaintenanceMode);
await mutate({ enabled: /* value */ });
```

- mutation updateDefaultPartnerFee(args: feePercentage)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.systemSettings.mutations.updateDefaultPartnerFee);
await mutate({ feePercentage: /* value */ });
```

- mutation updateSetting()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.systemSettings.mutations.updateSetting);
await mutate({});
```

- mutation upsertSetting()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.systemSettings.mutations.upsertSetting);
await mutate({});
```

### convex/domains/systemSettings/queries.ts

- query getAllSettings()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.systemSettings.queries.getAllSettings, {});
```

- query getDefaultPartnerFee()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.systemSettings.queries.getDefaultPartnerFee, {});
```

- query getPublicSettings()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.systemSettings.queries.getPublicSettings, {});
```

- query getSetting(args: category, includePrivate)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.systemSettings.queries.getSetting, { category: /* value */, includePrivate: /* value */ });
```

- query getSettingsByCategory(args: category, includePrivate)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.systemSettings.queries.getSettingsByCategory, { category: /* value */, includePrivate: /* value */ });
```

- query isMaintenanceMode()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.systemSettings.queries.isMaintenanceMode, {});
```

### convex/domains/users/actions.ts

- action autoFixFailedEmployeeSyncs()
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.users.actions.autoFixFailedEmployeeSyncs);
const result = await run({});
```

- action fixFailedEmployeeCreation(args: employeeId)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.users.actions.fixFailedEmployeeCreation);
const result = await run({ employeeId: /* value */ });
```

- action processEmployeeCreationRequests()
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.users.actions.processEmployeeCreationRequests);
const result = await run({});
```

- action sendEmployeeInvitation(args: email, organizationName, inviterName)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.users.actions.sendEmployeeInvitation);
const result = await run({ email: /* value */, organizationName: /* value */, inviterName: /* value */ });
```

### convex/domains/users/mutations.ts

- mutation completeOnboarding(args: fullName, dateOfBirth, phoneNumber)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.users.mutations.completeOnboarding);
await mutate({ fullName: /* value */, dateOfBirth: /* value */, phoneNumber: /* value */ });
```

- mutation createEmployee(args: email, password, name, phone, organizationId)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.users.mutations.createEmployee);
await mutate({ email: /* value */, password: /* value */, name: /* value */, phone: /* value */, organizationId: /* value */ });
```

- mutation createUser(args: clerkId, email, name, image, phone, createdAt, updatedAt)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.users.mutations.createUser);
await mutate({ clerkId: /* value */, email: /* value */, name: /* value */, image: /* value */, phone: /* value */, createdAt: /* value */, updatedAt: /* value */ });
```

- mutation getOnboardingStatus()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.users.mutations.getOnboardingStatus);
await mutate({});
```

- mutation getUserByClerkId(args: clerkId)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.users.mutations.getUserByClerkId);
await mutate({ clerkId: /* value */ });
```

- mutation removeEmployee(args: employeeId)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.users.mutations.removeEmployee);
await mutate({ employeeId: /* value */ });
```

- mutation toggleUserActive(args: userId, isActive)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.users.mutations.toggleUserActive);
await mutate({ userId: /* value */, isActive: /* value */ });
```

- mutation updateUserProfile(args: fullName, phoneNumber)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.users.mutations.updateUserProfile);
await mutate({ fullName: /* value */, phoneNumber: /* value */ });
```

- mutation updateUserProfileData(args: userId, name, image, phone)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.users.mutations.updateUserProfileData);
await mutate({ userId: /* value */, name: /* value */, image: /* value */, phone: /* value */ });
```

- mutation updateUserRole(args: userId, role)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.users.mutations.updateUserRole);
await mutate({ userId: /* value */, role: /* value */ });
```

### convex/domains/users/queries.ts

- query getAdminBasicInfo(args: userId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.getAdminBasicInfo, { userId: /* value */ });
```

- query getAllUsers()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.getAllUsers, {});
```

- query getCurrentUser()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.getCurrentUser, {});
```

- query getEmployeeCreationStatus(args: employeeId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.getEmployeeCreationStatus, { employeeId: /* value */ });
```

- query getEmployeesByOrganization(args: organizationId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.getEmployeesByOrganization, { organizationId: /* value */ });
```

- query getOnboardingStatus()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.getOnboardingStatus, {});
```

- query getPartnerEmployeeStats()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.getPartnerEmployeeStats, {});
```

- query getSystemStatistics()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.getSystemStatistics, {});
```

- query getUserByClerkId(args: clerkId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.getUserByClerkId, { clerkId: /* value */ });
```

- query getUserByIdPublic(args: userId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.getUserByIdPublic, { userId: /* value */ });
```

- query getUserDetailsById(args: userId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.getUserDetailsById, { userId: /* value */ });
```

- query getUserProfile()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.getUserProfile, {});
```

- query getUsersByRole(args: role)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.getUsersByRole, { role: /* value */ });
```

- query listAllActivities(args: isActive, partnerId, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.listAllActivities, { isActive: /* value */, partnerId: /* value */, limit: /* value */ });
```

- query listAllAssets(args: assetType, isActive, partnerId, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.listAllAssets, { assetType: /* value */, isActive: /* value */, partnerId: /* value */, limit: /* value */ });
```

- query listAllEvents(args: isActive, partnerId, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.listAllEvents, { isActive: /* value */, partnerId: /* value */, limit: /* value */ });
```

- query listAllRestaurants(args: isActive, partnerId, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.listAllRestaurants, { isActive: /* value */, partnerId: /* value */, limit: /* value */ });
```

- query listAllUsers(args: role, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.listAllUsers, { role: /* value */, limit: /* value */ });
```

- query listAllVehicles(args: isActive, ownerId, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.listAllVehicles, { isActive: /* value */, ownerId: /* value */, limit: /* value */ });
```

- query listPartnerEmployees(args: limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.listPartnerEmployees, { limit: /* value */ });
```

- query listTravelers(args: search, paginationOpts, numItems, cursor)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.listTravelers, { search: /* value */, paginationOpts: /* value */, numItems: /* value */, cursor: /* value */ });
```

- query shouldRedirectToOnboarding()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.users.queries.shouldRedirectToOnboarding, {});
```

### convex/domains/vehicles/mutations.ts

- mutation createVehicle(args: name, brand, model, category, year, licensePlate, color, seats, fuelType, transmission, pricePerDay, description, features, imageUrl, status)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.vehicles.mutations.createVehicle);
await mutate({ name: /* value */, brand: /* value */, model: /* value */, category: /* value */, year: /* value */, licensePlate: /* value */, color: /* value */, seats: /* value */, fuelType: /* value */, transmission: /* value */, pricePerDay: /* value */, description: /* value */, features: /* value */, imageUrl: /* value */, status: /* value */ });
```

- mutation createVehicleBooking(args: vehicleId, userId, startDate, endDate, totalPrice, status, paymentMethod, paymentStatus, pickupLocation, returnLocation, additionalDrivers, additionalOptions, notes, customerInfo, name, email, phone)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.vehicles.mutations.createVehicleBooking);
await mutate({ vehicleId: /* value */, userId: /* value */, startDate: /* value */, endDate: /* value */, totalPrice: /* value */, status: /* value */, paymentMethod: /* value */, paymentStatus: /* value */, pickupLocation: /* value */, returnLocation: /* value */, additionalDrivers: /* value */, additionalOptions: /* value */, notes: /* value */, customerInfo: /* value */, name: /* value */, email: /* value */, phone: /* value */ });
```

- mutation deleteVehicle(args: id)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.vehicles.mutations.deleteVehicle);
await mutate({ id: /* value */ });
```

- mutation syncVehiclesWithOrganizations()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.vehicles.mutations.syncVehiclesWithOrganizations);
await mutate({});
```

- mutation updateVehicle(args: id, name, brand, model, category, year, licensePlate, color, seats, fuelType, transmission, pricePerDay, description, features, imageUrl, status)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.vehicles.mutations.updateVehicle);
await mutate({ id: /* value */, name: /* value */, brand: /* value */, model: /* value */, category: /* value */, year: /* value */, licensePlate: /* value */, color: /* value */, seats: /* value */, fuelType: /* value */, transmission: /* value */, pricePerDay: /* value */, description: /* value */, features: /* value */, imageUrl: /* value */, status: /* value */ });
```

- mutation updateVehicleBooking(args: id, status, paymentMethod, paymentStatus, notes)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.vehicles.mutations.updateVehicleBooking);
await mutate({ id: /* value */, status: /* value */, paymentMethod: /* value */, paymentStatus: /* value */, notes: /* value */ });
```

### convex/domains/vehicles/queries.ts

- query getAll()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.vehicles.queries.getAll, {});
```

- query getVehicle(args: id)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.vehicles.queries.getVehicle, { id: /* value */ });
```

- query getVehicleStats()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.vehicles.queries.getVehicleStats, {});
```

- query listVehicleBookings(args: vehicleId, userId, status)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.vehicles.queries.listVehicleBookings, { vehicleId: /* value */, userId: /* value */, status: /* value */ });
```

- query listVehicles(args: search, category, status, organizationId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.vehicles.queries.listVehicles, { search: /* value */, category: /* value */, status: /* value */, organizationId: /* value */ });
```

- query listVehiclesSimple(args: organizationId, status)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.vehicles.queries.listVehiclesSimple, { organizationId: /* value */, status: /* value */ });
```

### convex/domains/vouchers/actions.ts

- action generateQRVerificationToken(args: voucherNumber, expirationHours)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.vouchers.actions.generateQRVerificationToken);
const result = await run({ voucherNumber: /* value */, expirationHours: /* value */ });
```

- action generateVoucherPDF(args: voucherNumber)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.vouchers.actions.generateVoucherPDF);
const result = await run({ voucherNumber: /* value */ });
```

- action getVoucherPDFUrl(args: voucherNumber)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.vouchers.actions.getVoucherPDFUrl);
const result = await run({ voucherNumber: /* value */ });
```

- action manualVoucherLookup(args: voucherNumber, partnerId, ipAddress, userAgent)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.vouchers.actions.manualVoucherLookup);
const result = await run({ voucherNumber: /* value */, partnerId: /* value */, ipAddress: /* value */, userAgent: /* value */ });
```

- action verifyQRToken(args: qrContent, partnerId, ipAddress, userAgent)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.domains.vouchers.actions.verifyQRToken);
const result = await run({ qrContent: /* value */, partnerId: /* value */, ipAddress: /* value */, userAgent: /* value */ });
```

### convex/domains/vouchers/mutations.ts

- mutation bulkUpdateVoucherExpiration(args: partnerId, bookingType, newExpirationDate, reason)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.vouchers.mutations.bulkUpdateVoucherExpiration);
await mutate({ partnerId: /* value */, bookingType: /* value */, newExpirationDate: /* value */, reason: /* value */ });
```

- mutation cancelVoucher()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.vouchers.mutations.cancelVoucher);
await mutate({});
```

- mutation generateVoucher()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.vouchers.mutations.generateVoucher);
await mutate({});
```

- mutation recordVoucherDownload(args: voucherId, voucherNumber, userId, userType, ipAddress, userAgent, metadata)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.vouchers.mutations.recordVoucherDownload);
await mutate({ voucherId: /* value */, voucherNumber: /* value */, userId: /* value */, userType: /* value */, ipAddress: /* value */, userAgent: /* value */, metadata: /* value */ });
```

- mutation recordVoucherEmailSent(args: voucherId, voucherNumber, emailAddress, userId)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.vouchers.mutations.recordVoucherEmailSent);
await mutate({ voucherId: /* value */, voucherNumber: /* value */, emailAddress: /* value */, userId: /* value */ });
```

- mutation recordVoucherScan(args: voucherId, voucherNumber, userId, userType, ipAddress, userAgent, location, metadata)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.vouchers.mutations.recordVoucherScan);
await mutate({ voucherId: /* value */, voucherNumber: /* value */, userId: /* value */, userType: /* value */, ipAddress: /* value */, userAgent: /* value */, location: /* value */, metadata: /* value */ });
```

- mutation regenerateVoucher(args: voucherId, reason)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.vouchers.mutations.regenerateVoucher);
await mutate({ voucherId: /* value */, reason: /* value */ });
```

- mutation updateVoucher()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.vouchers.mutations.updateVoucher);
await mutate({});
```

- mutation useVoucher()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.domains.vouchers.mutations.useVoucher);
await mutate({});
```

### convex/domains/vouchers/queries.ts

- query getAllVouchers(args: status, bookingType, dateRange, from, to)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.vouchers.queries.getAllVouchers, { status: /* value */, bookingType: /* value */, dateRange: /* value */, from: /* value */, to: /* value */ });
```

- query getCustomerVouchers()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.vouchers.queries.getCustomerVouchers, {});
```

- query getPartnerVouchers()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.vouchers.queries.getPartnerVouchers, {});
```

- query getVoucherByBooking(args: bookingId, bookingType)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.vouchers.queries.getVoucherByBooking, { bookingId: /* value */, bookingType: /* value */ });
```

- query getVoucherByConfirmationCode(args: confirmationCode)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.vouchers.queries.getVoucherByConfirmationCode, { confirmationCode: /* value */ });
```

- query getVoucherByNumber(args: voucherNumber)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.vouchers.queries.getVoucherByNumber, { voucherNumber: /* value */ });
```

- query getVoucherStats(args: partnerId, dateRange, from, to)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.vouchers.queries.getVoucherStats, { partnerId: /* value */, dateRange: /* value */, from: /* value */, to: /* value */ });
```

- query getVoucherUsageLogs(args: voucherId, limit, offset)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.vouchers.queries.getVoucherUsageLogs, { voucherId: /* value */, limit: /* value */, offset: /* value */ });
```

- query verifyVoucher()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.vouchers.queries.verifyVoucher, {});
```

### convex/domains/vouchers/queries_additions.ts

- query getRecentVoucherActivities(args: partnerId, limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.vouchers.queries_additions.getRecentVoucherActivities, { partnerId: /* value */, limit: /* value */ });
```

- query getVoucherAnalytics(args: partnerId, dateRange, from, to)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.vouchers.queries_additions.getVoucherAnalytics, { partnerId: /* value */, dateRange: /* value */, from: /* value */, to: /* value */ });
```

- query partnerVerifyVoucher(args: voucherNumber, partnerId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.domains.vouchers.queries_additions.partnerVerifyVoucher, { voucherNumber: /* value */, partnerId: /* value */ });
```

### convex/functions.js

- query getUser()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.functions.getUser, {});
```

### convex/guide.ts

- mutation addSection(args: sectionTitle, content, tags)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.guide.addSection);
await mutate({ sectionTitle: /* value */, content: /* value */, tags: /* value */ });
```

- query search(args: query)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.guide.search, { query: /* value */ });
```

### convex/openaiActions.ts

- action generateAIRecommendations(args: userPreferences, baseRecommendations)
  
  Example:
```tsx
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.openaiActions.generateAIRecommendations);
const result = await run({ userPreferences: /* value */, baseRecommendations: /* value */ });
```

### convex/packageComparison.ts

- mutation addToComparison(args: packageId)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.packageComparison.addToComparison);
await mutate({ packageId: /* value */ });
```

- mutation clearComparison()
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.packageComparison.clearComparison);
await mutate({});
```

- query getComparisonCount()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.packageComparison.getComparisonCount, {});
```

- query getUserComparison()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.packageComparison.getUserComparison, {});
```

- query isInComparison(args: packageId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.packageComparison.isInComparison, { packageId: /* value */ });
```

- mutation removeFromComparison(args: packageId)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.packageComparison.removeFromComparison);
await mutate({ packageId: /* value */ });
```

### convex/reviews.ts

- mutation createReview(args: userId, itemType, itemId, rating, title, comment, detailedRatings, value, service, cleanliness, location, food, organization, guide)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.reviews.createReview);
await mutate({ userId: /* value */, itemType: /* value */, itemId: /* value */, rating: /* value */, title: /* value */, comment: /* value */, detailedRatings: /* value */, value: /* value */, service: /* value */, cleanliness: /* value */, location: /* value */, food: /* value */, organization: /* value */, guide: /* value */ });
```

- query getItemReviews(args: itemType, itemId, limit, offset, sortBy)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.reviews.getItemReviews, { itemType: /* value */, itemId: /* value */, limit: /* value */, offset: /* value */, sortBy: /* value */ });
```

- query getItemReviewStats(args: itemType, itemId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.reviews.getItemReviewStats, { itemType: /* value */, itemId: /* value */ });
```

- query getUserReviewForItem(args: userId, itemType, itemId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.reviews.getUserReviewForItem, { userId: /* value */, itemType: /* value */, itemId: /* value */ });
```

- mutation voteOnReview(args: reviewId, userId, voteType)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.reviews.voteOnReview);
await mutate({ reviewId: /* value */, userId: /* value */, voteType: /* value */ });
```

### convex/userPreferences.ts

- mutation deleteUserPreferences(args: userId)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.userPreferences.deleteUserPreferences);
await mutate({ userId: /* value */ });
```

- query getPopularPreferences(args: limit)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.userPreferences.getPopularPreferences, { limit: /* value */ });
```

- query getPreferencesCount()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.userPreferences.getPreferencesCount, {});
```

- query getUserPreferences(args: userId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.userPreferences.getUserPreferences, { userId: /* value */ });
```

- mutation saveUserPreferences(args: userId, preferences, tripDuration, tripDate, companions, interests, budget, dining, activities)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.userPreferences.saveUserPreferences);
await mutate({ userId: /* value */, preferences: /* value */, tripDuration: /* value */, tripDate: /* value */, companions: /* value */, interests: /* value */, budget: /* value */, dining: /* value */, activities: /* value */ });
```

### convex/wishlist.ts

- mutation addToWishlist(args: userId, itemType, itemId)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.wishlist.addToWishlist);
await mutate({ userId: /* value */, itemType: /* value */, itemId: /* value */ });
```

- query getUserWishlist(args: itemType)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.wishlist.getUserWishlist, { itemType: /* value */ });
```

- query getWishlistCount()
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.wishlist.getWishlistCount, {});
```

- query isInWishlist(args: userId, itemType, itemId)
  
  Example:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.wishlist.isInWishlist, { userId: /* value */, itemType: /* value */, itemId: /* value */ });
```

- mutation removeFromWishlist(args: userId, itemType, itemId)
  
  Example:
```tsx
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.wishlist.removeFromWishlist);
await mutate({ userId: /* value */, itemType: /* value */, itemId: /* value */ });
```
