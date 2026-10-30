/**
 * Canonical transport-level mock scenario registry for Admin Members Enquiries.
 *
 * Pass a real module-local populated fixture as `activeRecords`; the registry does not invent
 * business records, endpoints, permission rules, or DTOs. The returned values are scenario
 * descriptors/envelopes for a module-owned test adapter. They are not wired to production APIs.
 */
/** Demo-only fixture migrated from mocks/scenarios/admin_members_enquiries.scenarios.ts; values are preserved. */
export const ADMIN_MEMBERS_ENQUIRIES_HARDCODED_FIXTURE = {
  "enquiries": [
    {
      "id": "enq_001",
      "name": "Aarav Sharma",
      "phone": "9876500022",
      "shift": "Morning",
      "status": "New",
      "addedDate": "24 May",
      "source": "Google Ads",
      "handledBy": "Sarah Jenkins",
      "enquiryDate": "May 24, 2025",
      "preferredBranch": "Downtown Hub",
      "avatar": "AS",
      "isOverdue": true,
      "followUps": [
        {
          "id": "fu_001",
          "date": "Today, 10:45 AM",
          "time": "10:45 AM",
          "by": "Sarah Jenkins",
          "remark": "Called the student to discuss pricing. They are interested in a demo session tomorrow. Very high chance of conversion."
        },
        {
          "id": "fu_002",
          "date": "Oct 14, 2025",
          "time": "02:00 PM",
          "by": "System",
          "remark": "Automated WhatsApp brochure sent to the registered mobile number."
        },
        {
          "id": "fu_003",
          "date": "Oct 12, 2025",
          "time": "09:30 AM",
          "by": "Sarah Jenkins",
          "remark": "Initial enquiry captured via Google Ads. Needs morning shift availability check."
        }
      ]
    },
    {
      "id": "enq_002",
      "name": "Ishani Gupta",
      "phone": "9765444120",
      "shift": "Night",
      "status": "New",
      "addedDate": "25 May",
      "source": "Instagram",
      "handledBy": "Mike Ross",
      "enquiryDate": "May 25, 2025",
      "preferredBranch": "Uptown Branch",
      "avatar": "IG",
      "isToday": true,
      "followUps": [
        {
          "id": "fu_003",
          "date": "May 25, 2025",
          "time": "02:30 PM",
          "by": "Mike Ross",
          "remark": "Enquiry added. Follow-up scheduled for today evening."
        }
      ]
    },
    {
      "id": "enq_003",
      "name": "Rajiv Verma",
      "phone": "9123488330",
      "shift": "Evening",
      "status": "Visited",
      "addedDate": "22 May",
      "source": "Walk-in",
      "handledBy": "Sarah Jenkins",
      "enquiryDate": "May 22, 2025",
      "preferredBranch": "Downtown Hub",
      "avatar": "RV",
      "isUpcoming": true,
      "followUps": [
        {
          "id": "fu_004",
          "date": "May 23, 2025",
          "time": "11:00 AM",
          "by": "Sarah Jenkins",
          "remark": "Student visited the library. Liked the evening shift setup. Will confirm by weekend."
        },
        {
          "id": "fu_005",
          "date": "May 22, 2025",
          "time": "05:00 PM",
          "by": "Admin",
          "remark": "Walk-in enquiry. Showed interest in evening shift."
        }
      ]
    },
    {
      "id": "enq_004",
      "name": "Sneha Patel",
      "phone": "9901111000",
      "shift": "Morning",
      "status": "Converted",
      "addedDate": "25 May",
      "convertedDate": "Today",
      "source": "Referral",
      "handledBy": "Mike Ross",
      "enquiryDate": "May 25, 2025",
      "preferredBranch": "Downtown Hub",
      "avatar": "SP",
      "followUps": [
        {
          "id": "fu_006",
          "date": "May 26, 2025",
          "time": "12:00 PM",
          "by": "Mike Ross",
          "remark": "Admission confirmed. Fee collected. Seat allocated in morning shift."
        },
        {
          "id": "fu_007",
          "date": "May 25, 2025",
          "time": "10:00 AM",
          "by": "Mike Ross",
          "remark": "Referred by existing student Rohan Mehta. Very keen to join immediately."
        }
      ]
    },
    {
      "id": "enq_005",
      "name": "Vihaan Rao",
      "phone": "9677887780",
      "shift": "Evening",
      "status": "Interested",
      "addedDate": "26 May",
      "source": "WhatsApp",
      "handledBy": "Sarah Jenkins",
      "enquiryDate": "May 26, 2025",
      "preferredBranch": "Uptown Branch",
      "avatar": "VR",
      "isToday": true,
      "followUps": [
        {
          "id": "fu_008",
          "date": "May 26, 2025",
          "time": "08:00 PM",
          "by": "Sarah Jenkins",
          "remark": "Student messaged on WhatsApp. Interested in evening shift. Sent fee details and shift schedule."
        }
      ]
    },
    {
      "id": "enq_006",
      "name": "Priya Nair",
      "phone": "9812345670",
      "shift": "Full Day",
      "status": "Lost",
      "addedDate": "18 May",
      "source": "Phone Call",
      "handledBy": "Admin",
      "enquiryDate": "May 18, 2025",
      "preferredBranch": "Downtown Hub",
      "avatar": "PN",
      "followUps": [
        {
          "id": "fu_009",
          "date": "May 20, 2025",
          "time": "03:00 PM",
          "by": "Admin",
          "remark": "Called three times — no response. Marked as lost after 7-day follow-up window."
        },
        {
          "id": "fu_010",
          "date": "May 18, 2025",
          "time": "11:00 AM",
          "by": "Admin",
          "remark": "Phone call enquiry. Interested in full-day seat. Couldn't decide on fees."
        }
      ]
    }
  ],
  "staff": [
    {
      "id": "staff_001",
      "name": "Library Admin"
    },
    {
      "id": "staff_002",
      "name": "Sarah Jenkins"
    },
    {
      "id": "staff_003",
      "name": "Mike Ross"
    }
  ],
  "shifts": [
    {
      "id": "shift_001",
      "name": "Morning",
      "time": "6 AM – 12 PM"
    },
    {
      "id": "shift_002",
      "name": "Afternoon",
      "time": "12 PM – 5 PM"
    },
    {
      "id": "shift_003",
      "name": "Evening",
      "time": "5 PM – 10 PM"
    },
    {
      "id": "shift_004",
      "name": "Night",
      "time": "10 PM – 6 AM"
    },
    {
      "id": "shift_005",
      "name": "Full Day",
      "time": "6 AM – 10 PM"
    }
  ]
};

