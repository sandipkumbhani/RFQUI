var orderColumn = '';
var orderDir = '';
var profileId;
var companyID;
$(document).ready(function () {
    profileId = getCookieValue('profileid');
    companyID = getCookieValue('companyid');
    GetFranchiseAndCorporateName();
    GetAllCityList("ddlCity");
    CheckValidation();
    FetchCorporateCompany();
    $(document).on("click", "#btnView", function () {
        FetchCorporateCompany();
        $("#formDiv").css('display', 'none')
        $("#backButton").css('display', 'Block');
    });
    $('#tableDivLink').on('click', function (e) {
        FetchCorporateCompany();
    });
    $("#btnCancel").on("click", function () {
        FetchCorporateCompany();
        $('#ddlFranchisename').val(Number(0)).trigger('change');
    });
    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir); // update for next click
        $('th.sortable').not(this).data('order', 'asc');
        FetchDataForTable('corporateTable', '/CorporateCompany/ViewCorporateCompany', orderColumn, orderDir.toUpperCase(), 'EditCorporateCompany', 'DeleteCorporateCompany', 'companyId');
    });
    document.querySelectorAll("#txtGstNumber, #txtPanNumber").forEach(function (element) {
        element.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
        });
    });
    $("#btnSaveCompanyType, #btnsaveandnew").on('click', function () {
        var action = $(this).data('action'); // "save" or "saveNew"
        if (OnSubmitCheckValidation()) {
            SaveCorporateCompany(action);
        }
    });
    ButtonUpdateClick();

});

$('#btnAdd').click(function () {
    $('#formDiv').css("display", "block");
    $('#tableDiv').css("display", "none");
    if (!IsNullOrEmpty(profileId) && profileId == EnumProfile.Franchise) {
        $("#ddlFranchisename").val(companyID).trigger('change');
        $("#ddlFranchisename").prop("disabled", true);
    }
    else {
        $("#ddlFranchisename").prop("disabled", false);
    }
});
function FetchCorporateCompany() {
    $("#tableDiv").show();
    $("#formDiv").css('display', 'none');
    $('#CompanyTypeForm')[0].reset();
    $('#ddlFranchisename').val(0).trigger('change');
    $('#ddlCity').val(0).trigger('change');
    $("#btnupdate").hide();
    $("#btnsaveandnew").show();
    $("#btnSaveCompanyType").show();
    ResetAttachmentRepeater();
    FetchDataForTable('corporateTable', '/CorporateCompany/ViewCorporateCompany', orderColumn, orderDir.toUpperCase(), 'EditCorporateCompany', 'DeleteCorporateCompany', 'companyId');
}

