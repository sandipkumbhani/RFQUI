
$(document).ready(function () {
    SetValidation();
    GetAllCompany();
});

function GetAllCompany() {
    $("#tableDiv").show();
    var fetchFranchiseUrl = '/CompanyConfiguration/GetAllCompany';
    $.ajax({
        url: fetchFranchiseUrl,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log(response)
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

function SetValidation() {
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
        if (!/^[a-zA-Z0-9\x40!#$%^&*(),.?":{}|<>]+$/.test(password))
        {
            $("#txtPassword").val('');
            toastr.warning("Please enter a valid password", "Warning");
            return;
        }
    });
}