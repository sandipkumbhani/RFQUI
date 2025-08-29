const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('LinkId');
var myDropzone;
var orderColumn = '';
var orderDir = '';
var fetchVehicleIndentUrl = '/VehicleIndent/GetAllVehicleIndent';
var companyId;
var profileId;
var locationId;
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
    FetchIndentNo();
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

        FetchDataForTable('IndentTable', fetchVehicleIndentUrl, orderColumn, orderDir.toUpperCase());
    });

    $("#btnSave, #btnsaveandnew").on('click', function () {
        $(this).prop('disabled', true);
        var action = $(this).data('action');
        if (OnSubmitCheckValidation()) {
            SaveVehicleIndent(action);
        }
    });
});
$('#addCompany').click(function () {
    $('#formDiv').css("display", "block");
    $('#tableDiv').css("display", "none");
});

function FetchVehicleIndent() {
    $("#tableDiv").css('display', 'block');
    $("#formDiv").css('display', 'none');
    $('#vehicleIndentForm')[0].reset();
    //myDropzone.removeAllFiles();
    //$('#ddlCity').val(null).trigger('change');
    $("#btnSave").show();
    $("#btnupdate").hide();
    $("#btnsaveandnew").show();
    //ResetAttachmentRepeater();
    FetchDataForTable('IndentTable', fetchVehicleIndentUrl, orderColumn, orderDir.toUpperCase());
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
function CheckValidation() {
    $("#txtVehicleReqDate").on("change", function () {
        if ($(this).val() <= $('#txtIndentDate').val()) {
            toastr.warning("Vehicle Req On date must be greater than Indent Date.", "Warning");
            $(this).val('');
        }
    });
    $("#txtRfqExpiredOn").on("change", function () {
        var expireDate = $(this).val().split('T')[0];
        if (expireDate <= $('#txtVehicleReqDate').val()) {
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
    if ($("#txtVehicleReqDate").val() <= $('#txtIndentDate').val()) {
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
    if ($("#txtRfqExpiredOn").val().split('T')[0] <= $('#txtVehicleReqDate').val()) {
        toastr.warning("Indent Expired On date must be greater than Vehicle Req On Date.", "Warning");
        $("#txtRfqExpiredOn").val('');
        return false;
    }
    if (IsNullOrEmpty($("#ddlConsignorInput").val())) {
        toastr.warning("Please enter a Consignor", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtPickupAddress").val())) {
        toastr.warning("Please enter a Pickup Address", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#ddlConsigneeInput").val())) {
        toastr.warning("Please enter a Consignee", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtDeliveryAddress").val())) {
        toastr.warning("Please enter a Delivery Address", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlItemName").val())) {
        toastr.warning("Please Select a Item Name", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlPackingType").val())) {
        toastr.warning("Please Select a Packing Type", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtRemarks").val())) {
        toastr.warning("Please enter a Remarks", "Validation Error");
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
        ItemId: $('#ddlItemName').val(),
        PackingTypeId: $('#ddlPackingType').val(),
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
                    window.location.href = "../Dashboard/Dashboard";
                } else {
                    toastr.error("Failed to Submit Vehicle Indent Details.", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Vehicle Indent Details.", "Error");
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
                    $("#btnSave").prop('disabled', false);
                    $("#btnsaveandnew").prop('disabled', false);
                    $('#vehicleIndentForm')[0].reset();
                    $('#ddlCustomerName').val(null).trigger('change');
                    $('#ddlVehicleType').val(null).trigger('change');
                    $('#ddlItemName').val(null).trigger('change');
                    $('#ddlPackingType').val(null).trigger('change');
                    $('#ddlConsignorInput').val(null).trigger('change');
                    $('#ddlConsigneeInput').val(null).trigger('change');
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
    const selectedValue = $("#" + inputId).val();
    const selectedText = $("#" + inputId).find("option:selected").text();
    let result;
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
    $("#btnupdate").on('click', function (e) {
        e.preventDefault();
        debugger;
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
            ItemId: $("#ddlItemName").val(),
            PackingTypeId: $("#ddlPackingType").val(),
            Remarks: $("#txtRemarks").val(),
            LinkId: GetQueryParam("LinkId")
        };


        var linkd = GetQueryParam("LinkId");


        // First AJAX call
        $.ajax({
            type: "PUT",
            url: "/VehicleIndent/UpdateVehicleIndent",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(formData),
            dataType: "json",
            success: function (result) {
                if (result.result == "success") {
                    toastr.success("Vehicle Indent Details Updated Successfully!");
                    $("#formDiv").css('display', 'none');
                    FetchVehicleIndent();
                    $('#vehicleIndentForm')[0].reset();
                    $('#ddlLocation').val(null).trigger('change');
                    $('#ddlCustomerName').val(null).trigger('change');
                    $('#ddlVehicleType').val(null).trigger('change');
                    $('#ddlConsignorInput').val(null).trigger('change');
                    $('#ddlConsigneeInput').val(null).trigger('change');
                    $('#ddlItemName').val(null).trigger('change');
                    $('#ddlPackingType').val(null).trigger('change');
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
function DeleteVehicleIndent(indentId) {
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
                    if (response && response.result === "success") {
                        toastr.success("Vehicle Indent has been deleted successfully.");
                        $("#addReqBranchDiv").addClass('d-none');
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
function UpdateVehicleIndent(indentId) {
    var data = viewModelDto.filter(x => x.indentId == indentId);
    var formData = data[0];
    debugger;
    $('#tableDiv').css('display', 'none');
    $("#formDiv").css('display', 'Block');
    $("#backButton").css('display', 'none');
    $("#formDiv").css('display', 'Block');
    $("#btnSave").hide();
    $("#btnupdate").show();
    $("#btnView").hide();
    $("#btnCancel").removeClass('d-none');
    $("#btnsaveandnew").hide();
    $("#txtIndentId").val(formData.indentId);
    $("#ddlLocation").val(formData.locationId).trigger('change');
    $("#txtIndentNo").val(formData.indentNo);
    $("#txtIndentDate").val(formatDateForInput(formData.indentDate));
    $("#txtVehicleReqDate").val(formatDateForInput(formData.vehicleReqOn));
    $("#txtRfqExpiredOn").val(formData.expiryDate);
    $("#ddlCustomerName").val(formData.partyId).trigger('change');

    $("#from-search-box").val(formData.fromLocation);
    $("fromState").val(formData.fromLocationState);
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
    $("#ddlConsignorInput").val(formData.consignerId).trigger('change');
    $("#txtPickupAddress").val(formData.pickUpAddress);
    $("#ddlConsigneeInput").val(formData.consigneeId).trigger('change');
    $("#txtDeliveryAddress").val(formData.deliveryAddress);
    $("#ddlItemName").val(formData.itemId).trigger('change');
    $("#ddlPackingType").val(formData.packingTypeId).trigger('change');
    $("#txtRemarks").val(formData.remarks);


} 
