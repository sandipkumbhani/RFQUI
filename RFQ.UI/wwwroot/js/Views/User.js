
// View Button click Call Api
var userResponseDto;

$(document).ready(function () {
    Initialization();
    GetAllLocation();
    GetFrenchiseAndcorporateName();
    UpdateUserList();
});
function Initialization() {
    $("#btnViewForm").on('click', function () {
        Fetchuserlist();
        $("#adduserdiv").css('display', 'none')
        $("#backButton").css('display', 'Block');
    });
    $("#txtName").on("blur", function () {
        var Textname = $(this).val();
        if (!isAlphabets(Textname)) {
            $("#txtName").val('');
            toastr.warning("Please enter a valid UserName", "Warning");
            return;
        }
    });
    $("#CompanyAndFranchise").on("blur", function () {
        var corporatename = $(this).val();
        if (!isValidateSelect(corporatename)) {
            //$("#CompanyAndFranchise").val('');
            toastr.warning("Please select a valid CorporateName", "Warning");
            return;
        }
    });
    $("#txtMobileNo").on("blur", function () {
        var mobileno = $(this).val();
        if (!isMobile(mobileno)) {
            //$("#txtMobileNo").val('');
            toastr.warning("Please enter a valid MobileNumber", "Warning");
            return;
        }
    });
    $("#txtLoginName").on("blur", function () {
        var loginname = $(this).val();
        //if(!isAlphabets(txtLoginName))
        if (!/^[a-zA-Z0-9\x40!#$%^&*(),.?":{}|<>]+$/.test(loginname)) {
            $("#txtLoginName").val('');
            toastr.warning("Please enter a valid LoginName", "Warning");
            return;
        }
    });
    $("#selectLocation").on("blur", function () {
        var location = $(this).val();
        if (!isValidateSelect(location)) {
            //$("#selectLocation").val('');
            toastr.warning("Please select a valid Location", "Warning");
            return;
        }
    });
    $("#txtEmailid").on("blur", function () {
        var emailid = $(this).val();
        if (!isValidateEmail(emailid)) {
            $("#txtEmailid").val('');
            toastr.warning("Please enter a valid Email", "Warning");
            return;
        }
    });
    $("#txtPassword").on("blur", function () {
        var password = $(this).val();
        if (!/^[a-zA-Z0-9\x40!#$%^&*(),.?":{}|<>]+$/.test(password))
        //if(!isAlphaNumeric(password))
        {
            $("#txtPassword").val('');
            toastr.warning("Please enter a valid PASSWORD", "Warning");
            return;
        }
    });
    //$("#btnSaveForm").on('click', function (event) {
    //    event.preventDefault();
    //    Save();
    //});
    //$('#btnSaveAndNewForm').on('click', function () {
    //    Save();
    //    $('#userbodyform')[0].reset();
    //});
    $('#backButton').on('click', function () {
        window.location.reload(true);
        // $("#adduserdiv").css('display', 'Block')
        // $("#backButton").css('display', 'none');
        //  $('#tableDiv').hide();
    });
    $('#cancleButton').on('click', function () {
        Fetchuserlist();
        $("#adduserdiv").css('display', 'none')
        $("#backButton").css('display', 'Block');
    });

    $("#btnSaveForm, #btnSaveAndNewForm").on('click', function () {
        var action = $(this).data('action'); // "save" or "saveNew"
        Save(action);
    });

}
function Fetchuserlist() {

    $('#tableDiv').show();
    //var fetchuserlistUrl = '/Home/ViewUserList';
    $.ajax({
        url: '/Home/ViewUserList',
        type: "GET",
        dataType: "json",
        success: function (response) {
            let trlist = response;
            userResponseDto = response;
            // Destroy existing DataTable if exists
            if ($.fn.DataTable.isDataTable('#tableuser')) {
                $('#tableuser').DataTable().clear().destroy();
            }
            $('#tableuser').DataTable({
                "processing": true,
                "serverSide": false,
                "paging": true,
                "pageLength": 10,
                "lengthChange": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": true,
                "responsive": true,
                "info": true,
                "autoWidth": true,
                "responsive": true,
                // "scrollX": true,
                "data": trlist,
                "columns": [
                    { "data": "personName" },
                    { "data": "company" },
                    { "data": "location" },
                    { "data": "mobileNo" },
                    { "data": "emailId" },
                    {
                        "data": "userId",
                        "render": function (data, type, row) {
                            return `
                               <div class="btn-group" role="group">
                               <button type="button" class="btn btn-sm btn-primary"
                               onclick="Edituserlist(${data})">
                               <i class="ti ti-edit"></i> Edit
                               </button>
                               <button type="button" class="btn btn-sm btn-danger"
                               onclick="Deleteuserlist(${data})">
                               <i class="ti ti-trash"></i> Delete
                               </button>
                              </div>`;
                        }
                    },
                ],
                "columnDefs": [
                    {
                        "targets": "_all",
                        "className": "text-center"
                    }
                ]
            });
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to fetch data!", "Error");
        }
    });
}

async function Save(action) {
    var username = $('#txtName').val();
    var corporatename = $('#CompanyAndFranchise').val();
    var mobileno = $('#txtMobileNo').val();
    var loginname = $('#txtLoginName').val();
    var location = $('#selectLocation').val();
    var emailid = $('#txtEmailid').val();
    var password = $('#txtPassword').val();

    if (!isAlphabets(username)) {
        toastr.warning("Please enter a not UserName", "Warning");
        return;
    }
    if (!isValidateSelect(corporatename)) {
        toastr.warning("Please select a valid CorporateName", "Warning");
        return;
    }
    if (!isMobile(mobileno)) {
        toastr.warning("Please enter a valid MobileNumber", "Warning");
        return;
    }
    if (!/^[a-zA-Z0-9\x40!#$%^&*(),.?":{}|<>]+$/.test(loginname))
    //if(!isAlphabets(loginname))
    {
        toastr.warning("Please enter a valid LoginName", "Warning");
        return;
    }
    if (!isValidateSelect(location)) {
        toastr.warning("Please select a valid Location", "Warning");
        return;
    }
    if (!isValidateEmail(emailid)) {
        toastr.warning("Please enter a valid Email", "Warning");
        return;
    }
    if (!/^[a-zA-Z0-9\x40!#$%^&*(),.?":{}|<>]+$/.test(password))
    //if(!isAlphaNumeric(password))
    {
        toastr.warning("Please enter a valid password", "Warning");
        return;
    }
    var formdata = {
        PersonName: username,
        LoginId: loginname,
        Mobileno: mobileno,
        CompanyId: corporatename,
        LocationId: location,
        Emailid: emailid,
        Password: password
    };

    if (action === "save") {
        $.ajax({
            url: '/Home/UserSave/',
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(formdata),
            dataType: "json",
            success: function (response) {
                console.log(response);
                toastr.success("User submitted successfully!");
                window.location.href = "../Dashboard/Dashboard";
            },
            error: function (req, status, error) {
                console.log(error);
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
                    console.log(response);
                    if (response.result == "success") {
                        toastr.success("User submitted successfully!");
                    } else {
                        toastr.success("User already exists");
                    }
                },
                error: function (req, status, error) {
                    console.log(error);
                }
            });

            // Uncomment if needed:
            // toastr.success("User submitted successfully!");
            // $('#selectLocation').selectpicker('val', 0);
            // $('#CompanyAndFranchise').selectpicker('val', 0);
            // $('#selectLocation').selectpicker('refresh');
            // $('#userbodyform')[0].reset();

        } catch (error) {
            console.error("Error:", error);
        }
    }
}
function Edituserlist(userId) {
    console.log(userResponseDto);
    var data = userResponseDto.filter(x => x.userId == userId);
    var formdata = data[0];
    console.log(data);
    $("#tableDiv").hide();
    $("#backButton").css('display', 'Block');
    $("#adduserdiv").css('display', 'Block');
    $("#btnSaveForm").hide();
    $("#btnUpdate").show();
    $("#cancleButton").removeClass('d-none');
    $("#btnSaveAndNewForm").prop("disabled", true);
    $('#txtuserid').val(formdata.userId);
    $("#txtName").val(formdata.personName);
    $("#txtEmailid").val(formdata.emailId);
    $("#CompanyAndFranchise").val(formdata.companyId);
    $("#txtMobileNo").val(formdata.mobileNo);
    $("#txtLoginName").val(formdata.loginId);
    $('#selectLocation').selectpicker('val', formdata.locationId);
    $('#CompanyAndFranchise').selectpicker('val', formdata.companyId);
    $('#selectLocation').selectpicker('refresh');
    $('#txtPassword').val(formdata.password);
    //$('#txtPassword').hide();
    $("#txtPassword").prop("disabled", true);
    $("#btnSaveForm").hide();
    $("#btnSaveAndNewForm").hide();
    $("#btnViewForm").hide();
}
function Deleteuserlist(userId) {
    var deleteuserlist = '/Home/DeleteUserList/' + userId
    $.ajax({
        url: deleteuserlist,
        type: "DELETE",
        dataType: "json",
        data: JSON.stringify(userId),
        success: function (response) {
            $("#backButton").show();
            Fetchuserlist();
            console.log("Deleted successfullyy...")
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to fetch data!", "Error");
        }
    });
}
function UpdateUserList() {
    $("#btnUpdate").on('click', function (e) {
        e.preventDefault();
        var UserViewModel = {
            UserId: $('#txtuserid').val(),
            PersonName: $('#txtName').val(),
            CompanyId: $('#CompanyAndFranchise').val(),
            Password: $('#txtPassword').val(),
            LocationId: $('#selectLocation').val(),
            LoginId: $('#txtLoginName').val(),
            Mobileno: $('#txtMobileNo').val(),
            Emailid: $('#txtEmailid').val(),
        }
       
        //var edituserlist = '@Url.Action("EditUserList", "Home")';
        var edituserlist = '/Home/EditUserList';
        $.ajax({
            type: "PUT",
            url: edituserlist,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(UserViewModel),
            dataType: "json",
            success: function (result) {
                if (result.result == "success") {
                    $("#adduserdiv").css('display', 'none')
                    //$("#dataDiv").html("User updated successfully!");
                    Fetchuserlist();
                    toastr.success("User Updated successfully!");

                } else {
                    $("#dataDiv").html("Failed to update User.");
                }
                $("#btnSaveForm").show();
                $("#btnUpdate").hide();
                $("#btnSaveAndNewForm").prop("disabled", false);
                //$("#txtPassword").prop("disabled", true);
                $("#btnViewForm").click();
            },
            error: function (xhr, status, error) {
                $("#dataDiv").html("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText);
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
            const selectLocation = document.getElementById("selectLocation");
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
            console.error("Error:", error);
            toastr.error("Failed to fetch data!", "Error");
        }
    });
}
function GetFrenchiseAndcorporateName() {

    var GetUrl = '/Home/GetAllCompanyAndFranchise';
    $.ajax({
        url: GetUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);
            var data = response.filter(x => x.companyTypeId == 2 || x.companyTypeId == 3);
            const CompanyAndFranchiseDrp = document.getElementById("CompanyAndFranchise");
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
            console.error("Error:", error);
            toastr.error("Failed to submit company and franchise ", "Error");
        }
    });
}

