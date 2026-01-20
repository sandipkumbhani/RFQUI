const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('LinkId');
var myDropzone;
var orderColumn = '';
var orderDir = '';
var fetchVehicleIndentUrl = '/VehicleIndent/GetAllVehicleIndent';
var companyId;
var profileId;
var locationId;
let IsEditClick = false;
$(document).ready(function () {
    companyId = getCookieValue('companyid');
    profileId = getCookieValue('profileid');
    locationId = getCookieValue('locationid');
    CheckValidation();
    GetAllLocation("ddlLocation", companyId, function () {
        if (profileId == EnumProfile.Branch) {
            $('#ddlLocation').val(Number(locationId)).trigger('change');
            $('#ddlLocation').prop('disabled', true);
        }
    });
    //FetchIndentNo();
    GetAllVehicleType("ddlVehicleType", companyId);
    GetAllCustomer("ddlCustomerName", companyId);
    GetAllItemName("ddlItemName", companyId);
    GetAllConsignorList();
    GetAllConsigneeList();
    GetAllPakingType("ddlPackingType");
    FetchVehicleIndent();
    ButtonUpdateClick();

    $('#tableDivLink').on('click', function (e) {
        FetchVehicleIndent();
    });

    $("#btnCancel").on("click", function () {
        FetchVehicleIndent();
    });

    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir); // update for next click
        $('th.sortable').not(this).data('order', 'asc');
        FetchDataForTable('IndentTable', fetchVehicleIndentUrl, orderColumn, orderDir.toUpperCase(), 'UpdateVehicleIndent', 'DeleteVehicleIndent', 'indentId');
    });

    $("#btnSave, #btnsaveandnew").on('click', function () {
        $(this).prop('disabled', true);
        var action = $(this).data('action');
        if (OnSubmitCheckValidation()) {
            SaveVehicleIndent(action);
        }
    });

    $("#ddlLocation").on("change", async function () {
        var locationId = $(this).val();
        var locationData = await GetLocationById(locationId)
        console.log(locationData.code);
        var code = await GetAutoGenerateCode(locationData.code, PrefixCode.VI);
        console.log(code);
        if (!IsEditClick) {
            $("#txtIndentNo").val(code);
        }
    });
});

$('#btnAdd').click(function () {
    $('#formDiv').removeClass("d-none");
    $('#tableDiv').addClass("d-none");
    if ($("#ddlLocation").is(":disabled"))
        $("#ddlLocation").removeAttr("disabled");
});
function FetchVehicleIndent() {
    IsEditClick = false;
    $("#tableDiv").removeClass('d-none');
    $("#formDiv").addClass('d-none');
    $('#vehicleIndentForm')[0].reset();
    //FetchIndentNo();
    $(".select2-custom").each(function () {
        $(this).val(0).trigger('change');
    });
    $("#btnSave").show();
    $("#btnupdate").hide();
    $("#btnsaveandnew").show();
    GetAllConsignorList();
    GetAllConsigneeList();
    FetchDataForTable('IndentTable', fetchVehicleIndentUrl, orderColumn, orderDir.toUpperCase(), 'UpdateVehicleIndent', 'DeleteVehicleIndent', 'indentId');
}

