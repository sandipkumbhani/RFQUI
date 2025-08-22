var orderColumn = '';
var orderDir = '';
var companyId;
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
    companyId = getCookieValue('companyid');
    GetAllInternalMaster();
    BindDropDownFromCity();
    GetAllCityList("ddlCity");
    GetAllVehicleType("ddlvendorVehicleTypeTable", companyId);
    GetAllStateList("ddlvendorFromStateTable");
    GetAllStateList("ddlvendorToStateTable");
    CheckValidation();
    VehicleTypeDetailsTable();
    ApplicableRouteDetailsTable();
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
                    console.log(response);
                    var gstModel = response.gstModel
                    console.log(gstModel);
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
                    console.log(response);
                    var panModel = response.panModel;
                    console.log(panModel);
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
    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir); // update for next click

        $('th.sortable').not(this).data('order', 'asc');

        FetchDataForTable('vendorTable', '/Vendor/GetAllVendor', orderColumn, orderDir.toUpperCase());
    });
    FetchVendor();
});

let vehicleTypeNameList = [];
let applicableRouteList = [];

$('#addVendor').on('click', function () {
    $('#formDiv').css("display", "block");
    $('#tableDiv').css("display", "none");
});
$('#ddlvendorFromCityTable').on('change', function () {
    const stateId = $('option:selected', this).data('stateid');
    $('#ddlvendorFromStateTable').val(stateId).change();
});

