

$(document).ready(function () {
    var corporateCompanyViewModelDto
    var list


    var GetAttachmentUrl = '/MasterAttachment/GetAllMasterAttachmentType';
    var attachmentType = [];
    var attachmentList = [];
    $.ajax({
        url: GetAttachmentUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);
            localStorage.setItem('attachmentType', null)
            if (response && response.length > 0) {
                $.each(response, function (index, item) {
                    $('.ddlAttachment').append($('<option>', {
                        value: item.attachmentTypeId,
                        text: item.attachmentTypeName
                    }));

                    attachmentType.push({ value: item.attachmentTypeId, text: item.attachmentTypeName })
                });
                if (localStorage.getItem("attachmentType") == "null") {

                    localStorage.setItem('attachmentType', JSON.stringify(attachmentType));
                }
            }
            else {
                $('.ddlAttachment').empty().append('<option value="">No Attachment Available</option>');
            }

        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to MasterAttachmentType ", "Error");
        }
    });
    // View Button click Call Api
    $(document).on("click", "#viewButton", function () {
        fetchCorporateCompany();
        $("#addCorporateCompanyDiv").css('display', 'none')
        $("#backButton").css('display', 'Block');
    });

    // Check Form Validation
    $("#txtCompanyName").on("change", function () {
        var CompanyNa = $(this).val();
        if (!isAlphabets(CompanyNa)) {
            $(this).focus();
            toastr.warning("Please enter a valid Corporate Company", "Warning");
            return;
        }
    });
    $("#txtCompanyCode").on("change", function () {
        var CompanyCo = $(this).val();
        if (!isAlphabets(CompanyCo)) {
            $(this).focus();
            toastr.warning("Please enter a Corporate Company Code", "Warning");
            return;
        }
    });
    $("#txtWhatsAppNumber").on("change", function () {
        var whats = $(this).val();
        if (!isMobile(whats)) {
            $(this).focus();
            toastr.warning("Please enter a whatsApp number", "Warning");
            return;
        }
    });
    $("#txtMobileNumber").on("change", function () {
        var MobileNum = $(this).val();
        if (!isMobile(MobileNum)) {
            $(this).focus();
            toastr.warning("Please enter a valid 10-digit mobile number", "Warning");
            return;
        }
    });

    $("#txtContactNumber").on("change", function () {
        var mobileNum = $(this).val();
        if (!isMobile(mobileNum)) {
            $(this).focus();
            toastr.warning("Please enter a valid 10-digit contact number", "Warning");
            return;
        }
    });

    $("#txtAddress").on("change", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a valid Address", "Warning");
            $(this).focus();
            return;
        }
    });

    $("#txtPinCode").on("change", function () {
        var pinc = $(this).val();
        if (!/^\d{6}$/.test(pinc)) {
            $(this).focus();
            toastr.warning("Please enter a Valid Pincode", "Warning");
            return;
        }
    });
    $("#ddlCity").on("change", function () {
        var city = $(this).val();
        if (!isValidateSelect(city)) {
            // $("#txtcity").val('');
            toastr.warning("Please enter a City", "Warning");
            return;
        }
    });
    $("#txtPerson").on("change", function () {
        var person = $(this).val();
        if (!isAlphabets(person)) {
            $(this).focus();
            toastr.warning("Please enter a Contact Person", "Warning");
            return;
        }
    });
    $("#txtEmail").on("change", function () {
        var email = $(this).val();
        if (!isValidateEmail(email)) {
            $(this).focus();
            toastr.warning("Please enter a valid email", "Warning");
            return;
        }
    });
    $("#txtPanNumber").on("change", function () {
        var pan = $(this).val();
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
            $(this).focus();
            toastr.warning("Please enter a valid PAN number", "Warning");
            return;
        }
    });
    $("#txtGstNumber").on("change", function () {
        var gst = $(this).val();
        if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/.test(gst)) {
            $(this).focus();
            toastr.warning("Please enter a valid GST number", "Warning");
            return;
        }
    });
    $("#ddlFranchisename").on("change", function () {
        var fname = $(this).val();
        if (!isValidateSelect(fname)) {
            // $("#franchisename").val('');
            toastr.warning("Please enter a Franchise Name", "Warning");
            return;
        }
    });

    $("#cancleButton").on('click', function () {
        fetchCorporateCompany();
        $("#addCorporateCompanyDiv").css('display', 'none')
        $("#backButton").css('display', 'Block');
    })
    function isValidAddress(value) {
        return /^[A-Za-z0-9\s,.\-\/]+$/.test(value);
    }

    document.querySelectorAll("#txtGstNumber, #txtPanNumber").forEach(function (element) {
        element.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
        });
    });

    // On form submit
    $("#btnSaveCompanyType").click(function (event) {
        event.preventDefault();
        var companyId = SaveAndSaveNew();

    });

    // Reset form fields on button click
    $('#btnsaveandnew').on('click', function () {
        var companyId = SaveAndSaveNew();

        $('#CompanyTypeForm')[0].reset();
    });

    $('#backButton').click(function () {
        window.location.reload(true);
        
    });

    BouttonUpdateClick();
});