$('#corporateTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    //FetchDataForTable('corporateTable', '/CorporateCompany/ViewCorporateCompany', orderColumn, orderDir.toUpperCase(), 'EditCorporateCompany', 'DeleteCorporateCompany', 'companyId');
    FetchCorporateCompany();
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    //FetchDataForTable('corporateTable', '/CorporateCompany/ViewCorporateCompany', orderColumn, orderDir.toUpperCase(), 'EditCorporateCompany', 'DeleteCorporateCompany', 'companyId');
    FetchCorporateCompany();
});
function CheckValidation() {
    //$("#txtCompanyName").on("blur", function () {
    //    if (!/^[A-Za-z0-9 ]+$/.test($(this).val())) {
    //        toastr.warning("Please enter a valid Corporate Company", "Validation Error");
    //        return;
    //    }
    //});
    $("#txtWhatsAppNumber").on("blur", function () {
        if (!isMobile($(this).val())) {
            toastr.warning("Please enter a valid WhatsApp Number", "Validation Error");
            return;
        }
    })
    $("#txtAddress").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a valid Address", "Validation Error");
            return;
        }
    });
    $("#txtPinCode").on("blur", function () {
        if (!ValidatePinCode($(this).val())) {
            toastr.warning("Please enter a valid Pincode", "Validation Error");
            return;
        }
    });
    $("#ddlCity").on("keypress", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please select a valid City", "Validation Error");
            return;
        }
    });
    $("#txtEmail").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            return;
        }
        else {
            if (!isValidateEmail($(this).val())) {
                toastr.warning("Please enter a valid Email Id", "Validation Error");
                return;
            }
        }
    });
    $("#txtPanNumber").on("blur", function () {
        if (!ValidatePanNumber($(this).val())) {
            toastr.warning("Please enter a valid PAN Number", "Validation Error");
            return;
        }
    });
    $("#txtGstNumber").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            return;
        }
        else {
            if (!ValidateGstNumber($(this).val())) {
                toastr.warning("Please enter a valid GST Number", "Validation Error");
                return;
            }
        }
    });
    $("#ddlFranchisename").on("keypress", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please select a valid Franchise Name", "Validation Error");
            return;
        }
    });
}
function OnSubmitCheckValidation() {

    if (IsNullOrEmpty($("#txtCompanyName").val())) {
        toastr.warning("Please enter a valid Corporate Company", "Validation Error");
        return false;
    }

    if (!isValidateSelect($("#ddlFranchisename").val())) {
        toastr.warning("Please Select a Franchise Name", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#from-search-box").val())) {
        toastr.warning("Please enter a valid Address", "Validation Error");
        return false;
    }

    if (!isValidateSelect($("#ddlCity").val())) {
        toastr.warning("Please select a valid City", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtPinCode").val()) || !ValidatePinCode($("#txtPinCode").val())) {
        toastr.warning("Please enter a valid Pincode", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtWhatsAppNumber").val()) || !isMobile($("#txtWhatsAppNumber").val())) {
        toastr.warning("Please enter a valid whatsApp Number", "Validation Error");
        return false;
    }

    //if (IsNullOrEmpty($("#txtPanNumber").val()) || !ValidatePanNumber($("#txtPanNumber").val())) {
    //    toastr.warning("Please enter a valid PAN Number", "Validation Error");
    //    return false;
    //}
    //if (IsNullOrEmpty($("#txtGstNumber").val()) || !ValidateGstNumber($("#txtGstNumber").val())) {
    //    toastr.warning("Please enter a valid GST Number", "Validation Error");
    //    return false;
    //}
    var panNumber = $("#txtPanNumber").val().toUpperCase().trim();
    var gstNumber = $("#txtGstNumber").val().toUpperCase().trim();

    if (IsNullOrEmpty(panNumber) || !ValidatePanNumber(panNumber)) {
        toastr.warning("Please enter a valid PAN Number", "Validation Error");
        return false;
    }


    if (!IsNullOrEmpty(gstNumber)) {
        if (!ValidateGstNumber(gstNumber)) {
            toastr.warning("Please enter a valid GST Number", "Validation Error");
            return false;
        }

        var panInGst = gstNumber.substring(2, 12); // GSTIN[2..11]

        if (panInGst !== panNumber) {
            toastr.warning("PAN in GST Number does not match the entered PAN Number", "Validation Error");
            return false;
        }
    }
    return true;
}
function GetAllFranchiseList(callback) {
    var franchiseUrl = '/CorporateCompany/GetAllFranchise';
    $.ajax({
        url: franchiseUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            var data = response.filter(x => x.companyTypeId == EnumInternalMaster.FRANCHISE);
            const select = document.getElementById("ddlFranchisename");
            select.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
            placeholderOption.textContent = "Select a Franchise";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            select.appendChild(placeholderOption);

            data.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.companyId;
                opt.textContent = option.companyName;
                select.appendChild(opt);
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
function ButtonUpdateClick() {
    $("#btnupdate").click(function (e) {
        e.preventDefault();
        var isValid = OnSubmitCheckValidation();
        if (isValid) {
            var companyId = 0;

            var formData = {
                CompanyId: $("#txtCompanyId").val(),
                CompanyName: $("#txtCompanyName").val().trim(),
                MobNo: $("#txtMobileNumber").val(),
                ContactNo: $("#txtContactNumber").val(),
                AddressLine: $("#from-search-box").val(),
                CityId: $("#ddlCity").val(),
                PinCode: $("#txtPinCode").val(),
                ContactPerson: $("#txtPerson").val(),
                Email: $("#txtEmail").val(),
                WhatsAppNo: $("#txtWhatsAppNumber").val(),
                PANNo: $("#txtPanNumber").val(),
                GSTNo: $("#txtGstNumber").val(),
                ParentCompanyId: $("#ddlFranchisename").val(),
                LinkId: GetQueryParam("LinkId")
            };

            DeleteAttachmentAPI(formData.PartyId);
            var editUrl = "/CorporateCompany/EditCorporateCompany";
            $.ajax({
                type: "PUT",
                url: editUrl,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(formData),
                dataType: "json",
                success: function (result) {
                    if (!IsNullOrEmpty(result)) {
                        toastr.success("Corporate Company Details Updated Successfully!");
                        addMasterUserActivityLog(0, LogType.Update, "Corporate Company Details Updated Successfully", 0);
                        $("#formDiv").css('display', 'none');
                        const transactionId = $("#txtCompanyId").val();
                        UpdateAttachmentData(transactionId);
                        FetchCorporateCompany();
                        $('#CompanyTypeForm')[0].reset();
                        $('#ddlFranchisename').val(0).trigger('change');
                        $('#ddlCity').val(0).trigger('change');
                        $("#btnupdate").hide();
                        $("#btnsaveandnew").show();
                        $("#btnSaveCompanyType").show();
                    } 
                },
                error: function (xhr, status, error) {
                    if (xhr.status == 409)
                        toastr.warning(xhr.responseText, "Already exists");
                    else
                        toastr.error(xhr.responseText);
                }
            });
        }
    });
};
function DeleteCorporateCompany(companyId, linkId) {
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
            var deleteCorporateCompanyUrl = '/CorporateCompany/DeleteCorporateCompany/' + companyId;
            // First fetch master attachment before deleting the company
            FetchMasterAttachment(linkId, companyId, function (attachments) {
                // Proceed to delete the company
                $.ajax({
                    url: deleteCorporateCompanyUrl,
                    type: "DELETE",
                    contentType: "application/json",
                    dataType: "json",
                    success: function (response) {
                        // Delete attachment if exists
                        if (attachments && attachments.length > 0) {
                            DeleteMasterAttachment(attachments[0].attachmentId);
                        }

                        toastr.success("Corporate Company has been deleted successfully.");

                        addMasterUserActivityLog(0, LogType.Delete, "Corporate Company has been deleted successfully.", 0);

                        $('#currentPage').val(1);
                        FetchCorporateCompany();
                        $("#backButton").css('display', 'block');
                    },
                    error: function (xhr, status, error) {
                        toastr.error("Failed to delete Corporate Company.", "Error");
                    }
                });
            });
        }
    });
}
function SaveCorporateCompany(action) {
    var companyName = $("#txtCompanyName").val();
    var franchiseName = $("#ddlFranchisename").val();
    var address = $("#from-search-box").val();
    var city = $("#ddlCity").val();
    var pincode = $("#txtPinCode").val();
    var contactPerson = $("#txtPerson").val();
    var whatsAppNumber = $("#txtWhatsAppNumber").val();
    var mobileNumber = $("#txtMobileNumber").val();
    var contactNumber = $("#txtContactNumber").val();
    var panNumber = $("#txtPanNumber").val();
    var email = $("#txtEmail").val();
    var gSTNumber = $("#txtGstNumber").val();
    var linkid = GetQueryParam("LinkId");
    var companyId;

    var saveUrl = '/CorporateCompany/CorporateCompanySave';
    var formData = {
        LinkId: linkid,
        CompanyName: companyName.trim(),
        MobNo: mobileNumber,
        ContactNo: contactNumber,
        AddressLine: address,
        CityId: city,
        PinCode: pincode,
        ContactPerson: contactPerson,
        Email: email,
        WhatsAppNo: whatsAppNumber,
        PANNo: panNumber,
        GSTNo: gSTNumber,
        ParentCompanyId: franchiseName
    };

    if (action == "save") {
        $.ajax({
            url: saveUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                if (!IsNullOrEmpty(response)) {
                    let companyId = response.companyId;
                    if (companyId != null) {
                        Saveattachment(companyId);
                        toastr.success("Corporate Company Details Submitted Successfully");
                        addMasterUserActivityLog(0, LogType.Create, "Corporate Company Details Submitted Successfully", 0);
                        if (typeof this.completeOnSuccess === "function") {
                            this.completeOnSuccess();
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                if (xhr.status == 409)
                    toastr.warning(xhr.responseText, "Already exists");
                else
                    toastr.error(xhr.responseText);
            },
            completeOnSuccess: function () {
                FetchCorporateCompany();
            }
        });
    }
    if (action == "saveNew") {
        $.ajax({
            url: saveUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                if (!IsNullOrEmpty(response)) {
                    let companyId = response.companyId;
                    Saveattachment(companyId);
                    toastr.success("Corporate Company Details Submitted Successfully");
                    addMasterUserActivityLog(0, LogType.Create, "Corporate Company Details Submitted Successfully", 0);
                    $('#CompanyTypeForm')[0].reset();
                    $('#ddlFranchisename').val(0).trigger('change');
                    $('#ddlCity').val(0).trigger('change');
                    setTimeout(() => {
                        ResetAttachmentRepeater();
                    }, 1000);
                }
            },
            error: function (xhr, status, error) {
                if (xhr.status == 409)
                    toastr.warning(xhr.responseText, "Already exists");
                else
                    toastr.error(xhr.responseText);
            }
        });
    }
    return companyId;
}
function EditCorporateCompany(companyId) {
    if ($("#btnupdate").hasClass('d-none')) {
        $("#btnupdate").removeClass('d-none');
    }
    var data = viewModelDto.filter(x => x.companyId == companyId);
    if (data.length === 0) {
        return;
    }
    var formData = data[0];
    FetchMasterAttachment(formData.linkId, companyId, function (list) {
        var attachmantData = list;
        $('#tableDiv').css('display', 'none');
        $("#formDiv").css('display', 'Block');

        $("#backButton").css('display', 'none');
        $("#formDiv").css('display', 'Block');
        $("#btnSaveCompanyType").hide();
        $("#btnupdate").show();
        $("#btnView").hide();
        $("#btnCancel").removeClass('d-none');
        $("#btnsaveandnew").hide();
        $("#txtCompanyId").val(formData.companyId);
        $("#txtCompanyName").val(formData.companyName);
        $("#txtPerson").val(formData.contactPerson);
        $("#txtMobileNumber").val(formData.mobNo);
        $("#txtContactNumber").val(formData.contactNo);
        $("#from-search-box").val(formData.addressLine);
        $("#ddlCity").val(formData.cityId).trigger('change');
        $("#txtPinCode").val(formData.pinCode);
        $("#txtEmail").val(formData.email);
        $("#txtWhatsAppNumber").val(formData.whatsAppNo);
        $("#txtPanNumber").val(formData.panNo);
        $("#txtGstNumber").val(formData.gstNo);
        $("#ddlFranchisename").val(formData.parentCompanyId).trigger('change');
        if (!IsNullOrEmpty(profileId) && profileId == EnumProfile.Franchise) {
            $("#ddlFranchisename").val(companyID).trigger('change');
            $("#ddlFranchisename").prop("disabled", true);
        }
        else {
            $("#ddlFranchisename").prop("disabled", false);
        }
        if (attachmantData.length > 0) {
            EditMasterAttachment(attachmantData);
        }
    });
}
//function ViewCorporateCompany(companyId) {
//    EditCorporateCompany(companyId);
//    $('#CompanyTypeForm').find('input, select, textarea, button, a').prop('disabled', true);
//    $("#btnupdate").addClass('d-none');
//}
function GetFranchiseAndCorporateName() {
    var GetUrl = '/Home/GetAllCompanyAndFranchise';
    $.ajax({
        url: GetUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            var data = null
            var profileid = getCookieValue("profileid");
            var userid = getCookieValue("userid");
            //if (!IsNullOrEmpty(profileid) && profileId != EnumProfile.Franchise)
            //    data = response.filter(x => x.companyTypeId == 2 && x.createdBy == userid);
            //else
            data = response.filter(x => x.companyTypeId == 2);

            const CompanyAndFranchiseDrp = document.getElementById("ddlFranchisename");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
            placeholderOption.textContent = "Franchise Name";
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
        },
    });
}