function CheckValidation() {
    $("#txtPanNumber").on("blur", function () {
        if (!IsNullOrEmpty($(this).val()) && !ValidatePanNumber($(this).val())) {
            toastr.warning("Please enter a valid Pan Number", "Validation Error");
            return;
        }

    });
    $("#txtGstNumber").on("blur", function () {
        if (!IsNullOrEmpty($(this).val()) && !ValidateGstNumber($(this).val())) {
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
    $("#txtEmailId").on("blur", function () {
        if (!IsNullOrEmpty($(this).val()) && !isValidateEmail($(this).val())) {
            toastr.warning("Please enter a valid Email", "Validation Error");
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
    $("#numPanNumber").on("blur", function () {
        if (IsNullOrEmpty($(this).val()) || !ValidatePanNumber($(this).val())) {
            toastr.warning("Please enter a valid PAN Nubmer", "Validation Error");
            return;
        }
    });
    $("#numGstNumber").on("blur", function () {
        if (!IsNullOrEmpty($(this).val()) && !ValidateGstNumber($(this).val())) {
            toastr.warning("Please enter a valid GST Number", "Validation Error");
            return;
        }
    });
}
function OnSubmitValidation() {
    if (!IsNullOrEmpty($("#txtGstNumber").val()) && !ValidateGstNumber($("#txtGstNumber").val())) {
        toastr.warning("Please enter a valid GST Number", "Validation Error");
        return false;
    }
    if (!IsNullOrEmpty($("#txtPanNumber").val()) && !ValidatePanNumber($("#txtPanNumber").val())) {
        toastr.warning("Please enter a valid PAN Nubmer", "Validation Error");
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
    if (IsNullOrEmpty($("#txtWhatsappNumber").val()) || !isMobile($("#txtWhatsappNumber").val())) {
        toastr.warning("Please enter a valid Whatsapp Number", "Validation Error");
        return false;
    }
    if (!IsNullOrEmpty($("#txtEmailId").val()) && !isValidateEmail($("#txtEmailId").val())) {
        toastr.warning("Please enter a valid Email", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#numPanNumber").val()) || !ValidatePanNumber($("#numPanNumber").val())) {
        toastr.warning("Please enter a valid PAN Nubmer", "Validation Error");
        return false;
    }
    if (!IsNullOrEmpty($("#numGstNumber").val()) && !ValidateGstNumber($("#numGstNumber").val())) {
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
}
function BindDropDownFromCity() {
    var getcityUrl = '/Customer/GetAllCity'
    $.ajax({
        url: getcityUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            const select = document.getElementById("ddlvendorFromCityTable");
            select.innerHTML = "";

            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a City";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            select.appendChild(placeholderOption);

            response.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.cityId;
                opt.textContent = option.cityName;
                opt.setAttribute("data-stateid", option.stateId);
                select.appendChild(opt);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
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
        var vendorVehicleTypes = vehicleTypeNameList.map(item => ({
            PartyVehicleTypeId: 0,
            PartyId: 0,
            VehicleTypeId: item.VehicleTypeId
        }));
        var vendorApplicableRoutes = applicableRouteList.map(item => ({
            PartyRouteId: 0,
            PartyId: 0,
            FromCityId: item.FromCityId,
            FromStateId: item.FromStateId,
            ToStateId: item.ToStateId,
        }));
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
            GSTVarifiedOn: gstVerifiedOn? new Date(gstVerifiedOn).toISOString() : null,
            PANStatus: panStatus,
            PANLinkedWithAdhar: adharLinked,
            PANVerifiedOn: panVerifiedOn ? new Date(panVerifiedOn).toISOString() : null,
            LinkId: linkId,
            VendorVehicleTypes: vendorVehicleTypes,
            VendorApplicableRoutes: vendorApplicableRoutes
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
                    $('#ddlVendorCategory').val(null).trigger('');
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
    $('#ddlVendorCategory').val(null).trigger('change');
    $('#vendorVehicleTypeTable tbody').empty();
    ClearVehicleTypeForm();
    $('#applicableRouteDetails tbody').empty();
    ClearApplicableRouteForm();
    $("#btnSaveVendor").show();
    $("#btnupdate").hide();
    $("#btnsaveandnew").show();
    ResetAttachmentRepeater();
    FetchDataForTable('vendorTable', '/Vendor/GetAllVendor', null, null);
}

$('#vendorTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchDataForTable('vendorTable', '/Vendor/GetAllVendor', orderColumn, orderDir.toUpperCase());
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchDataForTable('vendorTable', '/Vendor/GetAllVendor', orderColumn, orderDir.toUpperCase());
});
function EditVendor(partyId) {
    var data = viewModelDto.filter(x => x.partyId == partyId);
    var formData = data[0];
    var vehicleTypeTableData = FetchVendorVehicleTypeList(partyId);
    var applicableRouteTableData = FetchVendorApplicableRouteList(partyId);
    vehicleTypeNameList = vehicleTypeTableData.map(item => ({
        PartyVehicleTypeId: item.partyVehicleTypeId,
        PartyId: item.partyId,
        VehicleTypeId: item.vehicleTypeId,
        VehicleTypeName: item.vehicleTypeName
    }));
    applicableRouteList = applicableRouteTableData.map(item => ({
        PartyRouteId: item.partyRouteId,
        PartyId: item.partyId,
        FromCityId: item.fromCityId,
        FromCity: item.fromCityName,
        FromStateId: item.fromStateId,
        FromState: item.fromStateName,
        ToStateId: item.toStateId,
        ToState: item.toStateName
    }))
    RenderVehicleTypeDetailsTable();
    RenderApplicableRouteDetailsTable();
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
        $("#ddlVendorCategory").val(formData.partyCategoryId).trigger('change');
        $("#txtAddress").val(formData.addressLine);
        $("#ddlCity").val(formData.cityId).trigger('change');
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
        LinkId: linkId,
        VendorVehicleTypes: vehicleTypeNameList.map(item => ({
            PartyVehicleTypeId: item.PartyVehicleTypeId,
            PartyId: $("#hdnPartyId").val(),
            VehicleTypeId: item.VehicleTypeId
        })),
        VendorApplicableRoutes: applicableRouteList.map(item => ({
            PartyRouteId: item.PartyRouteId,
            PartyId: $("#hdnPartyId").val(),
            FromCityId: item.FromCityId,
            FromStateId: item.FromStateId,
            ToStateId: item.ToStateId,
        }))
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
                toastr.error("Failed to Update Vendor Details!", "Error");
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
function DeleteVendor(partyId, linkId) {
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
            var deleteVendorUrl = '/Vendor/DeleteVendor/' + partyId;

            FetchMasterAttachment(linkId, partyId, function (list) {
                var result = list;

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
                        $('#currentPage').val(1);
                        FetchVendor();
                        $("#backButton").css('display', 'block');
                    },
                    error: function (xhr, status, error) {
                        toastr.error("Failed to Delete Vendor Details", "Error");
                    }
                });
            });
        }
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

function VehicleTypeDetailsTable() {
    $('#btnAddVendorVehicleType').on('click', function () {
        const getSelectVehicleTypeID = $("#ddlvendorVehicleTypeTable").val();
        if (getSelectVehicleTypeID == null || getSelectVehicleTypeID == '') {
            toastr.warning("Please Select Vehcile Type Name!", "Warning");
            return;
        }
        const getvehicleTypeName = $('#ddlvendorVehicleTypeTable option:selected').text();
        vehicleTypeNameList.push({
            VehicleTypeId: getSelectVehicleTypeID,
            VehicleTypeName: getvehicleTypeName
        });
        RenderVehicleTypeDetailsTable();
        ClearVehicleTypeForm();
    });
    $('#btnCancelVendorVehicleType').on('click', function () {
        ClearVehicleTypeForm();
    });
    $('#vendorVehicleTypeTable').on('click', '.deleteVehicleType', function () {
        const rowIndex = $(this).closest('tr').data('index');
        const deleteItem = vehicleTypeNameList.splice(rowIndex, 1);
        const partyVehicleTypeId = deleteItem[0].PartyVehicleTypeId;
        var deleteUrl = '/MasterPartyVehicleType/DeleteMasterPartyVehicleTypeById/' + partyVehicleTypeId;
        $.ajax({
            url: deleteUrl,
            type: "DELETE",
            dataType: "json",
            data: JSON.stringify(partyVehicleTypeId),
            success: function (response) {
                if (response.result == "1") {
                    toastr.success("VehicleType Details Deleted Successfully!", "Success");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Delete VehicleType Details", "Error");
            }
        });
        RenderVehicleTypeDetailsTable();
    });
    $('#vendorVehicleTypeTable').on('click', '.editVehicleType', function () {
        const rowIndex = $(this).closest('tr').data('index');
        const vehicleType = vehicleTypeNameList[rowIndex];
        const selectHtml = `<select id="editVehicleTypeSelect"  class="select2-custom form-control" placeholdeeer="Select a Vehicle Type">  
          ${$('#ddlvendorVehicleTypeTable').html()}  
        </select>`;
        $(this).closest('tr').find('td:nth-child(2)').html(selectHtml);
        //$('#editVehicleTypeSelect').select2('refresh');
        //$('#editVehicleTypeSelect').val(vehicleType.VehicleTypeId);  

        const actionButtonsHtml = `
              <button type="button" class="saveEditVehicleType" style="color:blue;border:none;background:none;">Save</button> /
              <button type="button" class="cancelEditVehicleType" style="color:blue;border:none;background:none;">Cancel</button>
          `;
        $(this).closest('tr').find('td:nth-child(3)').html(actionButtonsHtml);

        $('.saveEditVehicleType').on('click', function () {
            const selectedVehicleTypeId = $('#editVehicleTypeSelect').val();
            const selectedVehicleTypeName = $('#editVehicleTypeSelect option:selected').text();

            if (!selectedVehicleTypeId) {
                toastr.warning("Please select a valid Vehicle Type!", "Validation Error");
                return;
            }

            vehicleTypeNameList[rowIndex] = {
                PartyVehicleTypeId: vehicleType.PartyVehicleTypeId,
                VehicleTypeId: selectedVehicleTypeId,
                VehicleTypeName: selectedVehicleTypeName
            };

            RenderVehicleTypeDetailsTable();
        });

        $('.cancelEditVehicleType').on('click', function () {
            RenderVehicleTypeDetailsTable();
        });

        $('#btnEditAddVehicleType').on('click', function () {
            const selectedVehicleTypeId = $('#editVehicleTypeSelect').val();
            const selectedVehicleTypeName = $('#editVehicleTypeSelect option:selected').text();

            if (!selectedVehicleTypeId) {
                toastr.warning("Please select a valid Vehicle Type!", "Validation Error");
                return;
            }

            vehicleTypeNameList[rowIndex] = {
                VehicleTypeId: selectedVehicleTypeId,
                VehicleTypeName: selectedVehicleTypeName
            };

            RenderVehicleTypeDetailsTable();
        });
    });
    return;
}
function RenderVehicleTypeDetailsTable() {
    const tbody = $('#vendorVehicleTypeTable tbody');

    tbody.empty();
    $.each(vehicleTypeNameList, function (index, item) {
        const row = `
      <tr data-index="${index}">
        <td class="text-center">${index + 1}</td>
        <td class="text-center">${item.VehicleTypeName}</td>
        <td class="text-center">
          <button type="button" class="editVehicleType" style="color:blue;border:none;background:none;">Edit</button> /
          <button type="button" class="deleteVehicleType" style="color:blue;border:none;background:none;">Delete</button>
        </td>
      </tr>
    `;
        tbody.append(row);
    });
}
function ClearVehicleTypeForm() {
    $('#ddlvendorVehicleTypeTable').val(null).trigger('change');
}

function ApplicableRouteDetailsTable() {
    $('#btnAddVendorApplicableRoute').on('click', function () {
        const getSelectFromCityID = $("#ddlvendorFromCityTable").val();
        const getSelectFromStateID = $("#ddlvendorFromStateTable").val();
        const getSelectToStateID = $("#ddlvendorToStateTable").val();
        if (getSelectFromCityID == null || getSelectFromCityID == '') {
            toastr.warning("Please Select From City!", "Warning");
            return;
        }
        if (getSelectFromStateID == null || getSelectFromStateID == '') {
            toastr.warning("Please Select From State!", "Warning");
            return;
        }
        if (getSelectToStateID == null || getSelectToStateID == '') {
            toastr.warning("Please Select To State!", "Warning");
            return;
        }
        const getFromCityName = $('#ddlvendorFromCityTable option:selected').text();
        const getFromStateName = $('#ddlvendorFromStateTable option:selected').text();
        const getToStateName = $('#ddlvendorToStateTable option:selected').text();
        applicableRouteList.push({
            FromCityId: getSelectFromCityID,
            FromCity: getFromCityName,
            FromStateId: getSelectFromStateID,
            FromState: getFromStateName,
            ToStateId: getSelectToStateID,
            ToState: getToStateName
        });
        RenderApplicableRouteDetailsTable();
        ClearApplicableRouteForm();
    });
    $('#btnCancelVendorApplicableRoute').on('click', function () {
        ClearApplicableRouteForm();
    });
    $('#applicableRouteDetails').on('click', '.deleteApplicableRouteDetails', function () {
        const rowIndex = $(this).closest('tr').data('index');
        const deleteItem = applicableRouteList.splice(rowIndex, 1);
        const partyRouteId = deleteItem[0].PartyRouteId;
        var deleteUrl = '/MasterPartyRoute/DeleteMasterPartyRouteById/' + partyRouteId;
        $.ajax({
            url: deleteUrl,
            type: "DELETE",
            dataType: "json",
            data: JSON.stringify(partyRouteId),
            success: function (response) {
                if (response.result == "1") {
                    toastr.success("Route Details Deleted Successfully!", "Success");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Delete Route Details", "Error");
            }
        });
        RenderApplicableRouteDetailsTable();
    });
    $('#applicableRouteDetails').on('click', '.editApplicableRouteDetails', function () {
        const rowIndex = $(this).closest('tr').data('index');
        const routeDetails = applicableRouteList[rowIndex];

        const fromCitySelectHtml = `<select id="editFromCitySelect" class="select2-custom form-control">  
           ${$('#ddlvendorFromCityTable').html()}  
       </select>`;
        const fromStateSelectHtml = `<select id="editFromStateSelect" class="select2-custom form-control">  
           ${$('#ddlvendorFromStateTable').html()}  
       </select>`;
        const toStateSelectHtml = `<select id="editToStateSelect" class="select2-custom form-control">  
           ${$('#ddlvendorToStateTable').html()}  
       </select>`;

        $(this).closest('tr').find('td:nth-child(2)').html(fromCitySelectHtml);
        $(this).closest('tr').find('td:nth-child(3)').html(fromStateSelectHtml);
        $(this).closest('tr').find('td:nth-child(4)').html(toStateSelectHtml);

        $('#editFromCitySelect').val(routeDetails.FromCityId).trigger('change');
        $('#editFromStateSelect').val(routeDetails.FromStateId).trigger('change');
        $('#editToStateSelect').val(routeDetails.ToStateId).trigger('change');

        const actionButtonsHtml = `  
           <button type="button" class="saveEditApplicableRouteDetails" style="color:blue;border:none;background:none;">Save</button> /  
           <button type="button" class="cancelEditApplicableRouteDetails" style="color:blue;border:none;background:none;">Cancel</button>  
       `;
        $(this).closest('tr').find('td:nth-child(5)').html(actionButtonsHtml);
        $('#editFromCitySelect').on('change', function () {
            const stateId = $('option:selected', this).data('stateid');
            $('#editFromStateSelect').val(stateId).change();
        });


        $('.saveEditApplicableRouteDetails').on('click', function () {
            const selectedFromCityId = $('#editFromCitySelect').val();
            const selectedFromCityName = $('#editFromCitySelect option:selected').text();
            const selectedFromStateId = $('#editFromStateSelect').val();
            const selectedFromStateName = $('#editFromStateSelect option:selected').text();
            const selectedToStateId = $('#editToStateSelect').val();
            const selectedToStateName = $('#editToStateSelect option:selected').text();

            if (!selectedFromCityId || !selectedFromStateId || !selectedToStateId) {
                toastr.warning("Please select valid route details!", "Validation Error");
                return;
            }

            applicableRouteList[rowIndex] = {
                PartyRouteId: routeDetails.PartyRouteId,
                FromCityId: selectedFromCityId,
                FromCity: selectedFromCityName,
                FromStateId: selectedFromStateId,
                FromState: selectedFromStateName,
                ToStateId: selectedToStateId,
                ToState: selectedToStateName
            };

            RenderApplicableRouteDetailsTable();
        });

        $('.cancelEditApplicableRouteDetails').on('click', function () {
            RenderApplicableRouteDetailsTable();
        });
    });
    return;
}
function RenderApplicableRouteDetailsTable() {
    const tbody = $('#applicableRouteDetails tbody');

    tbody.empty();
    $.each(applicableRouteList, function (index, item) {
        const row = `
      <tr data-index="${index}">
        <td class="text-center">${index + 1}</td>
        <td class="text-center">${item.FromCity}</td>
        <td class="text-center">${item.FromState}</td>
        <td class="text-center">${item.ToState}</td>
        <td class="text-center">
          <button type="button" class="editApplicableRouteDetails" style="color:blue;border:none;background:none;">Edit</button> /
          <button type="button" class="deleteApplicableRouteDetails" style="color:blue;border:none;background:none;">Delete</button>
        </td>
      </tr>
    `;
        tbody.append(row);
    });
}
function ClearApplicableRouteForm() {
    $('#ddlvendorFromCityTable').val(null).trigger('change');
    $('#ddlvendorFromStateTable').val(null).trigger('change');
    $('#ddlvendorToStateTable').val(null).trigger('change');
}

function FetchVendorVehicleTypeList(partyId) {
    var fetchVehicleTypeUrl = '/MasterPartyVehicleType/GetMasterPartyVehicleTypeByPartyId/' + partyId;
    var result = null;
    $.ajax({
        url: fetchVehicleTypeUrl,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (response) {
            result = response;
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Vehicle Type Data!", "Error");
        }
    });
    return result;
}
function FetchVendorApplicableRouteList(partyId) {
    var fetchRouteUrl = '/MasterPartyRoute/GetMasterPartyRouteByPartyId/' + partyId;
    var result = null;
    $.ajax({
        url: fetchRouteUrl,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (response) {
            result = response;
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Applicable Route Data!", "Error");
        }
    });
    return result;
}