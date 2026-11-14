// FLOW: Feature source -> superadmin_system/system_health_overview/types/SuperadminSystemHealthOverviewTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin System Health Types; defines module-owned type contracts for the named data boundary. */
export interface SuperadminSystemHealthInfrastructureFixture {
  id: string;
  name: string;
  nameKey: string;
  type: 'Compute';
  usage: number;
  status: 'Healthy' | 'Warning';
  ping: string;
}

/**
 * Defines the public SuperadminSystemHealthDatabaseFixture contract for system health overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: string.
 * @property name Display label for the owning feature. Declared type: string.
 * @property nameKey Display label for the owning feature. Declared type: string.
 * @property type Value defined by the existing feature-local contract. Declared type: 'Database' | 'Cache' | 'Storage'.
 * @property status Status value as represented by the existing feature contract. Declared type: 'Healthy' | 'Warning'.
 * @property metric Value defined by the existing feature-local contract. Declared type: string.
 * @property metricKey Value defined by the existing feature-local contract. Declared type: string.
 * @property val Value defined by the existing feature-local contract. Declared type: string.
 * @property pct Value defined by the existing feature-local contract. Declared type: number.
 */
export interface SuperadminSystemHealthDatabaseFixture {
  id: string;
  name: string;
  nameKey: string;
  type: 'Database' | 'Cache' | 'Storage';
  status: 'Healthy' | 'Warning';
  metric: string;
  metricKey: string;
  val: string;
  pct: number;
}

/**
 * Defines the public SuperadminSystemHealthNetworkKpiFixture contract for system health overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: 'requests' | 'latency' | 'errors' | 'websockets'.
 * @property label Display label for the owning feature. Declared type: string.
 * @property labelKey Display label for the owning feature. Declared type: string.
 * @property value Value defined by the existing feature-local contract. Declared type: string.
 * @property unit Value defined by the existing feature-local contract. Declared type: string.
 * @property trend Value defined by the existing feature-local contract. Declared type: string.
 * @property trendKey Value defined by the existing feature-local contract. Declared type: string.
 */
export interface SuperadminSystemHealthNetworkKpiFixture {
  id: 'requests' | 'latency' | 'errors' | 'websockets';
  label: string;
  labelKey: string;
  value: string;
  unit: string;
  trend: string;
  trendKey: string;
}

/**
 * Defines the public SuperadminSystemHealthIntegrationFixture contract for system health overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: 'payment-gateway' | 'messaging-api' | 'backup-storage' | 'email-service'.
 * @property name Display label for the owning feature. Declared type: string.
 * @property nameKey Display label for the owning feature. Declared type: string.
 * @property status Status value as represented by the existing feature contract. Declared type: 'Not connected'.
 * @property statusKey Status value as represented by the existing feature contract. Declared type: string.
 * @property latency Value defined by the existing feature-local contract. Declared type: string.
 * @property uptime Timestamp or date value in the declared type; formatting is handled by the owning view. Declared type: string.
 */
export interface SuperadminSystemHealthIntegrationFixture {
  id: 'payment-gateway' | 'messaging-api' | 'backup-storage' | 'email-service';
  name: string;
  nameKey: string;
  status: 'Not connected';
  statusKey: string;
  latency: string;
  uptime: string;
}

/**
 * Defines the public SuperadminSystemHealthCronFixture contract for system health overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: 'database-backup' | 'subscription-renewal' | 'session-cleanup' | 'invoice-reminders'.
 * @property name Display label for the owning feature. Declared type: string.
 * @property nameKey Display label for the owning feature. Declared type: string.
 * @property schedule Value defined by the existing feature-local contract. Declared type: string.
 * @property scheduleKey Value defined by the existing feature-local contract. Declared type: string.
 * @property lastRun Value defined by the existing feature-local contract. Declared type: string.
 * @property lastRunKey Value defined by the existing feature-local contract. Declared type: string.
 * @property duration Value defined by the existing feature-local contract. Declared type: string.
 * @property status Status value as represented by the existing feature contract. Declared type: 'Not connected'.
 * @property statusKey Status value as represented by the existing feature contract. Declared type: string.
 */
export interface SuperadminSystemHealthCronFixture {
  id: 'database-backup' | 'subscription-renewal' | 'session-cleanup' | 'invoice-reminders';
  name: string;
  nameKey: string;
  schedule: string;
  scheduleKey: string;
  lastRun: string;
  lastRunKey: string;
  duration: string;
  status: 'Not connected';
  statusKey: string;
}
