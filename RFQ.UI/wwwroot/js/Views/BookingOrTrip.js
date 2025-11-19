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
    $('#ddlPlacementNo').on('change', function () {
        if ($(this).val() != null) {
            AutoFetch();
        }
        else {
            return;
        }
    });
    //$('#ddlPlacementNo').on('change', function () {
    //    debugger;
    //    const selectedValue = $(this).val();
    //    if (!selectedValue) {
    //        return;
    //    }
    //    const selectedIndent = bookingDrpList.find(x => x.placementId == selectedValue);
    //    if (selectedIndent) {

    //        //$('#txtLRNo').val(selectedIndent.bookingNo);
    //        //$('#txtLrDate').val(selectedIndent.bookingDate.split('T')[0]);
    //        //$("#ddlBookingBranch").val(selectedIndent.locationId).trigger('change');
    //        $('#from-search-box').val(selectedIndent.fromLocation);
    //        $('#to-search-box').val(selectedIndent.toLocation);
    //        //$('#txtVehicleNo').val(selectedIndent.vehicleNo);
    //        //$("#ddlVehicleType").val(selectedIndent.vehicleTypeId).trigger('change');
    //        //$("#ddlCustomerName").val(selectedIndent.partyId).trigger('change');
    //        //$("#txtConsignorInput").val(selectedIndent.consignerName).trigger('change');
    //        //$("#txtConsigneeInput").val(selectedIndent.consigneeName).trigger('change');
    //        //$('#txtEDD').val(selectedIndent.edd.split('T')[0]);
    //        //$('#txtPkg').val(selectedIndent.totalPacket);
    //        //$('#txtActualWt').val(selectedIndent.actualWeight);

    //    }
    //});
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
    $('#bookingForm')[0].reset();
    FetchLRNo();
    $('.select2-custom').val(null).trigger('change');
    $("#btnSaveForm").show();
    $("#btnUpdate").hide();
    $("#btnSaveAndNewForm").show();
    GetAllConsignorList();
    GetAllConsigneeList();
    FetchDataForTable('BookingTable', fetchBookingUrl, orderColumn, orderDir.toUpperCase(), 'UpdateBooking', 'DeleteBooking', 'bookingId');
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
            bookingDrpList = response.result;
            const selectLocation = document.getElementById("ddlPlacementNo");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select placement No";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectLocation.appendChild(placeholderOption);
            bookingDrpList.forEach(option => {
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
        LinkId: GetQueryParam("LinkId"),
        BookingInvoiceDetailList: additionalInvoiceList
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
    $("#tfInvoiceNo").val(null).trigger('change');
    $("#tfInvoiceDate").val(null).trigger('change');
    $("#tfInvoiceValue").val(null).trigger('change');
    $("#tfEwayBillNo").val(null).trigger('change');
    $("#tfEwayBillDate").val(null).trigger('change');
    $("#tfEwayBillValidUpto").val(null).trigger('change');
}

function AutoFetch() {
    debugger;
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


//function AutoFetch() {
//    debugger;
//    var placementNo = $("#ddlPlacementNo").val();
//    var getUrl = '/BookingOrTrip/AutoFetchBooking/' + placementNo;
//    $.ajax({
//        url: getUrl,
//        type: "GET",
//        contentType: "application/json",
//        success: function (response) {
//            if (Array.isArray(response) && response.length > 0) {
//                let data = response[0]; // Use the first object in the array
                
//                $('#from-search-box').val(data.fromLocation);
//                $('#to-search-box').val(data.toLocation);
//                //$("#ddlCustomerName").val(data.VehicleId).trigger('change');
//                $("#ddlVehicleNo").val(data.vehicleId).trigger('change');
//                $("#ddlVehicleType").val(data.vehicleTypeId).trigger('change');
//                $("#ddlDriverName").val(data.driverId).trigger('change');
//                $('#txtMobileNo').val(data.mobileNo);


//            } else {
//                toastr.warning("No data found for selected indent number.", "Warning");
//            }
//        },
//        error: function (xhr, status, error) {
//            toastr.error("Failed to fetch RFQ data!", "Error");
//        }
//    });
//}
