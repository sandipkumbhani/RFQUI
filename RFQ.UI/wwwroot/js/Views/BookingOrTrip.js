const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('LinkId');
var myDropzone;
var driverDrpList;
var companyId;
var profileId;
var locationId;
var orderColumn = '';
var orderDir = '';
var fetchBookingUrl = '/BookingOrTrip/GetAllBookingOrTrip';
$(document).ready(function () {
    companyId = getCookieValue('companyid');
    profileId = getCookieValue('profileid');
    locationId = getCookieValue('locationid');
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
    FetchLRNo();
    FetchBookingOrTrip();
    ButtonUpdateClick();

    $('#tableDivLink').on('click', function (e) {
        FetchBookingOrTrip();
    });
    $("#btnCancel").on("click", function () {
        $('#formDiv')
            .find('input, select, textarea, button, a')
            .prop('disabled', false);
        FetchBookingOrTrip();
    });

    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir); // update for next click

        $('th.sortable').not(this).data('order', 'asc');

        FetchDataForTable('BookingTable', fetchBookingUrl, orderColumn, orderDir.toUpperCase(), IsEdit, IsView, IsCancel);
    });


    $("#btnSaveForm, #btnSaveAndNewForm").on('click', function () {
        $(this).prop('disabled', true);
        var action = $(this).data('action');
        if (OnSubmitCheckValidation()) {
            SaveBookingOrTrip(action);
        }
    });
    
    //$('#ddlPlacementNo').on('change', function () {
    //    debugger;
    //    const selectedValue = $(this).val();
    //    if (!selectedValue) {
    //        return;
    //    }
    //    const selectedPlacement = driverDrpList.find(x => x.placementId == selectedValue);

    //    if (selectedPlacement) {
    //        $("#ddlCustomerName").val(selectedPlacement.partyId).trigger('change');
    //        $("#ddlVehicleType").val(selectedPlacement.vehicleTypeId).trigger('change');
    //        //$('#from-search-box').val(selectedPlacement.fromLocation);
    //        //$('#to-search-box').val(selectedPlacement.toLocation);
    //        //$('#txtNoofVehicles').val(selectedPlacement.requiredVehicles);
    //        //$('#txtVehicleReqDate').val(selectedPlacement.vehicleReqOn.split('T')[0]);
    //        //$('#fromState').val(selectedPlacement.fromLocationState);
    //        //$('#fromCity').val(selectedPlacement.fromLocationCity);
    //        //$('#fromLat').val(selectedPlacement.fromLatitude);
    //        //$('#fromLng').val(selectedPlacement.fromLongitude);
    //        //$('#toState').val(selectedPlacement.toLocationState);
    //        //$('#toCity').val(selectedPlacement.toLocationCity);
    //        //$('#toLat').val(selectedPlacement.toLatitude);
    //        //$('#toLng').val(selectedPlacement.toLongitude);
    //        //$("#ddlItemName").val(selectedPlacement.itemId == 0 ? null : selectedPlacement.itemId).trigger('change');
    //        //$("#ddlPackingType").val(selectedPlacement.packingTypeId == 0 ? null : selectedPlacement.packingTypeId).trigger('change');
    //        //$("#hdnIndentExpiryDate").val(selectedPlacement.expiryDate);
    //    }
    //});
});

$('#addCompany').click(function () {
    $('#formDiv').css("display", "block");
    $('#tableDiv').css("display", "none");
});
function FetchBookingOrTrip() {
    $("#tableDiv").css('display', 'block');
    $("#formDiv").css('display', 'none');
    $('#bookingForm')[0].reset();
    FetchLRNo();
    $('.select2-custom').val(null).trigger('change');
    $("#btnSaveForm").show();
    $("#btnUpdate").hide();
    $("#btnSaveAndNewForm").show();
    GetAllConsignorList();
    GetAllConsigneeList();
    FetchDataForTable('BookingTable', fetchBookingUrl, orderColumn, orderDir.toUpperCase(), IsEdit, IsView, IsCancel);
}

