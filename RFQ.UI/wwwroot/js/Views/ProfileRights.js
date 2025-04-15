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
            var data = $.grep(response, function (x) {
                return x.linkGroupId == parseInt(linkGroupId);
            });
            data.forEach((item, index) => {
                var html = '';
                html
                html += '<div class="mb-3">'
                html+= '<div class="row">'
                html += '<div class="col-3 mb-3">'
                html += '<label class="form-check-label me-10">' + item.linkName + '</label>'
                html += '</div>'
                html += '<div class="col">'

                //view checkbox
                html += '<div class="form-check form-check-inline ms-5">'
                html += '<input class="form-check-input" type="checkbox" id="view1' + item.linkId + '" ' +
                    (item.isView ? 'checked' : '') +
                    ' onchange="OnChangeViewCheckbox(this, ' + JSON.stringify(item).replace(/"/g, '&quot;') + ')">';
                html += '<label class="form-check-label" for="view' + item.linkId + '">View</label>';
                html += '</div>'

                //Add checkbox
                html += '<div class="form-check form-check-inline ms-5">'
                html += '<input class="form-check-input" type="checkbox" id="add' + item.linkId + '" ' +
                    (item.isAdd ? 'checked' : '') +
                    ' onchange="OnChangeAddCheckbox(this, ' + JSON.stringify(item).replace(/"/g, '&quot;') + ')">';
                html += '<label class="form-check-label" for="add' + item.linkId + '">Add</label>';
                html += '</div>'

                //Edit checkbox
                html += '<div class="form-check form-check-inline ms-5">'
                html += '<input class="form-check-input" type="checkbox" id="edit' + item.linkId + '" ' +
                    (item.isEdit ? 'checked' : '') +
                    ' onchange="OnChangeEditCheckbox(this, ' + JSON.stringify(item).replace(/"/g, '&quot;') + ')">';
                html += '<label class="form-check-label" for="edit' + item.linkId + '">Edit</label>';
                html += '</div>'

                //Cancel checkbox
                html += '<div class="form-check form-check-inline ms-5">'
                html += '<input class="form-check-input" type="checkbox" id="cancel' + item.linkId + '" ' +
                    (item.isCancel ? 'checked' : '') +
                    ' onchange="OnChangeCancelCheckbox(this, ' + JSON.stringify(item).replace(/"/g, '&quot;') + ')">';
                html += '<label class="form-check-label" for="cancel' + item.linkId + '">Cancel</label>';
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

function OnChangeViewCheckbox(checkbox, item) {
    console.log("Checkbox changed for:", item);
    console.log("Is checked:", checkbox.checked);
}

function OnChangeAddCheckbox(checkbox, item) {
    console.log("Add checkbox changed for:", item);
    console.log("Is checked:", checkbox.checked);
}

function OnChangeEditCheckbox(checkbox, item) {
    console.log("Edit checkbox changed for:", item);
    console.log("Is checked:", checkbox.checked);
}

function OnChangeCancelCheckbox(checkbox, item) {
    console.log("Cancel checkbox changed for:", item);
    console.log("Is checked:", checkbox.checked);
}

