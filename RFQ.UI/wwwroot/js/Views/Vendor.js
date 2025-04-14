
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
    $("#btnSaveVendor").on('click', function (event) {
        event.preventDefault();
        SaveVendor();
    })
    $("#btnSavenewVendor").on('click', function (event) {
        SaveVendor();
        $('#vendorForm')[0].reset();
    })
    $("#btnUpdateVendor").on('click', function (event) {
        event.preventDefault();
        UpdateVendor();
    });
    $("#btnViewButton").on("click", function () {
        FetchVendor();
        $("#addVendorDiv").css('display', 'none');
        $("#backButton").css('display', 'block');
    });
    $('#backButton').on('click', function () {
        window.location.reload(true);
    });
    $("#txtVendorName").on("change", function () {
        if (!isAlphabets($(this).val())) {
            toastr.warning("Please enter a valid Vendor Name", "Warning");
            return;
        }
    });
    $("#ddlVendorCategory").on("keypress", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please enter a valid Vendor Category", "Warning");
            return;
        }
    });
    $("#txtAddress").on("change", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a valid Address", "Warning");
            return;
        }
    });
    $("#ddlCity").on("keypress", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please enter a valid Vendor City", "Warning");
            return;
        }
    });
    $("#txtContactPerson").on("change", function () {
        if (!isAlphabets($(this).val())) {
            toastr.warning("Please enter a valid Contact Person", "Warning");
            return;
        }
    });
    $("#txtEmailId").on("change", function () {
        if (!isValidateEmail($(this).val())) {
            toastr.warning("Please enter a valid Email", "Warning");
            return;
        }
    });
    $("#txtMobileNumber").on("change", function () {
        if (($(this).val()).length != 10) {
            toastr.warning("Please enter a valid Mobile Number", "Warning");
            return;
        }
    });
    $("#txtWhatsappNumber").on("change", function () {
        if (($(this).val()).length != 10) {
            toastr.warning("Please enter a valid WhatsApp Number", "Warning");
            return;
        }
    });
    $("#txtPinCode").on("change", function () {
        if (($(this).val()).length != 6) {
            toastr.warning("Please enter a valid  PinCode", "Warning");
            return;
        }
    });

    $("#gstEKycButton").on("click", function () {
        var gstNumber = $("#txtGstNumber").val();
        if (!ValidateGstNumber(gstNumber)) {
            toastr.warning("Please enter a valid GST Number", "Warning");
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
                    $("#txtLegalName").val(gstModel.legalName);
                    $("#txtTypeBusiness").val(gstModel.constitutionOfBusiness);
                    $("#txtGstStatus").val(gstModel.gstStatus);
                    $("#txtGstAddress").val(gstModel.principalAddress);
                    $("#txtTradeName").val(gstModel.tradeName);
                    $("#txtAadharVerified").val(gstModel.aadhaarVerified);
                    $("#txtGstVerifiedOn").val(new Date(gstModel.dateOfRegistration).toISOString().split('T')[0]);
                    $("#txtVerifiedGstNo").val();
                },
                error: function (xhr, status, error) {

                    toastr.error("Failed to submit Vehicle Type", "Error");
                }
            });
        }
    });
    $("#panEKycButton").on("click", function () {

        var getPanKycUrl = '/Customer/GetPanKycDetails';
        var panNumber = $("#txtPanNumber").val();
        if (!ValidatePanNumber(panNumber)) {
            toastr.warning("Please enter a valid PAN Nubmer", "Warning");
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
                    $("#txtPanName").val(panModel.fullName);
                    $("#txtAadharLinked").val(panModel.aadhaarLinked);
                    $("#txtPanStatus").val(panModel.message);
                    $("#txtPanVerifiedOn ").val(new Date(panModel.logDateTime).toISOString().split('T')[0]);
                },
                error: function (xhr, status, error) {

                    toastr.error("Failed to submit Vehicle Type", "Error");
                }
            });
        }
    });
    $("#cancleButton").on("click", function () {
        FetchVendor();
        $("#addVendorDiv").css('display', 'none');
        $("#backButton").css('display', 'block');
    });
    function ValidatePanNumber(number) {
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(number);
    }
    function ValidateGstNumber(number) {
        return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/.test(number);
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
                toastr.error("Failed to fetch data!", "Error");
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
                toastr.error("Failed to fetch data!", "Error");
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

    function SaveVendor() {
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

        if (IsNullOrEmpty(vendorName)) {
            toastr.warning("Please enter a valid Vendor Name", "Warning");
            return;
        }
        if (!isValidateSelect(vendorCategory)) {
            toastr.warning("Please enter a valid Vendor Category", "Warning");
            return;
        }
        if (IsNullOrEmpty(vendorAddress)) {
            toastr.warning("Please enter a valid Vendor Address", "Warning");
            return;
        }
        if (!isValidateSelect(vendorCity)) {
            toastr.warning("Please enter a valid Vendor City", "Warning");
            return;
        }
        if (IsNullOrEmpty(vendorPincode)) {
            toastr.warning("Please enter a valid PinCode", "Warning");
            return;
        }
        if (IsNullOrEmpty(contactPerson)) {
            toastr.warning("Please enter a valid Contact Person", "Warning");
            return;
        }
        if (IsNullOrEmpty(whatsappNumber)) {
            toastr.warning("Please enter a valid Whatsapp Number", "Warning");
            return;
        }
        if (IsNullOrEmpty(mobileNumber)) {
            toastr.warning("Please enter a valid Mobile Number", "Warning");
            return;
        }
        if (!isValidateEmail(emailId)) {
            toastr.warning("Please enter a valid Email", "Warning");
            return;
        }
        if (IsNullOrEmpty(panNumber)) {
            toastr.warning("Please enter a valid PAN Nubmer", "Warning");
            return;
        }
        if (IsNullOrEmpty(gstNubmer)) {
            toastr.warning("Please enter a valid GST Number", "Warning");
            return;
        }

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
        $.ajax({
            url: saveVendorUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                toastr.success("Vendor details submitted successfully!");

            },
            error: function (xhr, status, error) {
                toastr.error("Failed to submit Vendor details", "Error");
            }
        });
    }
});
function FetchVendor() {
    $("#tableDiv").show();
    var fetchVendorUrl = '/Vendor/GetAllVendor';
    $.ajax({
        url: fetchVendorUrl,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            let vendorList = response;

            vendorListDto = response;
            if ($.fn.DataTable.isDataTable('#tableVendor')) {
                $('#tableVendor').DataTable().clear().destroy();
            }
            $('#tableVendor').DataTable({
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
                "scrollX": true,
                "data": vendorList,
                "columns": [
                    { "data": "partyName", },
                    { "data": "partyCategoryId" },
                    { "data": "addressLine" },
                    { "data": "pinCode" },
                    { "data": "contactPerson" },
                    { "data": "mobNo" },
                    { "data": "whatsAppNo" },
                    { "data": "email" },
                    { "data": "panNo" },
                    { "data": "gstNo" },
                    {
                        "data": "partyId",
                        "render": function (data, type, row) {
                            return `<div class="btn-group" role="group">
        <button type="button" class="btn btn-sm btn-primary" onclick="EditVendor(${data})">
            <i class="ti ti-edit"></i> Edit
        </button>
        <button type="button" class="btn btn-sm btn-danger" onclick="DeleteVendor(${data})">
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
            })
        },
        error: function (xhr, status, error) {

            toastr.error("Failed to fetch data!", "Error");
        }
    });
}
function EditVendor(partyId) {
    var data = vendorListDto.filter(x => x.partyId == partyId);
    var formData = data[0];
    $('#tableDiv').hide();
    $("#backButton").css('display', 'none');
    $("#addVendorDiv").css('display', 'Block');
    $("#btnSaveVendor").hide();
    $("#btnUpdateVendor").show();
    $("#btnSavenewVendor").hide();
    $("#btnViewButton").hide();
    $("#cancleButton").removeClass("d-none");
    $("#txtPartyId").val(formData.partyId);
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
}
function UpdateVendor() {

    var formData = {
        PartyId: $("#txtPartyId").val(),
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
                toastr.success("Vendor Updated successfully!");
                FetchVendor();
                $("#backButton").show();
            }
            else {
                toastr.error("Failed to update Vendor");
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to update Vendor");
        }
    });
}
function DeleteVendor(partyId) {
    var deleteVendorUrl = '@Url.Content("/Vendor/DeleteVendor/' + partyId
    $.ajax({
        url: deleteVendorUrl,
        type: "DELETE",
        dataType: "json",
        data: JSON.stringify(partyId),
        success: function (response) {
            toastr.success("Vendor Deleted successfully!");
            FetchVendor();
            $("#backButton").show();
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to delete Vendor", "Error");
        }
    });
}