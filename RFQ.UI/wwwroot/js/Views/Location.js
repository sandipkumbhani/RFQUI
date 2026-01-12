var orderColumn = '';
var orderDir = '';
var locationResponseDto;
$(document).ready(function () {
    $('#locationListSectionLink').on('click', function (e) {
        FetchLocationList();
    });
    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir); // update for next click

        $('th.sortable').not(this).data('order', 'asc');

        FetchDataForTable('tablelocation', '/Location/ViewLocationList', orderColumn, orderDir.toUpperCase(), 'EditLocation', 'DeleteLocation', 'locationId');
    });
    Initialization();
    GetAllCityList("ddlCity");
    UpdateLocation();
    FetchLocationList();
});

$("#btnAdd").on("click", function (e) {
    e.preventDefault();
    $("#locationListSection").hide();
    $("#locationFormSection").show();
    $('#LocationForm').find('input, select, textarea, button, a').prop('disabled', false);
});
function Initialization() {
    $("#btnViewForm").on('click', function () {
        FetchLocationList();
        $("#AddLocationDiv").css('display', 'none');
        $("#backButton").css('display', 'Block');
    });
    //$("#txtLocationName").on("blur", function () {
    //    var locationName = $(this).val();
    //    if (IsNullOrEmpty(locationName)) {
    //        toastr.warning("Please enter a valid LocationName", "Validation Error");
    //        return;
    //    }
    //});
    $("#from-search-box").on("blur", function () {
        var Address = $(this).val();
        if (IsNullOrEmpty(Address)) {
            toastr.warning("Please enter a Address", "Validation Error");
            return;
        }
    });
    $("#ddlCity").on("blur", function () {
        var city = $(this).val();
        if (!isValidateSelect(city)) {
            toastr.warning("Please enter a City", "Validation Error");
            return;
        }
    });
    $("#txtMobileNumber").on("blur", function () {
        if (!IsNullOrEmpty($(this).val()) && !isMobile($(this).val())) {
            toastr.warning("Please enter a valid Mobile No", "Validation Error");
            return;
        }
    });
    $("#txtPinCode").on("blur", function () {
        var pinc = $(this).val();
        if (!ValidatePinCode(pinc)) {
            toastr.warning("Please enter a Valid Pincode", "Validation Error");
            return;
        }
    });
    $("#txtWhatsAppNumber").on("blur", function () {
        var whats = $(this).val();
        if (!isMobile(whats)) {
            toastr.warning("Please enter a whatsApp number", "Validation Error");
            return;
        }
    });
    $("#txtEmail").on("blur", function () {
        if (!IsNullOrEmpty($(this).val()) && !isValidateEmail($(this).val())) {
            toastr.warning("Please enter a valid email", "Validation Error");
            return;
        }
    });
    $("#txtCode").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Location Code is required.", "Validation Error");
            return;
        }
    })
    $("#txtContactNumber").on("blur", function () {
        if (!IsNullOrEmpty($(this).val()) && !isMobile($(this).val())) {
            toastr.warning("Please enter a valid Contact No", "Validation Error");
            return;
        }
    });
    $("#btnCancel").on("click", function () {
        FetchLocationList();
    });
    $("#btnSaveForm, #btnSaveAndNewForm").on('click', function () {
        var action = $(this).data('action');
        SaveLocation(action);
    });
}
function FetchLocationList() {
    $("#locationFormSection").hide();
    $("#locationListSection").show();
    $('#LocationForm')[0].reset();
    $('#ddlCity').val(0).trigger('change');
    $("#btnUpdate").hide();
    $("#btnSaveAndNewForm").show();
    $("#btnSaveForm").show();
    FetchDataForTable('tablelocation', '/Location/ViewLocationList', null, null, 'EditLocation', 'DeleteLocation', 'locationId');
}
function SaveLocation(action) {
    var isvalid = ValidationCheck();
    if (!isvalid) {
        return;
    }
    var locationname = $('#txtLocationName').val();
    var address = $('#from-search-box').val();
    var city = $("#ddlCity").val();
    var pincode = $("#txtPinCode").val();
    var contactPerson = $("#txtPerson").val();
    var contactNumber = $("#txtContactNumber").val();
    var mobileNumber = $("#txtMobileNumber").val();
    var whatsAppNumber = $("#txtWhatsAppNumber").val();
    var email = $("#txtEmail").val();
    var linkid = GetQueryParam("LinkId");
    var locationCode = $("#txtCode").val();

    var formdata = {
        LinkId: linkid,
        LocationName: locationname,
        AddressLine: address,
        CityId: city,
        PinCode: pincode,
        ContactPerson: contactPerson,
        ContactNo: contactNumber,
        MobNo: mobileNumber,
        WhatsAppNo: whatsAppNumber,
        Email: email,
        Code: locationCode
    };
    if (action === "save") {
        $.ajax({
            url: '/Location/LocationSave/',
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(formdata),
            success: function (response) {
                if (response) {
                    toastr.success("Location Details Submitted Successfully!");
                    addMasterUserActivityLog(0, LogType.Create, "Location Details Submitted Successfully!", 0);
                    if (typeof this.completeOnSuccess === "function") {
                        this.completeOnSuccess();
                    }
                }
                else {
                    toastr.error("Failed to Submit Location Details", "Error");
                }
            },
            error: function (xhr, status, error) {
                if (xhr.status == 409) {
                    toastr.warning(xhr.responseText, "Already exists");
                }
                else {
                    toastr.error("Failed to Submit Location Details!");
                }
            },
            completeOnSuccess: function () {
                FetchLocationList();
            }
        });
    }
    else if (action === "saveNew") {
        $.ajax({
            url: '/Location/LocationSave/',
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(formdata),
            success: function (response) {
                if (response) {
                    toastr.success("Location Details Submitted Successfully!");
                    addMasterUserActivityLog(0, LogType.Create, "Location Details Submitted Successfully!", 0);
                    $('#LocationForm')[0].reset();
                    $('#ddlCity').val(0).trigger('change');
                }
                else {
                    toastr.error("Failed to Submit Location Details", "Error");
                }
            },
            error: function (xhr, status, error) {
                if (xhr.status == 409)
                    toastr.warning(xhr.responseText, "Already exists");
                else
                    toastr.error("Failed to Submit Location Details!");
            }
        });
    }
}
function UpdateLocation() {
    $("#btnUpdate").on('click', function (e) {
        e.preventDefault();
        var isvalid = ValidationCheck();
        if (!isvalid) {
            return;
        }
        var locationmodel = {
            LocationId: $('#hdnLocationId').val(),
            LocationName: $('#txtLocationName').val(),
            AddressLine: $('#from-search-box').val(),
            CityId: $("#ddlCity").val(),
            PinCode: $("#txtPinCode").val(),
            ContactPerson: $("#txtPerson").val(),
            ContactNo: $("#txtContactNumber").val(),
            MobNo: $("#txtMobileNumber").val(),
            WhatsAppNo: $("#txtWhatsAppNumber").val(),
            Email: $("#txtEmail").val(),
            LinkId: GetQueryParam("LinkId"),
            Code: $("#txtCode").val()
        };
        var editlocationlist = '/Location/EditLocationList';
        $.ajax({
            type: "PUT",
            url: editlocationlist,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(locationmodel),
            dataType: "json",
            success: function (result) {
                if (result) {
                    FetchLocationList();
                    toastr.success("Location Details Updated Successfully!");
                    addMasterUserActivityLog(0, LogType.Update, "Location Details Updated Successfully!", 0);
                    $("#locationFormSection").hide();
                    $("#locationListSection").show();
                    $('#LocationForm')[0].reset();
                    $('#ddlCity').val(0).trigger('change');
                    $("#btnUpdate").hide();
                    $("#btnSaveAndNewForm").show();
                    $("#btnSaveForm").show();
                } else {
                    toastr.error("Failed to Update Location Details!", "Error");
                }
            },
            error: function (xhr, status, error) {
                if (xhr.status == 409) {
                    toastr.warning(xhr.responseText, "Already exists");
                }
                else {
                    toastr.error("Failed to Update Location Details!");
                }
            }
        });
    });
}
function EditLocation(locationId) {
    if ($("#btnUpdate").hasClass('d-none')) {
        $("#btnUpdate").removeClass('d-none');
        $('#LocationForm').find('input, select, textarea, button, a').prop('disabled', false);
    }
    var data = viewModelDto.filter(x => x.locationId == locationId);
    var formdata = data[0];
    $('#locationListSection').css('display', 'none');
    $("#locationFormSection").css('display', 'Block');
    $("#backButton").css('display', 'none');
    $("#AddLocationDiv").css('display', 'Block');
    $("#btnSaveForm").hide();
    $("#btnUpdate").show();
    $("#btnCancel").removeClass('d-none');
    $("#btnSaveAndNewForm").prop("disabled", true);
    $('#hdnLocationId').val(formdata.locationId);
    $('#txtLocationName').val(formdata.locationName);
    $('#from-search-box').val(formdata.addressLine);
    $('#ddlCity').val(formdata.cityId).trigger('change');
    $("#txtPinCode").val(formdata.pinCode);
    $("#txtPerson").val(formdata.contactPerson);
    $("#txtContactNumber").val(formdata.contactNo);
    $("#txtMobileNumber").val(formdata.mobNo);
    $("#txtWhatsAppNumber").val(formdata.whatsAppNo);
    $("#txtEmail").val(formdata.email);
    $("#txtCode").val(formdata.code);
    $("#btnSaveForm").hide();
    $("#btnSaveAndNewForm").hide();
    $("#btnViewForm").hide();
}
function DeleteLocation(locationId) {
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
            var deletelocationlist = '/Location/Deletelocationlist/' + locationId;
            $.ajax({
                url: deletelocationlist,
                type: "DELETE",
                dataType: "json",
                data: JSON.stringify(locationId),
                success: function (response) {
                    FetchLocationList();
                    toastr.success("Location Details Deleted Successfully!");
                    addMasterUserActivityLog(0, LogType.Delete, "Location Details Deleted Successfully!", 0);
                },
                error: function (xhr, status, error) {
                    toastr.error("Failed to Delete Location Details!", "Error");
                }
            });
        }
    });
}
function ValidationCheck() {
    if (IsNullOrEmpty($("#txtLocationName").val())) {
        toastr.warning("Please enter a valid Location Name", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtCode").val())) {
        toastr.warning("Location Code is required.", "Validation Error");
        return;
    }
    if (IsNullOrEmpty($("#from-search-box").val())) {
        toastr.warning("Address is Required", "Validation Error");
        return false;
    }

    if (!isValidateSelect($("#ddlCity").val())) {
        toastr.warning("Please select a City", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtPinCode").val()) || !ValidatePinCode($("#txtPinCode").val())) {
        toastr.warning("Please enter a valid Pincode", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtWhatsAppNumber").val()) || !isMobile($("#txtWhatsAppNumber").val())) {
        toastr.warning("Please enter a valid WhatsApp Number", "Validation Error");
        return false;
    }
    return true;
}

$('#tablelocationSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchLocationList('tablelocation', '/Location/ViewLocationList', orderColumn, orderDir.toUpperCase());
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchLocationList('tablelocation', '/Location/ViewLocationList', orderColumn, orderDir.toUpperCase());
})
function ViewLocation(locationId) {
    EditLocation(locationId);
    $('#LocationForm').find('input, select, textarea, button, a').prop('disabled', true);
    $("#btnUpdate").addClass('d-none');
}
