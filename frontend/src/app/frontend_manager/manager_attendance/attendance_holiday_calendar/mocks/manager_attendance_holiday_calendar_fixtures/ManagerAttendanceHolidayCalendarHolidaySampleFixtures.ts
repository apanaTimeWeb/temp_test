/**
 * Module-owned illustrative fixtures. These records are preview-only and are not live business data.
 */

export interface Holiday { id: string; date: string; name: string; type: string; }

export const MANAGER_ENGAGEMENT_SAMPLE_HOLIDAYS: Holiday[] = [
  { id:'1', date:'2026-04-14', name:'Dr. Ambedkar Jayanti',      type:'National'  },
  { id:'2', date:'2026-04-21', name:'Ram Navami',                type:'Religious' },
  { id:'3', date:'2026-05-01', name:'International Labour Day',  type:'National'  },
  { id:'4', date:'2026-08-15', name:'Independence Day',          type:'National'  },
  { id:'5', date:'2026-10-02', name:'Gandhi Jayanti',            type:'National'  },
];
