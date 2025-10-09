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
    MSG91_ALTERNATE: 14
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