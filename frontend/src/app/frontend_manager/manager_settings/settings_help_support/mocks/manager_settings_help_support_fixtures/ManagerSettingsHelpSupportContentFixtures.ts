/** Preview-only Help Center and announcement content; not a live feed. */
export const MANAGER_HELP_SUPPORT_SAMPLE_DOCUMENTATION_ARTICLES = [
  {
    id: 'group-admissions',
    category: 'Student Management',
    titleKey: 'how_to_handle_group_admissions',
    descriptionKey: 'learn_the_best_practices_for_onboarding_multiple_student_93c9b5',
    categoryLabelKey: 'student_management',
  },
] as const;

export const MANAGER_HELP_SUPPORT_SAMPLE_ANNOUNCEMENTS = [
  {
    id: 'late-fees',
    tagKey: 'announcement_sample_tag_new_feature',
    colorClass: 'bg-success-bg text-success border-success',
    date: '2026-10-01',
    titleKey: 'announcement_sample_late_fee_title',
    descriptionKey: 'announcement_sample_late_fee_desc',
  },
  {
    id: 'maintenance',
    tagKey: 'announcement_sample_tag_maintenance',
    colorClass: 'bg-warning-bg text-warning border-warning',
    date: '2026-09-25',
    titleKey: 'announcement_sample_maintenance_title',
    descriptionKey: 'announcement_sample_maintenance_desc',
  },
  {
    id: 'reports',
    tagKey: 'announcement_sample_tag_update',
    colorClass: 'bg-info-bg text-info border-info',
    date: '2026-09-10',
    titleKey: 'announcement_sample_reports_title',
    descriptionKey: 'announcement_sample_reports_desc',
  },
] as const;
