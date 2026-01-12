const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('LinkId');
let isGstEKycClicked = false;
let isPanEKycClicked = false;
var orderColumn = '';
var orderDir = '';
var fetchCustomerUrl = '/Customer/ViewCustomer';

$(document).ready(function () {

    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir); // update for next click

        $('th.sortable').not(this).data('order', 'asc');

        FetchDataForTable('customerTable', fetchCustomerUrl, orderColumn, orderDir.toUpperCase(), 'EditCustomer', 'DeleteCustomer', 'partyid');
    });

    document.getElementById("txtPanNumber").addEventListener("input", function () {
        const panKyc = this.value;
        document.getElementById("numPan").value = panKyc;
    });

    document.getElementById("txtGstNumber").addEventListener("input", function () {
        const gstKyc = this.value;
        document.getElementById("numGstNumber").value = gstKyc;
    });

    $("#gstEKycButton").on('click', function () {
        isGstEKycClicked = true;
    });

    $("#panEKycButton").on('click', function () {
        isPanEKycClicked = true;
    });

    $("#btnSaveCustomer, #SavenewButton").on('click', function () {
        var action = $(this).data('action');
        if (ValidationCheck()) {
            SaveCustomer(action);
        }

    });

    $("#btnCancel").on("click", function () {
        FetchCustomerList();
    });

    $("#btnAdd").on("click", function () {
        $("#tableDiv").css('display', 'none ');
        $("#formDiv").css('display', 'block');
    });

    $('#tableDivLink').on('click', function (e) {
        e.preventDefault(); // prevent default anchor behavior
        FetchCustomerList();
    });

    InitializeFields();
    GetAllCityList("ddlCity");
    UpdateCustomer();
    GstEKycClick();
    PanEKycClick();
    FetchCustomerList();
});

function FetchCustomerList() {
    $("#tableDiv").show();
    $("#formDiv").hide();
    $('#customerForm')[0].reset();
    getAutoCustomerCode();
    $('#ddlCity').val(0).trigger('change');
    $("#btnSaveCustomer").show();
    $("#btnUpdate").hide();
    $("#SavenewButton").show();
    ResetAttachmentRepeater();
    FetchDataForTable('customerTable', fetchCustomerUrl, orderColumn, orderDir.toUpperCase(), 'EditCustomer', 'DeleteCustomer', 'partyid');
}

