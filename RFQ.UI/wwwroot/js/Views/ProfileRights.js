$(document).ready(function () {
    GetAllProfileName();
    GetAllMenuName();
    GetLinkItemList(1)
    OnChangeMenuGroupDropDown();
});

$("#btnSaveForm").on('click', function (event) {
    event.preventDefault();
    Save();
});
$('#btnSaveAndNewForm').on('click', function () {
    Save();
    $('#userbodyform')[0].reset();
});
function Save() {
    var ProfileName = $('#txtName').val();
    var MenuName = $('#txtMenu').val();
    if (!isValidateSelect(ProfileName)) {
        toastr.warning("Please select a valid Profile Name", "Warning");
        return;
    }
    if (!isValidateSelect(MenuName)) {
        toastr.warning("Please select a valid Menu Name", "Warning");
        return;
    }
    var formdata = {
        ProfileName: ProfileName,
        MenuName: MenuName
    };
    console.log(formdata)
    $.ajax({
        url: '/Profile/Profilerightsave/',
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(formdata),
        success: function (response) {
            console.log(response);
            toastr.success("Profilerigt submitted successfully!");
        },
        error: function (req, status, error) {
            console.log(error);
        }
    });
}
function GetAllProfileName() {
    $.ajax({
        url: '/Profile/ViewProfile',
        type: "GET",
        dataType: "json",
        success: function (response) {
            //debugger;
            console.log(response);
            var data = response
            const selectProfileName = document.getElementById("txtName");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select Profile";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectProfileName.appendChild(placeholderOption);
            data.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.profileId;
                opt.textContent = option.profileName;
                selectProfileName.appendChild(opt);
            });

            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to fetch data!", "Error");
        }
    });
}
function GetAllMenuName() {
    $.ajax({
        url: '/Profile/GetAllMenuGroup',
        type: "GET",
        dataType: "json",
        success: function (response) {
            //debugger;
            console.log(response);
            var data = response
            const selectProfileRightsName = document.getElementById("txtMenu");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select Menu Group Name";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectProfileRightsName.appendChild(placeholderOption);
            data.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.linkGroupId;
                opt.textContent = option.linkGroupName;
                selectProfileRightsName.appendChild(opt);
            });

            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            console.log("Response Text:", xhr.response.Text);
            toastr.error("Failed to fetch data!", "Error");
        }
    });
}
function GetLinkItemList(linkGroupId) {
    var GetUrl = '/Profile/GetLinkItemList';
    $.ajax({
        url: GetUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            debugger;
            console.log(response);
            var data = $.grep(response, function (x) {
                return x.linkGroupId == parseInt(linkGroupId);
            });
            console.log(data, GetLinkItemList);
            data.forEach((item, index) => {
                var html = '';
                html
                html += '<div class="mb-3">'
                html+= '<div class="row">'
                html += '<div class="col-3 mb-3">'
                html += '<label class="form-check-label me-10">' + item.linkName + '</label>'
                html += '</div>'
                html += '<div class="col">'
                html += '<div class="form-check form-check-inline ms-5">'
                html += '<input class="form-check-input" type="checkbox" id="view1' + item.linkId + '" ' + (item.isView ? 'checked' : '') + '>';
                html += '<label class="form-check-label" for="view1">View</label>'
                html += '</div>'
                html += '<div class="form-check form-check-inline ms-5">'
                html += '<input class="form-check-input" type="checkbox" id="add' + item.linkId + '" ' + (item.isAdd ? 'checked' : '') + '>';
                html += '<label class="form-check-label" for="add1">Add</label>'
                html += '</div>'
                html += '<div class="form-check form-check-inline ms-5">'
                html += '<input class="form-check-input" type="checkbox" id="edit' + item.linkId + '" ' + (item.isEdit ? 'checked' : '') + '>';
                html += '<label class="form-check-label" for="edit1">Edit</label>'
                html += '</div>'
                html += '<div class="form-check form-check-inline ms-5">'
                html += '<input class="form-check-input" type="checkbox" id="cancel' + item.linkId + '" ' + (item.isCancel ? 'checked' : '') + '>';
                html += '<label class="form-check-label" for="cancel1">Cancel</label>'
                html += '</div>'
                html += '</div>'
                html += '</div>'
                html += '</div>'
                $("#menuItemList").append(html)
            });

        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to submit LinkMenu Item ", "Error");
        }
    });
}
function OnChangeMenuGroupDropDown() {
    $("#txtMenu").on('change', function () {
        $("#menuItemList").html('');
        GetLinkItemList($(this).val())
    });
}

