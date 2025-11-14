
var companyConfigResponseDto;
var orderColumn = '';
var orderDir = '';
var fetchUrl = '/CompanyConfiguration/GetAllCompanyConfiguration'
var companyId;
var profileId;

$(document).ready(function () {
    companyId = getCookieValue('companyid');
    profileId = getCookieValue('profileid');
    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir);

        $('th.sortable').not(this).data('order', 'asc');
        FetchDataForTable('tableCmpConfig', fetchUrl, orderColumn, orderDir.toUpperCase(), 'EditCompanyConfiguration', 'DeleteCompanyConfiguration', 'companyConfigId');
    });
    $('#ListSectionLink').on('click', function (e) {
        FetchCompanyConfiguration();
    });
    Initializejquery();
    CheckValidation();
    loadAllData();
});

async function loadAllData() {
    try {
        const companies = await GetAllCompany();
        const providers = await GetAllProviders();
        const config = await FetchCompanyConfiguration();
    } catch (error) {
        console.log(error);
    }
}

$("#btnAdd").on("click", function (e) {
    e.preventDefault();
    $("#listSection").hide();
    $("#formSection").show();
});
function Initializejquery() {
    $("#btnSaveForm, #btnSaveAndNewForm").on('click', function () {
        var action = $(this).data('action');
        SaveCompanyConfiguration(action);
    });
    $("#btnCancel").on('click', function () {
        FetchCompanyConfiguration();
    });
}
function GetAllCompany() {
    $("#tableDiv").show();
    $.ajax({
        url: '/CompanyConfiguration/GetAllCompany',
        type: "GET",
        dataType: "json",
        success: function (response) {
            if (profileId == EnumProfile.Franchise)
                response = response.filter(x => x.companyTypeId == EnumInternalMaster.CORPORATE && x.parentCompanyId == companyId);
            else
                response = response.filter(x => x.companyTypeId == EnumInternalMaster.CORPORATE);

            const selectCustomer = document.getElementById("ddlCompany");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select Company Name";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectCustomer.appendChild(placeholderOption);
            response.forEach(name => {
                const option = document.createElement("option");
                option.value = name.companyId;
                option.textContent = name.companyName;
                selectCustomer.appendChild(option);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Customer Name!", "Error");
        }
    });
};
function CheckValidation() {
    $("#txtSmsAuthKey").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            return;
        }
        else {
            if (!IsValidAuthKey($(this).val())) {
                toastr.warning("Please enter a valid SMS authorization Key", "Validation Error");
                return;
            }
        }
    });
    $("#txtWhatsappAuthKey").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            return;
        }
        else {
            if (!IsValidAuthKey($(this).val())) {
                toastr.warning("Please enter a valid whatsapp authorization Key", "Validation Error");
                return;
            }
        }
    });
    $("#txtSmtpPassword").on("blur", function () {
        if ($(this).val() == "" || ($(this).val() == null)) {
            return;
        }
        else {
            if (!/^[a-zA-Z0-9\x40!#$%^&*(),.?":{}|<>]+$/.test($(this).val())) {
                $("#txtPassword").val('');
                toastr.warning("Please enter a valid password", "Validation Error");
                return;
            }
        }
    });
}
function OnSubmitValidation() {
    if (!isValidateSelect($('#ddlCompany').val())) {
        toastr.warning("Please Select Customer Name", "Validation Error");
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
            SMSProvider: smsProvider,
            SMSAuthKey: smsAuthKey,
            WhatsAppProvider: whatsappProvider,
            WhatsAppAuthKey: whatsappAuthKey,
            SMTPHost: smtpHost,
            SMTPPort: Number(smtpPort),
            SMTPUsername: smtpUserName,
            SMTPPassword: smtpPassword
        };
        if (action == "save") {
            $.ajax({
                url: saveConfigrationUrl,
                method: 'POST',
                contentType: 'application/json',
                dataType: "json",
                data: JSON.stringify(formData),
                success: function (response) {
                    if (response.result == "Success") {
                        toastr.success("Company Configuration Details Submitted Successfully!");
                        addMasterUserActivityLog(0, LogType.Create, "Company Configuration Details Submitted Successfully!", 0);
                        if (typeof this.completeOnSuccess === "function") {
                            this.completeOnSuccess();
                        }
                    } else {
                        toastr.error("Failed to Save Company Configuration Details!", "Error");
                    }
                },
                error: function (xhr, status, error) {
                    if (xhr.status == 409)
                        toastr.warning("Company already exists.");
                    else
                        toastr.error("Failed to Save Company Configuration Details!", "Error");
                },
                completeOnSuccess: function () {
                    FetchCompanyConfiguration();
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
                    addMasterUserActivityLog(0, LogType.Create, "Company Configuration Details Submitted Successfully!", 0);
                    $('#companyConfigurationForm')[0].reset();
                    $('#ddlSmsProvider').val(null).trigger('change');
                    $('#ddlWhatsappProvider').val(null).trigger('change');
                    $('#ddlCompany').val(null).trigger('change');
                },
                error: function (xhr, status, error) {
                    if (xhr.status == 409)
                        toastr.warning("Company already exists.");
                    else
                        toastr.error("Failed to Save Company Configuration Details!", "Error");
                }
            });
        }
    }
}
function FetchCompanyConfiguration() {
    $("#formSection").hide();
    $("#listSection").show();
    $('#companyConfigurationForm')[0].reset();
    $('#ddlSmsProvider').val(null).trigger('change');
    $('#ddlWhatsappProvider').val(null).trigger('change');
    $('#ddlCompany').val(null).trigger('change');
    $("#btnUpdate").hide();
    $("#btnSaveAndNewForm").show();
    $("#btnSaveForm").show();
    FetchDataForTable('tableCmpConfig', fetchUrl, orderColumn, orderDir.toUpperCase(), 'EditCompanyConfiguration', 'DeleteCompanyConfiguration', 'companyConfigId');
}

