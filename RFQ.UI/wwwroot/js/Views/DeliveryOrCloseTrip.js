var DeliveryDrpList;
const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('LinkId');
var myDropzone;
var companyId;
var profileId;
var locationId;
var orderColumn = '';
var orderDir = '';
var fetchDeliveryUrl = '/DeliveryOrCloseTrip/GetAllDelivery';
$(document).ready(function () {
    companyId = getCookieValue('companyid');
    profileId = getCookieValue('profileid');
    locationId = getCookieValue('locationid');
    $('#ddlLR').on('change', function () {
        debugger;
        const selectedValue = $(this).val();
        if (!selectedValue) {
            return;
        }
        const selectedIndent = DeliveryDrpList.find(x => x.bookingId == selectedValue);
        if (selectedIndent) {

            $('#txtLRNo').val(selectedIndent.bookingNo);
            $('#txtLrDate').val(selectedIndent.bookingDate.split('T')[0]);
            $("#ddlBookingBranch").val(selectedIndent.locationId).trigger('change');
            $('#from-search-box').val(selectedIndent.fromLocation);
            $('#to-search-box').val(selectedIndent.toLocation);
            $('#txtVehicleNo').val(selectedIndent.vehicleNo);
            $("#ddlVehicleType").val(selectedIndent.vehicleTypeId).trigger('change');
            $("#ddlCustomerName").val(selectedIndent.partyId).trigger('change');
            $("#txtConsignorInput").val(selectedIndent.consignerName).trigger('change');
            $("#txtConsigneeInput").val(selectedIndent.consigneeName).trigger('change');
            $('#txtEDD').val(selectedIndent.edd.split('T')[0]);
            $('#txtPkg').val(selectedIndent.totalPacket);
            $('#txtActualWt').val(selectedIndent.actualWeight);
            
        }
    });
    GetCustomer("ddlCustomerName", companyId);
    GetVehicleType("ddlVehicleType", companyId);
    GetAllLocation("ddlLocation", companyId);
    GetLocation("ddlBookingBranch", companyId);
    GetAllConsignorList();
    GetAllConsigneeList(); 
    GetAllLRNo();
    FetchDocumentNo();
    FetchDelivery();
    ButtonUpdateClick()

    $('#tableDivLink').on('click', function (e) {
        FetchDelivery();

    });

    $("#btnCancel").on("click", function () {
        FetchDelivery();
    });

    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir); // update for next click

        $('th.sortable').not(this).data('order', 'asc');

        FetchDataForTable('DeliveryTable', fetchDeliveryUrl, orderColumn, orderDir.toUpperCase(), 'UpdateDelivery', 'DeleteDelivery', 'deliveryId');
    });

    $("#btnSave, #btnSaveAndNew").on('click', function () {
        $(this).prop('disabled', true);
        var action = $(this).data('action');
        if (OnSubmitCheckValidation()) {
            SaveBookingOrTrip(action);
        }
    });
});

