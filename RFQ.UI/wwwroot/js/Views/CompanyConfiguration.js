$(document).ready(function () {
    var companyConfigResponseDto;
    initializjquery();
    CheckValidation();
    GetAllCompany();
    FetchAllCompConfigList();
    GetAllProviders();
    SaveConfigration();
});

function initializjquery() {
    $('#backButton').on('click', function () {
        window.location.reload(true);
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
            console.log(response)
            sessionStorage.setItem("CompanyList", JSON.stringify(response));
            const companydropdown = document.getElementById("company");
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
            toastr.error("Failed to fetch data!", "Error");
        }
    });
};

function CheckValidation() {
    $("#smsAuthKey").on("blur change", function () {
        if (!IsValidAuthKey($(this).val())) {
            toastr.warning("Please enter a valid SMS authorization Key", "Warning");
            return;
        }
    });
    $("#whatsappAuthKey").on("blur change", function () {
        if (!IsValidAuthKey($(this).val())) {
            toastr.warning("Please enter a valid whatsapp authorization Key", "Warning");
            return;
        }
    });
    $("#smtpHost").on("blur change", function () {
        if (!isAlphaNumeric($(this).val())) {
            toastr.warning("Please enter a valid smtp Host", "Warning");
            return;
        }
    });
    $("#smtpUserName").on("change", function () {
        var Textname = $(this).val();
        if (!isAlphabets(Textname)) {
            $("#txtName").val('');
            toastr.warning("Please enter a valid smtp User Name", "Warning");
            return;
        }
    });
    $("#smtpPort").on("blur change", function () {
        if (!isNumeric($(this).val())) {
            toastr.warning("Please enter a valid smtp Port", "Warning");
            return;
        }
    });
    $("#smtpPassword").on("blur change", function () {
        var password = $(this).val();
        if (!/^[a-zA-Z0-9\x40!#$%^&*(),.?":{}|<>]+$/.test(password)) {
            $("#txtPassword").val('');
            toastr.warning("Please enter a valid password", "Warning");
            return;
        }
    });
}

function CheckNullFiled() {
    var company = $('#company').val();
    var smsProvider = $('#smsProvider').val();
    var whatsappProvider = $('#whatsappProvider').val();
    var smsAuthKey = $('#smsAuthKey').val();
    var whatsappAuthKey = $('#whatsappAuthKey').val();
    var smtpHost = $('#smtpHost').val();
    var smtpUserName = $('#smtpUserName').val();
    var smtpPort = $('#smtpPort').val();
    var smtpPassword = $('#smtpPassword').val();

    if (IsNullOrEmpty(company))
        return toastr.warning("Please enter company");
    if (IsNullOrEmpty(smsProvider))
        return toastr.warning("Please enter smsProvider");
    if (IsNullOrEmpty(whatsappProvider))
        return toastr.warning("Please enter whatsappProvider");
    if (IsNullOrEmpty(smsAuthKey))
        return toastr.warning("Please enter smsAuthKey");
    if (IsNullOrEmpty(whatsappAuthKey))
        return toastr.warning("Please enter whatsappAuthKey");
    if (IsNullOrEmpty(smtpHost))
        return toastr.warning("Please enter smtpHost");
    if (IsNullOrEmpty(smtpUserName))
        return toastr.warning("Please enter smtpUserName");
    if (IsNullOrEmpty(smtpPort))
        return toastr.warning("Please enter smtpPort");
    if (IsNullOrEmpty(smtpPassword))
        return toastr.warning("Please enter smtpPassword");
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
            const smsProviderDrop = document.getElementById("smsProvider");
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
            const whatsappProviderDrop = document.getElementById("whatsappProvider");
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
            toastr.error("Failed to fetch data!", "Error");
        }
    });
};