export const createAdminMembersEnquiriesScenarioCatalog = (activeRecords: unknown) => ({
  ACTIVE_RECORDS: {
    kind: 'http-response',
    status: 200,
    envelope: {
      success: true,
      message: 'Module-local populated fixture.',
      data: activeRecords,
      requestId: 'mock-active-records',
    },
  },
  EMPTY_DATA: {
    kind: 'http-response',
    status: 200,
    envelope: {
      success: true,
      message: 'No records returned by the empty-result scenario.',
      data: [],
      requestId: 'mock-empty-data',
    },
  },
  SERVER_500_ERROR: {
    kind: 'http-response',
    status: 500,
    envelope: {
      success: false,
      message: 'Simulated internal server error.',
      data: null,
      errorCode: 'ERR_INTERNAL_500',
      statusCode: 500,
      requestId: 'mock-server-500',
    },
  },
  NETWORK_TIMEOUT: {
    kind: 'delayed-http-response',
    delayMs: 15000,
    status: 504,
    envelope: {
      success: false,
      message: 'Simulated request timeout.',
      data: null,
      errorCode: 'ERR_TIMEOUT',
      statusCode: 504,
      requestId: 'mock-network-timeout',
    },
  },
  UNAUTHORIZED_401: {
    kind: 'http-response',
    status: 401,
    envelope: {
      success: false,
      message: 'Simulated unauthenticated request.',
      data: null,
      errorCode: 'ERR_UNAUTHORIZED',
      statusCode: 401,
      requestId: 'mock-unauthorized-401',
    },
  },
  FORBIDDEN_403: {
    kind: 'http-response',
    status: 403,
    envelope: {
      success: false,
      message: 'Simulated authenticated request without permission.',
      data: null,
      errorCode: 'ERR_FORBIDDEN',
      statusCode: 403,
      requestId: 'mock-forbidden-403',
    },
  },
  NETWORK_ERROR: {
    kind: 'transport-error',
    transport: 'fetch-rejection',
    message: 'Simulated network failure without an HTTP response.',
  },
  INVALID_RESPONSE: {
    kind: 'malformed-success-envelope',
    status: 200,
    envelope: {
      success: true,
      message: 'Deliberately malformed response: required data and requestId are absent.',
    },
  },
} as const);
