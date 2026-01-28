const EnumInternalMaster = Object.freeze({
    ADMIN: 1,
    FRANCHISE: 2,
    CORPORATE: 3,
    BRANCH: 4,
    VENDOR: 5,
    CUSTOMER: 6,
    OWNED: 7,
    MARKET: 8,
    MANAGED: 9,
    ATTACHED: 10,
    OWNER: 11,
    BROKER: 12,
    MSG91: 13,
    MSG91_ALTERNATE: 14,
    QTY: 15,
    VEHICLE: 16,
    CONTRACTUAL: 17,
    ADHOC: 18,
    HIGH: 19,
    MEDIUM: 20,
    "USER REGISTRATION": 21,
    "RFQSAVE": 22,
    "FORGOTPASS": 23,
    "AWARDED": 24,
    "NOT AWARDED": 25,
    "Closed by Customer": 26,
    "Costing Late Received": 27,
    "Costing Not Received": 28,
    "Costing was on Higher Side": 29,
    "Vehicle Not Available": 30,
    "Any Other Reason": 31,
    "Sim": 32,
    "GPS": 33,
    "Driver App": 34,
    "LOGIN": 35,
    "LOGOUT": 36,
    "CREATE": 37,
    "UPDATE": 38,
    "DELETE": 39,
});

const EnumInternalMasterType = Object.freeze({
    COMPANY_TYPE: 1,
    PARTY_TYPE: 2,
    PARTY_CATEGORY: 3,
    RFQ_ON: 4,
    RFQ_TYPE: 5,
    RFQ_PRIORITY: 6,
    EVENT_TYPE: 7,
    VEHICLE_CATEGORY: 8,
    SMS_PROVIDER: 9,
    WHATSAPP_PROVIDER: 10,
    RFQ_STATUS: 11,
    FAILURE_REASONS: 12,
    TRACKING_TYPE: 13
});

const EnumProfile = Object.freeze({
    Admin: 1,
    Branch: 2,
    Corporate: 3,
    Franchise: 4,
    Vendor: 5,
    Driver: 6
});

const LogType = Object.freeze({
    Login: 35,
    Logout: 36,
    Create: 37,
    Update: 38,
    Delete: 39
});

const PrefixCode = Object.freeze({
    VI: "VI",
    RFQ: "RFQ",
    VP: "VP",
    BKG: "BKG",
    DLY: "DLY",
    LR: "LR"
});