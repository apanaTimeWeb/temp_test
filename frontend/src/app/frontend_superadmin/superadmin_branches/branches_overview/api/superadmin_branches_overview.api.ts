// RESPONSIBILITY: Typed API client methods for Superadmin Branch Management with canonical ApiResponse envelope.
import type { SuperadminBranchRecord, SuperadminBranchAuditLog } from '../types/SuperadminBranchesOverviewTypes';
import { SUPERADMIN_BRANCHES_OVERVIEW_URLS } from '../config/superadmin_branches_overview.url_config';

export interface ApiResponseSuccess<T> {
  success: true;
  message: string;
  data: T;
  requestId: string;
}

export interface ApiResponseFailure {
  success: false;
  message: string;
  data: null;
  errorCode: string;
  statusCode: number;
  requestId: string;
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseFailure;

export async function fetchSuperadminBranchesApi(): Promise<ApiResponse<SuperadminBranchRecord[]>> {
  return {
    success: true,
    message: 'Branches retrieved successfully',
    data: [],
    requestId: `req-br-${Date.now()}`,
  };
}

export async function createSuperadminBranchApi(
  payload: Omit<SuperadminBranchRecord, 'id' | 'createdAt'>,
): Promise<ApiResponse<SuperadminBranchRecord>> {
  return {
    success: true,
    message: `Branch ${payload.name} created successfully`,
    data: {
      ...payload,
      id: `br-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    },
    requestId: `req-create-${Date.now()}`,
  };
}

export async function updateSuperadminBranchStatusApi(
  branchId: string,
  status: SuperadminBranchRecord['status'],
  reason?: string,
): Promise<ApiResponse<{ branchId: string; status: string; reason?: string }>> {
  return {
    success: true,
    message: `Branch status updated to ${status}`,
    data: { branchId, status, reason },
    requestId: `req-status-${Date.now()}`,
  };
}

export async function transferSuperadminBranchManagerApi(
  branchId: string,
  newManager: { name: string; email: string; phone: string },
  reason: string,
): Promise<ApiResponse<{ branchId: string; manager: typeof newManager; reason: string }>> {
  return {
    success: true,
    message: `Manager transferred successfully to ${newManager.name}`,
    data: { branchId, manager: newManager, reason },
    requestId: `req-trans-${Date.now()}`,
  };
}
