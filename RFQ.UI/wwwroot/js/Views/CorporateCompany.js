
$(document).ready(function () {
    var corporateCompanyViewModelDto
    var list

    GetAllFranchiseList();
    GetAllCityList();
    CheckValidation();
    $(document).on("click", "#viewButton", function () {
        fetchCorporateCompany();
        $("#addCorporateCompanyDiv").css('display', 'none')
        $("#backButton").css('display', 'Block');
    });
    $("#cancleButton").on('click', function () {
        fetchCorporateCompany();
        $("#addCorporateCompanyDiv").css('display', 'none')
        $("#backButton").css('display', 'Block');
    })
    document.querySelectorAll("#txtGstNumber, #txtPanNumber").forEach(function (element) {
        element.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
        });
    });
    $("#btnSaveCompanyType, #btnsaveandnew").on('click', function () {
        var action = $(this).data('action'); // "save" or "saveNew"
        SaveAndSaveNew(action);
    });
    $('#backButton').click(function () {
        window.location.reload(true);
        
    });
    BouttonUpdateClick();
});
function CheckValidation() {
    $("#txtCompanyName").on("blur", function () {
        var CompanyNa = $(this).val();
        if (!isAlphabets(CompanyNa)) {
            toastr.warning("Please enter a valid Corporate Company", "Warning");
            return;
        }
    });
    $("#txtWhatsAppNumber").on("blur", function () {
        var whats = $(this).val();
        if (!isMobile(whats)) {
            toastr.warning("Please enter a whatsApp number", "Warning");
            return;
        }
    });
    $("#txtMobileNumber").on("blur", function () {
        var MobileNum = $(this).val();
        if (!isMobile(MobileNum)) {
            toastr.warning("Please enter a valid 10-digit mobile number", "Warning");
            return;
        }
    });
    $("#txtContactNumber").on("blur", function () {
        var mobileNum = $(this).val();
        if (!isMobile(mobileNum)) {
            toastr.warning("Please enter a valid 10-digit contact number", "Warning");
            return;
        }
    });
    $("#txtAddress").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a valid Address", "Warning");
            return;
        }
    });
    $("#txtPinCode").on("blur", function () {
        var pinc = $(this).val();
        if (!/^\d{6}$/.test(pinc)) {
            toastr.warning("Please enter a Valid Pincode", "Warning");
            return;
        }
    });
    $("#ddlCity").on("keypress", function () {
        var city = $(this).val();
        if (!isValidateSelect(city)) {
            toastr.warning("Please enter a City", "Warning");
            return;
        }
    });
    $("#txtPerson").on("blur", function () {
        var person = $(this).val();
        if (!isAlphabets(person)) {
            toastr.warning("Please enter a Contact Person", "Warning");
            return;
        }
    });
    $("#txtEmail").on("blur", function () {
        var email = $(this).val();
        if (!isValidateEmail(email)) {
            toastr.warning("Please enter a valid email", "Warning");
            return;
        }
    });
    $("#txtPanNumber").on("blur", function () {
        var pan = $(this).val();
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
            toastr.warning("Please enter a valid PAN number", "Warning");
            return;
        }
    });
    $("#txtGstNumber").on("blur", function () {
        var gst = $(this).val();
        if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/.test(gst)) {
            toastr.warning("Please enter a valid GST number", "Warning");
            return;
        }
    });
    $("#ddlFranchisename").on("keypress", function () {
        var fname = $(this).val();
        if (!isValidateSelect(fname)) {
            toastr.warning("Please enter a Franchise Name", "Warning");
            return;
        }
    });
}
function CheckNullValidation() {
    let isValid = true;
    const fields = [
        { id: "#txtCompanyName", name: "Company Name" },
        { id: "#ddlFranchisename", name: "franchise" },
        { id: "#txtAddress", name: "address" },
        { id: "#ddlCity", name: "City" },
        { id: "#txtPinCode", name: "Pincode" },
        { id: "#txtPerson", name: "Mobile Number" },
        { id: "#txtWhatsAppNumber", name: "Whatsapp  Number" },
        { id: "#txtMobileNumber", name: "Mobile Number" },
        { id: "#txtContactNumber", name: "Contact Number" },
        { id: "#txtEmail", name: "Email" },
        { id: "#txtPanNumber", name: "Pan Number" },
        { id: "#txtGstNumber", name: "Gst Number" },
    ];
    fields.forEach(field => {
        const value = $(field.id).val();
        if (!value || value.trim() === "") {
            toastr.warning(`${field.name} is required`, "Validation Error");
            isValid = false;
        }
    });
    return isValid;
}
function GetAllFranchiseList() {
    var franchiseUrl = '/CorporateCompany/GetAllFranchise';
    $.ajax({
        url: franchiseUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            var data = response.filter(x => x.companyTypeId == 2);
            BindDropDownData(data)
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to fetch data!", "Error");
        }
    });
}
function BindDropDownData(data) {
    const select = document.getElementById("ddlFranchisename");
    select.innerHTML = "";

    let placeholderOption = document.createElement("option");
    placeholderOption.value = "";
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

    $('.selectpicker').selectpicker('refresh');
}
function GetAllCityList() {
    var cityUrl = '/Customer/GetAllCity';
    $.ajax({
        url: cityUrl,
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
function fetchCorporateCompany() {
    $('#tableDiv').show();
    var fetchCorporateCompanyUrl = '/CorporateCompany/ViewCorporateCompany';
    $.ajax({
        url: fetchCorporateCompanyUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            let trlist = response.filter(x => x.companyTypeId == 3);
            corporateCompanyViewModelDto = response;
            if ($.fn.DataTable.isDataTable('#tableCorporateCompany')) {
                $('#tableCorporateCompany').DataTable().clear().destroy();
            }


            $('#tableCorporateCompany').DataTable({
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

                "data": trlist,
                "columns": [

                    { "data": "companyTypeId" },
                    { "data": "companyName" },
                    { "data": "addressLine" },
                    { "data": "cityId" },
                    { "data": "pinCode" },
                    { "data": "contactPerson" },
                    { "data": "mobNo" },
                    { "data": "contactNo" },
                    { "data": "whatsAppNo" },
                    { "data": "email" },
                    { "data": "panNo" },
                    { "data": "gstNo" },


                    {
                        "data": function (row) {
                            return { CompanyId: row.companyId, LinkId: row.linkId }
                        },
                        "render": function (data, type, row) {
                            return `
                            <div class="btn-group" role="group">

                                <button type="button" class="btn btn-sm btn-primary"
                                    onclick="EditCorporateCompany(${data.CompanyId})">
                                    <i class="ti ti-edit"></i> Edit
                                </button>
                                <button type="button" class="btn btn-sm btn-danger"
                                    onclick="deleteCorporateCompany(${data.CompanyId},${data.LinkId})">
                                    <i class="ti ti-trash"></i> Delete
                                </button>
                            </div>`;
                        },
                    }
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
function BouttonUpdateClick() {
    $("#btnupdate").click(function (e) {
        e.preventDefault();
        var isValid = CheckNullValidation();
        if (isValid) {
            var companyId = 0;

            var formData = {
                CompanyId: $("#txtCompanyId").val(),
                CompanyName: $("#txtCompanyName").val(),
                MobNo: $("#txtMobileNumber").val(),
                ContactNo: $("#txtContactNumber").val(),
                AddressLine: $("#txtAddress").val(),
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
                debugger;
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
                        toastr.success("Company Updated successfully!");
                        $("#addCorporateCompanyDiv").css('display', 'none');
                        fetchCorporateCompany();
                        $("#backButton").show();
                    } else {
                        $("#dataDiv").html("Failed to update profile.");
                    }
                    $("#btnSaveCompanyType").show();
                    $("#btnupdate").hide();
                    $("#btnsaveandnew").prop("disabled", false);
                    $("#viewprofile").click();
                },
                error: function (xhr, status, error) {
                    $("#dataDiv").html("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText);
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
                console.log("Value: " + value);
            });
        }
    });
};
function deleteCorporateCompany(companyId, linkId) {
    var result;
    var deleteCorporateCompanyUrl = '/CorporateCompany/DeleteCorporateCompany/' + companyId
    FetchMasterAttachment(linkId, companyId, function (list) {
        result = list;

        console.log(result);
        $.ajax({
            url: deleteCorporateCompanyUrl,
            type: "DELETE",
            dataType: "json",
            data: JSON.stringify(companyId),
            success: function (response) {
                if (result.length > 0) {
                    DeleteMasterAttachment(result[0].attachmentId);
                }
                toastr.success("Comporate Company deleted successfully!");
                fetchCorporateCompany();
                $("#backButton").css('display', 'block');
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to fetch data!", "Error");
            }
        });
    });
}
function SaveAndSaveNew(action) { 
        var companyName = $("#txtCompanyName").val();
        var franchiseName = $("#ddlFranchisename").val();
        var address = $("#txtAddress").val();
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
        if (!isAlphabets(companyName)) {
            toastr.warning("Please enter a valid Corporate Company", "Warning");
            return;
        }

        if (!isValidateSelect(franchiseName)) {
            toastr.warning("Please enter a Franchise Name", "Warning");
            return;
        }

        if (IsNullOrEmpty($("#txtAddress").val())) {
            toastr.warning("Please enter a valid Address", "Warning");
            return;
        }

        if (!isValidateSelect(city)) {
            toastr.warning("Please enter a City", "Warning");
            return;
        }

        if (!/^\d{6}$/.test(pincode)) {
            toastr.warning("Please enter a Valid Pincode", "Warning");
            return;
        }

        if (!isAlphabets(contactPerson)) {
            toastr.warning("Please enter a Contact Person", "Warning");
            return;
        }

        if (!isMobile(whatsAppNumber)) {
            toastr.warning("Please enter a whatsApp number", "Warning");
            return;
        }

        if (!isMobile(mobileNumber)) {
            toastr.warning("Please enter a valid 10-digit mobile number", "Warning");
            return;
        }

        if (!isMobile(contactNumber)) {
            toastr.warning("Please enter a valid 10-digit contact number", "Warning");
            return;
        }

        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase())) {
            toastr.warning("Please enter a valid PAN number", "Warning");
            return;
        }

        if (!isValidateEmail(email)) {
            toastr.warning("Please enter a valid email", "Warning");
            return;
        }

        if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/.test(gSTNumber.toUpperCase())) {
            toastr.warning("Please enter a valid GST number", "Warning");
            return;
        }



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
        if (action == "save") {
            $.ajax({
                url: saveUrl,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(formData),
                success: function (response) {
                    let companyId = response.result.companyId;
                    Saveattachment(companyId);
                    toastr.success("Corporate Company submitted successfully");
                    window.location.href = "../Dashboard/Dashboard";
                },
                error: function (xhr, status, error) {
                    console.error("Error:", error);
                    toastr.error("Failed to submitCompany", "Error");
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
                    toastr.success("Corporate Company submitted successfully");
                    $('#CompanyTypeForm')[0].reset();
                    $('#ddlFranchisename').val('');
                    $('#ddlCity').val('');
                    $('.selectpicker').selectpicker('refresh');
                },
                error: function (xhr, status, error) {
                    console.error("Error:", error);
                    toastr.error("Failed to submitCompany", "Error");
                }
            });
        }
    return companyId;

}
function EditCorporateCompany(companyId) {
    var data = corporateCompanyViewModelDto.filter(x => x.companyId == companyId);
    if (data.length === 0) {
        console.error("No company data found for companyId:", companyId);
        return;
    }

    var formData = data[0];

    FetchMasterAttachment(formData.linkId, companyId, function (list) {
        var attachmantData = list;
        console.log(formData);
        $('#tableDiv').hide();
        $("#backButton").css('display', 'none');
        $("#addCorporateCompanyDiv").css('display', 'Block');
        $("#btnSaveCompanyType").hide();
        $("#btnupdate").show();
        $("#viewButton").hide();
        $("#cancleButton").removeClass('d-none');
        $("#btnsaveandnew").hide();
        $("#txtCompanyId").val(formData.companyId);
        $("#txtCompanyName").val(formData.companyName);
        $("#txtPerson").val(formData.contactPerson);
        $("#txtMobileNumber").val(formData.mobNo);
        $("#txtContactNumber").val(formData.contactNo);
        $("#txtAddress").val(formData.addressLine);
        $("#ddlCity").selectpicker('val', formData.cityId);
        $('#ddlCity').selectpicker('refresh');
        $("#txtPinCode").val(formData.pinCode);
        $("#txtEmail").val(formData.email);
        $("#txtWhatsAppNumber").val(formData.whatsAppNo);
        $("#txtPanNumber").val(formData.panNo);
        $("#txtGstNumber").val(formData.gstNo);
        $("#ddlFranchisename").selectpicker('val', formData.parentCompanyId);
        $('#ddlFranchisename').selectpicker('refresh');

        if (attachmantData.length > 0) {
            EditMasterAttachment(attachmantData);
        } else {
            console.warn("No attachment data found for companyId:", companyId);
        }
    });
}


