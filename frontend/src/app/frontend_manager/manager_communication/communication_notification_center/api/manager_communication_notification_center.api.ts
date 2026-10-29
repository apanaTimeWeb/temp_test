/** No authoritative manager_notification_center API contract exists in the supplied frontend ZIP. */
export const MANAGERNOTIFICATIONCENTERNOTIFICATIONCENTER_API_CONTRACT_STATUS = 'CONTRACT_NOT_FOUND_IN_WEB_ZIP' as const;
export function assertManagerCommunicationNotificationCenterApiContract(): never {
  throw Object.assign(new Error('CONTRACT_NOT_FOUND_IN_WEB_ZIP: no authoritative endpoint or response schema is supplied for manager_notification_center.'), { code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP' as const, status: 501 as const });
}