GetAllFranchiseList();
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


GetAllCityList();
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
            let filePath = item.querySelector("#txtUplodedFileName").value;
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
                    $("#dataDiv").html("Profile updated successfully!");
                    $("#addCorporateCompanyDiv").css('display', 'none');
                    fetchCorporateCompany();
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
                    $("#dataDiv").html("Profile updated successfully!");
                    $("#addCorporateCompanyDiv").css('display', 'none');
                    fetchCorporateCompany();
                    companyId = $("#txtCompanyId").val();
                    Saveattachment(companyId);
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

        // Thired Ajax Call for DeletedAttachments From Table
        var deletedAttachments = JSON.parse(sessionStorage.getItem('deletedAttachments')) || [];
        $.each(deletedAttachments, function (index, value) {
            DeleteAttachmentAPI(value);
            console.log("Value: " + value);
        });

    });
};
function deleteCorporateCompany(companyId, linkId) {
    var result;
    var deleteCorporateCompanyUrl = '/CorporateCompany/DeleteCorporateCompany/' + companyId
    fetchMasterAttachment(linkId, companyId, function (list) {
        result = list;

        console.log(result);
        $.ajax({
            url: deleteCorporateCompanyUrl,
            type: "DELETE",
            dataType: "json",
            data: JSON.stringify(companyId),
            success: function (response) {
                deleteMasterAttachment(result[0].attachmentId);
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to fetch data!", "Error");
            }
        });
    });
}
function deleteMasterAttachment(attachmentId) {
    var deleteMasterAttachmentUrl = '/MasterAttachment/DeleteMasterAttachment/' + attachmentId
    $.ajax({
        url: deleteMasterAttachmentUrl,
        type: "DELETE",
        dataType: "json",
        data: JSON.stringify(attachmentId),
        success: function (response) {
            fetchCorporateCompany();
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to fetch data!", "Error");
        }
    });
}
function SaveAndSaveNew() {
    var companyName = $("#txtCompanyName").val();
    var companyCode = $("#txtCompanyCode").val();
    var mobileNumber = $("#txtMobileNumber").val();
    var contactNumber = $("#txtContactNumber").val();
    var address = $("#txtAddress").val();
    var city = $("#ddlCity").val();
    var pincode = $("#txtPinCode").val();
    var contactPerson = $("#txtPerson").val();
    var email = $("#txtEmail").val();
    var whatsAppNumber = $("#txtWhatsAppNumber").val();
    var panNumber = $("#txtPanNumber").val();
    var gSTNumber = $("#txtGstNumber").val();
    var franchiseName = $("#ddlFranchisename").val();
    var linkid = GetQueryParam("LinkId");
    var companyId = 0;
    if (!isAlphabets(companyName)) {
        toastr.warning("Please enter a valid Corporate Company", "Warning");
        return;
    }
    if (!isAlphabets(companyCode)) {
        toastr.warning("Please enter a Corporate Company Code", "Warning");
        return;
    }

    if (IsNullOrEmpty($("#txtAddress").val())) {
        toastr.warning("Please enter a valid Address", "Warning");
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

    if (!isValidateEmail(email)) {
        toastr.warning("Please enter a valid email", "Warning");
        return;
    }
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/.test(gSTNumber.toUpperCase())) {
        toastr.warning("Please enter a valid GST number", "Warning");
        return;
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase())) {
        toastr.warning("Please enter a valid PAN number", "Warning");
        return;
    }
    if (!isValidateSelect(franchiseName)) {
        toastr.warning("Please enter a Franchise Name", "Warning");
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

    $.ajax({
        url: saveUrl,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {

            companyId = response.result.companyId;
            Saveattachment(companyId);
            toastr.success("Corporate Company submitted successfully");

        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to submitCompany", "Error");
        }
    });
    return companyId;

}
function GetAttachmentList(repeaterItemName, transactionId) {
    let repeaterItems = document.querySelectorAll("[data-repeater-item]");
    let attachmentDetails = [];
    var linkd = GetQueryParam("LinkId");

    repeaterItems.forEach((item, index) => {

        let fileName = item.querySelector("#txtFileName")?.value || "N/A";
        let attachmentType = item.querySelector(".ddlAttachment")?.selectedOptions[0]?.value || "N/A";
        let fileUpload = item.querySelector("#fileUpload");
        let filePath = item.querySelector("#txtUplodedFileName")?.value

        attachmentDetails.push({
            AttachmentName: fileName,
            AttachmentTypeId: attachmentType,
            AttachmentPath: filePath,
            ReferenceLinkId: parseInt(linkd),
            TransactionId: transactionId
        });
    });

    return attachmentDetails;
}
function Saveattachment(transactionId) {
    var attachmentListData = GetAttachmentList("[data-repeater-item]", transactionId);
    var attachmentSaveUrl = '/MasterAttachment/MasterAttachmentSave';
    $.ajax({
        url: attachmentSaveUrl,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(attachmentListData), // Serialize data correctly
        success: function (response) {
            if (response.result != 'fail')
                toastr.success("Attachment saved successfully");
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to save attachment", "Error");
        }
    });
}

