
var userResponseDto;
var allUserList;

$(document).ready(function ()
{ 
    $("#btnCancel").on("click", function ()
    {
        window.location.reload(true);
    });
    $('#userListSectionLink').on('click', function (e) {
        e.preventDefault(); // prevent default anchor behavior
        $('#userFormSection').hide(); // hide the add/edit form
        $('#userListSection').show(); // show the list
    });
    Initialization();
    GetAllLocation();
    GetFranchiseAndCorporateName();
    UpdateUser();
    GetAllUser();
    FetchUser();
});
$("#btnAddUser").on("click", function (e) {
    e.preventDefault();
    $("#userListSection").hide();
    $("#userFormSection").show();
});
function Initialization() {
    $("#btnViewForm").on('click', function () {
        FetchUser();
        $("#adduserdiv").css('display', 'none');
    });
    $("#txtName").on("blur", function () {
        var Textname = $(this).val();
        if (IsNullOrEmpty(Textname)) {
            toastr.warning("Please enter a valid UserName", "Validation Error");
            return;
        }
    });
    $("#ddlCompanyAndFranchise").on("blur", function () {
        var corporatename = $(this).val();
        if (!isValidateSelect(corporatename)) {
            toastr.warning("Please select a valid CorporateName", "Validation Error");
            return;
        }
    });
    $("#txtMobileNo").on("blur", function () {
        var mobileno = $(this).val();
        if (!isMobile(mobileno)) {
            toastr.warning("Please enter a valid MobileNumber", "Validation Error");
            return;
        }
    });
    $("#txtLoginName").on("blur", function () {
        var loginname = $(this).val();
        if (!/^[a-zA-Z0-9\x40!#$%^&*(),.?":{}|<>]+$/.test(loginname)) {
            toastr.warning("Please enter a valid LoginName", "Validation Error");
            return;
        }
    });
    $("#ddlLocation").on("blur", function () {
        var location = $(this).val();
        if (!isValidateSelect(location)) {
            toastr.warning("Please select a valid Location", "Validation Error");
            return;
        }
    });
    $("#txtEmailid").on("blur", function () {
        var emailid = $(this).val();
        if (!isValidateEmail(emailid)) {
            $("#txtEmailid").val('');
            toastr.warning("Please enter a valid Email", "Validation Error");
            return;
        }
    });
    $("#txtPassword").on("blur", function () {
        var password = $(this).val();
        if (!/^[a-zA-Z0-9\x40!#$%^&*(),.?":{}|<>]+$/.test(password)) {
            $("#txtPassword").val('');
            toastr.warning("Please enter a valid PASSWORD", "Validation Error");
            return;
        }
    });
    $('#backButton').on('click', function () {
        window.location.reload(true);
    });
    $('#btnCancel').on('click', function () {
        FetchUser();
        $("#adduserdiv").css('display', 'none')
        $("#backButton").css('display', 'Block');
    });
    $("#btnSaveForm, #btnSaveAndNewForm").on('click', function () {
        var action = $(this).data('action');
        SaveUser(action);
    });

}
function FetchUser() {
    $('#userListSection').show();
    $.ajax({
        url: '/Home/ViewUserList',
        type: "GET",
        dataType: "json",
        success: function (response) {
            let trlist = response;
            userResponseDto = response;
            if ($.fn.DataTable.isDataTable('#tableuser')) {
                $('#tableuser').DataTable().clear();
            }
            const table = $('#tableuser').DataTable();
                trlist.forEach(item => {
                    table.row.add([
                        item.personName,
                        item.company,
                        item.location,
                        item.mobileNo,
                        item.emailId,
                    `
                    <div class="text-center action-items" style="cursor:pointer;">
                        <a class="icon-btn" onclick="EditUser(${item.userId})"><i class="ri-edit-2-line"></i></a>
                        <a class="icon-btn" onclick="DeleteUser(${item.userId})"><i class="ri-delete-bin-3-line"></i></a>
                    </div>
                    ` ]);
                });
            // Redraw table with new data
            table.draw();
            // Update total list count
            $('#totalList').text(`Total List: ${trlist.length}`);
        }
    });
}
function SaveUser(action) {

    var isvalid = ValidationCheck();
    if (!isvalid) {
        return;
    }
    var username = $('#txtName').val();
    var corporatename = $('#ddlCompanyAndFranchise').val();
    var mobileno = $('#txtMobileNo').val();
    var loginname = $('#txtLoginName').val();
    var location = $('#ddlLocation').val();
    var emailid = $('#txtEmailid').val();
    var password = $('#txtPassword').val();

    var formdata = {
        PersonName: username,
        LoginId: loginname,
        Mobileno: mobileno,
        CompanyId: corporatename,
        LocationId: location,
        Emailid: emailid,
        Password: password
    };
    var existuser = allUserList.map(x => x.emailId).includes(emailid)
    if (existuser) {
        toastr.warning("User Is already exist update EmailId", "User Exist");
        $('#txtEmailid').val('');
        return;
    }
    if (action === "save") {
        $.ajax({
            url: '/Home/UserSave/',
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(formdata),
            dataType: "json",
            success: function (response) {
                toastr.success("User Details Submitted Successfully!");
                window.location.href = "../Dashboard/Dashboard";
            },
            error: function (req, status, error) {
                toastr.error("Failed to Save User Details", "Error");
            }
        });
    }
    else if (action === "saveNew") {
        try {
            $.ajax({
                url: '/Home/UserSave/',
                type: "POST",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(formdata),
                dataType: "json",
                success: function (response) {
                    if (response.result == "success") {
                        toastr.success("User Details Submitted Successfully!");
                        $('#userbodyform')[0].reset();
                        $('#ddlCompanyAndFranchise').val(null).trigger('change');
                        $('#ddlLocation').val(null).trigger('change');
                    } else {
                        toastr.error("User already exists", "Error");
                    }
                },
                error: function (req, status, error) {
                    toastr.error("Failed to Save User Details", "Error");
                }
            });


        } catch (error) {
            toastr.error("Failed to Save User Details", "Error");
        }
    }
}
function EditUser(userId) {
    var data = userResponseDto.filter(x => x.userId == userId);
    var formdata = data[0];
    $('#userListSection').css('display', 'none');
    $("#userFormSection").css('display', 'Block');
    $("#backButton").css('display', 'none');
    $("#adduserdiv").css('display', 'Block');
    $("#btnSaveForm").hide();
    $("#btnUpdate").show();
    $("#btnCancel").removeClass('d-none');
    $("#btnSaveAndNewForm").prop("disabled", true);
    $('#hdnUserId').val(formdata.userId);
    $("#txtName").val(formdata.personName);
    $("#txtEmailid").val(formdata.emailId);
    $("#ddlCompanyAndFranchise").val(formdata.companyId);
    $("#txtMobileNo").val(formdata.mobileNo);
    $("#txtLoginName").val(formdata.loginId);
    $('#ddlLocation').selectpicker('val', formdata.locationId);
    $('#ddlCompanyAndFranchise').selectpicker('val', formdata.companyId);
    $('#ddlLocation').selectpicker('refresh');
    $('#txtPassword').val(formdata.password);
    $("#txtPassword").prop("disabled", true);
    $("#btnSaveForm").hide();
    $("#btnSaveAndNewForm").hide();
    $("#btnViewForm").hide();
}
function DeleteUser(userId) {
    var deleteuserlist = '/Home/DeleteUserList/' + userId
    $.ajax({
        url: deleteuserlist,
        type: "DELETE",
        dataType: "json",
        data: JSON.stringify(userId),
        success: function (response) {
            FetchUser();
            toastr.success("User Details Deleted Successfully!");
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Delete User Details!", "Error");
        }
    });
}
function UpdateUser() {
    $("#btnUpdate").on('click', function (e) {
        e.preventDefault();
        var isvalid = ValidationCheck();
        if (!isvalid) {
            return;
        }
        var UserViewModel = {
            UserId: $('#hdnUserId').val(),
            PersonName: $('#txtName').val(),
            CompanyId: $('#ddlCompanyAndFranchise').val(),
            Password: $('#txtPassword').val(),
            LocationId: $('#ddlLocation').val(),
            LoginId: $('#txtLoginName').val(),
            Mobileno: $('#txtMobileNo').val(),
            Emailid: $('#txtEmailid').val(),
        }

        var edituserlist = '/Home/EditUserList';
        $.ajax({
            type: "PUT",
            url: edituserlist,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(UserViewModel),
            dataType: "json",
            success: function (result) {
                if (result.result == "success") {
                    FetchUser();
                    toastr.success("User Details Updated Successfully!");
                    $('#userbodyform')[0].reset();
                    $('#ddlCompanyAndFranchise').val(null).trigger('change');
                    $('#ddlLocation').val(null).trigger('change');
                    $("#btnUpdate").hide();
                    $("#txtPassword").prop("disabled", false);
                    $("#btnSaveAndNewForm").show();
                    $("#btnSaveForm").show();
                    $("#userFormSection").hide();

                } else {
                    toastr.error("Failed to Update User Details", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Update User Details", "Error");
            }
        });
    });
}
function GetAllLocation() {
    $.ajax({
        url: '/Location/ViewLocationList',
        type: "GET",
        dataType: "json",
        success: function (response) {
            var data = response
            const selectLocation = document.getElementById("ddlLocation");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select Location";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectLocation.appendChild(placeholderOption);
            data.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.locationId;
                opt.textContent = option.locationName;
                selectLocation.appendChild(opt);
            });

            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function GetFranchiseAndCorporateName() {

    var GetUrl = '/Home/GetAllCompanyAndFranchise';
    $.ajax({
        url: GetUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            var data = response.filter(x => x.companyTypeId == 2 || x.companyTypeId == 3);
            const CompanyAndFranchiseDrp = document.getElementById("ddlCompanyAndFranchise");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Franchise/Corporate Name";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            CompanyAndFranchiseDrp.appendChild(placeholderOption);
            data.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.companyId;
                opt.textContent = option.companyName;
                CompanyAndFranchiseDrp.appendChild(opt);
            });

            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function ValidationCheck() {
    if (IsNullOrEmpty($("#txtName").val())) {
        toastr.warning("Please enter a valid User Name", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtLoginName").val()) || !/^[a-zA-Z0-9\x40!#$%^&*(),.?":{}|<>]+$/.test($("#txtLoginName").val())) {
        toastr.warning("Login Name is Required", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtPassword").val())) {
        toastr.warning("Password is Required", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtEmailid").val()) || !isValidateEmail($("#txtEmailid").val())) {
        toastr.warning("Please enter a valid email", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#ddlCompanyAndFranchise").val()) || !isValidateSelect($("#ddlCompanyAndFranchise").val())) {
        toastr.warning("Please select a Corporate Name", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#ddlLocation").val()) || !isValidateSelect($("#ddlLocation").val())) {
        toastr.warning("Please select a Location", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtMobileNo").val()) || !isMobile($("#txtMobileNo").val())) {
        toastr.warning("Please enter a valid Mobile Number", "Validation Error");
        return false;
    }
    return true;
}
function GetAllUser() {
    var getUrl = '/Dashboard/Dashboard';
    $.ajax({
        url: getUrl,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            allUserList = response;
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
};