$('#customerTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchCustomerList();
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchCustomerList();
});
function SaveCustomer(action) {
    var isvalid = ValidationCheck();
    if (!isvalid) {
        return;
    }
    var gstKyc = $("#txtGstNumber").val();
    var legalName = $("#txtLegalName").val();
    var typeBusiness = $("#txtTypeBusiness").val();
    var gstStatus = $("#txtGstStatus").val();
    var tradeName = $("#txtTradeName").val();
    var adharVerified = $("#txtAadharVerified").val();
    var gstVerifiedOn = $("#txtGstVerifiedOn").val() ? $("#txtGstVerifiedOn").val() : null;
    var adharLinked = $("#txtAadharLinked").val();
    var panCardName = $("#txtPanName").val();
    var panStatus = $("#txtPanStatus").val();
    var panVerifiedOn = $("#txtPanVerifiedOn").val() ? $("#txtPanVerifiedOn").val() : null;
    var panKyc = $("#txtPanNumber").val();
    var customerName = $("#txtCustomerName").val();
    var code = $("#txtCustomerCode").val();
    var address = $("#from-search-box").val();
    var city = $("#ddlCity").val();
    var selectedIndex = $("#ddlCity").prop("selectedIndex");
    var contactPerson = $("#txtContactPerson").val();
    var mobileNumber = $("#numMobile").val();
    var panNumber = $("#numPan").val();
    var pincode = $("#numPincode").val();
    var whatsAppNumber = $("#numWhatsApp").val();
    var contactNo = $("#numContact").val();
    var email = $("#txtEmail").val();
    var gstaddress = $("#txtGstAddress").val();
    var gstNumber = $("#numGstNumber").val();
    var partyCategoryId = 0;
    var partyId = 0;

    var saveUrl = '/Customer/CustomerSave';
    var formData = {
        GSTNo: gstKyc,
        LegalName: legalName,
        TypeOfBusiness: typeBusiness,
        GstStatus: gstStatus,
        TradeName: tradeName,
        AadharVerified: adharVerified,
        PANCardName: panCardName,
        PanStatus: panStatus,
        GSTVarifiedOn: gstVerifiedOn,
        PANVerifiedOn: panVerifiedOn,
        PANNo: panKyc,
        PartyName: customerName,
        Code: code,
        AddressLine: address,
        CityId: city,
        ContactPerson: contactPerson,
        MobNo: mobileNumber,
        PANNo: panNumber,
        Pincode: pincode,
        WhatsAppNo: whatsAppNumber,
        ContactNo: contactNo,
        Email: email,
        GSTNo: gstNumber,
        PANLinkedWithAdhar: adharLinked,
        GSTAddress: gstaddress,
        PartyCategoryId: partyCategoryId,
        LinkId: linkId

    }

    if (action == "save") {
        var completeOnSuccess = function () {
            FetchCustomerList();
        };

        $.ajax({
            url: saveUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                if (response != null) {
                    if (response.statusCode == 200) {
                        partyId = response.data.partyId;
                        Saveattachment(partyId);
                        toastr.success("Customer Details Submitted Successfully!");
                        addMasterUserActivityLog(0, LogType.Create, "Customer Details Submitted Successfully!", 0);

                        if (typeof completeOnSuccess === "function") {
                            completeOnSuccess();
                        }
                    }
                    else if (response.statusCode === 409)
                        toastr.warning(response.message, "Duplicate Entry");
                    else
                        toastr.error(response.message || "Unexpected error occurred.", "Error");

                } else {
                    toastr.error("Failed to Submit Customer Details", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Customer Details", "Error");
            }
        });
    }

    else {
        $.ajax({
            url: saveUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                if (response != null) {
                    if (response.statusCode == 200) {
                        partyId = response.data.partyId;
                        Saveattachment(partyId);
                        toastr.success("Customer Details Submitted Successfully!");
                        addMasterUserActivityLog(0, LogType.Create, "Customer Details Submitted Successfully!", 0);
                        $('#customerForm')[0].reset();
                        $('#ddlCity').val(0).trigger('change');
                        setTimeout(() => {
                            ResetAttachmentRepeater();
                        }, 1000);
                    }
                    else if (response.statusCode === 409) {
                        toastr.warning(response.message, "Duplicate Entry");
                    }
                    else {
                        toastr.error(response.message || "Unexpected error occurred.", "Error");
                    }
                } else {
                    toastr.error("Failed to Submit Customer Details", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Customer Details", "Error");
            }
        });
    }
    return partyId;
};
function EditCustomer(partyId) {
    if ($("#btnUpdate").hasClass('d-none')) {
        $("#btnUpdate").removeClass('d-none');
    }
    var data = viewModelDto.filter(x => x.partyId === partyId);
    var formData = data[0];
    FetchMasterAttachment(formData.linkId, partyId, function (list) {
        var attachmentData = list;
        $('#tableDiv').css('display', 'none');
        $("#formDiv").css('display', 'Block');
        $("#btnSaveCustomer").hide();
        $("#btnUpdate").show();
        $("#SavenewButton").hide();
        $("#txtGstNumber").val(formData.gstNo);
        $("#txtVerifiedGstNo").val(formData.gstNo);
        $("#hdnPartyId").val(formData.partyId);
        $("#txtLinkId").val(formData.linkId);
        $("#txtLegalName").val(formData.legalName);
        $("#txtTypeBusiness").val(formData.typeOfBusiness);
        $("#txtGstStatus").val(formData.gstStatus);
        $("#txtTradeName").val(formData.tradeName);
        $("#txtAadharVerified").val(formData.aadharVerified);
        var gstVerifiedDate = new Date(formData.gstVarifiedOn).toLocaleDateString('en-CA');
        $("#txtGstVerifiedOn").val(gstVerifiedDate);
        $("#txtAadharLinked").val(formData.panLinkedWithAdhar);
        $("#txtPanStatus").val(formData.panStatus);
        var panVerifiedDate = new Date(formData.panVerifiedOn).toLocaleDateString('en-CA');
        $("#txtPanName").val(formData.panCardName);
        $("#txtPanVerifiedOn").val(panVerifiedDate);
        $("#txtPanNumber").val(formData.panNo);
        $("#txtCustomerName").val(formData.partyName);
        //$("#txtCustomerCode").val(formData.customerCode);
        $("#from-search-box").val(formData.addressLine);
        $('#ddlCity').val(formData.cityId).trigger('change');
        $("#txtContactPerson").val(formData.contactPerson);
        $("#numMobile").val(formData.mobNo);
        $("#numContact").val(formData.contactNo);
        $("#numPan").val(formData.panNo);
        $("#numPincode").val(formData.pinCode);
        $("#numWhatsApp").val(formData.whatsAppNo);
        $("#txtEmail").val(formData.email);
        $("#numGstNumber").val(formData.gstNo);
        $("#txtGstAddress").val(formData.gstAddress);
        $("#txtCustomerCode").val(formData.code);
        if (attachmentData.length > 0) {
            EditMasterAttachment(attachmentData);
        }
    });
}
function UpdateCustomer() {
    $("#btnUpdate").on('click', function (e) {
        e.preventDefault();
        var isvalid = ValidationCheck();
        if (!isvalid) {
            return;
        }
        var formData = {
            PartyId: $("#hdnPartyId").val(),
            LegalName: $("#txtLegalName").val(),
            TypeOfBusiness: $("#txtTypeBusiness").val(),
            GstStatus: $("#txtGstStatus").val(),
            TradeName: $("#txtTradeName").val(),
            AadharVerified: $("#txtAadharVerified").val(),
            PANCardName: $("#txtPanName").val(),
            PanStatus: $("#txtPanStatus").val(),
            GSTVarifiedOn: $("#txtGstVerifiedOn").val() ? $("#txtGstVerifiedOn").val() : null,
            //var gstVerifiedOn = $("#txtGstVerifiedOn").val() ? $("#txtGstVerifiedOn").val() : null;
            PANVerifiedOn: $("#txtPanVerifiedOn").val() ? $("#txtPanVerifiedOn").val() : null,
            //var panVerifiedOn = $("#txtPanVerifiedOn").val() ? $("#txtPanVerifiedOn").val() : null;
            PartyName: $("#txtCustomerName").val(),
            //CustomerCode: $("#txtCustomerCode").val(),
            AddressLine: $("#from-search-box").val(),
            CityId: $("#ddlCity").val(),
            ContactPerson: $("#txtContactPerson").val(),
            MobNo: $("#numMobile").val(),
            PANNo: $("#numPan").val(),
            Pincode: $("#numPincode").val(),
            WhatsAppNo: $("#numWhatsApp").val(),
            ContactNo: $("#numContact").val(),
            Email: $("#txtEmail").val(),
            GSTNo: $("#numGstNumber").val(),
            PANLinkedWithAdhar: $("#txtAadharLinked").val(),
            Code: $("#txtCustomerCode").val(),
            GSTAddress: $("#txtGstAddress").val(),
            LinkId: linkId
        };

        DeleteAttachmentAPI(formData.PartyId);
        var editCustomer = '/Customer/UpdateCustomer';
        $.ajax({
            type: "PUT",
            url: editCustomer,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(formData),
            dataType: "json",
            success: function (res) {
                if (!IsNullOrEmpty(res)) {
                    toastr.success("Customer Details Updated Successfully!");
                    addMasterUserActivityLog(0, LogType.Update, "Customer Details Updated Successfully!", 0);
                    $("#addCustomerDiv").css('display', 'none');
                    const transactionId = $("#hdnPartyId").val();
                    UpdateAttachmentData(transactionId);
                    FetchCustomerList();
                } 
            },
            error: function (xhr, status, error) {
                if (xhr.status == 409)
                    toastr.warning(xhr.responseText, "Already exists");
                else
                    toastr.error(xhr.responseText);
            },
        });
    });
}
function DeleteCustomer(partyId, linkId) {
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
            var deleteCustomerUrl = '/Customer/DeleteCustomer/' + partyId;
            FetchMasterAttachment(linkId, partyId, function (attachments) {
                $.ajax({
                    url: deleteCustomerUrl,
                    type: "DELETE",
                    contentType: "application/json",
                    dataType: "json",
                    success: function (response) {
                        if (attachments && attachments.length > 0) {
                            DeleteMasterAttachment(attachments[0].attachmentId);
                        }
                        toastr.success("Customer details have been deleted successfully.");
                        addMasterUserActivityLog(0, LogType.Delete, "Customer details have been deleted successfully.", 0);
                        $('#currentPage').val(1);
                        FetchCustomerList();
                    },
                    error: function (xhr, status, error) {
                        toastr.error("Failed to delete customer details.", "Error");
                    }
                });
            });
        }
    });
}
function GstEKycClick() {
    $("#gstEKycButton").on("click", function () {
        var gstNumber = $("#txtGstNumber").val();
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
                var gstModel = response.gstModel
                if (gstModel != null) {
                    $("#txtLegalName").val(gstModel.legalName),
                        $("#txtTypeBusiness").val(gstModel.constitutionOfBusiness),
                        $("#txtGstStatus").val(gstModel.gstStatus),
                        $("#txtGstAddress").val(gstModel.principalAddress),
                        $("#from-search-box").val(gstModel.principalAddress),
                        $("#txtTradeName").val(gstModel.tradeName),
                        $("#txtCustomerName").val(gstModel.tradeName),
                        $("#txtAadharVerified").val(gstModel.aadhaarVerified),
                        $("#txtGstVerifiedOn").val(new Date().toISOString().split('T')[0]),
                        $("#txtVerifiedGstNo").val(gstModel.gstNo)
                } else {
                    toastr.warning(response.messageDescription, "Error");
                    ClearGstFields();
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Gst E-Kyc Details", "Error");
                ClearGstFields();
            }
        });
    });
}
function PanEKycClick() {
    $("#panEKycButton").on("click", function () {
        var getPanKycUrl = '/Customer/GetPanKycDetails';
        var panNumber = $("#txtPanNumber").val();
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
                var panModel = response.panModel
                if (panModel != null) {
                    $("#txtPanName").val(panModel.fullName),
                        $("#txtAadharLinked").val(panModel.aadhaarLinked),
                        $("#txtPanStatus").val(panModel.message),
                        $("#txtPanVerifiedOn ").val(new Date().toISOString().split('T')[0])
                } else {
                    toastr.warning(response.messageDescription, "Error");
                    ClearPanFields();
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Fetch EKyc Details", "Error");
                ClearPanFields();
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
function InitializeFields() {
    $("#txtGstNumber").on("blur", function () {
        if (!IsNullOrEmpty($(this).val()) && !ValidateGstNumber($(this).val())) {
            toastr.warning("Please enter a valid GST No", "Validation Error");
            return;
        }
    });

    $("#txtPanNumber").on("blur", function () {
        if (!IsNullOrEmpty($(this).val()) && !ValidatePanNumber($(this).val())) {
            toastr.warning("Please enter a valid PAN No", "Validation Error");
            return;
        }
    });

    $("#numPan").on("blur", function () {
        if (!ValidatePanNumber($(this).val())) {
            toastr.warning("Please enter a valid PAN No", "Validation Error");
            return;
        }
    });

    //$("#txtCustomerName").on("blur", function () {
    //    if (IsNullOrEmpty($(this).val())) {
    //        toastr.warning("Please enter a valid CustomerName", "Validation Error");
    //        return;
    //    }
    //});

    $("#txtCustomerCode").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a valid Customer Code", "Validation Error");
            return;
        }
    });

    $("#numMobile").on("blur", function () {
        if (!IsNullOrEmpty($(this).val()) && !isMobile($(this).val())) {
            toastr.warning("Please enter a valid Mobile No", "Validation Error");
            return;
        }
    });

    $("#from-search-box").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a valid Address", "Validation Error");
            return;
        }
    });

    $("#ddlCity").on("keypress", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please select a valid City", "Validation Error");
            return;
        }
    });

    $("#numContact").on("blur", function () {
        if (!IsNullOrEmpty($(this).val()) && !isMobile($(this).val())) {
            toastr.warning("Please enter a valid Contact No", "Validation Error");
            return;
        }
    });

    $("#numPincode").on("blur", function () {
        if (!ValidatePinCode($(this).val())) {
            toastr.warning("Please enter a valid Pincode", "Validation Error");
            return;
        }
    });

    $("#numWhatsApp").on("blur", function () {
        if (!isMobile($(this).val())) {
            toastr.warning("Please enter a valid WhatsApp No", "Validation Error");
            return;
        }
    });

    $("#txtEmail").on("blur", function () {
        if (!IsNullOrEmpty($(this).val()) && !isValidateEmail($(this).val())) {
            toastr.warning("Please enter a valid Email", "Validation Error");
            return;
        }
    });
}
function ValidationCheck() {

    //if (IsNullOrEmpty($("#numPan").val()) || !ValidatePanNumber($("#numPan").val())) {
    //    toastr.warning("Please enter a valid PAN No", "Validation Error");
    //    return false;
    //}
    //if (IsNullOrEmpty($("#numGstNumber").val()) && !ValidatePanNumber($("#numGstNumber").val())) {
    //    toastr.warning("Please enter a valid GST No", "Validation Error");
    //    return false;
    //}
    var panNumber = $("#numPan").val().toUpperCase().trim();
    var gstNumber = $("#numGstNumber").val().toUpperCase().trim();

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

    if (IsNullOrEmpty($("#txtCustomerName").val())) {
        toastr.warning("Please enter a valid CustomerName", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtCustomerCode").val()) || !isAlphabets($("#txtCustomerCode").val())) {
        toastr.warning("Please enter a valid Customer code", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#from-search-box").val())) {
        toastr.warning("Please enter a valid Address", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#ddlCity").val()) || !isValidateSelect($("#ddlCity").val(), $("#ddlCity").prop("selectedIndex"))) {
        toastr.warning("Please select a City", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#numPincode").val()) || !/^\d{6}$/.test($("#numPincode").val())) {
        toastr.warning("Please enter a valid Pincode", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#numWhatsApp").val()) || !isMobile($("#numWhatsApp").val())) {
        toastr.warning("Please enter a valid WhatsApp No", "Validation Error");
        return false;
    }
    return true;
}
function getAutoCustomerCode() {
    $.ajax({
        url: '/Customer/GetAutoCustomerCode', 
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            $("#txtCustomerCode").val(response);
        },
        error: function (xhr, status, error) {
            console.error('Error fetching customer code:', error);
        }
    });
}
