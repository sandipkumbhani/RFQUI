
var locationResponseDto;
$(document).ready(function () {
    // Optionally, add "Cancel" to go back to the list
    $("#btnCancel").on("click", function () {
        window.location.reload(true);
    });

    $('#locationListSectionLink').on('click', function (e) {
        e.preventDefault(); // prevent default anchor behavior
        $('#locationFormSection').hide(); // hide the add/edit form
        $('#locationListSection').show(); // show the list
    });

    Initialization();
    GetAllCityList();
    UpdateLocation();
    FetchLocationList();
});
$("#btnAddLocation").on("click", function (e) {
    e.preventDefault();
    $("#locationListSection").hide();
    $("#locationFormSection").show();
});
function Initialization()
{
    $("#btnViewForm").on('click', function () {
        FetchLocationList();
        $("#AddLocationDiv").css('display', 'none');
        $("#backButton").css('display', 'Block');
    });
    $("#txtLocationName").on("blur", function () {
        var locationName = $(this).val();
        if (IsNullOrEmpty(locationName)) {
            toastr.warning("Please enter a valid LocationName", "Validation Error");
            return;
        }
    });
    $("#txtAddress").on("blur", function () {
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
    $("#txtPerson").on("blur", function () {
        var person = $(this).val();
        if (IsNullOrEmpty(person)) {
            toastr.warning("Please enter a Contact Person", "Validation Error");
            return;
        }
    });
    $("#txtMobileNumber").on("blur", function () {
        var mobileNum = $(this).val();
        if (!isMobile(mobileNum)) {
            toastr.warning("Please enter a valid 10-digit Mobile number", "Validation Error");
            return;
        }
    });
    $("#txtLocationCode").on("blur", function () {
        var locationcode = $(this).val();
        if (!isAlphabets(locationcode)) {
            $("#txtLocationCode").val('');
            toastr.warning("Please enter a Location Code", "Validation Error");
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
        var email = $(this).val();
        if (!isValidateEmail(email)) {
            toastr.warning("Please enter a valid email", "Validation Error");
            return;
        }
    });
    $("#txtContactNumber").on("blur", function () {
        var contactnumber = $(this).val();
        if (!isMobile(contactnumber)) {
            toastr.warning("Please enter a contact number", "Validation Error");
            return;
        }
    });
    $('#backButton').on('click', function () {
        window.location.reload(true);
    });
    $("#btnCancel").on("click", function () {
        FetchLocationList();
        $("#AddLocationDiv").css('display', 'none');
        $("#backButton").css('display', 'Block');
    });
    $("#btnSaveForm, #btnSaveAndNewForm").on('click', function () {
        var action = $(this).data('action');
        SaveLocation(action);
    });
}
function FetchLocationList() {
    $("#FetchLocationList").show();
    var locationurl = '/Location/ViewLocationList';
    $.ajax({
        url: locationurl,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            let trlist = response;
            locationResponseDto = response;
            if ($.fn.DataTable.isDataTable('#tablelocation')) {
                $('#tablelocation').DataTable().clear();
            }
            const table = $("#tablelocation").DataTable();
            trlist.forEach(item => {
                table.row.add([
                    item.locationName,
                    item.addressLine,
                    item.city,
                    item.pinCode,
                    item.contactPerson,
                    item.mobNo,
                    item.contactNo,
                    item.whatsAppNo,
                    item.email,
                    `
                    <div class="action-items" style="cursor:pointer;">
                        <a class="icon-btn" onclick="EditLocation(${item.locationId})"><i class="ri-edit-2-line"></i></a>
                        <a class="icon-btn" onclick="DeleteLocation(${item.locationId})"><i class="ri-delete-bin-3-line"></i></a>
                    </div>
                    `
                ]);
            });
            // Redraw table with new data
            table.draw();
            // Update total list count
            $('#totalList').text(`Total List: ${trlist.length}`);
        }
    });
}
function SaveLocation(action) {
    var isvalid = ValidationCheck();
    if (!isvalid) {
        return;
    }
    var locationname = $('#txtLocationName').val();
    var address = $('#txtAddress').val();
    var city = $("#ddlCity").val();
    var pincode = $("#txtPinCode").val();
    var contactPerson = $("#txtPerson").val();
    var contactNumber = $("#txtContactNumber").val();
    var mobileNumber = $("#txtMobileNumber").val();
    var whatsAppNumber = $("#txtWhatsAppNumber").val();
    var email = $("#txtEmail").val();
    var linkid = GetQueryParam("LinkId");

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
        Email: email
    };

    if (action === "save") {
        $.ajax({
            url: '/Location/LocationSave/',
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(formdata),
            success: function (response) {
                toastr.success("Location Details Submitted Successfully!");
                window.location.href = "../Dashboard/Dashboard";
            },
            error: function (req, status, error) {
                toastr.error("Failed to Submit Location Details", "Error");
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
                toastr.success("Location Details Submitted Successfully!");
                $('#LocationForm')[0].reset();
                $('#ddlCity').val(null).trigger('change');
            },
            error: function (req, status, error) {
                toastr.error("Failed to Submit Location Details", "Error");
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
            AddressLine: $('#txtAddress').val(),
            CityId: $("#ddlCity").val(),
            PinCode: $("#txtPinCode").val(),
            ContactPerson: $("#txtPerson").val(),
            ContactNo: $("#txtContactNumber").val(),
            MobNo: $("#txtMobileNumber").val(),
            WhatsAppNo: $("#txtWhatsAppNumber").val(),
            Email: $("#txtEmail").val(),
            LinkId: GetQueryParam("LinkId")
        };
        var editlocationlist = '/Location/EditLocationList';
        $.ajax({
            type: "PUT",
            url: editlocationlist,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(locationmodel),
            dataType: "json",
            success: function (result) {
                if (result.result == "success") {
                    FetchLocationList();
                    toastr.success("Location Details Updated Successfully!");
                    $("#locationFormSection").hide();
                    $("#locationListSection").show();
                    $('#LocationForm')[0].reset();
                    $('#ddlCity').val(null).trigger('change');
                    $("#btnUpdate").hide();
                    $("#btnSaveAndNewForm").show();
                    $("#btnSaveForm").show();

                } else {
                    toastr.error("Failed to Update Location Details!", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Update Location Details!", "Error");
            }
        });
    });
}
function EditLocation(locationId) {
    var data = locationResponseDto.filter(x => x.locationId == locationId);
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
    $('#txtAddress').val(formdata.addressLine);
    $('#ddlCity').selectpicker('val', formdata.cityId);
    $('#ddlCity').selectpicker('refresh');
    $("#txtPinCode").val(formdata.pinCode);
    $("#txtPerson").val(formdata.contactPerson);
    $("#txtContactNumber").val(formdata.contactNo);
    $("#txtMobileNumber").val(formdata.mobNo);
    $("#txtWhatsAppNumber").val(formdata.whatsAppNo);
    $("#txtEmail").val(formdata.email);
    $("#btnSaveForm").hide();
    $("#btnSaveAndNewForm").hide();
    $("#btnViewForm").hide();
}
function DeleteLocation(locationId) {
    var deletelocationlist = '/Location/Deletelocationlist/' + locationId;
    $.ajax({
        url: deletelocationlist,
        type: "DELETE",
        dataType: "json",
        data: JSON.stringify(locationId),
        success: function (response) {
            FetchLocationList();
            toastr.success("Location Details Deleted Successfully!");
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Delete Location Details!", "Error");
        }
    });
}
function GetAllCityList() {
    var deleteCustomerUrl = '/Customer/GetAllCity';
    $.ajax({
        url: deleteCustomerUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            BindDropDown(response);
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function BindDropDown(data) {
    const selectCity = document.getElementById("ddlCity");
    let placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Select City";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    selectCity.appendChild(placeholderOption);
    data.forEach(option => {
        let opt = document.createElement("option");
        opt.value = option.cityId;
        opt.textContent = option.cityName;
        selectCity.appendChild(opt);
    });

    $('.selectpicker').selectpicker('refresh');
}
function ValidationCheck() {
    if (IsNullOrEmpty($("#txtLocationName").val())) {
        toastr.warning("Please enter a valid Location Name", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtPerson").val())) {
        toastr.warning("Please enter a valid Contact Person", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtAddress").val())) {
        toastr.warning("Address is Required", "Validation Error");
        return false;
    }

    if (!isValidateSelect($("#ddlCity").val())) {
        toastr.warning("Please select a City", "Validation Error");
        return false;
    }
    if (!isValidateEmail($("#txtEmail").val())) {
        toastr.warning("Please enter a valid email", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtMobileNumber").val()) || !isMobile($("#txtMobileNumber").val())) {
        toastr.warning("Please enter a valid Mobile Number", "Validation Error");
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

    if (IsNullOrEmpty($("#txtContactNumber").val()) || !isMobile($("#txtContactNumber").val())) {
        toastr.warning("Please enter a valid Contact No", "Validation Error");
        return false;
    }
    return true;
} 