function fetchMasterAttachment(linkid, transactionid, callback) {
    var fetchMasterAttachmentUrl = '/MasterAttachment/GetAllMasterAttachment';
    console.log(fetchMasterAttachmentUrl + "?linkid=" + linkid + "&transactionid=" + transactionid)
    $.ajax({
        url: fetchMasterAttachmentUrl + "?linkid=" + linkid + "&transactionid=" + transactionid,
        type: "GET",
        dataType: "json",
        success: function (response) {

            list = response; // Assign globally
            console.log("List updated:", list);
            if (callback) {
                callback(list); // Execute the callback function
            }
        }
    });
}
function EditCorporateCompany(companyId) {
    var data = corporateCompanyViewModelDto.filter(x => x.companyId == companyId);
    if (data.length === 0) {
        console.error("No company data found for companyId:", companyId);
        return;
    }

    var formData = data[0];

    fetchMasterAttachment(formData.linkId, companyId, function (list) {
        var attachmantData = list;

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
        $("#ddlCity").val(formData.cityId).change();
        $("#txtPinCode").val(formData.pinCode);
        $("#txtEmail").val(formData.email);
        $("#txtWhatsAppNumber").val(formData.whatsAppNo);
        $("#txtPanNumber").val(formData.panNo);
        $("#txtGstNumber").val(formData.gstNo);
        $("#ddlFranchisename").val(formData.parentCompanyId);

        if (attachmantData.length > 0) {
            const repeaterList = $("[data-repeater-list='kt_docs_repeater_basic']");

            repeaterList.find("[data-repeater-item]").not(":first").remove();

            attachmantData.forEach((attachment, index) => {

                let currentItem;
                if (index === 0) {
                    currentItem = repeaterList.find("[data-repeater-item]").first();
                } else {

                    $("[data-repeater-create]").click();
                    currentItem = repeaterList.find("[data-repeater-item]").last();
                }
                currentItem.find("#hdnAttachmentId").val(attachment.attachmentId);
                currentItem.find("#txtFileName").val(attachment.attachmentName);
                currentItem.find("#fileUpload").text(attachment.attachmentPath);
                currentItem.find(".ddlAttachment").val(attachment.attachmentTypeId).trigger("change");
                currentItem.find("#txtUplodedFileName").val(attachment.attachmentPath);
                currentItem.find("#fileLink").attr("href", `../../AttachmentFiles/${attachment.attachmentPath}`);
            });
        } else {
            console.warn("No attachment data found for companyId:", companyId);
        }
    });
}



