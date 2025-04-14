
var locationResponseDto;

$("#btnViewForm").on('click', function () {
    Fetchlocationlist();
    $("#AddLocationDiv").css('display', 'none');
    $("#backButton").css('display', 'Block');
});
$("#txtLocationName").on("blur change", function () {
    var locationname = $(this).val();
    if (!isAlphabets(locationname)) {
        $("#txtLocationName").val('');
        toastr.warning("Please enter a valid LocationName", "Warning");
        return;
    }
});
$("#txtAddress").on("blur change", function () {
    var Address = $(this).val();
    if (!isAlphaNumeric(Address)) {
        $("#txtAddress").val('');
        toastr.warning("Please enter a Address", "Warning");
        return;
    }
});
$("#selectCity").on("blur change", function () {
    var city = $(this).val();
    if (!isValidateSelect(city)) {
        toastr.warning("Please enter a City", "Warning");
        return;
    }
});
$("#txtPerson").on("blur change", function () {
    var person = $(this).val();
    if (!isAlphabets(person)) {
        $("#txtPerson").val('');
        toastr.warning("Please enter a Contact Person", "Warning");
        return;
    }
});
$("#txtMobileNumber").on("blur change", function () {
    var mobileNum = $(this).val();
    if (!isMobile(mobileNum)) {
        toastr.warning("Please enter a valid 10-digit Mobile number", "Warning");
        return;
    }
});
$("#txtLocationCode").on("blur change", function () {
    var locationcode = $(this).val();
    if (!isAlphabets(locationcode)) {
        $("#txtLocationCode").val('');
        toastr.warning("Please enter a Location Code", "Warning");
        return;
    }
});
$("#txtPinCode").on("blur change", function () {
    var pinc = $(this).val();
    if (!/^\d{6}$/.test(pinc)) {
        // $(this).focus();
        toastr.warning("Please enter a Valid Pincode", "Warning");
        return;
    }
});
$("#txtWhatsAppNumber").on("blur change", function () {
    var whats = $(this).val();
    if (!isMobile(whats)) {
        toastr.warning("Please enter a whatsApp number", "Warning");
        return;
    }
});
$("#txtEmail").on("blur change", function () {
    var email = $(this).val();
    if (!isValidateEmail(email)) {
        $("#txtEmail").val('');
        toastr.warning("Please enter a valid email", "Warning");
        return;
    }
});
$("#txtContactNumber").on("blur change", function () {
    var contactnumber = $(this).val();
    if (!isMobile(contactnumber)) {
        toastr.warning("Please enter a contact number", "Warning");
        return;
    }
});
$("#btnSaveForm").on('click', function (event) {
    event.preventDefault();
    Save();
});
$('#btnSaveAndNewForm').on('click', function () {
    Save();
    $('#userbodyform')[0].reset();
});
$('#backButton').on('click', function () {
    window.location.reload(true);
    // $("#AddLocationDiv").css('display', 'Block');
    // $("#backButton").css('display', 'none');
    // $('#tableDiv').hide();
});
$("#cancleButton").on("click", function () {
    Fetchlocationlist();
    $("#AddLocationDiv").css('display', 'none');
    $("#backButton").css('display', 'Block');
});
function Fetchlocationlist() {
    $('#tableDiv').show();
    $.ajax({
        url: '/Location/ViewLocationList',
        type: "GET",
        dataType: "json",
        success: function (response) {
            let trlist = response;
            console.log(response);
            locationResponseDto = response;
            // Destroy existing DataTable if exists
            if ($.fn.DataTable.isDataTable('#tablelocation')) {
                $('#tablelocation').DataTable().clear().destroy();
            }
            $('#tablelocation').DataTable({
                "processing": true,
                "serverSide": false,
                "paging": true,
                "pageLength": 10,
                "lengthChange": true,
                "searching": true,
                "ordering": false,
                "info": true,
                "autoWidth": true,
                "responsive": true,
                "scrollX": true,
                "data": trlist,
                "columns": [
                    { "data": "locationName" },
                    { "data": "addressLine" },
                    { "data": "city" },
                    { "data": "pinCode" },
                    { "data": "contactPerson" },
                    { "data": "contactNo" },
                    { "data": "mobNo" },
                    { "data": "whatsAppNo" },
                    { "data": "email" },
                    {
                        "data": "locationId",
                        "render": function (data, type, row) {
                            return `
    <div class="btn-group" role="group">
        <button type="button" class="btn btn-sm btn-primary" onclick="Editlocationlist(${data})">
            <i class="ti ti-edit"></i> Edit
        </button>
        <button type="button" class="btn btn-sm btn-danger" onclick="Deletelocationlist(${data})">
            <i class="ti ti-trash"></i> Delete
        </button>
    </div>`;
                        }
                    }
                ],
                "columnDefs": [{
                    "targets": "_all",
                    "className": "text-center"
                }]
            });
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to fetch data!", "Error");
        }
    });
}
function Save() {
    var locationname = $('#txtLocationName').val();
    var address = $('#txtAddress').val();
    var city = $("#selectCity").val();
    var pincode = $("#txtPinCode").val();
    var contactPerson = $("#txtPerson").val();
    var contactNumber = $("#txtContactNumber").val();
    var mobileNumber = $("#txtMobileNumber").val();
    var whatsAppNumber = $("#txtWhatsAppNumber").val();
    var email = $("#txtEmail").val();

    if (!isAlphabets(locationname)) {
        toastr.warning("Please enter a valid Location Name", "Warning");
        return;
    }
    if (!isAlphaNumeric(address)) {
        toastr.warning("Please enter a Address", "Warning");
        return;
    }
    if (!isValidateSelect(city)) {
        toastr.warning("Please enter a City", "Warning");
        return;
    }
    if (!/^\d{6}$/.test(pincode)) {
        toastr.warning("Please enter a Valid Pincode", "Warning");
        return;
    }
    if (!isAlphabets(contactPerson)) {
        toastr.warning("Please enter a Contact Person", "Warning");
        return;
    }
    if (!isValidateEmail(email)) {
        toastr.warning("Please enter a valid email", "Warning");
        return;
    }
    if (!isMobile(whatsAppNumber)) {
        toastr.warning("Please enter a whatsApp number", "Warning");
        return;
    }
    if (!isMobile(mobileNumber)) {
        toastr.warning("Please enter a valid 10-digit mobile number", "Warning");
        return;
    }
    if (!isMobile(contactNumber)) {
        toastr.warning("Please enter a valid 10-digit contact number", "Warning");
        return;
    }

    var formdata = {
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
    console.log(formdata);
    $.ajax({
        url: '/Location/LocationSave/',
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(formdata),
        success: function (response) {
            console.log(response);
            toastr.success("Location submitted successfully!");
        },
        error: function (req, status, error) {
            console.log(error);
        }
    });
}

$(document).ready(function () {
    GetAllCityList();
    UpdateLocationList();
});
function UpdateLocationList() {
    $("#btnUpdate").on('click',function (e) {
        e.preventDefault();
        var locationmodel = {
            LocationId: $('#txtLocationId').val(),
            LocationName: $('#txtLocationName').val(),
            AddressLine: $('#txtAddress').val(),
            CityId: $("#selectCity").val(),
            PinCode: $("#txtPinCode").val(),
            ContactPerson: $("#txtPerson").val(),
            ContactNo: $("#txtContactNumber").val(),
            MobNo: $("#txtMobileNumber").val(),
            WhatsAppNo: $("#txtWhatsAppNumber").val(),
            Email: $("#txtEmail").val()
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
                    toastr.success("Location Updated successfully!");
                    $("#adduserdiv").css('display', 'none');
                    Fetchlocationlist();
                } else {
                    $("#dataDiv").html("Failed to update Location.");
                    toastr.error("Failed to Location Updated");
                }
                $("#btnSaveForm").show();
                $("#btnUpdate").hide();
                $("#btnSaveAndNewForm").prop("disabled", false);
                $("#btnViewForm").click();
            },
            error: function (xhr, status, error) {
                $("#dataDiv").html("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText);
            }
        });
    });
}
function Editlocationlist(locationId) {
    console.log(locationResponseDto);
    var data = locationResponseDto.filter(x => x.locationId == locationId);
    var formdata = data[0];
    console.log(formdata);
    $("#tableDiv").hide();
    $("#backButton").css('display', 'none');
    $("#AddLocationDiv").css('display', 'Block');
    $("#btnSaveForm").hide();
    $("#btnUpdate").show();
    $("#cancleButton").removeClass('d-none');
    $("#btnSaveAndNewForm").hide();
    $('#txtLocationId').val(formdata.locationId);
    $('#txtLocationName').val(formdata.locationName);
    $('#txtAddress').val(formdata.addressLine);
    $('#selectCity').selectpicker('val', formdata.cityId);
    $('#selectCity').selectpicker('refresh');
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
function Deletelocationlist(locationId) {
    var deletelocationlist = '/Location/Deletelocationlist/' + locationId;
    $.ajax({
        url: deletelocationlist,
        type: "DELETE",
        dataType: "json",
        data: JSON.stringify(locationId),
        success: function (response) {
            Fetchlocationlist();
            toastr.success("Location Deleted successfully...");
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to fetch data!", "Error");
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
            console.log(response);
            BindDropDown(response);
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to fetch data!", "Error");
        }
    });
}
function BindDropDown(data) {
    const selectCity = document.getElementById("selectCity");
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