// Bind events
$('#tableCmpConfigSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchCompanyConfiguration();
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchCompanyConfiguration();
});

function EditCompanyConfiguration(companyConfigId) {
    if ($("#btnUpdate").hasClass('d-none')) {
        $("#btnUpdate").removeClass('d-none');
        $('#formSection').find('input, select, textarea, button, a').prop('disabled', false);
    }
    var data = viewModelDto.filter(x => x.companyConfigId == companyConfigId);
    var formdata = data[0];
    $('#listSection').css('display', 'none');
    $("#formSection").css('display', 'Block');
    $("#backButton").addClass('d-none');
    $("#addCompanyConfigDiv").removeClass('d-none');
    $("#btnSaveForm").hide();
    $("#btnSaveAndNewForm").prop("disabled", true);
    $("#btnUpdate").show();
    $("#btnCancel").removeClass('d-none');
    $("#ddlCompany").val(formdata.companyId).trigger('change');
    $("#ddlSmsProvider").val(formdata.smsProvider).trigger('change');
    $("#ddlWhatsappProvider").val(formdata.whatsAppProvider).trigger('change');
    $("#txtWhatsappAuthKey").val(formdata.whatsAppAuthKey);
    $("#txtSmtpHost").val(formdata.smtpHost);
    $("#txtSmtpPort").val(formdata.smtpPort)
    $("#txtSmtpUserName").val(formdata.smtpUsername);
    $('#txtSmtpPassword').val(formdata.smtpPassword);
    $("#btnSaveForm").hide();
    $("#btnSaveAndNewForm").hide();
    $("#btnViewForm").hide();
    $('#btnUpdate').off('click').on('click', function (e) {
        e.preventDefault();
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
            SMSProvider: smsProvider,
            SMSAuthKey: smsAuthKey,
            WhatsAppProvider: whatsappProvider,
            WhatsAppAuthKey: whatsappAuthKey,
            SMTPHost: smtpHost,
            SMTPPort: Number(smtpPort),
            SMTPUsername: smtpUserName,
            SMTPPassword: smtpPassword
        };
        $.ajax({
            url: updateUrl,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                if (response.result == 'success') {
                    FetchCompanyConfiguration();
                    toastr.success("Company Configuration Details Updated Successfully!");
                    addMasterUserActivityLog(0, LogType.Update, "Company Configuration Details Updated Successfully!", 0);
                    $("#formSection").hide();
                    $("#listSection").show();
                    $('#companyConfigurationForm')[0].reset();
                    $('#ddlSmsProvider').val(null).trigger('change');
                    $('#ddlWhatsappProvider').val(null).trigger('change');
                    $('#ddlCompany').val(null).trigger('change');
                    $("#btnUpdate").hide();
                    $("#btnSaveAndNewForm").show();
                    $("#btnSaveForm").show();
                }
                else
                    return
            },
            error: function (xhr, status, error) {
                if (xhr.status == 409)
                    toastr.warning("Company already exists.");
                else
                    toastr.error("Failed to Update Company Configuration Details!", "Error");
            }
        });
    }
}
function DeleteCompanyConfiguration(CompanyConfigrationId) {
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
            var deleteCompConfig = '/CompanyConfiguration/DeleteCompanyConfiguration/' + CompanyConfigrationId;

            $.ajax({
                url: deleteCompConfig,
                type: "DELETE",
                dataType: "json",
                data: JSON.stringify(CompanyConfigrationId),
                success: function (response) {
                    if (response.result == "success") {
                        toastr.success("Company Configuration Details Deleted Successfully!");
                        addMasterUserActivityLog(0, LogType.Delete, "Company Configuration Details Deleted Successfully!", 0);
                        FetchCompanyConfiguration();
                        $('#currentPage').val(1);
                    }
                    else {
                        toastr.error("Failed to Delete Company Configuration Details!", "Error");
                    }
                },
                error: function (xhr, status, error) {
                    toastr.error("Failed to Delete Company Configuration Details!", "Error");
                }
            });
        }
    });
}
function ViewCompanyConfiguration(CompanyConfigrationId) {
    EditCompanyConfiguration(CompanyConfigrationId);
    $('#formSection').find('input, select, textarea, button, a').prop('disabled', true);
    $("#btnUpdate").addClass('d-none');
}