$(document).on('click', '.upload-btn', function () {
    var uploadUrl = '/MasterAttachment/UploadAttachment';
    const $row = $(this).closest('[data-repeater-item]');
    const fileInput = $row.find('.file-upload')[0].files[0];
    const spanText = $row.find('#spanText');
    if (!fileInput) {
        alert("Please choose a file.");
        return;
    }
    const formData = new FormData();
    formData.append("file", fileInput);
    $.ajax({
        url: uploadUrl,
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            $row.find('#txtUplodedFileName').val(response.fileName); // Save to hidden input
            $row.find("#fileLink").attr("href", `../../AttachmentFiles/${response.fileName}`);
            spanText.text(response.fileName); // Update label
            toastr.success("Master Attachment submitted successfully!");
        },
        error: function () {
            alert("Upload failed. Please try again.");
        }
    });
});

$(document).on('click', '.btnDeleteAttachment', function () {
    var deleteUrl = '/MasterAttachment/DeleteAttachment'

    const $row = $(this).closest('[data-repeater-item]');

    const fileName = $row.find("#txtUplodedFileName").val();
    const attachmentId = $row.find("#hdnAttachmentId").val();

    // Delete attachmentId store in session
    var deletedAttachments = JSON.parse(sessionStorage.getItem('deletedAttachments')) || [];
    if (!deletedAttachments.includes(attachmentId)) {
        deletedAttachments.push(attachmentId);
    }
    sessionStorage.setItem('deletedAttachments', JSON.stringify(deletedAttachments));

    if (!fileName) {
        toastr.error("No file available to delete.", "Error");
        return;
    }

    if (!confirm("Are you sure you want to delete this file?")) {
        return;
    }

    $.ajax({
        url: deleteUrl,
        type: "POST",
        data: { fileName: fileName },
        dataType: "json",
        success: function (response) {
            if (response.result === "Success") {
                toastr.success("Attachment deleted successfully", "Success");

            } else {
                toastr.error(response.message || "An error occurred while deleting the attachment.", "Error");
            }
        },
        error: function (xhr, status, error) {
            console.error("Delete Error:", status, error);
            toastr.error("Failed to delete attachment. Please try again.", "Error");
        }
    });

});
function DeleteAttachmentAPI(attachmentId) {
    if (attachmentId) {
        var deleteAttachmentUrl = '/MasterAttachment/DeleteMasterAttachmentTable/'
        $.ajax({
            url: deleteAttachmentUrl + attachmentId,
            type: "DELETE",
            success: function (response) {
            },
            error: function (xhr, status, error) {
                console.error("Delete Error:", error);
                toastr.error("Failed to delete attachment", "Error");
            }
        });
    }
}


