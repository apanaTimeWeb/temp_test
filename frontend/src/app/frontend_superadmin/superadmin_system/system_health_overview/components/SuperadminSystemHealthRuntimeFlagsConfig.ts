export interface SystemRuntimeControls {
  apiRateLimiter: boolean;
  queueWorkers: boolean;
  dbReadReplicaRouter: boolean;
  webhookEgress: boolean;
  apmDistributedTracing: boolean;
  maintenanceGate: boolean;
}

export const INITIAL_FLAGS: SystemRuntimeControls = {
  apiRateLimiter: true,
  queueWorkers: true,
  dbReadReplicaRouter: true,
  webhookEgress: true,
  apmDistributedTracing: true,
  maintenanceGate: false,
};
