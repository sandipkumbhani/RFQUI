var orderColumn = '';
var orderDir = '';
var userResponseDto;
var allUserList = [];
var profileid = '';
var companyid = ''
var locationid;
$(document).ready(function () {

    profileid = getCookieValue('profileid');
    companyid = getCookieValue('companyid');
    locationid = getCookieValue('locationid');

    if (profileid == EnumInternalMaster.ADMIN) {
        $('#ddlLocation').prop('disabled', true);
        $("#btnActivitylog").removeClass('d-none');
    }
    $("#btnCancel").on("click", function () {
        FetchUser();
    });
    $('#userListSectionLink').on('click', function (e) {
        FetchUser();
    });

    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir); // update for next click

        $('th.sortable').not(this).data('order', 'asc');

        FetchDataForTable('tableuser', '/Home/ViewUserList', orderColumn, orderDir.toUpperCase());

    });
    Initialization();
    GetAllLocation("ddlLocation", companyid, function () {
        if (profileid == EnumProfile.Branch) {
            $('#ddlLocation').val(Number(locationid)).trigger('change');
            $('#ddlLocation').prop('disabled', true);
        }
    });
    GetFranchiseAndCorporateName();
    UpdateUser();
    FetchUser();
});

$("#btnAddUser").on("click", function (e) {
    e.preventDefault();
    $("#userListSection").hide();
    $("#btnUpdate").hide();
    $("#userFormSection").show();
    $("#btnSaveForm").show();
    $("#btnSaveAndNewForm").show();
    $("#txtPassword").prop("disabled", false);
    $('#ddlCompanyAndFranchise').val(Number(companyid)).trigger('change');


    if (!IsNullOrEmpty($('#ddlCompanyAndFranchise').val())) {
        $('#ddlCompanyAndFranchise').prop('disabled', true);
    }
    else {
        $('#ddlCompanyAndFranchise').val(0).trigger('change');
        $('#ddlCompanyAndFranchise').prop('disabled', false);
    }
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
        if (!/^(?=.{3,20}$)(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9._]*[a-zA-Z0-9]$/.test(loginname)) {
            toastr.warning("Login Name must be 3–20 characters, start with a letter, and contain only letters,No numbers and WhightSpace, . or _ (no consecutive symbols)", "Invalid Format");
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
        if (!emailid || emailid == "") {
            return;
        }
        else {
            if (!isValidateEmail(emailid)) {
                $("#txtEmailid").val('');
                toastr.warning("Please enter a valid Email", "Validation Error");
                return;
            }
        }
    });
    $("#txtPassword").on("blur", function () {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        var password = $(this).val();
        if (!passwordPattern.test(password)) {
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
    $('#userFormSection').hide();
    $('#userbodyform')[0].reset();
    $('#ddlCompanyAndFranchise').val(null).trigger('change');
    $('#ddlLocation').val(null).trigger('change');
    FetchDataForTable('tableuser', '/Home/ViewUserList', null, null);
}
function SaveUser(action) {
    var profile = '';
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

    if (profileid == EnumProfile.Admin) {
        profile = EnumProfile.Franchise; // Default to Franchise for Admin
    }
    if (profileid == EnumProfile.Franchise) {
        var ddllocationVal = $('#ddlLocation').val();
        if (!IsNullOrEmpty(ddllocationVal)) {
            profile = EnumProfile.Branch;
        } else {
            profile = EnumProfile.Corporate;
        }
    }
    if (profileid == EnumProfile.Branch) {
        profile = EnumProfile.Branch
    }
    if (profileid == EnumProfile.Corporate) {
        profile = EnumProfile.Corporate
    }

    var formdata = {
        PersonName: username,
        LoginId: loginname,
        Mobileno: mobileno,
        CompanyId: corporatename,
        LocationId: location,
        Emailid: emailid,
        Password: password,
        ProfileId: profile
    };

    if (action === "save") {
        $.ajax({
            url: '/Home/UserSave/',
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(formdata),
            dataType: "json",
            success: function (response) {
                if (response.result == "success") {
                    toastr.success("User Details Submitted Successfully!");
                    addMasterUserActivityLog(0, LogType.Create, "User Details Submitted Successfully!", 0);
                    if (typeof this.completeOnSuccess === "function") {
                        this.completeOnSuccess();
                    }
                }
                else {
                    toastr.error("User already exists", "Error");
                }
            },
            error: function (req, status, error) {
                toastr.error("Failed to Save User Details", "Error");
            },
            completeOnSuccess: function () {
                FetchUser();
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
                        addMasterUserActivityLog(0, LogType.Create, "User Details Submitted Successfully!", 0);
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
    var data = viewModelDto.filter(x => x.userId == userId);
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
    $("#txtMobileNo").val(formdata.mobileNo);
    $("#txtLoginName").val(formdata.loginId);
    $('#ddlCompanyAndFranchise').val(formdata.companyId).trigger('change');
    $('#txtPassword').val(formdata.password);
    $("#txtPassword").prop("disabled", true);
    $("#btnSaveForm").hide();
    $("#btnSaveAndNewForm").hide();
    $("#btnViewForm").hide();
    if (formdata.locationId != 0) {
        $('#ddlLocation').val(formdata.locationId).trigger('change');
    }
    //if (profileid != EnumInternalMaster.ADMIN) {
    //    $('#ddlCompanyAndFranchise').prop('disabled', true);
    //}
    if (!IsNullOrEmpty($('#ddlCompanyAndFranchise').val())) {
        $('#ddlCompanyAndFranchise').prop('disabled', true);
    }
    else {
        $('#ddlCompanyAndFranchise').val(0).trigger('change');
        $('#ddlCompanyAndFranchise').prop('disabled', false);
    }

    if (profileid == EnumProfile.Branch) {
        $('#ddlLocation').val(Number(formdata.locationId)).trigger('change');
        $('#ddlLocation').prop('disabled', true);
    }
}
function DeleteUser(userId) {
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
            var deleteUserUrl = '/Home/DeleteUserList/' + userId;

            $.ajax({
                url: deleteUserUrl,
                type: "DELETE",
                contentType: "application/json",
                dataType: "json",
                success: function (response) {
                    FetchUser();
                    toastr.success("User details have been deleted successfully.");
                    addMasterUserActivityLog(0, LogType.Delete, "User details have been deleted successfully.", 0);
                },
                error: function (xhr, status, error) {
                    toastr.error("Failed to delete user details.", "Error");
                }
            });
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
                    addMasterUserActivityLog(0, LogType.Update, "User Details Updated Successfully!", 0);
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
function GetFranchiseAndCorporateName() {
    debugger;
    var GetUrl = '/Home/GetAllCompanyAndFranchise';
    $.ajax({
        url: GetUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            var data = null
            var profileid = getCookieValue("profileid");
            if (!IsNullOrEmpty(profileid)) {
                if (profileid == EnumProfile.Admin)
                    data = response.filter(x => x.companyTypeId == 2);
                if (profileid == EnumProfile.Franchise || profileid == EnumProfile.Corporate || profileid == EnumProfile.Vendor)
                    data = response.filter(x => x.companyTypeId == 3);
            }
            const CompanyAndFranchiseDrp = document.getElementById("ddlCompanyAndFranchise");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
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
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function ValidationCheck() {
    if (IsNullOrEmpty($("#txtName").val())) {
        debugger;
        toastr.warning("Please enter a valid User Name", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtLoginName").val()) || !/^(?=.{3,20}$)(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9._]*[a-zA-Z0-9]$/.test($("#txtLoginName").val())) {
        toastr.warning("Login Name must be 3–20 characters, start with a letter, and contain only letters,No numbers and WhightSpace, . or _ (no consecutive symbols)", "Invalid Format");
        return false;
    }
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (IsNullOrEmpty($("#txtPassword").val() || !passwordPattern.test(password))) {
        toastr.warning("Please enter a valid PASSWORD", "Validation Error");
        return false;
    }

    //if (IsNullOrEmpty($("#txtEmailid").val()) || !isValidateEmail($("#txtEmailid").val())) {
    //    toastr.warning("Please enter a valid email", "Validation Error");
    //    return false;
    //}

    if (IsNullOrEmpty($("#ddlCompanyAndFranchise").val()) || !isValidateSelect($("#ddlCompanyAndFranchise").val())) {
        toastr.warning("Please select a Corporate Name", "Validation Error");
        return false;
    }
    if ($('#ddlLocation').is(':disabled')) {
        return true;
    }

    if (profileid == EnumProfile.Corporate) {
        if (IsNullOrEmpty($("#ddlLocation").val()) || !isValidateSelect($("#ddlLocation").val())) {
            toastr.warning("Please select a Location", "Validation Error");
            return false;
        }
    }

    if (IsNullOrEmpty($("#txtMobileNo").val()) || !isMobile($("#txtMobileNo").val())) {
        toastr.warning("Please enter a valid Mobile Number", "Validation Error");
        return false;
    }
    return true;
}


// Bind events
$('#tableuserSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchUser('tableuser', '/Home/ViewUserList', orderColumn, orderDir.toUpperCase());
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchUser('tableuser', '/Home/ViewUserList', orderColumn, orderDir.toUpperCase());
}); 
