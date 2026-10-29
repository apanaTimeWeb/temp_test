/** Contract-gap fixture. It is not an HTTP handler and does not shadow another module's endpoint. */
export const MANAGERSUBSCRIPTIONSSUBSCRIPTIONS_CONTRACT_GAP_MOCK = {
  code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP',
  status: 501,
  message: 'The supplied frontend ZIP does not contain an authoritative API contract for manager_subscriptions.',
} as const;