$('#BookingTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchBookingOrTrip();
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchBookingOrTrip();
});
function OnSubmitCheckValidation() {
    if (!isValidateSelect($("#ddlLocation").val())) {
        toastr.warning("Please Select a Booking Branch", "Validation Error");
        return false;
    }
    //if (IsNullOrEmpty($("#txtIndentNo").val())) {
    //    toastr.warning("Please enter a Indent No", "Validation Error");
    //    return false;
    //}
    if (IsNullOrEmpty($("#lrDate").val())) {
        toastr.warning("Please enter a LR Date", "Validation Error");
        return false;
    }
    //if (IsNullOrEmpty($("#txtVehicleReqDate").val())) {
    //    toastr.warning("Please enter a Vehicle Req On", "Validation Error");
    //    return false;
    //}
    //if ($("#txtVehicleReqDate").val() <= $('#txtIndentDate').val()) {
    //    toastr.warning("Vehicle Req On date must be greater than Indent Date.", "Warning");
    //    $("#txtVehicleReqDate").val('');
    //    return false;
    //}
    
    if (IsNullOrEmpty($("#from-search-box").val())) {
        toastr.warning("Please enter a Origin/From", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#to-search-box").val())) {
        toastr.warning("Please enter a Destination/To", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlVehicleNo").val())) {
        toastr.warning("Please Select a Vehicle No", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlCustomerName").val())) {
        toastr.warning("Please Select a Customer Name", "Validation Error");
        return false;
    }

    if (!isValidateSelect($("#ddlVehicleType").val())) {
        toastr.warning("Please Select a Vehicle Type", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlDriverName").val())) {
        toastr.warning("Please Select a Driver Name","Validation Error");
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
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select or Add a Consignor Name";
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
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select or Add a Consignee Name";
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
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
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
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
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
            placeholderOption.value = "";
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
            driverDrpList = response.result;
            const selectLocation = document.getElementById("ddlPlacementNo");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select placement No";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectLocation.appendChild(placeholderOption);
            driverDrpList.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.placementId;
                opt.textContent = option.placementNo;
                selectLocation.appendChild(opt);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function FetchLRNo() {

    $.ajax({
        url: "/BookingOrTrip/GenerateLRNo",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            $("#ddlLrNo").val(response.result);
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch LR No!", "Error");
        }
    });
}
function formatDateForInput(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date)) return '';

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
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
    debugger;
    var saveUrl = '/BookingOrTrip/AddBookingOrTrip';
    var consignorResult = GetDropdownValue("ddlConsignorInput");
    var consigneeResult = GetDropdownValue("ddlConsigneeInput");
    const formData = {

        BookingNo: $('#ddlLrNo').val(),
        LocationId: $('#ddlLocation').val(),
        BookingDate: $('#lrDate').val(),
        PlacementId: $('#ddlPlacementNo').val(),
        EWayBillStateId: $('#ddlBillState').val(),
        BusinessVerticalId: $('#ddlBusinessVertical').val(),
        EWayBillNo: $('#txtBillNo').val(),
        FromLocation: $('#from-search-box').val(),
        FromLatitude: $('#fromLat').val(),
        FromLongitude: $('#fromLng').val(),
        ToLocation: $('#to-search-box').val(),
        ToLatitude: $('#toLat').val(),
        ToLongitude: $('#toLng').val(),
        PartyId: $('#ddlCustomerName').val(),
        VehicleNo: $('#ddlVehicleNo option:selected').text(),
        VehicleTypeId: $('#ddlVehicleType').val(),
        DriverId: $('#ddlDriverName').val(),
        DriverName: $('#ddlDriverName option:selected').text(),
        DriverMobNo: $('#txtMobileNo').val(),
        TrackingTypeId: $('#ddlTrackingType').val(),
        InvoiceNo: $('#invoiceNo').val(), 
        InvoiceDate: $('#invoiceDate').val() ? $('#invoiceDate').val() : null,
        InvoiceValue: $('#txtInvoiceValue').val(),
        //EWayBillNo: $('#txtEwayBillNo').val(), //
        EWayBillDate: $('#ewayBillDate').val() ? $('#ewayBillDate').val() : null, 
        EWayBillExpiryDate: $('#expiryDate').val() ? $('#expiryDate').val() : null,
        ConsignerId: consignorResult.id,
        ConsignerName: consignorResult.name,
        ConsigneeId: consigneeResult.id,
        ConsigneeName: consigneeResult.name,
        TransitDays: $('#txtTransitDays').val(),
        EDD: $('#eddDate').val() ? $('#eddDate').val() : null,
        ItemId: $('#ddlItemName').val(),
        PackingTypeId: $('#ddlPackingType').val(),
        TotalPacket: $('#txtTotalPkgs').val(),
        ActualWeight: $('#txtActualWt').val(),
        ChargedWeight: $('#txtChargedWt').val(),
        TotalFreight: $('#txtTotalFreight').val(),
        LinkId: GetQueryParam("LinkId")

        //BookingNo: $('#ddlLrNo').val() || null,
        //LocationId: parseInt($('#ddlLocation').val()) || 0,
        //BookingDate: $('#lrDate').val() ? new Date($('#lrDate').val()) : null,
        //PlacementId: parseInt($('#ddlPlacementNo').val()) || 0,
        //EWayBillStateId: $('#ddlBillState').val() ? parseInt($('#ddlBillState').val()) : null,
        //BusinessVerticalId: $('#ddlBusinessVertical').val() ? parseInt($('#ddlBusinessVertical').val()) : null,
        //EWayBillNo: $('#txtBillNo').val() || null,

        //FromLocation: $('#from-search-box').val() || null,
        //FromLatitude: $('#fromLat').val() || null,
        //FromLongitude: $('#fromLng').val() || null,
        //ToLocation: $('#to-search-box').val() || null,
        //ToLatitude: $('#toLat').val() || null,
        //ToLongitude: $('#toLng').val() || null,

        //PartyId: $('#ddlCustomerName').val() ? parseInt($('#ddlCustomerName').val()) : 0,
        //VehicleNo: $('#ddlVehicleNo option:selected').text() || null,
        //VehicleTypeId: $('#ddlVehicleType').val() ? parseInt($('#ddlVehicleType').val()) : 0,

        //DriverId: $('#ddlDriverName').val() ? parseInt($('#ddlDriverName').val()) : 0,
        //DriverName: $('#ddlDriverName option:selected').text() || null,
        //DriverMobNo: $('#txtMobileNo').val() || null,

        //TrackingTypeId: $('#ddlTrackingType').val() ? parseInt($('#ddlTrackingType').val()) : 0,

        //InvoiceNo: $('#invoiceNo').val() || null,
        //InvoiceDate: $('#invoiceDate').val() ? new Date($('#invoiceDate').val()) : null,
        //InvoiceValue: $('#txtInvoiceValue').val() ? parseFloat($('#txtInvoiceValue').val()) : null,

        //EWayBillDate: $('#ewayBillDate').val() ? new Date($('#ewayBillDate').val()) : null,
        //EWayBillExpiryDate: $('#expiryDate').val() ? new Date($('#expiryDate').val()) : null,

        //ConsignerId: consignorResult?.id || null,
        //ConsignerName: consignorResult?.name || null,
        //ConsigneeId: consigneeResult?.id || null,
        //ConsigneeName: consigneeResult?.name || null,

        //TransitDays: $('#txtTransitDays').val() ? parseInt($('#txtTransitDays').val()) : null,
        //EDD: $('#eddDate').val() ? new Date($('#eddDate').val()) : null,

        //ItemId: $('#ddlItemName').val() ? parseInt($('#ddlItemName').val()) : null,
        //PackingTypeId: $('#ddlPackingType').val() ? parseInt($('#ddlPackingType').val()) : null,
        //TotalPacket: $('#txtTotalPkgs').val() ? parseInt($('#txtTotalPkgs').val()) : null,
        //ActualWeight: $('#txtActualWt').val() ? parseFloat($('#txtActualWt').val()) : null,
        //ChargedWeight: $('#txtChargedWt').val() ? parseFloat($('#txtChargedWt').val()) : null,
        //TotalFreight: $('#txtTotalFreight').val() ? parseFloat($('#txtTotalFreight').val()) : null,

        //LinkId: GetQueryParam("LinkId") ? parseInt(GetQueryParam("LinkId")) : 0
    };

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
    //else if (action === "saveNew") {
    //    $.ajax({
    //        url: saveUrl,
    //        type: 'POST',
    //        contentType: 'application/json',
    //        data: JSON.stringify(formData),
    //        success: function (response) {
    //            if (response) {
    //                toastr.success("Vehicle Indent Saved Successfully!", "Success");
    //                addMasterUserActivityLog(0, LogType.Create, "Vehicle Indent Saved Successfully!", 0);
    //                $("#btnSaveForm").prop('disabled', false);
    //                $("#btnSaveAndNewForm").prop('disabled', false);
    //                $('#vehicleIndentForm')[0].reset();
    //                $('.select2-custom').val(null).trigger('change');
    //                FetchIndentNo();

    //                if (profileId == EnumProfile.Branch) {
    //                    $('#ddlLocation').val(Number(locationId)).trigger('change');
    //                    $('#ddlLocation').prop('disabled', true);
    //                }
    //                else {
    //                    $('#ddlLocation').val(null).trigger('change');
    //                    $('#ddlLocation').prop('disabled', false);
    //                }

    //            } else {
    //                toastr.error("Failed to Submit Vehicle Indent Details.", "Error");
    //            }
    //        },
    //        error: function (xhr, status, error) {
    //            toastr.error("Failed to Submit Vehicle Indent Details.", "Error");
    //        }
    //    });
    //}

}
function UpdateBooking(bookingId) {
    debugger;
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
    $("#lrDate").val(formatDateForInput(formData.bookingDate));
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
    $("#invoiceDate").val(formatDateForInput(formData.invoiceDate));
    $("#txtInvoiceValue").val(formData.invoiceValue);
    $("#ewayBillDate").val(formatDateForInput(formData.eWayBillDate));
    $("#expiryDate").val(formatDateForInput(formData.eWayBillExpiryDate));
    if (formData.consignerId == 0 && formData.consignerName) {
        if ($("#ddlConsignorInput").find("option[value='" + formData.consignerName + "']").length === 0) {
            var newOption = new Option(formData.consignerName, formData.consignerName, true, true);
            $("#ddlConsignorInput").append(newOption).trigger("change");
        } else {
            $("#ddlConsignorInput").val(formData.consignerName).trigger("change");
        }
    }
    else if (formData.consignerId == 0) {
        $("#ddlConsignorInput").val(null).trigger("change");
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
        $("#ddlConsigneeInput").val(null).trigger("change");
    }
    else {
        $("#ddlConsigneeInput").val(formData.consigneeId).trigger("change");
    }
    $("#txtTransitDays").val(formData.transitDays);
    $("#eddDate").val(formatDateForInput(formData.edd));
    $("#ddlItemName").val(formData.itemId).trigger('change');
    $("#ddlPackingType").val(formData.packingTypeId).trigger('change');
    $("#txtTotalPkgs").val(formData.totalPacket);
    $("#txtActualWt").val(formData.actualWeight);
    $("#txtChargedWt").val(formData.chargedWeight);
    $("#txtTotalFreight").val(formData.totalFreight);

} 
function ButtonUpdateClick() {
    debugger;
    $("#btnUpdate").on('click', function (e) {
        debugger;
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
                    $('#ddlLocation').val(null).trigger('change');
                    $('#ddlPlacementNo').val(null).trigger('change');
                    $('#ddlBillState').val(null).trigger('change');
                    $('#ddlBusinessVertical').val(null).trigger('change');
                    $('#ddlCustomerName').val(null).trigger('change');
                    $('#ddlVehicleNo').val(null).trigger('change');
                    $('#ddlVehicleType').val(null).trigger('change');
                    $('#ddlDriverName').val(null).trigger('change');
                    $('#ddlTrackingType').val(null).trigger('change');
                    $('#ddlConsignorInput').val(null).trigger('change');
                    $('#ddlConsigneeInput').val(null).trigger('change');
                    $('#ddlItemName').val(null).trigger('change');
                    $('#ddlPackingType').val(null).trigger('change');
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
function ViewBooking(bookingId) {
    UpdateBooking(bookingId);
    $('#formDiv').find('input, select, textarea, button, a').prop('disabled', true);
    $("#btnUpdate").addClass('d-none');
}
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