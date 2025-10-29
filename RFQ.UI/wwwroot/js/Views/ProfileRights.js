var linkItemData = [];
var ViewCheckboxData = []; // set globaly for OnChangeViewCheckbox
var AddCheckboxData = []; // set globaly for OnChangeAddCheckbox
var EditCheckboxData = []; // set globaly for OnChangeEditCheckbox
var CancelCheckboxData = []; // set globaly for OnChangeCancelCheckbox

$(document).ready(function () {
    initializjquery();
    GetAllProfileName();
    GetAllMenuName();
    GetLinkItemList()
    OnChangeMenuGroupDropDown();
    CheckAll();
});
function initializjquery() {
    $("#btnSaveForm").on('click', function (event) {
        event.preventDefault();
        GetAllProfileRightsData();
    });

    $('#btnSaveAndNewForm').on('click', function () {
        SaveProfileRights();
        $('#userbodyform')[0].reset();
    });

    $("#txtName").on('change', function () {
        $("#menuItemList").html("");
        GetLinkItemList($("#txtMenu").val(), $("#txtName").val())
    })
}
function SaveProfileRights() {
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
    $.ajax({
        url: '/Profile/Profilerightsave/',
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(formdata),
        success: function (response) {
            toastr.success("Profilerigt submitted successfully!");
            addMasterUserActivityLog(0, LogType.Create, "Profilerigt submitted successfully!", 0);
        },
        error: function (req, status, error) {
            toastr.error("Failed to submit Profile Rights!");
        }
    });
}
function GetAllProfileName() {
    $.ajax({
        url: '/Profile/ViewProfile',
        type: "GET",
        dataType: "json",
        success: function (response) {
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
            toastr.error("Failed to fetch data!", "Error");
        }
    });
}
function GetLinkItemList(linkGroupId, profileId) {
    var GetUrl = '/Profile/GetLinkItemList';
    $.ajax({
        url: GetUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            var linkGroupId = parseInt($("#txtMenu").val());
            var profileId = parseInt($("#txtName").val());
            if (linkGroupId == undefined || profileId == undefined) {
                linkGroupId = linkGroupId;
                profileId = profileId;
            }
            linkItemData = [];
            var data = $.grep(response, function (x) {
                return (x.profileId == parseInt(profileId) && x.linkGroupId == linkGroupId);
            });
            if (data.length > 0) {
                linkItemData = data;
            } else {
                var linkGroupId = parseInt($("#txtMenu").val());
                var profileId = parseInt($("#txtName").val());
                if (!isNaN(linkGroupId) && !isNaN(profileId)) {
                    const filtered = [];
                    response.forEach(item => {
                        if (item.linkGroupId == linkGroupId) {
                            var exists = filtered.some(f => f.linkName === item.linkName);
                            if (!exists) {
                                item.isAdd = true
                                item.isCancel = true
                                item.isView = true
                                item.isEdit = true
                                filtered.push(item);
                            }
                        }
                    });
                    linkItemData = filtered;
                }
            }
            //linkItemData.forEach((item, index) => {
            //    var html = '';
            //    html
            //    html += '<div class="mb-3">'
            //    html += '<div class="row">'
            //    html += '<div class="col-3 mb-3">'
            //    html += '<label class="form-check-label me-10">' + item.linkName + '</label>'
            //    html += '</div>'
            //    html += '<div class="col">'

            //    //view checkbox
            //    html += '<div class="form-check form-check-inline ms-5">'
            //    html += '<input class="form-check-input" type="checkbox" id="view1' + item.linkId + '" ' +
            //        (item.isView ? 'checked' : '') +
            //        ' onchange="OnChangeViewCheckbox(this, ' + JSON.stringify(item).replace(/"/g, '&quot;') + ')">';
            //    html += '<label class="form-check-label" for="view' + item.linkId + '">View</label>';
            //    html += '</div>'

            //    //Add checkbox
            //    html += '<div class="form-check form-check-inline ms-5">'
            //    html += '<input class="form-check-input" type="checkbox" id="add' + item.linkId + '" ' +
            //        (item.isAdd ? 'checked' : '') +
            //        ' onchange="OnChangeAddCheckbox(this, ' + JSON.stringify(item).replace(/"/g, '&quot;') + ')">';
            //    html += '<label class="form-check-label" for="add' + item.linkId + '">Add</label>';
            //    html += '</div>'

            //    //Edit checkbox
            //    html += '<div class="form-check form-check-inline ms-5">'
            //    html += '<input class="form-check-input" type="checkbox" id="edit' + item.linkId + '" ' +
            //        (item.isEdit ? 'checked' : '') +
            //        ' onchange="OnChangeEditCheckbox(this, ' + JSON.stringify(item).replace(/"/g, '&quot;') + ')">';
            //    html += '<label class="form-check-label" for="edit' + item.linkId + '">Edit</label>';
            //    html += '</div>'

            //    //Cancel checkbox
            //    html += '<div class="form-check form-check-inline ms-5">'
            //    html += '<input class="form-check-input" type="checkbox" id="cancel' + item.linkId + '" ' +
            //        (item.isCancel ? 'checked' : '') +
            //        ' onchange="OnChangeCancelCheckbox(this, ' + JSON.stringify(item).replace(/"/g, '&quot;') + ')">';
            //    html += '<label class="form-check-label" for="cancel' + item.linkId + '">Cancel</label>';
            //    html += '</div>'

            //    html += '</div>'
            //    html += '</div>'
            //    html += '</div>'
            //    $("#menuItemList").append(html)
            //});
            linkItemData.forEach((item, index) => {
                var html = '';
                html += '<tr>';

                // Link Name
                html += '<td class="right-text"><label class="form-check-label">' + item.linkName + '</label></td>';

                // View checkbox
                html += '<td class="text-center">';
                html += '<input class="form-check-input fs-6" type="checkbox" id="view' + item.linkId + '" ' +
                    (item.isView ? 'checked' : '') +
                    ' onchange="OnChangeViewCheckbox(this, ' + JSON.stringify(item).replace(/"/g, '&quot;') + ')">';
                html += '</td>';

                // Add checkbox
                html += '<td class="text-center">';
                html += '<input class="form-check-input fs-6" type="checkbox" id="add' + item.linkId + '" ' +
                    (item.isAdd ? 'checked' : '') +
                    ' onchange="OnChangeAddCheckbox(this, ' + JSON.stringify(item).replace(/"/g, '&quot;') + ')">';
                html += '</td>';

                // Edit checkbox
                html += '<td class="text-center">';
                html += '<input class="form-check-input fs-6" type="checkbox" id="edit' + item.linkId + '" ' +
                    (item.isEdit ? 'checked' : '') +
                    ' onchange="OnChangeEditCheckbox(this, ' + JSON.stringify(item).replace(/"/g, '&quot;') + ')">';
                html += '</td>';

                // Cancel checkbox
                html += '<td class="text-center">';
                html += '<input class="form-check-input fs-6" type="checkbox" id="cancel' + item.linkId + '" ' +
                    (item.isCancel ? 'checked' : '') +
                    ' onchange="OnChangeCancelCheckbox(this, ' + JSON.stringify(item).replace(/"/g, '&quot;') + ')">';
                html += '</td>';

                html += '</tr>';

                $("#menuItemList").append(html);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to submit LinkMenu Item ", "Error");
        }
    });
}
function OnChangeMenuGroupDropDown() {
    $("#txtMenu").on('change', function () {
        $("#menuItemList").html('');
        GetLinkItemList($(this).val(), $("#txtName").val())
    });
}
function OnChangeViewCheckbox(checkbox, item) {
    var index = ViewCheckboxData.findIndex(obj => obj.linkId === item.linkId);
    if (index !== -1) {
        ViewCheckboxData[index] = {
            "linkId": item.linkId,
            "linkName": item.linkName,
            "status": checkbox.checked
        };
    } else {
        ViewCheckboxData.push({
            "linkId": item.linkId,
            "linkName": item.linkName,
            "status": checkbox.checked
        });
    }
}
function OnChangeAddCheckbox(checkbox, item) {
    var index = AddCheckboxData.findIndex(obj => obj.linkId === item.linkId);
    if (index !== -1) {
        AddCheckboxData[index] = {
            "linkId": item.linkId,
            "linkName": item.linkName,
            "status": checkbox.checked
        };
    } else {
        AddCheckboxData.push({
            "linkId": item.linkId,
            "linkName": item.linkName,
            "status": checkbox.checked
        });
    }
}
function OnChangeEditCheckbox(checkbox, item) {
    var index = EditCheckboxData.findIndex(obj => obj.linkId === item.linkId);
    if (index !== -1) {
        EditCheckboxData[index] = {
            "linkId": item.linkId,
            "linkName": item.linkName,
            "status": checkbox.checked
        };
    } else {
        EditCheckboxData.push({
            "linkId": item.linkId,
            "linkName": item.linkName,
            "status": checkbox.checked
        });
    }
}
function OnChangeCancelCheckbox(checkbox, item) {
    var index = CancelCheckboxData.findIndex(obj => obj.linkId === item.linkId);
    if (index !== -1) {
        CancelCheckboxData[index] = {
            "linkId": item.linkId,
            "linkName": item.linkName,
            "status": checkbox.checked
        };
    } else {
        CancelCheckboxData.push({
            "linkId": item.linkId,
            "linkName": item.linkName,
            "status": checkbox.checked
        });
    }
}
function GetAllProfileRightsData() {
    var AllProfileRightsData = [];
    // Fetch All ProfileRights records
    var profileId = parseInt($("#txtName").val());
    var linkGroupId = parseInt($("#txtMenu").val());
    if (!isNaN(profileId)) {
        var profileUrl = '/Profile/GetProfileRightsByProfileId/' + profileId;

        $.ajax({
            url: profileUrl,
            type: "post",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(profileId),
            success: function (response) {
                const filtered = response.filter(item => item.linkGroupId === linkGroupId);
                if (response.length > 0 && filtered.length > 0) {
                    AllProfileRightsData = [];
                    AllProfileRightsData = response;
                    AllProfileRightsData.forEach((item, index) => {
                        item.profileId = parseInt($("#txtName").val());
                        item.isView = ViewCheckboxData.length > 0
                            ? ViewCheckboxData.find(x => x.linkId === item.linkId)?.status ?? item.isView
                            : item.isView;

                        item.isAdd = AddCheckboxData.length > 0
                            ? AddCheckboxData.find(x => x.linkId === item.linkId)?.status ?? item.isAdd
                            : item.isAdd;

                        item.isEdit = EditCheckboxData.length > 0
                            ? EditCheckboxData.find(x => x.linkId === item.linkId)?.status ?? item.isEdit
                            : item.isEdit;

                        item.isCancel = CancelCheckboxData.length > 0
                            ? CancelCheckboxData.find(x => x.linkId === item.linkId)?.status ?? item.isCancel
                            : item.isCancel;
                    });
                } else {
                    AllProfileRightsData = [];
                    linkItemData.forEach(item => {
                        var rightList = {
                            "profileId": parseInt($("#txtName").val()),
                            "linkId": item.linkId,
                            "isAdd": AddCheckboxData.length > 0.
                                ? AddCheckboxData.find(x => x.linkId === item.linkId)?.status ?? true : true,
                            "isEdit": EditCheckboxData.length > 0
                                ? EditCheckboxData.find(x => x.linkId === item.linkId)?.status ?? true : true,
                            "isView": ViewCheckboxData.length > 0
                                ? ViewCheckboxData.find(x => x.linkId === item.linkId)?.status ?? true : true,
                            "isCancel": CancelCheckboxData.length > 0
                                ? CancelCheckboxData.find(x => x.linkId === item.linkId)?.status ?? true : true
                        }
                        AllProfileRightsData.push(rightList);
                    });
                }
                AddOrUpdateProfileRights(AllProfileRightsData);
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to fetch profile rights", "Error");
            }
        });
    } else {
        toastr.warning("Please enter a valid profile ID", "Warning");
    }
}
function AddOrUpdateProfileRights(AllProfileRightsData) {
    var AddOrUpdateProfileRightsUrl = '/Profile/AddOrUpdateProfileRights';
    $.ajax({
        url: AddOrUpdateProfileRightsUrl,
        type: "post",
        contentType: "application/json,charset=utf-8",
        dataType: "json",
        data: JSON.stringify(AllProfileRightsData),
        success: function (response) {
            toastr.success("Profile Rights Saved successfully", "success");
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to fetch profile rights", "Error");
        }
    });
}
function CheckAll() {
    $("#selectAll").on("change", function () {
        var isChecked = $(this).prop("checked");

        var allCheckboxes = $("#menuItemList").find("input[type='checkbox']");

        // Update all checkboxes
        allCheckboxes.prop("checked", isChecked).trigger("change");
        if (ViewCheckboxData.length > 0) {
            ViewCheckboxData.forEach((item) => { item.status = isChecked });
        }
        if (AddCheckboxData.length > 0) {
            AddCheckboxData.forEach((item) => { item.status = isChecked });
        }
        if (EditCheckboxData.length > 0) {
            EditCheckboxData.forEach((item) => { item.status = isChecked });
        }
        if (CancelCheckboxData.length > 0) {
            CancelCheckboxData.forEach((item) => { item.status = isChecked });
        }
    });
}