function SaveConfigration() {
    var saveConfigrationUrl = '/CompanyConfiguration/CompanyConfigurationSave';
    $('#btnSaveForm').click(function () {
        CheckNullFiled();
        CheckValidation();
        var company = $('#company').val();
        var smsProvider = $('#smsProvider').val();
        var whatsappProvider = $('#whatsappProvider').val();
        var smsAuthKey = $('#smsAuthKey').val();
        var whatsappAuthKey = $('#whatsappAuthKey').val();
        var smtpHost = $('#smtpHost').val();
        var smtpUserName = $('#smtpUserName').val();
        var smtpPort = $('#smtpPort').val();
        var smtpPassword = $('#smtpPassword').val();

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
        $.ajax({
            url: saveConfigrationUrl,
            method: 'POST',
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(formData),
            success: function (response) {
                console.log('Saved Successfully:', response);
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
                alert('Failed to save data. Please try again.');
            }
        });
    });
}

function FetchAllCompConfigList() {
    document.getElementById("btnViewForm").click();
    $('#btnViewForm').on('click', function () {
        $("#tableDiv").removeClass('d-none');
        $("#AddCompnyConfigDiv").addClass('d-none');
        $("#backButton").addClass('d-block')
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
                               <button type="button" class="btn btn-sm btn-primary" onclick="EditCompConfigList(${data})">
                                  <i class="ti ti-edit"></i> Edit
                               </button>
                               <button type="button" class="btn btn-sm btn-danger" onclick="DeleteCompConfiglist(${data})">
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
                toastr.error("Failed to fetch data!", "Error");
            }
        });
    });
};

function EditCompConfigList(companyConfigId) {
    var data = companyConfigResponseDto.filter(x => x.companyConfigId == companyConfigId);

    var formdata = data[0];
    $("#tableDiv").hide();
    $("#backButton").addClass('d-none');
    $("#AddCompnyConfigDiv").removeClass('d-none');
    $("#btnSaveForm").hide();
    $("#btnSaveAndNewForm").addClass('d-none');
    $("#btnSaveAndNewForm").addClass('d-none');
    $("#btnViewForm").addClass('d-none');
    $("#btnUpdate").show();
    $("#cancleButton").removeClass('d-none');
    $("#company").selectpicker('val', formdata.companyId);
    $("#company").selectpicker('refresh');
    $("#smsProvider").selectpicker('val', formdata.smsProvider);
    $('#smsProvider').selectpicker('refresh');
    $("#whatsappProvider").selectpicker('val', formdata.whatsAppProvider);
    $('#whatsappProvider').selectpicker('refresh');
    $("#smsAuthKey").val(formdata.smsAuthKey);
    $("#whatsappAuthKey").val(formdata.whatsAppAuthKey);
    $("#smtpHost").val(formdata.smtpHost);
    $("#smtpPort").val(formdata.smtpPort)
    $("#smtpUserName").val(formdata.smtpUsername);
    $('#btnUpdate').on('click', UpdateCompConfig(companyConfigId))
}

function UpdateCompConfig(companyConfigId) {
    var updateUrl = '/CompanyConfiguration/EditCompanyConfigurationList';
    $('#btnUpdate').on('click', function () {
        var company = $('#company').val();
        var smsProvider = $('#smsProvider').val();
        var whatsappProvider = $('#whatsappProvider').val();
        var smsAuthKey = $('#smsAuthKey').val();
        var whatsappAuthKey = $('#whatsappAuthKey').val();
        var smtpHost = $('#smtpHost').val();
        var smtpUserName = $('#smtpUserName').val();
        var smtpPort = $('#smtpPort').val();
        var smtpPassword = $('#smtpPassword').val();

        CheckValidation();

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
                    toastr.success("Company Configuration updated successfully!");
                    $("#AddCompnyConfigDiv").addClass('d-none'); //hide form
                    $("#backButton").removeClass('d-none');
                    $("#tableDiv").show();
                    FetchAllCompConfigList();
                }
                else
                    return
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                toastr.error("Failed to submit Vehicle Type", "Error");
            }
        });
    });
}

function DeleteCompConfiglist(CompanyConfigrationId) {
    var deleteCompConfig = '/CompanyConfiguration/DeleteCompanyConfiguration/' + CompanyConfigrationId;
    $.ajax({
        url: deleteCompConfig,
        type: "DELETE",
        dataType: "json",
        data: JSON.stringify(CompanyConfigrationId),
        success: function (response) {
            FetchAllCompConfigList();
            console.log("Deleted successfully...");
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to fetch data!", "Error");
        }
    });
}

