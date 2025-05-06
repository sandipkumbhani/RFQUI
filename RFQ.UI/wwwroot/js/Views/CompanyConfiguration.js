$(document).ready(function () {
    var companyConfigResponseDto;
    Initializejquery();
    CheckValidation();
    GetAllCompany();
    GetAllProviders();
});
function Initializejquery() {
    $("#btnSaveForm, #btnSaveAndNewForm").on('click', function () {
        var action = $(this).data('action');
        SaveCompanyConfiguration(action);
    });
    $('#btnViewForm').on('click', function () {
        FetchCompanyConfiguration();
    });
    $('#backButton').on('click', function () {
        window.location.reload(true);
    });
    $("#btnCancel").on('click', function () {
        FetchCompanyConfiguration();
        $("#tableDiv").removeClass('d-none');
        $("#addCompanyConfigDiv").addClass('d-none');
        $("#backButton").removeClass('d-none');
    });
}
function GetAllCompany() {
    $("#tableDiv").show();
    var fetchFranchiseUrl = '/CompanyConfiguration/GetAllCompany';
    $.ajax({
        url: fetchFranchiseUrl,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            sessionStorage.setItem("CompanyList", JSON.stringify(response));
            const companydropdown = document.getElementById("ddlCompany");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select Company";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            companydropdown.appendChild(placeholderOption);
            // Add Other Options
            response.forEach(category => {
                const option = document.createElement("option");
                option.value = category.companyId;
                option.textContent = category.companyName;
                companydropdown.appendChild(option);
            });
            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
};
function CheckValidation() {
    $("#txtSmsAuthKey").on("blur", function () {
        if (!IsValidAuthKey($(this).val())) {
            toastr.warning("Please enter a valid SMS authorization Key", "Validation Error");
            return;
        }
    });
    $("#txtWhatsappAuthKey").on("blur", function () {
        if (!IsValidAuthKey($(this).val())) {
            toastr.warning("Please enter a valid whatsapp authorization Key", "Validation Error");
            return;
        }
    });
    $("#txtSmtpHost").on("blur", function () {
        if (!isAlphaNumeric($(this).val())) {
            toastr.warning("Please enter a valid smtp Host", "Validation Error");
            return;
        }
    });
    $("#txtSmtpUserName").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a valid smtp User Name", "Validation Error");
            return;
        }
    });
    $("#txtSmtpPort").on("blur", function () {
        if (!isNumeric($(this).val())) {
            toastr.warning("Please enter a valid smtp Port", "Validation Error");
            return;
        }
    });
    $("#txtSmtpPassword").on("blur", function () {
        if (!/^[a-zA-Z0-9\x40!#$%^&*(),.?":{}|<>]+$/.test($(this).val())) {
            $("#txtPassword").val('');
            toastr.warning("Please enter a valid password", "Validation Error");
            return;
        }
    });
}
function OnSubmitValidation() {
    if (!isValidateSelect($('#ddlCompany').val())) {
        toastr.warning("Please enter company", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($('#ddlSmsProvider').val())) {
        toastr.warning("Please enter smsProvider", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($('#ddlWhatsappProvider').val())) {
        toastr.warning("Please enter whatsappProvider", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($('#txtSmsAuthKey').val())) {
        toastr.warning("Please enter a valid SMS authorization Key", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($('#txtWhatsappAuthKey').val())) {
        toastr.warning("Please enter a valid whatsapp authorization Key", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($('#txtSmtpHost').val())) {
        toastr.warning("Please enter a valid smtp Host", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($('#txtSmtpUserName').val())) {
        toastr.warning("Please enter a valid smtp User Name", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($('#txtSmtpPort').val())) {
        toastr.warning("Please enter a valid smtp Port", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($('#txtSmtpPassword').val())) {
        toastr.warning("Please enter a valid password", "Validation Error");
        return false;
    }
    return true;
}
function GetAllProviders() {
    $("#tableDiv").show();
    var getUrl = '/CompanyConfiguration/GetAllProviders';
    $.ajax({
        url: getUrl,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            sessionStorage.setItem("ProvidersList", JSON.stringify(response));
            var smsData = response.find(x => x.providerName == "SMS_PROVIDER");
            var smsArray = smsData ? [smsData] : [];
            var whatsappData = response.find(x => x.providerName == "WHATSAPP_PROVIDER");
            var whatsappArray = whatsappData ? [whatsappData] : [];

            //SMS Provider DropDown Binding
            const smsProviderDrop = document.getElementById("ddlSmsProvider");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a SMS Provider";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            smsProviderDrop.appendChild(placeholderOption);
            smsArray.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.providerTypeId;
                opt.textContent = option.providerValue;
                smsProviderDrop.appendChild(opt);
            });
            $('.selectpicker').selectpicker('refresh');

            //Whatsapp Provider DropDown Binding
            const whatsappProviderDrop = document.getElementById("ddlWhatsappProvider");
            let placeholder = document.createElement("option");
            placeholder.value = "";
            placeholder.textContent = "Select a Whatsapp Provider";
            placeholder.disabled = true;
            placeholder.selected = true;
            whatsappProviderDrop.appendChild(placeholder);
            whatsappArray.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.providerTypeId;
                opt.textContent = option.providerValue;
                whatsappProviderDrop.appendChild(opt);
            });
            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
};
function SaveCompanyConfiguration(action) {
    if (OnSubmitValidation()) {
        var saveConfigrationUrl = '/CompanyConfiguration/CompanyConfigurationSave';
        var company = $('#ddlCompany').val();
        var smsProvider = $('#ddlSmsProvider').val();
        var whatsappProvider = $('#ddlWhatsappProvider').val();
        var smsAuthKey = $('#txtSmsAuthKey').val();
        var whatsappAuthKey = $('#txtWhatsappAuthKey').val();
        var smtpHost = $('#txtSmtpHost').val();
        var smtpUserName = $('#txtSmtpUserName').val();
        var smtpPort = $('#txtSmtpPort').val();
        var smtpPassword = $('#txtSmtpPassword').val();

        let formData = {
            CompanyConfigId: 0,
            CompanyId: Number(company),
            SMSProvider: smsProvider || null,
            SMSAuthKey: smsAuthKey || null,
            WhatsAppProvider: whatsappProvider || null,
            WhatsAppAuthKey: whatsappAuthKey || null,
            SMTPHost: smtpHost || null,
            SMTPPort: Number(smtpPort) || 0,
            SMTPUsername: smtpUserName || null,
            SMTPPassword: smtpPassword || null
        };
        if (action == "save") {
            $.ajax({
                url: saveConfigrationUrl,
                method: 'POST',
                contentType: 'application/json',
                dataType: "json",
                data: JSON.stringify(formData),
                success: function (response) {
                    window.location.href = "../Dashboard/Dashboard";
                    toastr.success("Company Configuration Details Submitted Successfully!");
                },
                error: function (xhr, status, error) {
                    toastr.error("Failed to Save Company Configuration Details!", "Error");
                }
            });
        }
        else if (action == "saveNew") {
            $.ajax({
                url: saveConfigrationUrl,
                method: 'POST',
                contentType: 'application/json',
                dataType: "json",
                data: JSON.stringify(formData),
                success: function (response) {
                    toastr.success("Company Configuration Details Submitted Successfully!");
                    $('#companyConfigurationForm')[0].reset();
                    $('#ddlSmsProvider').val('');
                    $('#ddlWhatsappProvider').val('');
                    $('#ddlCompany').val('');
                    $('.selectpicker').selectpicker('refresh');
                },
                error: function (xhr, status, error) {
                    toastr.error("Failed to Save Company Configuration Details!", "Error");
                }
            });
        }
    }
}
function FetchCompanyConfiguration() {

    $("#tableDiv").removeClass('d-none');
    $("#addCompanyConfigDiv").addClass('d-none');
    $("#backButton").removeClass('d-none');
    var getUrl = '/CompanyConfiguration/GetAllCompanyConfiguration';
    $.ajax({
        url: getUrl,
        type: 'GET',                                                                                                       
        dataType: 'json',
        success: function (response) {
            companyConfigResponseDto = response;
            const companyList = JSON.parse(sessionStorage.getItem("CompanyList") || "[]");
            const providersList = JSON.parse(sessionStorage.getItem("ProvidersList") || "[]");
            const trlist = response.map(item => {
                const company = companyList.find(c => c.companyId === item.companyId);
                const smsProvider = providersList.find(p => p.providerTypeId === Number(item.smsProvider));
                const whatsAppProvider = providersList.find(p => p.providerTypeId === Number(item.whatsAppProvider));

                return {
                    ...item,
                    companyId: company ? company.companyName : "",
                    smsProvider: smsProvider ? smsProvider.providerName : "",
                    whatsAppProvider: whatsAppProvider ? whatsAppProvider.providerName : ""
                };
            });
            if ($.fn.DataTable.isDataTable('#tableCmpConfig')) {
                $('#tableCmpConfig').DataTable().clear().destroy();
            }
            $('#tableCmpConfig').DataTable({
                "processing": true,
                "serverSide": false,
                "paging": true,
                "pageLength": 10,
                "lengthChange": true,
                "searching": true,
                "ordering": false,
                "info": true,
                "autoWidth": true,
                "responsive": true,
                "scrollX": true,
                "data": trlist,
                "columns": [
                    { "data": "companyId" },
                    { "data": "smsProvider" },
                    { "data": "smsAuthKey" },
                    { "data": "whatsAppAuthKey" },
                    { "data": "whatsAppProvider" },
                    { "data": "smtpHost" },
                    { "data": "smtpPort" },
                    { "data": "smtpUsername" },
                    {
                        "data": "companyConfigId",
                        "render": function (data, type, row) {
                            return `
                            <div class="btn-group" role="group">
                               <button type="button" class="btn btn-sm btn-primary" onclick="EditCompanyConfiguration(${data})">
                                  <i class="ti ti-edit"></i> Edit
                               </button>
                               <button type="button" class="btn btn-sm btn-danger" onclick="DeleteCompanyConfiguration(${data})">
                                  <i class="ti ti-trash"></i> Delete
                               </button>
                            </div>`;
                        }
                    }
                ],
                "columnDefs": [{
                    "targets": "_all",
                    "className": "text-center"
                }]
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });

};
function EditCompanyConfiguration(companyConfigId) {
    var data = companyConfigResponseDto.filter(x => x.companyConfigId == companyConfigId);

    var formdata = data[0];
    $("#tableDiv").addClass('d-none');
    $("#backButton").addClass('d-none');
    $("#addCompanyConfigDiv").removeClass('d-none');
    $("#btnSaveForm").hide();
    $("#btnSaveAndNewForm").addClass('d-none');
    $("#btnSaveAndNewForm").addClass('d-none');
    $("#btnViewForm").addClass('d-none');
    $("#btnUpdate").show();
    $("#btnCancel").removeClass('d-none');
    $("#ddlCompany").selectpicker('val', formdata.companyId);
    $("#ddlCompany").selectpicker('refresh');
    $("#ddlSmsProvider").selectpicker('val', formdata.smsProvider);
    $('#ddlSmsProvider').selectpicker('refresh');
    $("#ddlWhatsappProvider").selectpicker('val', formdata.whatsAppProvider);
    $('#ddlWhatsappProvider').selectpicker('refresh');
    $("#txtSmsAuthKey").val(formdata.smsAuthKey);
    $("#txtWhatsappAuthKey").val(formdata.whatsAppAuthKey);
    $("#txtSmtpHost").val(formdata.smtpHost);
    $("#txtSmtpPort").val(formdata.smtpPort)
    $("#txtSmtpUserName").val(formdata.smtpUsername);
    $('#btnUpdate').on('click', function () {
        UpdateCompanyConfiguration(companyConfigId);
    });
}
function UpdateCompanyConfiguration(companyConfigId) {
    if (OnSubmitValidation()) {
        var updateUrl = '/CompanyConfiguration/EditCompanyConfigurationList';

        var company = $('#ddlCompany').val();
        var smsProvider = $('#ddlSmsProvider').val();
        var whatsappProvider = $('#ddlWhatsappProvider').val();
        var smsAuthKey = $('#txtSmsAuthKey').val();
        var whatsappAuthKey = $('#txtWhatsappAuthKey').val();
        var smtpHost = $('#txtSmtpHost').val();
        var smtpUserName = $('#txtSmtpUserName').val();
        var smtpPort = $('#txtSmtpPort').val();
        var smtpPassword = $('#txtSmtpPassword').val();

        let formData = {
            CompanyConfigId: Number(companyConfigId),
            CompanyId: Number(company),
            SMSProvider: smsProvider || null,
            SMSAuthKey: smsAuthKey || null,
            WhatsAppProvider: whatsappProvider || null,
            WhatsAppAuthKey: whatsappAuthKey || null,
            SMTPHost: smtpHost || null,
            SMTPPort: Number(smtpPort) || 0,
            SMTPUsername: smtpUserName || null,
            SMTPPassword: smtpPassword || null
        };
        $.ajax({
            url: updateUrl,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                if (response.result == 'success') {
                    toastr.success("Company Configuration Details Updated Successfully!");
                    $("#addCompanyConfigDiv").addClass('d-none'); //hide form
                    $("#backButton").removeClass('d-none');
                    $("#tableDiv").show();
                    FetchCompanyConfiguration();
                }
                else
                    return
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Update Company Configuration Details!", "Error");
            }
        });
    }
}
function DeleteCompanyConfiguration(CompanyConfigrationId) {
    var deleteCompConfig = '/CompanyConfiguration/DeleteCompanyConfiguration/' + CompanyConfigrationId;
    $.ajax({
        url: deleteCompConfig,
        type: "DELETE",
        dataType: "json",
        data: JSON.stringify(CompanyConfigrationId),
        success: function (response) {
            toastr.success("Company Configuration Details Deleted Successfully!");
            FetchCompanyConfiguration();
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Delete Company Configuration Details!", "Error");
        }
    });
}