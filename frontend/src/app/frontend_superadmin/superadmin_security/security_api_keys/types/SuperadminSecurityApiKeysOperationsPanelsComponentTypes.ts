// FLOW: API Keys page -> operations panel props -> typed redacted API-key preview rows.
/** Responsibility: define the API Keys-only operations panel contract; sibling security workflows are outside this leaf. */
export type SuperadminSecurityApiKey = {
  id: string;
  name: string;
  prefix: string;
  lastUsed: string;
  status: string;
};

export interface SuperadminSecurityOperationsPanelsProps {
  apiKeys: readonly SuperadminSecurityApiKey[];
}
