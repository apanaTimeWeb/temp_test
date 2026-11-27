import type { StudentSampleProfile } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/config/manager_communication_whatsapp_templates.demo_data';

export const KNOWN_VARIABLE_ALIASES: Record<string, string> = {
  '{student_name}': '{name}',
  '{student}': '{name}',
  '{studentname}': '{name}',
  '{name_of_student}': '{name}',
  '{fee}': '{amount}',
  '{fee_amount}': '{amount}',
  '{fees}': '{amount}',
  '{due_date}': '{duedate}',
  '{date}': '{duedate}',
  '{expiry_date}': '{duedate}',
  '{valid_till}': '{duedate}',
  '{plan}': '{planname}',
  '{membership_plan}': '{planname}',
  '{branch}': '{libraryname}',
  '{branch_name}': '{libraryname}',
  '{library}': '{libraryname}',
  '{mobile}': '{phone}',
  '{contact}': '{phone}',
  '{phone_number}': '{phone}',
  '{seat_no}': '{seat}',
  '{seat_number}': '{seat}',
  '{cabin}': '{seat}',
};

export const STANDARD_VARIABLES = [
  '{name}',
  '{amount}',
  '{duedate}',
  '{planname}',
  '{libraryname}',
  '{phone}',
  '{seat}',
] as const;

export interface VariableDiagnostics {
  totalTokens: number;
  validTokens: string[];
  aliasTokens: { token: string; suggested: string }[];
  unknownTokens: string[];
  isAllValid: boolean;
}

export function analyzeVariables(body: string): VariableDiagnostics {
  const matches = body.match(/\{[^}]+\}/g) || [];
  const validTokens: string[] = [];
  const aliasTokens: { token: string; suggested: string }[] = [];
  const unknownTokens: string[] = [];

  for (const token of matches) {
    if ((STANDARD_VARIABLES as readonly string[]).includes(token)) {
      if (!validTokens.includes(token)) validTokens.push(token);
    } else if (KNOWN_VARIABLE_ALIASES[token]) {
      if (!aliasTokens.some((a) => a.token === token)) {
        aliasTokens.push({ token, suggested: KNOWN_VARIABLE_ALIASES[token] });
      }
    } else if (!unknownTokens.includes(token)) {
      unknownTokens.push(token);
    }
  }

  return {
    totalTokens: matches.length,
    validTokens,
    aliasTokens,
    unknownTokens,
    isAllValid: aliasTokens.length === 0 && unknownTokens.length === 0,
  };
}

export function renderTemplatePreviewText(body: string, activeProfile: StudentSampleProfile): string {
  let result = body
    .replace(/{name}/g, activeProfile.name)
    .replace(/{amount}/g, activeProfile.amount)
    .replace(/{duedate}/g, activeProfile.duedate)
    .replace(/{planname}/g, activeProfile.planname)
    .replace(/{libraryname}/g, activeProfile.libraryname)
    .replace(/{phone}/g, activeProfile.phone)
    .replace(/{seat}/g, activeProfile.seat);

  Object.entries(KNOWN_VARIABLE_ALIASES).forEach(([alias, standard]) => {
    const standardKey = standard.replace(/[{}]/g, '') as keyof StudentSampleProfile;
    const val = activeProfile[standardKey];
    if (typeof val === 'string') {
      result = result.replaceAll(alias, val);
    }
  });

  return result;
}