$('#IndentTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchVehicleIndent();
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchVehicleIndent();
});
function GetAllConsignorList() {
    var getUrl = '/Vendor/GetAllVendorList'
    $.ajax({
        url: getUrl,
        type: "GET",
        data: { companyId: companyId },
        contentType: "application/json",
        success: function (response) {
            $("#ddlConsignorInput").empty();
            const consignorListDropdown = document.getElementById("ddlConsignorInput");
            consignorListDropdown.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
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
            $("#ddlConsigneeInput").empty();
            const selectConsignee = document.getElementById("ddlConsigneeInput");
            selectConsignee.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
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
function CheckValidation() {
    $("#txtVehicleReqDate").on("change", function () {
        if ($(this).val() < $('#txtIndentDate').val()) {
            toastr.warning("Vehicle Req On date must be greater than Indent Date.", "Warning");
            $(this).val('');
        }
    });
    $("#txtRfqExpiredOn").on("change", function () {
        var expireDate = $(this).val().split('T')[0];
        if (expireDate < $('#txtVehicleReqDate').val()) {
            toastr.warning("Indent Expired On date must be greater than Vehicle Req On Date.", "Warning");
            $(this).val('');
        }
    });
}
function OnSubmitCheckValidation() {
    if (!isValidateSelect($("#ddlLocation").val())) {
        toastr.warning("Please Select a Location", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtIndentNo").val())) {
        toastr.warning("Please enter a Indent No", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtIndentDate").val())) {
        toastr.warning("Please enter a Indent Date", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtVehicleReqDate").val())) {
        toastr.warning("Please enter a Vehicle Req On", "Validation Error");
        return false;
    }
    if ($("#txtVehicleReqDate").val() < $('#txtIndentDate').val()) {
        toastr.warning("Vehicle Req On date must be greater than Indent Date.", "Warning");
        $("#txtVehicleReqDate").val('');
        return false;
    }
    if (!isValidateSelect($("#ddlCustomerName").val())) {
        toastr.warning("Please Select a Customer Name", "Validation Error");
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
    if (!isValidateSelect($("#ddlVehicleType").val())) {
        toastr.warning("Please Select a Vehicle Type", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtNoofVehicles").val())) {
        toastr.warning("Please enter a No. of Vehicles Req", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtRfqExpiredOn").val())) {
        toastr.warning("Please enter a Indent Expired On", "Validation Error");
        return false;
    }
    if ($("#txtRfqExpiredOn").val().split('T')[0] < $('#txtVehicleReqDate').val()) {
        toastr.warning("Indent Expired On date must be greater than Vehicle Req On Date.", "Warning");
        $("#txtRfqExpiredOn").val('');
        return false;
    }
    return true;
}
function SaveVehicleIndent(action) {
    var saveUrl = '/VehicleIndent/AddVehicleIndent';
    var consignorResult = GetDropdownValue("ddlConsignorInput");
    var consigneeResult = GetDropdownValue("ddlConsigneeInput");
    const formData = {
        IndentNo: $('#txtIndentNo').val(),
        LocationId: $('#ddlLocation').val(),
        IndentDate: $('#txtIndentDate').val(),
        VehicleReqOn: $('#txtVehicleReqDate').val(),
        PartyId: $('#ddlCustomerName').val(),
        FromLocation: $('#from-search-box').val(),
        FromLocationState: $('#fromState').val(),
        FromLocationCity: $('#fromCity').val(),
        FromLatitude: $('#fromLat').val(),
        FromLongitude: $('#fromLng').val(),
        ToLocation: $('#to-search-box').val(),
        ToLocationState: $('#toState').val(),
        ToLocationCity: $('#toCity').val(),
        ToLatitude: $('#toLat').val(),
        ToLongitude: $('#toLng').val(),
        VehicleTypeId: $('#ddlVehicleType').val(),
        RequiredVehicles: $('#txtNoofVehicles').val(),
        ExpiryDate: $('#txtRfqExpiredOn').val(),
        ConsignerId: consignorResult.id,
        ConsignerName: consignorResult.name,
        ConsigneeId: consigneeResult.id,
        ConsigneeName: consigneeResult.name,
        PickUpAddress: $('#txtPickupAddress').val(),
        DeliveryAddress: $('#txtDeliveryAddress').val(),
        ItemId: $('#ddlItemName').val() ? $('#ddlItemName').val() : 0,
        PackingTypeId: $('#ddlPackingType').val() ? $('#ddlPackingType').val() : 0,
        Remarks: $('#txtRemarks').val(),
        LinkId: GetQueryParam("LinkId")
    };
    if (action === "save") {

        $.ajax({
            url: saveUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response) {
                    $("#btnSave").prop('disabled', false);
                    $("#btnsaveandnew").prop('disabled', false);
                    toastr.success("Vehicle Indent Saved Successfully!", "Success");
                    addMasterUserActivityLog(0, LogType.Create, "Vehicle Indent Saved Successfully!", 0);
                    if (typeof this.completeOnSuccess === "function") {
                        this.completeOnSuccess();
                    }
                } else {
                    toastr.error("Failed to Submit Vehicle Indent Details.", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Vehicle Indent Details.", "Error");
            },
            completeOnSuccess: function () {
                FetchVehicleIndent();
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
                    $("#btnSave").prop('disabled', false);
                    $("#btnsaveandnew").prop('disabled', false);
                    $('#vehicleIndentForm')[0].reset();
                    $('.select2-custom').val(null).trigger('change');
                    //FetchIndentNo();

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
function FetchIndentNo() {
    $.ajax({
        url: "/VehicleIndent/GetIndentNo",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            $("#txtIndentNo").val(response.result);
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Indent No!", "Error");
        }
    });
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

function ButtonUpdateClick() {
    $("#btnupdate").on('click', async function (e) {
        e.preventDefault();

        const indentId = $("#txtIndentId").val();
        const referenceCheck = await IndentReferenceCheckInRfq(indentId)
        if (referenceCheck) {
            toastr.warning("Cannot Update Vehicle Indent: referenced in RFQ");
            return;
        }

        var isValid = OnSubmitCheckValidation();
        if (!isValid) {
            return;
        }
        var consignorResult = GetDropdownValue("ddlConsignorInput");
        var consigneeResult = GetDropdownValue("ddlConsigneeInput");

        var formData = {
            IndentId: $("#txtIndentId").val(),
            LocationId: $("#ddlLocation").val(),
            IndentNo: $("#txtIndentNo").val(),
            IndentDate: $("#txtIndentDate").val(),
            VehicleReqOn: $("#txtVehicleReqDate").val(),
            PartyId: $("#ddlCustomerName").val(),
            FromLocation: $("#from-search-box").val(),
            FromLocationState: $('#fromState').val(),
            FromLocationCity: $('#fromCity').val(),
            FromLatitude: $('#fromLat').val(),
            FromLongitude: $('#fromLng').val(),
            ToLocation: $("#to-search-box").val(),
            ToLocationState: $('#toState').val(),
            ToLocationCity: $('#toCity').val(),
            ToLatitude: $('#toLat').val(),
            ToLongitude: $('#toLng').val(),
            VehicleTypeId: $("#ddlVehicleType").val(),
            RequiredVehicles: $("#txtNoofVehicles").val(),
            ExpiryDate: $("#txtRfqExpiredOn").val(),
            PickUpAddress: $("#txtPickupAddress").val(),
            ConsignerId: consignorResult.id,
            ConsignerName: consignorResult.name,
            ConsigneeId: consigneeResult.id,
            ConsigneeName: consigneeResult.name,
            DeliveryAddress: $("#txtDeliveryAddress").val(),
            ItemId: $("#ddlItemName").val() ? $('#ddlItemName').val() : 0,
            PackingTypeId: $("#ddlPackingType").val() ? $("#ddlPackingType").val() : 0,
            Remarks: $("#txtRemarks").val(),
            LinkId: GetQueryParam("LinkId")
        };
        var linkd = GetQueryParam("LinkId");

        $.ajax({
            type: "PUT",
            url: "/VehicleIndent/UpdateVehicleIndent",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(formData),
            dataType: "json",
            success: function (result) {
                if (result.result == "success") {
                    toastr.success("Vehicle Indent Details Updated Successfully!");
                    addMasterUserActivityLog(0, LogType.Update, "Vehicle Indent Details Updated Successfully!", 0);
                    $("#formDiv").addClass('d-none');
                    FetchVehicleIndent();
                    $('#vehicleIndentForm')[0].reset();
                    $('#ddlLocation').val(0).trigger('change');
                    $('#ddlCustomerName').val(0).trigger('change');
                    $('#ddlVehicleType').val(0).trigger('change');
                    $('#ddlConsignorInput').val(0).trigger('change');
                    $('#ddlConsigneeInput').val(0).trigger('change');
                    $('#ddlItemName').val(0).trigger('change');
                    $('#ddlPackingType').val(0).trigger('change');
                    $("#btnupdate").hide();
                    $("#btnsaveandnew").show();
                    $("#btnSave").show();

                } else {
                    toastr.error("Failed to Update Vehicle Indent Details!", "Error");
                }

            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Update Vehicle Indent Details!", "Error");
            }
        });
    });
};

async function DeleteVehicleIndent(indentId) {
    const referenceCheck = await IndentReferenceCheckInRfq(indentId)
    if (referenceCheck) {
        toastr.warning("Cannot edit Vehicle Indent: referenced in RFQ");
        return;
    }
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
            var deleteVehicleIndentUrl = `/VehicleIndent/DeleteVehicleIndent/${indentId}`;
            $.ajax({
                url: deleteVehicleIndentUrl,
                type: "DELETE",
                contentType: "application/json",
                dataType: "json",
                success: function (response) {
                    if (response) {
                        toastr.success("Vehicle Indent has been deleted successfully.");
                        addMasterUserActivityLog(0, LogType.Delete, "Vehicle Indent has been deleted successfully.", 0);
                        $("#formDiv").addClass('d-none');
                        $('#currentPage').val(1);
                        FetchVehicleIndent();
                    } else {
                        toastr.error("Failed to delete Vehicle Indent.", "Error");
                    }
                },
                error: function () {
                    toastr.error("Failed to delete Vehicle Indent.", "Error");
                }
            });
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

async function UpdateVehicleIndent(indentId) {
    if ($("#btnupdate").hasClass('d-none')) {
        $("#btnupdate").removeClass('d-none');
    }
    var data = viewModelDto.filter(x => x.indentId == indentId);
    var formData = data[0];
    $('#tableDiv').addClass('d-none');
    $("#formDiv").removeClass('d-none');
    $("#backButton").addClass('d-none');
    $("#btnSave").hide();
    $("#btnupdate").show();
    $("#btnView").hide();
    $("#btnCancel").removeClass('d-none');
    $("#btnsaveandnew").hide();
    $("#txtIndentId").val(formData.indentId);
    if (!IsNullOrEmpty(formData.locationId)) {
        $("#ddlLocation").val(formData.locationId).trigger('change');
        $("#ddlLocation").prop('disabled', true);
    }
    $("#txtIndentNo").val(formData.indentNo);
    $("#txtIndentDate").val(formatDateForInput(formData.indentDate));
    $("#txtVehicleReqDate").val(formatDateForInput(formData.vehicleReqOn));
    $("#txtRfqExpiredOn").val(formData.expiryDate);
    $("#ddlCustomerName").val(formData.partyId).trigger('change');
    $("#from-search-box").val(formData.fromLocation);
    $("#fromState").val(formData.fromLocationState);
    $("#fromCity").val(formData.fromLocationCity);
    $("#fromLat").val(formData.fromLatitude);
    $("#fromLng").val(formData.fromLongitude);
    $("#to-search-box").val(formData.toLocation);
    $("#toState").val(formData.toLocationState);
    $("#toCity").val(formData.toLocationCity);
    $("#toLat").val(formData.toLatitude);
    $("#toLng").val(formData.toLongitude);
    $("#ddlVehicleType").val(formData.vehicleTypeId).trigger('change');
    $("#txtNoofVehicles").val(formData.requiredVehicles);
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
    $("#txtPickupAddress").val(formData.pickUpAddress);
    $("#txtDeliveryAddress").val(formData.deliveryAddress);
    $("#ddlItemName").val(formData.itemId == 0 ? 0 : formData.itemId).trigger('change');
    $("#ddlPackingType").val(formData.packingTypeId == 0 ? 0 : formData.packingTypeId).trigger('change');
    $("#txtRemarks").val(formData.remarks);
    IsEditClick = true;
}
function IndentReferenceCheckInRfq(indentId) {
    return $.ajax({
        url: '/VehicleIndent/IndentReferenceCheckInRfqAsync/' + indentId,
        type: 'GET',
        dataType: 'json'
    });
}
function setMinVehicleReqOnDate() {
    var indentDate = document.getElementById('txtIndentDate').value;
    var vehicleDate = document.getElementById('txtVehicleReqDate');

    // if indent date is null or empty
    if (IsNullOrEmpty(indentDate)) {
        vehicleDate.min = new Date().toISOString().split('T')[0];
        return;
    }
    var date = new Date(indentDate);
    if (isNaN(date.getTime())) {
        vehicleDate.min = new Date().toISOString().split('T')[0];
        console.log("Wrong VehicleReqOnDate date")
        return;
    }
    vehicleDate.min = date.toISOString().split('T')[0];
}
function setRfqExpiredMinDate() {
    var vehicleReqDate = document.getElementById('txtVehicleReqDate').value;
    var rfqExpired = document.getElementById('txtRfqExpiredOn');

    // If vehicle date not selected
    if (IsNullOrEmpty(vehicleReqDate)) {
        rfqExpired.min = new Date().toISOString().slice(0, 16);
        return;
    }
    var date = new Date(vehicleReqDate);
    // Invalid date safety
    if (isNaN(date.getTime())) {
        rfqExpired.min = new Date().toISOString().slice(0, 16);
        console.log("Wrong Indent Expired On date")
        return;
    }
    rfqExpired.min = date.toISOString().slice(0, 16);
}






