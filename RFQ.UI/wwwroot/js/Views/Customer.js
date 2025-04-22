const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('LinkId');
let isGstEKycClicked = false;
let isPanEKycClicked = false;

$(document).ready(function () {

    //function isValidAddress(value) {
    //    return /^[A-Za-z0-9\s,.\-\/]+$/.test(value);
    //}

    document.getElementById("txtPanNumber").addEventListener("input", function () {
        const panKyc = this.value.toUpperCase();
        document.getElementById("numPan").value = panKyc;
    });
    document.getElementById("txtGstNumber").addEventListener("input", function () {
        const gstKyc = this.value.toUpperCase();
        document.getElementById("numGstNumber").value = gstKyc;
    });

    $(document).on("click", "#btnView", function () {
        FetchCustomerList();
        $("#addCustomerDiv").css('display', 'none')
        $("#backButton").css('display', 'Block');
    });
    // Check Form Validation
    $("#txtGstNumber").on("keypress", function (event) {
        var GstValue = $(this).val();
        var key = String.fromCharCode(event.which).toUpperCase();
        var validCharacterRegex = /^[0-9A-Z]$/;
        if (!validCharacterRegex.test(key)) {
            event.preventDefault();
            toastr.warning("Please enter a valid GST No ", "Warning");
        }
        $("#numGstNumber").val(GstValue.toUpperCase());
    });
    $("#txtPanNumber").on("keypress", function (event) {
        var PanEValue = $(this).val();
        var key = String.fromCharCode(event.which).toUpperCase();
        var validCharacterRegex = /^[0-9A-Z]$/;
        if (!validCharacterRegex.test(key)) {
            event.preventDefault();
            toastr.warning("Please enter a valid PAN No ", "Warning");
        }
        $("#numPan").val(PanEValue.toUpperCase());
    });
    $("#txtCustomerName").on("keypress", function (event) {
        var key = String.fromCharCode(event.which);
        if (!isAlphabets(key)) {
            event.preventDefault();
            toastr.warning("Please enter a valid Customer Name ", "Warning");
            ClearGstFields();
            return;
        }
    });
    //$("#txtaddress").on("keypress", function (event) {
    //    var key = String.fromCharCode(event.which);
    //    if (!isValidAddress(key)) {
    //        event.preventDefault();
    //        toastr.warning("Please enter a valid Address ", "Warning");
    //        return;
    //    }
    //});
    $("#ddlCity").on("change", function () {
        var ddlCity = $(this).val();
        console.log(isValidateSelect(ddlCity, selectedIndex));
        var selectedIndex = $(this).prop("selectedIndex");
        if (!isValidateSelect(ddlCity, selectedIndex)) {
            toastr.warning("Please select City", "Warning");
            return;
        }
    });
    $("#txtContactPerson").on("keypress", function (event) {
        var key = String.fromCharCode(event.which);
        if (!isAlphabets(key)) {
            event.preventDefault();
            toastr.warning("Please enter a valid Contact Person", "Warning");
            return;
        }
    });
    $("#numMobile").on("keypress", function (event) {
        var key = String.fromCharCode(event.which);
        if (!/^\d$/.test(key)) {
            event.preventDefault();
            toastr.warning("Please enter a valid Mobile Number", "Warning");
            return;
        }
    });
    $("#numContact").on("keypress", function (event) {
        var key = String.fromCharCode(event.which);
        if (!/^\d$/.test(key)) {
            event.preventDefault();
            toastr.warning("Please enter a valid Contact Number", "Warning");
        }
    });
    $("#numPincode").on("keypress", function (event) {
        var keyCode = event.which || event.keyCode;
        if (keyCode < 48 || keyCode > 57) {
            event.preventDefault();
            toastr.warning("Please enter a valid Pincode", "Warning");
            return;
        }
        var PincodeValue = $(this).val() + String.fromCharCode(keyCode);
        if (PincodeValue.length > 6) {
            event.preventDefault();
            //toastr.warning("Pincode cannot exceed 6 digits", "Warning");
            return;
        }
    });
    $("#numWhatsApp").on("keypress", function (event) {
        var key = String.fromCharCode(event.which);
        if (!/^\d$/.test(key)) {
            event.preventDefault();
            toastr.warning("Please enter a valid WhatsApp Number", "Warning");
            return;
        }
    });
    $("#txtEmail").on("keypress", function (event) {
        var key = String.fromCharCode(event.which);
        var emailValue = $(this).val() + key;
        if (!isValidateEmail(emailValue)) {
            toastr.warning("Please enter a valid email address", "Warning");
            return;
        }
    });

    document.querySelectorAll("#txtGstNumber, #txtPanNumber").forEach(function (element) {
        element.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
        });
    });

    $("#gstEKycButton").click(function () {
        isGstEKycClicked = true;
    });

    $("#panEKycButton").click(function () {
        isPanEKycClicked = true;
    });

    $("#btnSaveCustomer, #SavenewButton").on('click', function () {
        var action = $(this).data('action'); // "save" or "saveNew"
        if (isGstEKycClicked && isPanEKycClicked) {
            SaveAndSaveNew(action);
        } else {
            toastr.warning("Please complete GST and PAN E-KYC before saving!");
        }
    });

    //// Save Customer Data
    //$("#btnSaveCustomer").click(function (event) {
    //    event.preventDefault();
    //    if (isGstEKycClicked && isPanEKycClicked) {
    //        SaveAndSaveNew();

    //    } else {
    //        toastr.warning("Please complete GST and PAN E-KYC before saving!");
    //    }
    //});

    //// Save and Reset Form
    //$('#SavenewButton').on('click', function (event) {
    //    event.preventDefault();
    //    if (isGstEKycClicked && isPanEKycClicked) {

    //        //$('#CustomerForm')[0].reset();
    //        $("#ddlCity").val("");
    //        $("#ddlCity").selectpicker("refresh");
    //        isGstEKycClicked = false;
    //        isPanEKycClicked = false;
    //    } else {
    //        toastr.warning("Please complete GST and PAN E-KYC before proceeding!");
    //    }
    //});

    $('#backButton').click(function () {
        window.location.reload(true);
        // $("#addCustomerDiv").css('display', 'Block')
        // $("#backButton").css('display', 'none');
        //  $('#tableDiv').hide();
    });

    $("#cancleButton").on('click', function () {
        FetchCustomerList();
        $("#addCustomerDiv").css('display', 'none')
        $("#backButton").css('display', 'Block');
    })
    GetAllCityList();
    UpdateCustomer();
    GstEKycclick();
    PanEKycclick();
});
function FetchCustomerList() {
    $("#tableDiv").removeClass('d-none');
    var fetchCustomerUrl = '/Customer/ViewCustomer';
    $.ajax({
        url: fetchCustomerUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            let customerList = response.filter(x => x.partyTypeId == 6);
            customerViewModelDtos = response;
            // Destroy existing DataTable if exists
            if ($.fn.DataTable.isDataTable('#tableCustomer')) {
                $('#tableCustomer').DataTable().clear().destroy();
            }

            $('#tableCustomer').DataTable({
                "processing": true,
                "serverSide": false,
                "paging": true,
                "pageLength": 10,
                "lengthChange": true,
                "searching": true,
                "info": true,
                "autoWidth": true,
                "responsive": true,
                "info": true,
                "autoWidth": true,
                "responsive": true,
                "scrollX": true,
                "ordering": false,
                "data": customerList,
                "columns": [

                    { "data": "partyName" },
                    { "data": "addressLine" },
                    { "data": "pinCode" },
                    { "data": "mobNo" },
                    { "data": "email" },
                    { "data": "panNo" },
                    { "data": "gstNo" },
                    {
                        "data": "partyId",
                        "render": function (data, type, row) {
                            return `<div class="btn-group" role="group">
        <button type="button" class="btn btn-sm btn-primary" onclick="EditCustomer(${data})">
            <i class="ti ti-edit"></i> Edit
        </button>
        <button type="button" class="btn btn-sm btn-danger" onclick="DeleteCustomer(${data})">
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
function SaveAndSaveNew(action) {
    var gstKyc = $("#txtGstNumber").val();
    var legalName = $("#txtLegalName").val();
    var typeBusiness = $("#txtTypeBusiness").val();
    var gstStatus = $("#txtGstStatus").val();
    var tradeName = $("#txtTradeName").val();
    var adharVerified = $("#txtAadharVerified").val();
    var gstVerifiedOn = $("#txtGstVerifiedOn").val();
    var adharLinked = $("#txtAadharLinked").val();
    var panStatus = $("#txtPanStatus").val();
    var panVerifiedOn = $("#txtPanVerifiedOn").val();
    var panKyc = $("#txtPanNumber").val();
    var customerName = $("#txtCustomerName").val();
    var customerCode = $("#txtCustomerCode").val();
    var address = $("#txtaddress").val();
    var city = $("#ddlCity").val();
    var selectedIndex = $("#ddlCity").prop("selectedIndex");
    var contactPerson = $("#txtContactPerson").val();
    var mobileNumber = $("#numMobile").val();
    var panNumber = $("#numPan").val();
    var pincode = $("#numPincode").val();
    var whatsAppNumber = $("#numWhatsApp").val();
    var contactNo = $("#numContact").val();
    var email = $("#txtEmail").val();
    var gstNumber = $("#numGstNumber").val();
    var partyId = 0;

    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/.test(gstKyc.toUpperCase())) {
        toastr.warning("Please enter a valid GST number", "Warning");
        return;
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panKyc.toUpperCase())) {
        toastr.warning("Please enter a valid PAN number", "Warning");
        return;
    }
    if (!isAlphabets(customerName)) {
        toastr.warning("Please enter a valid Customer Name", "Warning");
        return;
    }
    if (!isAlphaNumeric(customerCode)) {
        toastr.warning("Please enter a valid Customer Code", "Warning");
        return;
    }
    if (IsNullOrEmpty(address)) {
        toastr.warning("Please enter a valid Address", "Warning");
        return;
    }
    if (!isValidateSelect(city, selectedIndex)) {
        toastr.warning("Please select a City", "Warning");
        return;
    }
    if (!isAlphabets(contactPerson)) {
        toastr.warning("Please enter a valid Contact Person", "Warning");
        return;
    }
    if (!isMobile(mobileNumber)) {
        toastr.warning("Please enter a valid Mobile Number", "Warning");
        return;
    }
    if (!/^\d{6}$/.test(pincode)) {
        toastr.warning("Please enter a valid Pincode", "Warning");
        return;
    }
    if (!isMobile(whatsAppNumber)) {
        toastr.warning("Please enter a valid WhatsApp Number", "Warning");
        return;
    }
    if (!isMobile(contactNo)) {
        toastr.warning("Please enter a valid Contact No", "Warning");
        return;
    }
    if (!isValidateEmail(email)) {
        toastr.warning("Please enter a valid email", "Warning");
        return;
    }

    var saveUrl = '/Customer/CustomerSave';
    var formData = {
        // GSTNo: gstKyc,
        LegalName: legalName,
        TypeOfBusiness: typeBusiness,
        GstStatus: gstStatus,
        TradeName: tradeName,
        AadharVerified: adharVerified,
        PanStatus: panStatus,
        GSTVarifiedOn: gstVerifiedOn,
        PANVerifiedOn: panVerifiedOn,
        // PANNo: panKyc,
        PartyName: customerName,
        CustomerCode: customerCode,
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
        LinkId: linkId

    }

    if (action == "save") {
        $.ajax({
            url: saveUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                if (response != null) {
                    partyId = response.result.partyId;
                    Saveattachment(partyId);
                    window.location.href = "../Dashboard/Dashboard";
                    toastr.success("Customer details submitted successfully!");
                } else {
                    toastr.success("Somthing Went Wrong!");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                toastr.error("Failed to submit Customer details", "Error");
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
                    partyId = response.result.partyId;
                    Saveattachment(partyId);
                    toastr.success("Customer details submitted successfully!");
                    $('#CustomerForm')[0].reset();
                    $("#ddlCity").val("");
                    $("#ddlCity").selectpicker("refresh");
                } else {
                    toastr.success("Somthing Went Wrong!");
                }

            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                toastr.error("Failed to submit Customer details", "Error");
            }
        });
    }
    return partyId;
};
function EditCustomer(partyId) {
    var data = customerViewModelDtos.filter(x => x.partyId === partyId);
    var formData = data[0];
    console.log(formData);
    FetchMasterAttachment(formData.linkId, partyId, function (list) {
        var attachmentData = list;
        console.log(list);
        $('#tableDiv').hide();
        $("#backButton").css('display', 'none');
        $("#addCustomerDiv").css('display', 'Block');
        $("#btnSaveCustomer").hide();
        $("#btnUpdate").show();
        $("#cancleButton").removeClass('d-none');
        $("#SavenewButton").hide();
        $("#btnView").hide();
        $("#txtGstNumber").val(formData.gstNo);
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
        $("#txtPanVerifiedOn").val(panVerifiedDate);
        $("#txtPanNumber").val(formData.panNo);
        $("#txtCustomerName").val(formData.partyName);
        $("#txtCustomerCode").val(formData.customerCode);
        $("#txtaddress").val(formData.addressLine);
        $('#ddlCity').selectpicker('val', formData.cityId);
        $('#ddlCity').selectpicker('refresh');
        $("#txtContactPerson").val(formData.contactPerson);
        $("#numMobile").val(formData.mobNo);
        $("#numContact").val(formData.contactNo);
        $("#numPan").val(formData.panNo);
        $("#numPincode").val(formData.pinCode);
        $("#numWhatsApp").val(formData.whatsAppNo);
        $("#txtEmail").val(formData.email);
        $("#numGstNumber").val(formData.gstNo);

        if (attachmentData.length > 0) {
            EditMasterAttachment(attachmentData);
        }
    });
}
function UpdateCustomer() {
    $("#btnUpdate").on('click', function (e) {
        e.preventDefault();
        var gstKyc = $("#txtGstNumber").val();
        var panKyc = $("#txtPanNumber").val();
        var customerName = $("#txtCustomerName").val();
        var address = $("#txtaddress").val();
        var city = $("#ddlCity").val();
        var selectedIndex = $("#ddlCity").prop("selectedIndex");
        var contactPerson = $("#txtContactPerson").val();
        var mobileNumber = $("#numMobile").val();
        var pincode = $("#numPincode").val();
        var whatsAppNumber = $("#numWhatsApp").val();
        var contactNo = $("#numContact").val();
        var email = $("#txtEmail").val();

        if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/.test(gstKyc.toUpperCase())) {
            toastr.warning("Please enter a valid GST number", "Warning");
            return;
        }
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panKyc.toUpperCase())) {
            toastr.warning("Please enter a valid PAN number", "Warning");
            return;
        }
        if (!isAlphabets(customerName)) {
            toastr.warning("Please enter a valid Customer Name", "Warning");
            return;
        }
        if (IsNullOrEmpty(address)) {
            toastr.warning("Please enter a valid Address", "Warning");
            return;
        }
        if (!isValidateSelect(city, selectedIndex)) {
            toastr.warning("Please select a City", "Warning");
            return;
        }
        if (!isAlphabets(contactPerson)) {
            toastr.warning("Please enter a valid Contact Person", "Warning");
            return;
        }
        if (!isMobile(mobileNumber)) {
            toastr.warning("Please enter a valid Mobile Number", "Warning");
            return;
        }
        if (!/^\d{6}$/.test(pincode)) {
            toastr.warning("Please enter a valid Pincode", "Warning");
            return;
        }
        if (!isMobile(whatsAppNumber)) {
            toastr.warning("Please enter a valid WhatsApp Number", "Warning");
            return;
        }
        if (!isMobile(contactNo)) {
            toastr.warning("Please enter a valid Contact No", "Warning");
            return;
        }
        if (!isValidateEmail(email)) {
            toastr.warning("Please enter a valid email", "Warning");
            return;
        }
        var formData = {
            PartyId: $("#hdnPartyId").val(),
            LegalName: $("#txtLegalName").val(),
            TypeOfBusiness: $("#txtTypeBusiness").val(),
            GstStatus: $("#txtGstStatus").val(),
            TradeName: $("#txtTradeName").val(),
            AadharVerified: $("#txtAadharVerified").val(),
            PanStatus: $("#txtPanStatus").val(),
            GSTVarifiedOn: $("#txtGstVerifiedOn").val(),
            PANVerifiedOn: $("#txtPanVerifiedOn").val(),
            PartyName: $("#txtCustomerName").val(),
            CustomerCode: $("#txtCustomerCode").val(),
            AddressLine: $("#txtaddress").val(),
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
            LinkId: linkId
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
                AttachmentId: attachmentId,
                AttachmentName: fileName,
                AttachmentTypeId: attachmentType,
                AttachmentPath: filePath,
                ReferenceLinkId: parseInt(linkd),
                TransactionId: $("#hdnPartyId").val()
            });
        });

        var editCustomer = '/Customer/UpdateCustomer';
        $.ajax({
            type: "PUT",
            url: editCustomer,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(formData),
            dataType: "json",
            success: function (result) {
                if (result.result === "success") {
                    toastr.success("Customer Updated successfully!", "Success");
                    $("#addCustomerDiv").css('display', 'none');
                    FetchCustomerList();
                    $("#backButton").css('display', 'block');
                } else {
                    toastr.error("Failed to Update Customer", "Error");
                }
            },
            error: function (xhr, status, error) {
                $("#dataDiv").html("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText + " " + xhr.responseText);
            }
        });

        $.ajax({
            type: "PUT",
            url: '/MasterAttachment/UpdateMasterAttachment',
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
    });
}

function DeleteCustomer(partyId) {
    var deleteCustomerUrl = '/Customer/DeleteCustomer/' + partyId;

    FetchMasterAttachment(linkId, partyId, function (list) {
        result = list;

        $.ajax({
            url: deleteCustomerUrl,
            type: "DELETE",
            dataType: "json",
            data: JSON.stringify(partyId),
            success: function (response) {
                if (result.length > 0) {
                    DeleteMasterAttachment(result[0].attachmentId);
                }
                toastr.success("Customer deleted successfully!");
                FetchCustomerList();
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                toastr.error("Failed to fetch data!", "Error");
            }
        });
    });
}
function GstEKycclick() {
    $("#gstEKycButton").on("click", function () {
        var gstNumber = $("#txtGstNumber").val();

        if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/.test(gstNumber.toUpperCase())) {
            toastr.warning("Please enter a valid GST number", "Warning");
            return;
        }
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
                    $("#txtLegalName").val(gstModel.legalName),
                        $("#txtTypeBusiness").val(gstModel.constitutionOfBusiness),
                        $("#txtGstStatus").val(gstModel.gstStatus),
                        $("#txtGstAddress").val(gstModel.principalAddress),
                        $("#txtTradeName").val(gstModel.tradeName),
                        $("#txtAadharVerified").val(gstModel.aadhaarVerified),
                        $("#txtGstVerifiedOn").val(new Date(gstModel.dateOfRegistration).toISOString().split('T')[0]),
                        $("#txtVerifiedGstNo").val()
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
function PanEKycclick() {
    $("#panEKycButton").on("click", function () {
        var getPanKycUrl = '/Customer/GetPanKycDetails';
        var panNumber = $("#txtPanNumber").val();

        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase())) {
            toastr.warning("Please enter a valid PAN number", "Warning");
            CleatPanFields();
            return;
        }
        // Request Body
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
                    $("#txtPanName").val(panModel.fullName),
                        $("#txtAadharLinked").val(panModel.aadhaarLinked),
                        $("#txtPanStatus").val(panModel.message),
                        $("#txtPanVerifiedOn ").val(new Date(panModel.logDateTime).toISOString().split('T')[0])
                } else {
                    toastr.warning(response.messageDescription, "Error");
                    CleatPanFields();
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                toastr.error("Failed to Fetch EKyc Details", "Error");
                CleatPanFields();
            }
        });
    });
}
function GetAllCityList() {
    var getAllCityUrl = '/Customer/GetAllCity'
    $.ajax({
        url: getAllCityUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            BindDropDown(response)
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to fetch data!", "Error");
        }
    });
}
function BindDropDown(data) {
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
function CleatPanFields() {
    $("#txtPanName").val(''),
        $("#txtAadharLinked").val(''),
        $("#txtPanStatus").val(''),
        $("#txtPanVerifiedOn ").val('')
}
//function validateCustomerForm() {
//    let isValid = true;

//    const fields = [
//        { id: "#txtGstNumber", name: "GST Number" },
//        { id: "#txtPanNumber", name: "PAN Number" },
//        { id: "#txtCustomerName", name: "Customer Name" },
//        { id: "#txtaddress", name: "Address" },
//        { id: "#ddlCity", name: "City" },
//        { id: "#txtContactPerson", name: "Contact Person" },
//        { id: "#numMobile", name: "Mobile Number" },
//        { id: "#numContact", name: "Contact Number" },
//        { id: "#numPincode", name: "Pincode" },
//        { id: "#numWhatsApp", name: "WhatsApp Number" },
//        { id: "#txtEmail", name: "Email" }
//    ];

//    fields.forEach(field => {
//        const value = $(field.id).val();
//        if (!value || value.trim() === "") {
//            toastr.warning(`${field.name} is required`, "Validation Error");
//            isValid = false;
//        }
//    });

//    return isValid;
//}
