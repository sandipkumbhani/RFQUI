
document.getElementById("txtPanNumber").addEventListener("input", function () {
    const panKyc = this.value;
    document.getElementById("numPanNumber").value = panKyc;
});
document.getElementById("txtGstNumber").addEventListener("input", function () {
    const gstKyc = this.value;
    document.getElementById("numGstNumber").value = gstKyc;
});
const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('LinkId');

$(document).ready(function () {
    GetAllInternalMaster();
    GetAllCityList();
    CheckValidation();
    

    $(document).on("click", "#btnViewButton", function () {
        FetchVendor();
        $("#formDiv").css('display', 'none')
        $("#backButton").css('display', 'Block');
    });

    $('#tableDivLink').on('click', function (e) {
        e.preventDefault(); // prevent default anchor behavior
        $('#formDiv').hide(); // hide the add/edit form
        $('#tableDiv').show(); // show the list
    });

    $("#btnSaveVendor, #btnsaveandnew").on('click', function () {
        var action = $(this).data('action');
        SaveVendor(action);
    });
    $("#btnupdate").on('click', function (event) {
        event.preventDefault();
        if (OnSubmitValidation()) {
            UpdateVendor();
        }
    });
    $("#btnViewButton").on("click", function () {
        FetchVendor();
        $("#addVendorDiv").css('display', 'none');
        $("#backButton").css('display', 'block');
    });
    $('#backButton').on('click', function () {
        window.location.reload(true);
    });
    $("#gstEKycButton").on("click", function () {
        var gstNumber = $("#txtGstNumber").val();
        if (!ValidateGstNumber(gstNumber)) {
            toastr.warning("Please enter a valid GST Number", "Validation Error");
            ClearGstFields();
        }
        else {
            // Request Body
            var Body = {
                GSTNo: gstNumber,
            }
            var GetUrl = '/Customer/GetGstKycDetails';
            $.ajax({
                url: GetUrl,
                type: "POST",
                contentType: "application/json,charset=utf-8",
                data: JSON.stringify(Body),
                dataType: "json",
                success: function (response) {
                    var Data = response;
                    var gstModel = response.gstModel
                    if (gstModel != null) {
                        $("#txtLegalName").val(gstModel.legalName);
                        $("#txtTypeBusiness").val(gstModel.constitutionOfBusiness);
                        $("#txtGstStatus").val(gstModel.gstStatus);
                        $("#txtGstAddress").val(gstModel.principalAddress);
                        $("#txtTradeName").val(gstModel.tradeName);
                        $("#txtAadharVerified").val(gstModel.aadhaarVerified);
                        $("#txtGstVerifiedOn").val(new Date(gstModel.dateOfRegistration).toISOString().split('T')[0]);
                        $("#txtVerifiedGstNo").val();
                    } else {
                        toastr.warning(response.messageDescription, "Warning");
                        ClearGstFields();
                    }
                },
                error: function (xhr, status, error) {
                    toastr.error("Failed to Get GstEkyc-Detail", "Error");
                    ClearGstFields();
                }
            });
        }
    });
    $("#panEKycButton").on("click", function () {

        var getPanKycUrl = '/Customer/GetPanKycDetails';
        var panNumber = $("#txtPanNumber").val();
        if (!ValidatePanNumber(panNumber)) {
            toastr.warning("Please enter a valid PAN Nubmer", "Validation Error");
            ClearPanFields();
        }
        else {

            var Body = {
                PANNo: panNumber,
            }
            $.ajax({
                url: getPanKycUrl,
                type: "Post",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(Body),
                success: function (response) {
                    var Data = response;
                    var panModel = response.panModel
                    if (panModel != null) {
                        $("#txtPanName").val(panModel.fullName);
                        $("#txtAadharLinked").val(panModel.aadhaarLinked);
                        $("#txtPanStatus").val(panModel.message);
                        $("#txtPanVerifiedOn ").val(new Date(panModel.logDateTime).toISOString().split('T')[0]);
                    }
                    else {
                        toastr.warning(response.messageDescription, "Warning");
                        ClearPanFields();
                    }
                },
                error: function (xhr, status, error) {
                    toastr.error("Failed to Get Pan Ekyc-Detail", "Error");
                    ClearPanFields();
                }
            });
        }
    });
    $("#btnCancel").on("click", function () {
        FetchVendor();
        $("#addVendorDiv").css('display', 'none');
        $("#backButton").css('display', 'block');
    });
    FetchVendor();
});
$('#addVendor').click(function () {
    $('#formDiv').css("display", "block");
    $('#tableDiv').css("display", "none");
});
function CheckValidation() {
    $("#txtPanNumber").on("blur", function () {
        if (!ValidatePanNumber($(this).val())) {
            toastr.warning("Please enter a valid Pan Number", "Validation Error");
            return;
        }
    });
    $("#txtGstNumber").on("blur", function () {
        if (!ValidateGstNumber($(this).val())) {
            toastr.warning("Please enter a valid Gst Number", "Validation Error");
            return;
        }
    });
    $("#txtVendorName").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a valid Vendor Name", "Validation Error");
            return;
        }
    });
    $("#ddlVendorCategory").on("keypress", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please enter a valid Vendor Category", "Validation Error");
            return;
        }
    });
    $("#txtAddress").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a valid Address", "Validation Error");
            return;
        }
    });
    $("#ddlCity").on("keypress", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please enter a valid Vendor City", "Validation Error");
            return;
        }
    });
    $("#txtContactPerson").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a valid Contact Person", "Validation Error");
            return;
        }
    });
    $("#txtEmailId").on("blur", function () {
        if (!isValidateEmail($(this).val())) {
            toastr.warning("Please enter a valid Email", "Validation Error");
            return;
        }
    });
    $("#txtMobileNumber").on("blur", function () {
        if (!isMobile($(this).val())) {
            toastr.warning("Please enter a valid Mobile Number", "Validation Error");
            return;
        }
    });
    $("#txtWhatsappNumber").on("blur", function () {
        if (!isMobile($(this).val())) {
            toastr.warning("Please enter a valid WhatsApp Number", "Validation Error");
            return;
        }
    });
    $("#txtPinCode").on("blur", function () {
        if (!ValidatePinCode($(this).val())) {
            toastr.warning("Please enter a valid  PinCode", "Validation Error");
            return;
        }
    });
}
function OnSubmitValidation() {
    if (IsNullOrEmpty($("#txtGstNumber").val()) || !ValidateGstNumber($("#txtGstNumber").val())) {
        toastr.warning("Please enter a valid GST Number", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtLegalName").val())) {
        toastr.warning("Please fill Gst e-kyc Details", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtTypeBusiness").val())) {
        toastr.warning("Please fill Gst e-kyc Details", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtGstStatus").val())) {
        toastr.warning("Please fill Gst e-kyc Details", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtTradeName").val())) {
        toastr.warning("Please fill Gst e-kyc Details", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtAadharVerified").val())) {
        toastr.warning("Please fill Gst e-kyc Details", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtGstVerifiedOn").val())) {
        toastr.warning("Please fill Gst e-kyc Details", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtPanNumber").val()) || !ValidatePanNumber($("#txtPanNumber").val())) {
        toastr.warning("Please enter a valid PAN Nubmer", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtAadharLinked").val())) {
        toastr.warning("Please fill Pan e-kyc Details", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtPanStatus").val())) {
        toastr.warning("Please fill Pan e-kyc Details", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtPanVerifiedOn").val())) {
        toastr.warning("Please fill Pan e-kyc Details", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtVendorName").val())) {
        toastr.warning("Please enter a valid Vendor Name", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlVendorCategory").val())) {
        toastr.warning("Please enter a valid Vendor Category", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtAddress").val())) {
        toastr.warning("Please enter a valid Vendor Address", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlCity").val())) {
        toastr.warning("Please enter a valid Vendor City", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtPinCode").val()) || !ValidatePinCode($("#txtPinCode").val())) {
        toastr.warning("Please enter a valid PinCode", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtContactPerson").val())) {
        toastr.warning("Please enter a valid Contact Person", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtWhatsappNumber").val()) || !isMobile($("#txtWhatsappNumber").val())) {
        toastr.warning("Please enter a valid Whatsapp Number", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtMobileNumber").val()) || !isMobile($("#txtMobileNumber").val())) {
        toastr.warning("Please enter a valid Mobile Number", "Validation Error");
        return false;
    }
    if (!isValidateEmail($("#txtEmailId").val())) {
        toastr.warning("Please enter a valid Email", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#numPanNumber").val())) {
        toastr.warning("Please enter a valid PAN Nubmer", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#numGstNumber").val())) {
        toastr.warning("Please enter a valid GST Number", "Validation Error");
        return false;
    }
    return true;
}
function GetAllInternalMaster() {
    var getInternalMasterUrl = '/Vendor/GetAllInternalMaster'
    $.ajax({
        url: getInternalMasterUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            BindDropDown(response)
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function BindDropDown(data) {

    let internalData = data.filter(x => x.internalMasterTypeId == 3);
    const select = document.getElementById("ddlVendorCategory");
    select.innerHTML = "";

    let placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Select a Category";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    select.appendChild(placeholderOption);

    internalData.forEach(option => {
        let opt = document.createElement("option");
        opt.value = option.internalMasterId;
        opt.textContent = option.internalMasterName;
        select.appendChild(opt);
    });

    $('.selectpicker').selectpicker('refresh');
}
function GetAllCityList() {
    var getcityUrl = '/Customer/GetAllCity'
    $.ajax({
        url: getcityUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            BindDropDownCity(response)
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function BindDropDownCity(data) {
    const select = document.getElementById("ddlCity");
    select.innerHTML = "";

    let placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Select a City";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    select.appendChild(placeholderOption);

    data.forEach(option => {
        let opt = document.createElement("option");
        opt.value = option.cityId;
        opt.textContent = option.cityName;
        select.appendChild(opt);
    });

    $('.selectpicker').selectpicker('refresh');
}
function SaveVendor(action) {
    if (OnSubmitValidation()) {
        var legalName = $("#txtLegalName").val();
        var typeBusiness = $("#txtTypeBusiness").val();
        var gstStatus = $("#txtGstStatus").val();
        var tradeName = $("#txtTradeName").val();
        var adharVerified = $("#txtAadharVerified").val();
        var gstVerifiedOn = $("#txtGstVerifiedOn").val();
        var adharLinked = $("#txtAadharLinked").val();
        var panStatus = $("#txtPanStatus").val();
        var panVerifiedOn = $("#txtPanVerifiedOn").val();
        var vendorName = $("#txtVendorName").val();
        var vendorCategory = $("#ddlVendorCategory").val();
        var vendorAddress = $("#txtAddress").val();
        var vendorCity = $("#ddlCity").val();
        var vendorPincode = $("#txtPinCode").val();
        var contactPerson = $("#txtContactPerson").val();
        var whatsappNumber = $("#txtWhatsappNumber").val();
        var mobileNumber = $("#txtMobileNumber").val();
        var emailId = $("#txtEmailId").val();
        var panNumber = $("#numPanNumber").val();
        var gstNubmer = $("#numGstNumber").val();
        var createUser = $("#createuser").is(":checked");
        var shareAppLink = $("#shareapplink").is(":checked");
        var partyId = 0;
        var saveVendorUrl = '/Vendor/VendorSave';
        var formData = {
            PartyName: vendorName,
            PartyCategoryId: vendorCategory,
            AddressLine: vendorAddress,
            CityId: vendorCity,
            PinCode: vendorPincode,
            ContactPerson: contactPerson,
            ContactNo: mobileNumber,
            MobNo: mobileNumber,
            WhatsAppNo: whatsappNumber,
            Email: emailId,
            PANNo: panNumber,
            GSTNo: gstNubmer,
            LegalName: legalName,
            TradeName: tradeName,
            TypeOfBusiness: typeBusiness,
            AadharVerified: adharVerified,
            GSTStatus: gstStatus,
            GSTVarifiedOn: gstVerifiedOn,
            PANStatus: panStatus,
            PANLinkedWithAdhar: adharLinked,
            PANVerifiedOn: panVerifiedOn,
            LinkId: linkId
        };
        if (action == "save") {
            $.ajax({
                url: saveVendorUrl,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(formData),
                success: function (response) {
                    let partyId = response.result.partyId;
                    Saveattachment(partyId);
                    toastr.success("Vendor Details Submitted Successfully!");
                    window.location.href = "../Dashboard/Dashboard";
                },
                error: function (xhr, status, error) {
                    toastr.error("Failed to Submit Vendor Details!", "Error");
                }
            });
        }
        else if (action == "saveNew") {
            $.ajax({
                url: saveVendorUrl,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(formData),
                success: function (response) {
                    let partyId = response.result.partyId;
                    Saveattachment(partyId);
                    toastr.success("Vendor Details Submitted Successfully!");
                    $('#vendorForm')[0].reset();
                    $('#ddlCity').val('');
                    $('#ddlVendorCategory').val('');
                    $('.selectpicker').selectpicker('refresh');
                    setTimeout(() => {
                        ResetAttachmentRepeater();
                    }, 1000);
                },
                error: function (xhr, status, error) {
                    toastr.error("Failed to Submit Vendor Details", "Error");
                }
            });
        }
        return partyId;
    }
}
function FetchVendor() {
    $("#tableDiv").css('display', 'block');
    $("#formDiv").css('display', 'none');
    $('#vendorForm')[0].reset();
    $('#ddlCity').val(null).trigger('change');
    $("#btnSaveVendor").show();
    $("#btnupdate").hide();
    $("#btnsaveandnew").show();
    ResetAttachmentRepeater();
    var fetchVendorUrl = '/Vendor/GetAllVendor';
    FetchDataForTable('vendorTable', fetchVendorUrl);
}

$('#customVendorSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchVendor();
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchVendor();
});
function EditVendor(partyId) {
    var data = viewModelDto.filter(x => x.partyId == partyId);
    var formData = data[0];
    FetchMasterAttachment(formData.linkId, partyId, function (list) {
        var attachmentData = list;
        $('#tableDiv').css('display', 'none');
        $("#formDiv").css('display', 'Block');
        $('#tableDiv').hide();
        $("#backButton").css('display', 'none');
        $("#addVendorDiv").css('display', 'Block');
        $("#btnSaveVendor").hide();
        $("#btnupdate").show();
        $("#btnsaveandnew").hide();
        $("#btnViewButton").hide();
        $("#btnCancel").removeClass("d-none");
        $("#hdnPartyId").val(formData.partyId);
        $("#txtGstNumber").val(formData.gstNo);
        $("#txtLegalName").val(formData.legalName);
        $("#txtTypeBusiness").val(formData.typeOfBusiness);
        $("#txtGstStatus").val(formData.gstStatus);
        $("#txtTradeName").val(formData.tradeName);
        $("#txtAadharVerified").val(formData.aadharVerified);
        var gstVerifiedDate = new Date(formData.gstVarifiedOn).toISOString().split('T')[0];
        $("#txtGstVerifiedOn").val(gstVerifiedDate);
        $("#txtAadharLinked").val(formData.panLinkedWithAdhar);
        $("#txtPanStatus").val(formData.panStatus);
        var panVerifiedDate = new Date(formData.panVerifiedOn).toISOString().split('T')[0];
        $("#txtPanVerifiedOn").val(panVerifiedDate);
        $("#txtPanNumber").val(formData.panNo);
        $("#txtVendorName").val(formData.partyName);
        $("#ddlVendorCategory").val(formData.partyCategoryId).change();
        $("#txtAddress").val(formData.addressLine);
        $("#ddlCity").val(formData.cityId).change();
        $("#txtContactPerson").val(formData.contactPerson);
        $("#txtMobileNumber").val(formData.mobNo);
        $("#txtPinCode").val(formData.pinCode);
        $("#txtWhatsappNumber").val(formData.whatsAppNo);
        $("#txtEmailId").val(formData.email);
        $("#numGstNumber").val(formData.gstNo);
        $("#numPanNumber").val(formData.panNo);
        if (attachmentData.length > 0) {
            EditMasterAttachment(attachmentData);
        }
    })
    
}
function UpdateVendor() {

    var formData = {
        PartyId: $("#hdnPartyId").val(),
        PartyName: $("#txtVendorName").val(),
        PartyCategoryId: $("#ddlVendorCategory").val(),
        AddressLine: $("#txtAddress").val(),
        CityId: $("#ddlCity").val(),
        PinCode: $("#txtPinCode").val(),
        ContactPerson: $("#txtContactPerson").val(),
        ContactNo: $("#txtMobileNumber").val(),
        MobNo: $("#txtMobileNumber").val(),
        WhatsAppNo: $("#txtWhatsappNumber").val(),
        Email: $("#txtEmailId").val(),
        PANNo: $("#numPanNumber").val(),
        GSTNo: $("#numGstNumber").val(),
        LegalName: $("#txtLegalName").val(),
        TradeName: $("#txtTradeName").val(),
        TypeOfBusiness: $("#txtTypeBusiness").val(),
        AadharVerified: $("#txtAadharVerified").val(),
        GSTStatus: $("#txtGstStatus").val(),
        GSTVarifiedOn: $("#txtGstVerifiedOn").val(),
        PANStatus: $("#txtPanStatus").val(),
        PANLinkedWithAdhar: $("#txtAadharLinked").val(),
        PANVerifiedOn: $("#txtPanVerifiedOn").val(),
        LinkId: linkId
    }
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
            TransactionId: $("#hdnPartyId").val()
        });
    });
    var updateVendorUrl = '/Vendor/UpdateVendor';
    $.ajax({
        type: "PUT",
        url: updateVendorUrl,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(formData),
        dataType: "json",
        success: function (result) {
            if (result.result == "Success") {
                $("#addVendorDiv").css('display', 'none')
                toastr.success("Vendor Details Updated Successfully!");
                FetchVendor();
                $("#backButton").show();
            }
            else {
                toastr.error("Failed to Update Vendor Details!","Error");
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Update Vendor Details!", "Error");
        }
    });
    $.ajax({
        type: "PUT",
        url: "/MasterAttachment/UpdateMasterAttachment",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(updateAttachmentDetails),
        dataType: "json",
        success: function (response) {
            if (response.result == "success") {
                partyId = $("#hdnPartyId").val();
                Saveattachment(partyId);
            } else {
                $("#dataDiv").html("Failed to update profile.");
            }
        },
        error: function (xhr, status, error) {
            $("#dataDiv").html("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText);
        }
    });

    var deletedAttachments = JSON.parse(sessionStorage.getItem('deletedAttachments')) || [];
    $.each(deletedAttachments, function (index, value) {
        DeleteAttachmentAPI(value);
    });
}
function DeleteVendor(partyId) {
    var deleteVendorUrl = '/Vendor/DeleteVendor/' + partyId
    var result;
    FetchMasterAttachment(linkId, partyId, function (list) {
        result = list;
        $.ajax({
            url: deleteVendorUrl,
            type: "DELETE",
            dataType: "json",
            data: JSON.stringify(partyId),
            success: function (response) {
                if (result.length > 0) {
                    DeleteMasterAttachment(result[0].attachmentId);
                }
                toastr.success("Vendor Details Deleted Successfully!");
                FetchVendor();
                $("#backButton").css('display', 'block');
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Delete Vendor Details", "Error");
            }   
        });
    });
}
function ClearGstFields() {
    $("#txtLegalName").val('');
    $("#txtTypeBusiness").val('');
    $("#txtGstStatus").val('');
    $("#txtGstAddress").val('');
    $("#txtTradeName").val('');
    $("#txtAadharVerified").val('');
    $("#txtAadharVerified").val('');
    $("#txtGstVerifiedOn").val('');
}
function ClearPanFields() {
    $("#txtPanName").val(''),
        $("#txtAadharLinked").val(''),
        $("#txtPanStatus").val(''),
        $("#txtPanVerifiedOn ").val('')
}