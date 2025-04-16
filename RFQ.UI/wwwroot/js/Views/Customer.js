
$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const linkId = urlParams.get('LinkId');
    console.log(linkId);

    function isValidAddress(value) {
        return /^[A-Za-z0-9\s,.\-\/]+$/.test(value);
    }

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
        }
        $("#numGstNumber").val(GstValue.toUpperCase());
    });
    $("#txtPanNumber").on("keypress", function (event) {
        var PanEValue = $(this).val();
        var key = String.fromCharCode(event.which).toUpperCase();
        var validCharacterRegex = /^[0-9A-Z]$/;
        if (!validCharacterRegex.test(key)) {
            event.preventDefault();
        }
        $("#numPan").val(PanEValue.toUpperCase());
    });
    $("#txtCustomerName").on("keypress", function (event) {
        var key = String.fromCharCode(event.which);
        if (!isAlphabets(key)) {
            event.preventDefault();
        }
    });
    $("#txtCustomerCode").on("keypress", function (event) {
        var key = String.fromCharCode(event.which);
        if (!isAlphaNumeric(key)) {
            event.preventDefault();
        }
    });
    $("#txtaddress").on("keypress", function (event) {
        var key = String.fromCharCode(event.which);
        if (!isValidAddress(key)) {
            event.preventDefault();
        }
    });
    $("#ddlCity").on("change", function () {
        var ddlCity = $(this).val();
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
        }
    });
    $("#numMobile").on("keypress", function (event) {
        var key = String.fromCharCode(event.which);
        if (!/^\d$/.test(key)) {
            event.preventDefault();
        }
    });
    $("#numContact").on("keypress", function (event) {
        var key = String.fromCharCode(event.which);
        if (!/^\d$/.test(key)) {
            event.preventDefault();
        }
    });
    $("#numPincode").on("keypress", function (event) {
        var PincodeValue = $(this).val() + String.fromCharCode(event.which);
        if (!/^\d{0, 6}$/.test(PincodeValue)) {
            event.preventDefault();
        }
    });
    $("#numWhatsApp").on("keypress", function (event) {
        var key = String.fromCharCode(event.which);
        if (!/^\d$/.test(key)) {
            event.preventDefault();
        }
    });
    $("#txtEmail").on("keypress", function (event) {
        var key = String.fromCharCode(event.which);
        var emailValue = $(this).val() + key;
        if (!isValidateEmail(emailValue)) {
            //toastr.warning("Email is not valid yet", "Warning");
        }
    });

    document.querySelectorAll("#txtGstNumber, #txtPanNumber").forEach(function (element) {
        element.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
        });
    });

    // On form submit
    $("#btnSaveCustomer").click(function (event) {
        event.preventDefault();
        SaveAndSaveNew();
    });

    // Reset form fields on button click
    $('#SavenewButton').on('click', function () {
        SaveAndSaveNew();
        $('#CustomerForm')[0].reset();
    });

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
    $('#tableDiv').show();
    var fetchCustomerUrl = '/Customer/ViewCustomer';
    $.ajax({
        url: fetchCustomerUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {

            let trlist = response;
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
                "ordering": true,
                "info": true,
                "autoWidth": true,
                "responsive": true,
                "info": true,
                "autoWidth": true,
                "responsive": true,
                "ordering": false,
                "data": trlist,
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
function SaveAndSaveNew() {
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
    var linkId = $("#txtLinkId").val();

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

    };
    $.ajax({
        url: saveUrl,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {
            toastr.success("Customer details submitted successfully!");

        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to submit Customer details", "Error");
        }
    });
}
function EditCustomer(partyId) {
    var data = customerViewModelDtos.filter(x => x.partyId === partyId);
    var formData = data[0];
    $('#tableDiv').hide();
    $("#backButton").css('display', 'none');
    $("#addCustomerDiv").css('display', 'Block');
    $("#btnSaveCustomer").hide();
    $("#btnUpdate").show();
    $("#cancleButton").removeClass('d-none');
    $("#SavenewButton").hide();
    $("#btnView").hide();
    $("#txtGstNumber").val(formData.gstNo);
    $("#txtPartyId").val(formData.partyId);
    $("#txtLinkId").val(formData.linkId);
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
    $("#txtCustomerName").val(formData.partyName);
    $("#txtCustomerCode").val(formData.customerCode);
    $("#txtaddress").val(formData.addressLine);
    $("#ddlCity").val(formData.cityId).change();
    $("#txtContactPerson").val(formData.contactPerson);
    $("#numMobile").val(formData.mobNo);
    $("#numContact").val(formData.contactNo);
    $("#numPan").val(formData.panNo);
    $("#numPincode").val(formData.pinCode);
    $("#numWhatsApp").val(formData.whatsAppNo);
    $("#txtEmail").val(formData.email);
    $("#numGstNumber").val(formData.gstNo);
}
function UpdateCustomer() {
    $("#btnUpdate").on('click', function (e) {
        e.preventDefault();

        var formData = {
            PartyId: $("#txtPartyId").val(),
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
            LinkId: $("#txtLinkId").val()
        }

        $.ajax({
            type: "PUT",
            url: "/Customer/UpdateCustomer",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(formData),
            dataType: "json",
            success: function (result) {
                if (result.result === "success") {
                    $("#addCustomerDiv").css('display', 'none')
                    FetchCustomerList();
                    $("#backButton").css('display', 'block');
                } else {
                    $("#dataDiv").html("Failed to update profile.");
                }
                $("#btnsave").show();
                $("#btnUpdate").hide();
                $("#btnsaveandnew").prop("disabled", false);
                $("#viewprofile").click();
            },
            error: function (xhr, status, error) {
                $("#dataDiv").html("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText + " " + xhr.responseText);
            }
        });
    });
}
function DeleteCustomer(partyId) {
    var deleteCustomerUrl = '/Customer/DeleteCustomer/' + partyId
    $.ajax({
        url: deleteCustomerUrl,
        type: "DELETE",
        dataType: "json",
        data: JSON.stringify(partyId),
        success: function (response) {
            FetchCustomerList();
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to fetch data!", "Error");
        }
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
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                toastr.error("Failed to Gst E-Kyc Details", "Error");
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
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                toastr.error("Failed to Fetch EKyc Details", "Error");
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
            console.log(response);
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