$('#btnAdd').click(function () {
    $('#formDiv').css("display", "block");
    $('#tableDiv').css("display", "none");
});
function FetchDelivery() {
    $("#tableDiv").css('display', 'block');
    $("#formDiv").css('display', 'none');
    $('#deliveryForm')[0].reset();
    FetchDocumentNo();
    $('.select2-custom').val(null).trigger('change');
    $("#btnSave").show();
    $("#btnUpdate").hide();
    $("#btnSaveAndNew").show();
    FetchDataForTable('DeliveryTable', fetchDeliveryUrl, orderColumn, orderDir.toUpperCase(), 'UpdateDelivery', 'DeleteDelivery', 'deliveryId');
}
function OnSubmitCheckValidation() {
    if (!isValidateSelect($("#ddlLocation").val())) {
        toastr.warning("Please Select a Delivery Branch", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtDeliveryDate").val())) {
        toastr.warning("Please enter a Delivery Date", "Validation Error");
        return false;
    }

    if (!isValidateSelect($("#ddlLR").val())) {
        toastr.warning("Please Select a LR No", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtArrivalDate").val())) {
        toastr.warning("Please enter a Arrival Date/Time", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtUploadDate").val())) {
        toastr.warning("Please enter a Upload Date/Time", "Validation Error");
        return false;
    }

    return true;
}
function FetchDocumentNo() {

    $.ajax({
        url: "/DeliveryOrCloseTrip/GenerateDocumentNo",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            $("#txtDocumentNo").val(response.result);
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch LR No!", "Error");
        }
    });
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
function GetAllLRNo() {
    $.ajax({
        url: '/BookingOrTrip/GetAllLRNo',
        type: "GET",
        dataType: "json",
        success: function (response) {
            DeliveryDrpList = response.result;
            const selectLocation = document.getElementById("ddlLR");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select LR No";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectLocation.appendChild(placeholderOption);
            DeliveryDrpList.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.bookingId;
                opt.textContent = option.bookingNo;
                selectLocation.appendChild(opt);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
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
function formatDateTimeForInput(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date)) return '';

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);

    // Format for <input type="datetime-local">
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}
function SaveBookingOrTrip(action) {
    var saveUrl = '/DeliveryOrCloseTrip/AddDelivery';

    const formData = {
        LocationId: $('#ddlLocation').val(),
        DeliveryNo: $('#txtDocumentNo').val(),
        DeliveryDate: $('#txtDeliveryDate').val(),
        BookingId: $('#ddlLR').val(),
        ArrivalDateTime: $('#txtArrivalDate').val(),
        UnloadDateTime: $('#txtUploadDate').val(),
        DeliveredPackets: $('#txtPkgs').val(),
        DeliveredWeight: $('#txtWt').val(),
        Signature: "ss",
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
                    $("#btnSaveAndNew").prop('disabled', false);
                    toastr.success("DeliveryOrCloseTrip Saved Successfully!", "Success");
                    addMasterUserActivityLog(0, LogType.Create, "DeliveryOrCloseTrip Saved Successfully!", 0);
                    if (typeof this.completeOnSuccess === "function") {
                        this.completeOnSuccess();
                    }
                } else {
                    toastr.error("Failed to Submit DeliveryOrCloseTrip Details.", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit DeliveryOrCloseTrip Details.", "Error");
            },
            completeOnSuccess: function () {
                FetchDelivery();
            }
        });
    }
    
}
function UpdateDelivery(deliveryId) {
    if ($("#btnUpdate").hasClass('d-none')) {
        $("#btnUpdate").removeClass('d-none');
    }
    var data = viewModelDto.filter(x => x.deliveryId == deliveryId);
    var formData = data[0];
    $('#tableDiv').css('display', 'none');
    $("#formDiv").css('display', 'Block');
    $("#backButton").css('display', 'none');
    $("#formDiv").css('display', 'Block');
    $("#btnSave").hide();
    $("#btnUpdate").show();
    $("#btnView").hide();
    $("#btnCancel").removeClass('d-none');
    $("#btnSaveAndNew").hide();

    $("#txtdeliveryId").val(formData.deliveryId);
    $("#ddlLocation").val(formData.locationId).trigger('change');
    $("#txtDocumentNo").val(formData.deliveryNo);
    $("#txtDeliveryDate").val(formatDateForInput(formData.deliveryDate));
    $("#ddlLR").val(formData.bookingId).trigger('change');

    $("#txtArrivalDate").val(formatDateTimeForInput(formData.arrivalDateTime));
    $("#txtUploadDate").val(formatDateTimeForInput(formData.unloadDateTime));
    $("#txtPkgs").val(formData.deliveredPackets);
    $("#txtWt").val(formData.deliveredWeight);
}
function ButtonUpdateClick() {
    $("#btnUpdate").on('click', function (e) {
        e.preventDefault();
        var isValid = OnSubmitCheckValidation();
        if (!isValid) {
            return;
        }

        var formData = {
            DeliveryId: $("#txtdeliveryId").val(),
            LocationId: $('#ddlLocation').val(),
            DeliveryNo: $('#txtDocumentNo').val(),
            DeliveryDate: $('#txtDeliveryDate').val(),
            BookingId: $('#ddlLR').val(),
            ArrivalDateTime: $('#txtArrivalDate').val(),
            UnloadDateTime: $('#txtUploadDate').val(),
            DeliveredPackets: $('#txtPkgs').val(),
            DeliveredWeight: $('#txtWt').val(),
            Signature: "ss",
            LinkId: GetQueryParam("LinkId"),
        };
        var linkd = GetQueryParam("LinkId");
        // First AJAX call
        $.ajax({
            type: "PUT",
            url: "/DeliveryOrCloseTrip/UpdateDelivery",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(formData),
            dataType: "json",
            success: function (result) {
                if (result.result == "success") {
                    toastr.success("DeliveryOrCloseTrip Details Updated Successfully!");
                    addMasterUserActivityLog(0, LogType.Update, "DeliveryOrCloseTrip Details Updated Successfully!", 0);
                    $("#formDiv").css('display', 'none');
                    FetchDelivery();
                    $('#deliveryForm')[0].reset();
                    $('#ddlLocation').val(null).trigger('change');
                    $('#ddlLR').val(null).trigger('change');
                    $("#btnUpdate").hide();
                    $("#btnSaveAndNew").show();
                    $("#btnSave").show();
                } else {
                    toastr.error("Failed to Update DeliveryOrCloseTrip Details!", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Update DeliveryOrCloseTrip Details!", "Error");
            }
        });
    });
};
function DeleteDelivery(deliveryId) {
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
            var deleteDeliveryUrl = `/DeliveryOrCloseTrip/DeleteDelivery/${deliveryId}`;
            $.ajax({
                url: deleteDeliveryUrl,
                type: "DELETE",
                contentType: "application/json",
                dataType: "json",
                success: function (response) {
                    if (response && response.result === "success") {
                        toastr.success("DeliveryOrCloseTrip  has been deleted successfully.");
                        addMasterUserActivityLog(0, LogType.Delete, "DeliveryOrCloseTrip has been deleted successfully.", 0);
                        $("#addReqBranchDiv").addClass('d-none');
                        $('#currentPage').val(1);
                        FetchDelivery();
                    } else {
                        toastr.error("Failed to delete DeliveryOrCloseTrip.", "Error");
                    }
                },
                error: function () {
                    toastr.error("Failed to delete DeliveryOrCloseTrip.", "Error");
                }
            });
        }
    });
}
function ViewDelivery(deliveryId) {
    UpdateDelivery(deliveryId);
    $('#formDiv').find('input, select, textarea, button, a').prop('disabled', true);
    $("#btnUpdate").addClass('d-none'); 
}
function GetVehicleType(dropdownId, companyIdParam) {
    $.ajax({
        url: '/Vehicle/GetAllMasterVehicleType',
        type: "GET",
        data: { companyId: companyIdParam },
        dataType: "json",
        success: function (response) {
            if (response != null) {
                var data = response
                const selectVehicleType = document.getElementById(dropdownId);
                let placeholderOption = document.createElement("option");
                placeholderOption.value = "";
                placeholderOption.textContent = "";
                placeholderOption.disabled = true;
                placeholderOption.selected = true;
                selectVehicleType.appendChild(placeholderOption);

                data.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.vehicleTypeId;
                    option.textContent = item.vehicleTypeName;
                    selectVehicleType.appendChild(option);
                });
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Vehicle Type!", "Error");
        }
    });
}
function GetCustomer(dropdownId, companyIdParam) {
    $.ajax({
        url: '/Customer/GetDrpCustomerList',
        type: "GET",
        data: { companyId: companyIdParam },
        dataType: "json",
        success: function (response) {
            var data = response
            const selectCustomer = document.getElementById(dropdownId);
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectCustomer.appendChild(placeholderOption);
            data.forEach(name => {
                const option = document.createElement("option");
                option.value = name.partyId;
                option.textContent = name.partyName;
                selectCustomer.appendChild(option);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Customer Name!", "Error");
        }
    });
}
function GetLocation(dropdownId, companyIdParam, callback) {
    $.ajax({
        url: '/Location/GetAllLocationList',
        type: "GET",
        data: { companyId: companyIdParam },
        dataType: "json",
        success: function (response) {
            var data = response
            const selectLocation = document.getElementById(dropdownId);
            selectLocation.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectLocation.appendChild(placeholderOption);
            data.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.locationId;
                opt.textContent = option.locationName;
                selectLocation.appendChild(opt);
            });
            if (callback && typeof callback === 'function') {
                callback();
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}



