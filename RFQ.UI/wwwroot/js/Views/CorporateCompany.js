var orderColumn = '';
var orderDir = '';
var profileId;
var companyID;
$(document).ready(function () {
    profileId = getCookieValue('profileid');
    companyID = getCookieValue('companyid');
    GetAllFranchiseList(function () {
        if (profileId == EnumProfile.Franchise) {
            $('#ddlFranchisename').val(Number(companyID)).trigger('change');
            $('#ddlFranchisename').prop('disabled', true);
        }
    });
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
    });

    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir); // update for next click

        $('th.sortable').not(this).data('order', 'asc');

        FetchDataForTable('corporateTable', '/CorporateCompany/ViewCorporateCompany', orderColumn, orderDir.toUpperCase());
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
    $('#backButton').click(function () {
        window.location.reload(true);

    });
    ButtonUpdateClick();
});
$('#addCompany').click(function () {
    $('#formDiv').css("display", "block");
    $('#tableDiv').css("display", "none");
});
function FetchCorporateCompany() {
    $("#tableDiv").show();
    $("#formDiv").css('display', 'none');
    $('#CompanyTypeForm')[0].reset();
    $('#ddlFranchisename').val(null).trigger('change');
    $('#ddlCity').val(null).trigger('change');
    $("#btnupdate").hide();
    $("#btnsaveandnew").show();
    $("#btnSaveCompanyType").show();
    FetchDataForTable('corporateTable', '/CorporateCompany/ViewCorporateCompany', null, null);
}
$('#corporateTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchDataForTable('corporateTable', '/CorporateCompany/ViewCorporateCompany', orderColumn, orderDir.toUpperCase());
    //FetchCorporateCompany();
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchDataForTable('corporateTable', '/CorporateCompany/ViewCorporateCompany', orderColumn, orderDir.toUpperCase());
    //FetchCorporateCompany();
});
function CheckValidation() {
    $("#txtCompanyName").on("blur", function () {
        if (!/^[A-Za-z0-9 ]+$/.test($(this).val())) {
            toastr.warning("Please enter a valid Corporate Company", "Validation Error");
            return;
        }
    });
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

    if (IsNullOrEmpty($("#txtCompanyName").val()) || !/^[A-Za-z0-9 ]+$/.test($("#txtCompanyName").val())) {
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

    if (IsNullOrEmpty($("#txtPanNumber").val()) || !ValidatePanNumber($("#txtPanNumber").val())) {
        toastr.warning("Please enter a valid PAN Number", "Validation Error");
        return false;
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
                CompanyName: $("#txtCompanyName").val(),
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

            let repeaterItems = document.querySelectorAll("[data-repeater-item]");
            let updateAttachmentDetails = [];
            var linkd = GetQueryParam("LinkId");


            repeaterItems.forEach((item, index) => {
                let attId = item.querySelector("#hdnAttachmentId").value;
                let attachmentId = attId == '' ? 0 : attId;
                let fileName = item.querySelector("#txtFileName")?.value || "N/A";
                let attachmentType = item.querySelector(".ddlAttachment")?.selectedOptions[0]?.value || "N/A";
                let filePath = item.querySelector("#hdnUplodedFileName").value;

                updateAttachmentDetails.push({
                    // index: index + 1,
                    AttachmentId: attachmentId,
                    AttachmentName: fileName,
                    AttachmentTypeId: attachmentType,
                    AttachmentPath: filePath,
                    ReferenceLinkId: parseInt(linkd),
                    TransactionId: $("#txtCompanyId").val()
                });

            });

            // First AJAX call
            $.ajax({
                type: "PUT",
                url: "/CorporateCompany/EditCorporateCompany",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(formData),
                dataType: "json",
                success: function (result) {
                    if (result.result == "success") {
                        toastr.success("Corporate Company Details Updated Successfully!");
                        addMasterUserActivityLog(0, LogType.Update, "Corporate Company Details Updated Successfully", 0);
                        $("#formDiv").css('display', 'none');
                        FetchCorporateCompany();
                        $('#CompanyTypeForm')[0].reset();
                        $('#ddlFranchisename').val(null).trigger('change');
                        $('#ddlCity').val(null).trigger('change');
                        $("#btnupdate").hide();
                        $("#btnsaveandnew").show();
                        $("#btnSaveCompanyType").show();

                    } else {
                        toastr.error("Failed to Update Corporate Company Details!", "Error");
                    }

                },
                error: function (xhr, status, error) {
                    toastr.error("Failed to Update Corporate Company Details!", "Error");
                }
            });

            // Second AJAX call
            $.ajax({
                type: "PUT",
                url: "/MasterAttachment/UpdateMasterAttachment",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(updateAttachmentDetails),
                dataType: "json",
                success: function (response) {
                    if (response.result == "success") {
                        companyId = $("#txtCompanyId").val();
                        Saveattachment(companyId);
                    } else {
                        $("#dataDiv").html("Failed to update profile.");
                    }
                },
                error: function (xhr, status, error) {
                    $("#dataDiv").html("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText);
                }
            });

            // Thired Ajax Call for DeletedAttachments From Table
            var deletedAttachments = JSON.parse(sessionStorage.getItem('deletedAttachments')) || [];
            $.each(deletedAttachments, function (index, value) {
                DeleteAttachmentAPI(value);
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
        CompanyName: companyName,
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
    //if (action == "save") {
    //    $.ajax({
    //        url: saveUrl,
    //        type: "POST",
    //        contentType: "application/json",
    //        data: JSON.stringify(formData),
    //        success: function (response) {
    //            let companyId = response.result.companyId;
    //            if (companyId != null) {
    //                Saveattachment(companyId);
    //                toastr.success("Corporate Company Details Submitted Successfully");
    //                if (typeof this.completeOnSuccess === "function") {
    //                    this.completeOnSuccess();
    //                }
    //            }
    //            else {
    //                toastr.error("Failed to Submit Corporate Company Details!", "Error");
    //            }
    //        },
    //        error: function (xhr, status, error) {
    //            toastr.error("Failed to Submit Corporate Company Details!", "Error");
    //        },
    //        completeOnSuccess: function () {
    //            FetchCorporateCompany();
    //        }
    //    });
    //}
    if (action == "save") {
        $.ajax({
            url: saveUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                let companyId = response.result.companyId;
                if (companyId != null) {
                    Saveattachment(companyId);
                    toastr.success("Corporate Company Details Submitted Successfully");

                    addMasterUserActivityLog(0, LogType.Create,"Corporate Company Details Submitted Successfully",0);

                    if (typeof this.completeOnSuccess === "function") {
                        this.completeOnSuccess();
                    }
                }
                else {
                    toastr.error("Failed to Submit Corporate Company Details!", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Corporate Company Details!", "Error");
            },
            completeOnSuccess: function () {
                FetchCorporateCompany();
            }
        });
    }

    else if (action == "saveNew") {
        $.ajax({
            url: saveUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                let companyId = response.result.companyId;
                Saveattachment(companyId);
                toastr.success("Corporate Company Details Submitted Successfully");

                addMasterUserActivityLog(0, LogType.Create, "Corporate Company Details Submitted Successfully", 0);

                $('#CompanyTypeForm')[0].reset();
                $('#ddlFranchisename').val(null).trigger('change');
                $('#ddlCity').val(null).trigger('change');
                setTimeout(() => {
                    ResetAttachmentRepeater();
                }, 1000);
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Corporate Company Details!", "Error");
            }
        });
    }
    return companyId;

}
function EditCorporateCompany(companyId) {
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

        if (attachmantData.length > 0) {
            EditMasterAttachment(attachmantData);
        }
    });
} 
