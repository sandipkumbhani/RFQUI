
$(document).ready(function () {
    var corporateCompanyViewModelDto
    var list

    GetAllFranchiseList();
    GetAllCityList();
    CheckValidation();
    $(document).on("click", "#btnView", function () {
        fetchCorporateCompany();
        $("#addCorporateCompanyDiv").css('display', 'none')
        $("#backButton").css('display', 'Block');
    });
    $("#btnCancel").on('click', function () {
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
        if (OnSubmitCheckValidation()) {
            SaveAndSaveNew(action);
        }
        
    });
    $('#backButton').click(function () {
        window.location.reload(true);
        
    });
    BouttonUpdateClick();
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
    });
    $("#txtMobileNumber").on("blur", function () {
        if (!isMobile($(this).val())) {
            toastr.warning("Please enter a valid Mobile Number", "Validation Error");
            return;
        }
    });
    $("#txtContactNumber").on("blur", function () {
        if (!isMobile($(this).val())) {
            toastr.warning("Please enter a valid Contact Number", "Validation Error");
            return;
        }
    });
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
            toastr.warning("Please enter a valid City", "Validation Error");
            return;
        }
    });
    $("#txtPerson").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a valid Contact Person", "Validation Error");
            return;
        }
    });
    $("#txtEmail").on("blur", function () {
        if (!isValidateEmail($(this).val())) {
            toastr.warning("Please enter a valid Email Id", "Validation Error");
            return;
        }
    });
    $("#txtPanNumber").on("blur", function () {
        if (!ValidatePanNumber($(this).val())) {
            toastr.warning("Please enter a valid PAN Number", "Validation Error");
            return;
        }
    });
    $("#txtGstNumber").on("blur", function () {
        if (!ValidateGstNumber($(this).val())) {
            toastr.warning("Please enter a valid GST Number", "Validation Error");
            return;
        }
    });
    $("#ddlFranchisename").on("keypress", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please enter a valid Franchise Name", "Validation Error");
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
        toastr.warning("Please enter a Franchise Name", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtAddress").val())) {
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

    if (IsNullOrEmpty($("#txtPerson").val()) || !isAlphabets($("#txtPerson").val())) {
        toastr.warning("Please enter a valid Contact Person", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtWhatsAppNumber").val()) || !isMobile($("#txtWhatsAppNumber").val())) {
        toastr.warning("Please enter a valid whatsApp Number", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtMobileNumber").val()) || !isMobile($("#txtMobileNumber").val())) {
        toastr.warning("Please enter a valid Mobile Number", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtContactNumber").val()) || !isMobile($("#txtContactNumber").val())) {
        toastr.warning("Please enter a valid Contact Number", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtPanNumber").val()) || !ValidatePanNumber($("#txtPanNumber").val())) {
        toastr.warning("Please enter a valid PAN Number", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtEmail").val()) || !isValidateEmail($("#txtEmail").val())) {
        toastr.warning("Please enter a valid Email Id", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtGstNumber").val()) || !ValidateGstNumber($("#txtGstNumber").val())) {
        toastr.warning("Please enter a valid GST Number", "Validation Error");
        return false;
    }
    return true;
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
        var isValid = OnSubmitCheckValidation();
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
        $("#btnView").hide();
        $("#btnCancel").removeClass('d-none');
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
