/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as admin_functions from "../admin_functions.js";
import type * as auth from "../auth.js";
import type * as clerk from "../clerk.js";
import type * as crons from "../crons.js";
import type * as domains_accommodations_index from "../domains/accommodations/index.js";
import type * as domains_accommodations_mutations from "../domains/accommodations/mutations.js";
import type * as domains_accommodations_queries from "../domains/accommodations/queries.js";
import type * as domains_accommodations_types from "../domains/accommodations/types.js";
import type * as domains_activities_index from "../domains/activities/index.js";
import type * as domains_activities_mutations from "../domains/activities/mutations.js";
import type * as domains_activities_queries from "../domains/activities/queries.js";
import type * as domains_activities_types from "../domains/activities/types.js";
import type * as domains_activities_utils from "../domains/activities/utils.js";
import type * as domains_audit_cron from "../domains/audit/cron.js";
import type * as domains_audit_mutations from "../domains/audit/mutations.js";
import type * as domains_audit_queries from "../domains/audit/queries.js";
import type * as domains_audit_types from "../domains/audit/types.js";
import type * as domains_audit_utils from "../domains/audit/utils.js";
import type * as domains_bookings_index from "../domains/bookings/index.js";
import type * as domains_bookings_mutations from "../domains/bookings/mutations.js";
import type * as domains_bookings_queries from "../domains/bookings/queries.js";
import type * as domains_bookings_types from "../domains/bookings/types.js";
import type * as domains_bookings_utils from "../domains/bookings/utils.js";
import type * as domains_chat_index from "../domains/chat/index.js";
import type * as domains_chat_mutations from "../domains/chat/mutations.js";
import type * as domains_chat_queries from "../domains/chat/queries.js";
import type * as domains_email_actions from "../domains/email/actions.js";
import type * as domains_email_config from "../domains/email/config.js";
import type * as domains_email_index from "../domains/email/index.js";
import type * as domains_email_mutations from "../domains/email/mutations.js";
import type * as domains_email_queries from "../domains/email/queries.js";
import type * as domains_email_service from "../domains/email/service.js";
import type * as domains_email_templates from "../domains/email/templates.js";
import type * as domains_email_types from "../domains/email/types.js";
import type * as domains_events_actions from "../domains/events/actions.js";
import type * as domains_events_index from "../domains/events/index.js";
import type * as domains_events_mutations from "../domains/events/mutations.js";
import type * as domains_events_queries from "../domains/events/queries.js";
import type * as domains_events_types from "../domains/events/types.js";
import type * as domains_events_utils from "../domains/events/utils.js";
import type * as domains_index from "../domains/index.js";
import type * as domains_integrations_clerk from "../domains/integrations/clerk.js";
import type * as domains_media_index from "../domains/media/index.js";
import type * as domains_media_mutations from "../domains/media/mutations.js";
import type * as domains_media_queries from "../domains/media/queries.js";
import type * as domains_media_types from "../domains/media/types.js";
import type * as domains_media_utils from "../domains/media/utils.js";
import type * as domains_notifications_actions from "../domains/notifications/actions.js";
import type * as domains_notifications_mutations from "../domains/notifications/mutations.js";
import type * as domains_notifications_queries from "../domains/notifications/queries.js";
import type * as domains_notifications_types from "../domains/notifications/types.js";
import type * as domains_packages_index from "../domains/packages/index.js";
import type * as domains_packages_mutations from "../domains/packages/mutations.js";
import type * as domains_packages_queries from "../domains/packages/queries.js";
import type * as domains_packages_types from "../domains/packages/types.js";
import type * as domains_packages_utils from "../domains/packages/utils.js";
import type * as domains_payments_actions from "../domains/payments/actions.js";
import type * as domains_payments_crons from "../domains/payments/crons.js";
import type * as domains_payments_queries from "../domains/payments/queries.js";
import type * as domains_rbac_action from "../domains/rbac/action.js";
import type * as domains_rbac_functions from "../domains/rbac/functions.js";
import type * as domains_rbac_index from "../domains/rbac/index.js";
import type * as domains_rbac_mutation from "../domains/rbac/mutation.js";
import type * as domains_rbac_mutations from "../domains/rbac/mutations.js";
import type * as domains_rbac_queries from "../domains/rbac/queries.js";
import type * as domains_rbac_query from "../domains/rbac/query.js";
import type * as domains_rbac_test from "../domains/rbac/test.js";
import type * as domains_rbac_types from "../domains/rbac/types.js";
import type * as domains_rbac_utils from "../domains/rbac/utils.js";
import type * as domains_recommendations_cacheQueries from "../domains/recommendations/cacheQueries.js";
import type * as domains_recommendations_index from "../domains/recommendations/index.js";
import type * as domains_recommendations_mutations from "../domains/recommendations/mutations.js";
import type * as domains_recommendations_queries from "../domains/recommendations/queries.js";
import type * as domains_reports_actions from "../domains/reports/actions.js";
import type * as domains_reports_queries from "../domains/reports/queries.js";
import type * as domains_restaurants_index from "../domains/restaurants/index.js";
import type * as domains_restaurants_mutations from "../domains/restaurants/mutations.js";
import type * as domains_restaurants_queries from "../domains/restaurants/queries.js";
import type * as domains_restaurants_types from "../domains/restaurants/types.js";
import type * as domains_restaurants_utils from "../domains/restaurants/utils.js";
import type * as domains_support_mutations from "../domains/support/mutations.js";
import type * as domains_support_queries from "../domains/support/queries.js";
import type * as domains_systemSettings_index from "../domains/systemSettings/index.js";
import type * as domains_systemSettings_mutations from "../domains/systemSettings/mutations.js";
import type * as domains_systemSettings_queries from "../domains/systemSettings/queries.js";
import type * as domains_systemSettings_types from "../domains/systemSettings/types.js";
import type * as domains_users_actions from "../domains/users/actions.js";
import type * as domains_users_helpers from "../domains/users/helpers.js";
import type * as domains_users_index from "../domains/users/index.js";
import type * as domains_users_mutations from "../domains/users/mutations.js";
import type * as domains_users_queries from "../domains/users/queries.js";
import type * as domains_users_types from "../domains/users/types.js";
import type * as domains_users_utils from "../domains/users/utils.js";
import type * as domains_vehicles_mutations from "../domains/vehicles/mutations.js";
import type * as domains_vehicles_queries from "../domains/vehicles/queries.js";
import type * as functions from "../functions.js";
import type * as http from "../http.js";
import type * as openaiActions from "../openaiActions.js";
import type * as packageComparison from "../packageComparison.js";
import type * as packages from "../packages.js";
import type * as rbac from "../rbac.js";
import type * as recommendations from "../recommendations.js";
import type * as reviews from "../reviews.js";
import type * as shared_index from "../shared/index.js";
import type * as shared_rateLimiting from "../shared/rateLimiting.js";
import type * as shared_rbac from "../shared/rbac.js";
import type * as shared_validators from "../shared/validators.js";
import type * as types from "../types.js";
import type * as userPreferences from "../userPreferences.js";
import type * as wishlist from "../wishlist.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  admin_functions: typeof admin_functions;
  auth: typeof auth;
  clerk: typeof clerk;
  crons: typeof crons;
  "domains/accommodations/index": typeof domains_accommodations_index;
  "domains/accommodations/mutations": typeof domains_accommodations_mutations;
  "domains/accommodations/queries": typeof domains_accommodations_queries;
  "domains/accommodations/types": typeof domains_accommodations_types;
  "domains/activities/index": typeof domains_activities_index;
  "domains/activities/mutations": typeof domains_activities_mutations;
  "domains/activities/queries": typeof domains_activities_queries;
  "domains/activities/types": typeof domains_activities_types;
  "domains/activities/utils": typeof domains_activities_utils;
  "domains/audit/cron": typeof domains_audit_cron;
  "domains/audit/mutations": typeof domains_audit_mutations;
  "domains/audit/queries": typeof domains_audit_queries;
  "domains/audit/types": typeof domains_audit_types;
  "domains/audit/utils": typeof domains_audit_utils;
  "domains/bookings/index": typeof domains_bookings_index;
  "domains/bookings/mutations": typeof domains_bookings_mutations;
  "domains/bookings/queries": typeof domains_bookings_queries;
  "domains/bookings/types": typeof domains_bookings_types;
  "domains/bookings/utils": typeof domains_bookings_utils;
  "domains/chat/index": typeof domains_chat_index;
  "domains/chat/mutations": typeof domains_chat_mutations;
  "domains/chat/queries": typeof domains_chat_queries;
  "domains/email/actions": typeof domains_email_actions;
  "domains/email/config": typeof domains_email_config;
  "domains/email/index": typeof domains_email_index;
  "domains/email/mutations": typeof domains_email_mutations;
  "domains/email/queries": typeof domains_email_queries;
  "domains/email/service": typeof domains_email_service;
  "domains/email/templates": typeof domains_email_templates;
  "domains/email/types": typeof domains_email_types;
  "domains/events/actions": typeof domains_events_actions;
  "domains/events/index": typeof domains_events_index;
  "domains/events/mutations": typeof domains_events_mutations;
  "domains/events/queries": typeof domains_events_queries;
  "domains/events/types": typeof domains_events_types;
  "domains/events/utils": typeof domains_events_utils;
  "domains/index": typeof domains_index;
  "domains/integrations/clerk": typeof domains_integrations_clerk;
  "domains/media/index": typeof domains_media_index;
  "domains/media/mutations": typeof domains_media_mutations;
  "domains/media/queries": typeof domains_media_queries;
  "domains/media/types": typeof domains_media_types;
  "domains/media/utils": typeof domains_media_utils;
  "domains/notifications/actions": typeof domains_notifications_actions;
  "domains/notifications/mutations": typeof domains_notifications_mutations;
  "domains/notifications/queries": typeof domains_notifications_queries;
  "domains/notifications/types": typeof domains_notifications_types;
  "domains/packages/index": typeof domains_packages_index;
  "domains/packages/mutations": typeof domains_packages_mutations;
  "domains/packages/queries": typeof domains_packages_queries;
  "domains/packages/types": typeof domains_packages_types;
  "domains/packages/utils": typeof domains_packages_utils;
  "domains/payments/actions": typeof domains_payments_actions;
  "domains/payments/crons": typeof domains_payments_crons;
  "domains/payments/queries": typeof domains_payments_queries;
  "domains/rbac/action": typeof domains_rbac_action;
  "domains/rbac/functions": typeof domains_rbac_functions;
  "domains/rbac/index": typeof domains_rbac_index;
  "domains/rbac/mutation": typeof domains_rbac_mutation;
  "domains/rbac/mutations": typeof domains_rbac_mutations;
  "domains/rbac/queries": typeof domains_rbac_queries;
  "domains/rbac/query": typeof domains_rbac_query;
  "domains/rbac/test": typeof domains_rbac_test;
  "domains/rbac/types": typeof domains_rbac_types;
  "domains/rbac/utils": typeof domains_rbac_utils;
  "domains/recommendations/cacheQueries": typeof domains_recommendations_cacheQueries;
  "domains/recommendations/index": typeof domains_recommendations_index;
  "domains/recommendations/mutations": typeof domains_recommendations_mutations;
  "domains/recommendations/queries": typeof domains_recommendations_queries;
  "domains/reports/actions": typeof domains_reports_actions;
  "domains/reports/queries": typeof domains_reports_queries;
  "domains/restaurants/index": typeof domains_restaurants_index;
  "domains/restaurants/mutations": typeof domains_restaurants_mutations;
  "domains/restaurants/queries": typeof domains_restaurants_queries;
  "domains/restaurants/types": typeof domains_restaurants_types;
  "domains/restaurants/utils": typeof domains_restaurants_utils;
  "domains/support/mutations": typeof domains_support_mutations;
  "domains/support/queries": typeof domains_support_queries;
  "domains/systemSettings/index": typeof domains_systemSettings_index;
  "domains/systemSettings/mutations": typeof domains_systemSettings_mutations;
  "domains/systemSettings/queries": typeof domains_systemSettings_queries;
  "domains/systemSettings/types": typeof domains_systemSettings_types;
  "domains/users/actions": typeof domains_users_actions;
  "domains/users/helpers": typeof domains_users_helpers;
  "domains/users/index": typeof domains_users_index;
  "domains/users/mutations": typeof domains_users_mutations;
  "domains/users/queries": typeof domains_users_queries;
  "domains/users/types": typeof domains_users_types;
  "domains/users/utils": typeof domains_users_utils;
  "domains/vehicles/mutations": typeof domains_vehicles_mutations;
  "domains/vehicles/queries": typeof domains_vehicles_queries;
  functions: typeof functions;
  http: typeof http;
  openaiActions: typeof openaiActions;
  packageComparison: typeof packageComparison;
  packages: typeof packages;
  rbac: typeof rbac;
  recommendations: typeof recommendations;
  reviews: typeof reviews;
  "shared/index": typeof shared_index;
  "shared/rateLimiting": typeof shared_rateLimiting;
  "shared/rbac": typeof shared_rbac;
  "shared/validators": typeof shared_validators;
  types: typeof types;
  userPreferences: typeof userPreferences;
  wishlist: typeof wishlist;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
