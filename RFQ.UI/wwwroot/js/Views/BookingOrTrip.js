const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('LinkId');
var myDropzone;
var bookingDrpList;
var companyId;
var profileId;
var locationId;
var orderColumn = '';
var orderDir = '';
var fetchBookingUrl = '/BookingOrTrip/GetAllBookingOrTrip';
let additionalInvoiceList = [];

$(document).ready(function () {
    companyId = getCookieValue('companyid');
    profileId = getCookieValue('profileid');
    locationId = getCookieValue('locationid');
    additionalInvoiceList = [];

    GetAllDriver();
    GetAllVehicleNumber();
    GetAllPakingType("ddlPackingType");
    GetAllCustomer("ddlCustomerName", companyId);
    GetAllVehicleType("ddlVehicleType", companyId);
    GetAllItemName("ddlItemName", companyId);
    GetAllLocation("ddlLocation", companyId);
    GetAllStateList("ddlBillState");
    GetAllConsignorList();
    GetAllConsigneeList();
    GetTrakingType();
    GetAllPlacementNo();
    FetchBookingOrTrip();
    ButtonUpdateClick();
    btnDeleteInvoiceClick();

    $('#tableDivLink').on('click', function (e) {
        FetchBookingOrTrip();
    });

    $("#btnCancel").on("click", function () {
        FetchBookingOrTrip();
    });

    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir); // update for next click

        $('th.sortable').not(this).data('order', 'asc');

        FetchDataForTable('BookingTable', fetchBookingUrl, orderColumn, orderDir.toUpperCase(), 'UpdateBooking', 'DeleteBooking', 'bookingId');
    });

    $("#btnSaveForm, #btnSaveAndNewForm").on('click', function () {
        $(this).prop('disabled', true);
        var action = $(this).data('action');
        if (OnSubmitCheckValidation()) {
            SaveBookingOrTrip(action);
        }
    });

    $("#additionalInvoiceDetails").on('click', '#tfBtnAddInvoice', function () {
        btnAddInvoiceClick();
    });
});

$('#btnAdd').click(function () {
    $('#formDiv').css("display", "block");
    $('#tableDiv').css("display", "none");
});
function FetchBookingOrTrip() {
    $("#tableDiv").css('display', 'block');
    $("#formDiv").css('display', 'none');
    resetBookingForm();
    $("#btnSaveForm").show();
    $("#btnUpdate").hide();
    $("#btnSaveAndNewForm").show();
    GetAllConsignorList();
    GetAllConsigneeList();
    FetchDataForTable('BookingTable', fetchBookingUrl, orderColumn, orderDir.toUpperCase(), 'UpdateBooking', 'DeleteBooking', 'bookingId');
}

$('#ddlPlacementNo').on('change', function () {
    const value = $(this).val();
    if (IsNullOrEmpty(value)) {
        AutoFetch();
    }
});

$('#BookingTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchBookingOrTrip();
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchBookingOrTrip();
});

$("#ddlLocation").on("change", async function () {
    const locationId = $(this).val();
    if (IsNullOrEmpty(locationId)) return;
    const locationData = await GetLocationById(locationId);
    if (!locationData || !locationData.code) {
        console.log("Location code not found");
        return;
    }
    const code = await GetAutoGenerateCode(locationData.code, PrefixCode.LR);
    $("#ddlLrNo").val(code);
});


function OnSubmitCheckValidation() {
    if (!isValidateSelect($("#ddlLocation").val())) {
        toastr.warning("Please Select a Booking Branch", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlLrNo").val())) {
        toastr.warning("Please Select a LR No", "Validation Error");
    }
    if (IsNullOrEmpty($("#lrDate").val())) {
        toastr.warning("Please enter a LR Date", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlPlacementNo").val())) {
        toastr.warning("Please Select a Indent/Placement No", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlBillState").val())) {
        toastr.warning("Please Select a E-Way Bill State", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlBusinessVertical").val())) {
        toastr.warning("Please Select a Business Vertical", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtBillNo").val())) {
        toastr.warning("Please enter a E-Way Bill No", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#from-search-box").val())) {
        toastr.warning("Please enter a Origin/From", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#to-search-box").val())) {
        toastr.warning("Please enter a Destination/To", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlCustomerName").val())) {
        toastr.warning("Please Select a Customer Name", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlVehicleNo").val())) {
        toastr.warning("Please Select a Vehicle No", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlVehicleType").val())) {
        toastr.warning("Please Select a Vehicle Type", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlDriverName").val())) {
        toastr.warning("Please Select a Driver Name", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtMobileNo").val())) {
        toastr.warning("Please enter a Mobile No", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlTrackingType").val())) {
        toastr.warning("Please select a Tracking Type", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#invoiceNo").val())) {
        toastr.warning("Please enter a Invoice No", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#invoiceDate").val())) {
        toastr.warning("Please enter a Invoice Date", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtInvoiceValue").val())) {
        toastr.warning("Please enter a Invoice Value", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtEwayBillNo").val())) {
        toastr.warning("Please enter a E-Way Bill No", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#ewayBillDate").val())) {
        toastr.warning("Please enter a E-Way Bill Date", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#expiryDate").val())) {
        toastr.warning("Please enter a Expiry Date", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtTransitDays").val())) {
        toastr.warning("Please enter a Transit Days", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#eddDate").val())) {
        toastr.warning("Please enter a EDD", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlItemName").val())) {
        toastr.warning("Please enter a Item Name", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlPackingType").val())) {
        toastr.warning("Please enter a Packing Type", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtTotalPkgs").val())) {
        toastr.warning("Please enter a Total Pkgs", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtActualWt").val())) {
        toastr.warning("Please enter a Actual Wt", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtChargedWt").val())) {
        toastr.warning("Please enter a Charged Wt", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtTotalFreight").val())) {
        toastr.warning("Please enter a Total Freight", "Validation Error");
        return false;
    }
    return true;
}
function GetAllConsignorList() {
    var getUrl = '/Vendor/GetAllVendorList'
    $.ajax({
        url: getUrl,
        type: "GET",
        data: { companyId: companyId },
        contentType: "application/json",
        success: function (response) {
            const consignorListDropdown = document.getElementById("ddlConsignorInput");
            consignorListDropdown.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
            placeholderOption.textContent = "Select Consignor";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            consignorListDropdown.appendChild(placeholderOption);
            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.partyId;
                option.textContent = item.partyName;
                consignorListDropdown.appendChild(option);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Consignor Name!", "Error");
            $("#ddlLocation").val()
        }
    });
};
function GetAllConsigneeList() {
    $.ajax({
        url: '/Customer/GetDrpCustomerList',
        type: "GET",
        data: { companyId: companyId },
        dataType: "json",
        success: function (response) {
            const selectConsignee = document.getElementById("ddlConsigneeInput");
            selectConsignee.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
            placeholderOption.textContent = "Select Consignee";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectConsignee.appendChild(placeholderOption);
            response.forEach(name => {
                const option = document.createElement("option");
                option.value = name.partyId;
                option.textContent = name.partyName;
                selectConsignee.appendChild(option);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Consignee Name!", "Error");
        }
    });
}
function GetAllDriver() {
    $.ajax({
        url: '/Driver/GetAllDriverList',
        type: "GET",
        dataType: "json",
        success: function (response) {
            var data = response
            const selectLocation = document.getElementById("ddlDriverName");
            selectLocation.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
            placeholderOption.textContent = "Select Driver";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectLocation.appendChild(placeholderOption);
            data.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.driverId;
                opt.textContent = option.driverName;
                selectLocation.appendChild(opt);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function GetAllVehicleNumber() {
    $.ajax({
        url: '/Vehicle/GetVehicleNumber',
        type: "GET",
        dataType: "json",
        success: function (response) {
            var data = response
            const selectVehicleNumber = document.getElementById("ddlVehicleNo");
            selectVehicleNumber.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
            placeholderOption.textContent = "Select Vehicle No";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectVehicleNumber.appendChild(placeholderOption);
            data.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.vehicleId;
                opt.textContent = option.vehicleNo;
                selectVehicleNumber.appendChild(opt);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function GetTrakingType() {
    var getInternalMasterUrl = '/Vendor/GetAllInternalMaster'
    $.ajax({
        url: getInternalMasterUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            let internalData = response.filter(x => x.internalMasterTypeId == EnumInternalMasterType.TRACKING_TYPE);
            const select = document.getElementById("ddlTrackingType");
            select.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
            placeholderOption.textContent = "Select a Tracking Type";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            select.appendChild(placeholderOption);

            internalData.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.internalMasterId;
                opt.textContent = option.internalMasterName;
                select.appendChild(opt);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function GetAllPlacementNo() {
    $.ajax({
        url: '/VehiclePlacement/GetAllVehiclePlacementNo',
        type: "GET",
        dataType: "json",
        success: function (response) {
            bookingDrpList = response.result;
            const ddlPlacementNo = document.getElementById("ddlPlacementNo");
            ddlPlacementNo.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
            placeholderOption.textContent = "Select placement No";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            ddlPlacementNo.appendChild(placeholderOption);
            bookingDrpList.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.placementId;
                opt.textContent = option.placementNo;
                ddlPlacementNo.appendChild(opt);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}

async function FetchLRNo() {
    try {
        const response = await $.ajax({
            url: "/BookingOrTrip/GenerateLRNo",
            type: "GET",
            contentType: "application/json"
        });
        $("#ddlLrNo").val(response.result);

    } catch (error) {
        toastr.error("Failed to Fetch LR No!", "Error");
    }
}

function GetDropdownValue(inputId) {
    let result;
    if ($("#" + inputId).val() == null) {
        return result = {
            id: 0,
            name: ""
        }
    }
    const selectedValue = $("#" + inputId).val();
    const selectedText = $("#" + inputId).find("option:selected").text();

    if (selectedValue === selectedText) {
        result = {
            id: 0,
            name: selectedValue
        };
    } else {
        result = {
            id: selectedValue,
            name: selectedText
        };
    }
    return result;
}
function SaveBookingOrTrip(action) {
    var saveUrl = '/BookingOrTrip/AddBookingOrTrip';
    var consignorResult = GetDropdownValue("ddlConsignorInput");
    var consigneeResult = GetDropdownValue("ddlConsigneeInput");

    const today = formatDate(new Date());
    const formData = {
        BookingId: 0,
        BookingNo: $('#ddlLrNo').val() ?? "",
        CompanyId: Number($('#ddlCompany').val() ?? 0),
        LocationId: Number($('#ddlLocation').val() ?? 0),
        BookingDate: $('#lrDate').val() || today,
        PlacementId: Number($('#ddlPlacementNo').val() ?? 0),
        EWayBillStateId: Number($('#ddlBillState').val() ?? 0),
        BusinessVerticalId: Number($('#ddlBusinessVertical').val() ?? 0),
        FromLocation: $('#from-search-box').val() ?? "",
        FromLongitude: $('#fromLng').val() ?? "",
        FromLatitude: $('#fromLat').val() ?? "",
        ToLocation: $("#to-search-box").val() ?? "",
        ToLatitude: $('#toLat').val() ?? "",
        ToLongitude: $('#toLng').val() ?? "",
        PartyId: Number($('#ddlCustomerName').val() ?? 0),
        VehicleTypeId: Number($('#ddlVehicleType').val() ?? 0),
        VehicleNo: $('#ddlVehicleNo').val() ?? "",
        DriverId: Number($('#ddlDriverName').val() ?? 0),
        DriverName: $('#ddlDriverName option:selected').text() ?? "",
        DriverMobNo: $('#txtMobileNo').val() ?? "",
        TrackingTypeId: Number($('#ddlTrackingType').val() ?? 0),
        InvoiceNo: $('#invoiceNo').val() || null,
        InvoiceDate: $('#invoiceDate').val() || today,
        InvoiceValue: Number($('#txtInvoiceValue').val() ?? 0),
        EWayBillNo: $('#txtBillNo').val() || null,
        EWayBillDate: $('#ewayBillDate').val() || today,
        EWayBillExpiryDate: $('#expiryDate').val() || today,
        ConsignerId: consignorResult?.id ?? 0,
        ConsignerName: consignorResult?.name ?? "",
        ConsigneeId: consigneeResult?.id ?? 0,
        ConsigneeName: consigneeResult?.name ?? "",
        TransitDays: Number($('#txtTransitDays').val() ?? 0),
        EDD: $('#eddDate').val() || today,
        ItemId: Number($('#ddlItemName').val() ?? 0),
        PackingTypeId: Number($('#ddlPackingType').val() ?? 0),
        TotalPacket: Number($('#txtTotalPkgs').val() ?? 0),
        ActualWeight: Number($('#txtActualWt').val() ?? 0),
        ChargedWeight: Number($('#txtChargedWt').val() ?? 0),
        TotalFreight: Number($('#txtTotalFreight').val() ?? 0),
        LinkId: Number(GetQueryParam("LinkId") ?? 0),
        BookingInvoiceDetailList: additionalInvoiceList ?? []
    };

    console.log(formData);
    if (action === "save") {
        $.ajax({
            url: saveUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response) {
                    $("#btnSaveForm").prop('disabled', false);
                    $("#btnSaveAndNewForm").prop('disabled', false);
                    toastr.success("Booking Or Trip Saved Successfully!", "Success");
                    addMasterUserActivityLog(0, LogType.Create, "Booking Or Trip Saved Successfully!", 0);
                    if (typeof this.completeOnSuccess === "function") {
                        this.completeOnSuccess();
                    }
                } else {
                    toastr.error("Failed to Submit Booking Or Trip Details.", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Vehicle Indent Details.", "Error");
            },
            completeOnSuccess: function () {
                FetchBookingOrTrip();
            }
        });
    }
    else if (action === "saveNew") {
        $.ajax({
            url: saveUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response) {
                    toastr.success("Vehicle Indent Saved Successfully!", "Success");
                    addMasterUserActivityLog(0, LogType.Create, "Vehicle Indent Saved Successfully!", 0);
                    $("#btnSaveForm").prop('disabled', false);
                    $("#btnSaveAndNewForm").prop('disabled', false);
                    $('#vehicleIndentForm')[0].reset();
                    $('.select2-custom').val(null).trigger('change');
                    FetchIndentNo();

                    if (profileId == EnumProfile.Branch) {
                        $('#ddlLocation').val(Number(locationId)).trigger('change');
                        $('#ddlLocation').prop('disabled', true);
                    }
                    else {
                        $('#ddlLocation').val(null).trigger('change');
                        $('#ddlLocation').prop('disabled', false);
                    }

                } else {
                    toastr.error("Failed to Submit Vehicle Indent Details.", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Vehicle Indent Details.", "Error");
            }
        });
    }
}
function UpdateBooking(bookingId) {
    if ($("#btnUpdate").hasClass('d-none')) {
        $("#btnUpdate").removeClass('d-none');
    }
    var data = viewModelDto.filter(x => x.bookingId == bookingId);
    var formData = data[0];
    $('#tableDiv').css('display', 'none');
    $("#formDiv").css('display', 'Block');
    $("#backButton").css('display', 'none');
    $("#formDiv").css('display', 'Block');
    $("#btnSaveForm").hide();
    $("#btnUpdate").show();
    $("#btnView").hide();
    $("#btnCancel").removeClass('d-none');
    $("#btnSaveAndNewForm").hide();
    $("#txtBookingId").val(formData.bookingId);
    $("#ddlLocation").val(formData.locationId).trigger('change');
    $("#ddlLrNo").val(formData.bookingNo);
    $("#lrDate").val(FormatDateToLocal(formData.bookingDate));
    $("#ddlPlacementNo").val(formData.placementId).trigger('change');
    $("#ddlBillState").val(formData.eWayBillStateId).trigger('change');
    $("#ddlBusinessVertical").val(formData.businessVerticalId).trigger('change');
    $("#txtBillNo").val(formData.eWayBillNo);
    $("#from-search-box").val(formData.fromLocation);
    //$("#fromState").val(formData.fromLocationState);
    //$("#fromCity").val(formData.fromLocationCity);
    $("#fromLat").val(formData.fromLatitude);
    $("#fromLng").val(formData.fromLongitude);
    $("#to-search-box").val(formData.toLocation);
    //$("#toState").val(formData.toLocationState);
    //$("#toCity").val(formData.toLocationCity);
    $("#toLat").val(formData.toLatitude);
    $("#toLng").val(formData.toLongitude);
    $("#ddlCustomerName").val(formData.partyId).trigger('change');
    if ($("#ddlVehicleNo option[value='" + formData.vehicleNo + "']").length === 0) {
        $('#ddlVehicleNo').append(new Option(formData.vehicleNo, formData.vehicleNo, true, true));
    }
    $('#ddlVehicleNo').val(formData.vehicleNo).trigger('change');
    $("#ddlVehicleType").val(formData.vehicleTypeId).trigger('change');
    $("#ddlDriverName").val(formData.driverId).trigger('change');
    var DriverName = $('#ddlDriverName option:selected').text();
    $("#txtMobileNo").val(formData.driverMobNo);
    $("#ddlTrackingType").val(formData.internalMasterId).trigger('change');
    $("#invoiceNo").val(formData.invoiceNo);
    $("#invoiceDate").val(FormatDateToLocal(formData.invoiceDate));
    $("#txtInvoiceValue").val(formData.invoiceValue);
    $("#ewayBillDate").val(FormatDateToLocal(formData.eWayBillDate));
    $("#expiryDate").val(FormatDateToLocal(formData.eWayBillExpiryDate));
    if (formData.consignerId == 0 && formData.consignerName) {
        if ($("#ddlConsignorInput").find("option[value='" + formData.consignerName + "']").length === 0) {
            var newOption = new Option(formData.consignerName, formData.consignerName, true, true);
            $("#ddlConsignorInput").append(newOption).trigger("change");
        } else {
            $("#ddlConsignorInput").val(formData.consignerName).trigger("change");
        }
    }
    else if (formData.consignerId == 0) {
        $("#ddlConsignorInput").val(0).trigger("change");
    }
    else {
        $("#ddlConsignorInput").val(formData.consignerId).trigger("change");
    }
    if (formData.consigneeId == 0 && formData.consigneeName) {
        if ($("#ddlConsigneeInput").find("option[value='" + formData.consigneeName + "']").length === 0) {
            var newOption = new Option(formData.consigneeName, formData.consigneeName, true, true);
            $("#ddlConsigneeInput").append(newOption).trigger("change");
        } else {
            $("#ddlConsigneeInput").val(formData.consigneeName).trigger("change");
        }
    }
    else if (formData.consignerId == 0) {
        $("#ddlConsigneeInput").val(0).trigger("change");
    }
    else {
        $("#ddlConsigneeInput").val(formData.consigneeId).trigger("change");
    }
    $("#txtTransitDays").val(formData.transitDays);
    $("#eddDate").val(FormatDateToLocal(formData.edd));
    $("#ddlItemName").val(formData.itemId).trigger('change');
    $("#ddlPackingType").val(formData.packingTypeId).trigger('change');
    $("#txtTotalPkgs").val(formData.totalPacket);
    $("#txtActualWt").val(formData.actualWeight);
    $("#txtChargedWt").val(formData.chargedWeight);
    $("#txtTotalFreight").val(formData.totalFreight);
}
function ButtonUpdateClick() {
    $("#btnUpdate").on('click', function (e) {
        e.preventDefault();
        var isValid = OnSubmitCheckValidation();
        if (!isValid) {
            return;
        }
        var consignorResult = GetDropdownValue("ddlConsignorInput");
        var consigneeResult = GetDropdownValue("ddlConsigneeInput");

        var formData = {
            BookingId: $("#txtBookingId").val(),
            LocationId: $("#ddlLocation").val(),
            BookingNo: $("#ddlLrNo").val(),
            BookingDate: $("#lrDate").val(),
            PlacementId: $("#ddlPlacementNo").val(),
            EWayBillStateId: $("#ddlBillState").val(),
            BusinessVerticalId: $("#ddlBusinessVertical").val(),
            EWayBillNo: $("#txtBillNo").val(),
            FromLocation: $("#from-search-box").val(),
            //FromLocationState: $('#fromState').val(),
            //FromLocationCity: $('#fromCity').val(),
            FromLatitude: $('#fromLat').val(),
            FromLongitude: $('#fromLng').val(),
            ToLocation: $("#to-search-box").val(),
            //ToLocationState: $('#toState').val(),
            //ToLocationCity: $('#toCity').val(),
            ToLatitude: $('#toLat').val(),
            ToLongitude: $('#toLng').val(),
            PartyId: $("#ddlCustomerName").val(),
            //VehicleNo: $("#ddlVehicleNo").val(),
            VehicleNo: $('#ddlVehicleNo option:selected').text(),
            VehicleTypeId: $("#ddlVehicleType").val(),
            DriverId: $("#ddlDriverName").val(),
            DriverName: $('#ddlDriverName option:selected').text(),
            DriverMobNo: $("#txtMobileNo").val(),
            TrackingTypeId: $("#ddlTrackingType").val(),
            InvoiceNo: $("#invoiceNo").val(),
            InvoiceDate: $("#invoiceDate").val(),
            InvoiceValue: $("#txtInvoiceValue").val(),
            EWayBillDate: $("#ewayBillDate").val(),
            EWayBillExpiryDate: $("#expiryDate").val(),
            ConsignerId: consignorResult.id,
            ConsignerName: consignorResult.name,
            ConsigneeId: consigneeResult.id,
            ConsigneeName: consigneeResult.name,
            TransitDays: $("#txtTransitDays").val(),
            EDD: $("#eddDate").val(),
            ItemId: $("#ddlItemName").val(),
            PackingTypeId: $("#ddlPackingType").val(),
            TotalPacket: $("#txtTotalPkgs").val(),
            ActualWeight: $("#txtActualWt").val(),
            ChargedWeight: $("#txtChargedWt").val(),
            TotalFreight: $("#txtTotalFreight").val(),
            LinkId: GetQueryParam("LinkId")
        };
        var linkd = GetQueryParam("LinkId");
        // First AJAX call
        $.ajax({
            type: "PUT",
            url: "/BookingOrTrip/UpdateBookingOrTrip",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(formData),
            dataType: "json",
            success: function (result) {
                if (result.result == "success") {
                    toastr.success("Booking Or Trip Details Updated Successfully!");
                    addMasterUserActivityLog(0, LogType.Update, "Booking Or Trip Details Updated Successfully!", 0);
                    $("#formDiv").css('display', 'none');
                    FetchBookingOrTrip();
                    $('#bookingForm')[0].reset();
                    $('#ddlLocation').val(0).trigger('change');
                    $('#ddlPlacementNo').val(0).trigger('change');
                    $('#ddlBillState').val(0).trigger('change');
                    $('#ddlBusinessVertical').val(0).trigger('change');
                    $('#ddlCustomerName').val(0).trigger('change');
                    $('#ddlVehicleNo').val(0).trigger('change');
                    $('#ddlVehicleType').val(0).trigger('change');
                    $('#ddlDriverName').val(0).trigger('change');
                    $('#ddlTrackingType').val(0).trigger('change');
                    $('#ddlConsignorInput').val(0).trigger('change');
                    $('#ddlConsigneeInput').val(0).trigger('change');
                    $('#ddlItemName').val(0).trigger('change');
                    $('#ddlPackingType').val(0).trigger('change');
                    $("#btnUpdate").hide();
                    $("#btnSaveAndNewForm").show();
                    $("#btnSaveForm").show();
                } else {
                    toastr.error("Failed to Update Booking Or Trip Details!", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Update Booking Or Trip Details!", "Error");
            }
        });
    });
};


function DeleteBooking(bookingId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            var deleteVehicleIndentUrl = `/BookingOrTrip/DeleteBookingOrTrip/${bookingId}`;
            $.ajax({
                url: deleteVehicleIndentUrl,
                type: "DELETE",
                contentType: "application/json",
                dataType: "json",
                success: function (response) {
                    if (response && response.result === "success") {
                        toastr.success("Booking Or Trip  has been deleted successfully.");
                        addMasterUserActivityLog(0, LogType.Delete, "Booking Or Trip has been deleted successfully.", 0);
                        $("#addReqBranchDiv").addClass('d-none');
                        $('#currentPage').val(1);
                        FetchBookingOrTrip();
                    } else {
                        toastr.error("Failed to delete Booking Or Trip.", "Error");
                    }
                },
                error: function () {
                    toastr.error("Failed to delete Booking Or Trip.", "Error");
                }
            });
        }
    });
}
function btnAddInvoiceClick() {
    const tfInvoiceNo = $("#tfInvoiceNo").val();
    const tfInvoiceDate = $("#tfInvoiceDate").val();
    const tfInvoiceValue = $("#tfInvoiceValue").val();
    const tfEwayBillNo = $("#tfEwayBillNo").val();
    const tfEwayBillDate = $("#tfEwayBillDate").val();
    const tfEwayBillValidUpto = $("#tfEwayBillValidUpto").val();

    if (!IsNullOrEmpty(tfInvoiceNo)) {
        const isExist = additionalInvoiceList.some(x => x.InvoiceNo.trim() == tfInvoiceNo.trim());
        if (isExist) {
            toastr.warning("This route already exists in list!", "Warning");
            return;
        }
        additionalInvoiceList.push({
            BookingId: 0,
            InvoiceNo: tfInvoiceNo,
            InvoiceDate: tfInvoiceDate,
            InvoiceValue: tfInvoiceValue,
            EwayBillNo: tfEwayBillNo,
            EwayBillDate: tfEwayBillDate,
            EwayBillValidUpto: tfEwayBillValidUpto
        });
        RenderInvoiceDetailsTable();
        ClearInvoiceDetails();
    }
    else {
        toastr.warning("Please enter Invoice No!");
        return;
    }
}
function RenderInvoiceDetailsTable() {
    const tbody = $('#additionalInvoiceDetails tbody');
    tbody.empty();
    $.each(additionalInvoiceList, function (index, item) {
        const row = `
      <tr data-index="${index}">
        <td class="text-center">${index + 1}</td>
        <td class="text-center">${item.InvoiceNo}</td>
        <td class="text-center">${item.InvoiceDate}</td>
        <td class="text-center">${item.InvoiceValue}</td>
        <td class="text-center">${item.EwayBillNo}</td>
        <td class="text-center">${item.EwayBillDate}</td>
        <td class="text-center">${item.EwayBillValidUpto}</td>
        <td class="text-center" style="cursor:pointer;">
          <a class="icon-btn deleteInvoiceDetails"  style="color:#F24B5A;"><i class="ri-delete-bin-3-line"></i></a>
        </td>
      </tr>
    `;
        tbody.append(row);
    });
}
function btnDeleteInvoiceClick() {
    $('#additionalInvoiceDetails').on('click', '.deleteInvoiceDetails', function () {
        const rowIndex = $(this).closest('tr').data('index');
        const deleteItem = additionalInvoiceList.splice(rowIndex, 1);
        RenderInvoiceDetailsTable();
    });
}
function ClearInvoiceDetails() {
    $("#tfInvoiceNo").val(0).trigger('change');
    $("#tfInvoiceDate").val(0).trigger('change');
    $("#tfInvoiceValue").val(0).trigger('change');
    $("#tfEwayBillNo").val(0).trigger('change');
    $("#tfEwayBillDate").val(0).trigger('change');
    $("#tfEwayBillValidUpto").val(0).trigger('change');
}
function AutoFetch() {
    var placementNo = $("#ddlPlacementNo").val();
    var getUrl = '/BookingOrTrip/AutoFetchBooking/' + placementNo;

    $.ajax({
        url: getUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            let data = response?.[0] || {};
            $('#from-search-box').val(data.fromLocation);
            $('#to-search-box').val(data.toLocation);
            $("#ddlVehicleNo").val(data.vehicleId).trigger('change');
            $("#ddlVehicleType").val(data.vehicleTypeId).trigger('change');
            $("#ddlDriverName").val(data.driverId).trigger('change');
            $("#ddlCustomerName").val(data.partyId).trigger('change');
            $('#txtMobileNo').val(data.mobileNo);
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to fetch RFQ data!", "Error");
        }
    });
}

function resetBookingForm() {
    // Reset all text, number, date, hidden, and textarea inputs
    $('#bookingForm').find('input[type="text"], input[type="number"], input[type="date"], input[type="hidden"], textarea').val('');
    $('#bookingForm').find('select').each(function () {
        $(this).val(0).trigger('change');
    });
    $('#ddlBusinessVertical').val(0).trigger('change');
    $('#additionalInvoiceDetails tbody').empty();
    $('#btnUpdate').hide();
    $('#btnSaveForm, #btnSaveAndNewForm').show();
    $('#from-location-suggestions, #to-location-suggestions').hide().empty();
    console.log("Form reset successfully!");
}
