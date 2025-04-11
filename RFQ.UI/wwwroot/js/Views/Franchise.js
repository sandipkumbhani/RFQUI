
const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('LinkId');

$(document).ready(function () {

    Dropzone.autoDiscover = false;
    var uploadUrl = "/Franchise/Upload";
    var deleteUploadUrl = "/Franchise/DeleteUpload";

    if (Dropzone.instances.length > 0) {
        Dropzone.instances.forEach(dz => dz.destroy());
    }
    let isNewFranchise = false;
    let isUpdateFranchise = false;
    const myDropzone = new Dropzone("#dropzone",
        {
            url: uploadUrl,
            paramName: "file",
            maxFiles: 1,
            parallelUploads: 1,
            maxFilesize: 1,
            addRemoveLinks: true,
            autoProcessQueue: false,
            acceptedFiles: "image/*",
            init: function () {
                $("#btnSaveFranchise").click(function (event) {
                    event.preventDefault();
                    isNewFranchise = false;
                    isUpdateFranchise = false;
                    if (IsNullOrEmpty($("#txtFranchiseName").val())) {
                        toastr.warning("Please enter a valid Franchise Name", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtFranchiseCode").val())) {
                        toastr.warning("Please enter a valid Franchise Code", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtAddress").val())) {
                        toastr.warning("Please enter a valid Franchise Address", "Warning");
                        return;
                    }
                    if (!isValidateSelect($("#ddlCity").val())) {
                        toastr.warning("Please select a valid Franchise City", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtPinCode").val())) {
                        toastr.warning("Please enter a valid Franchise Pincode", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtContactPerson").val())) {
                        toastr.warning("Please enter a valid Contact Person", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtEmailId").val())) {
                        toastr.warning("Please enter a valid Email Id", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtPanNumber").val())) {
                        toastr.warning("Please enter a valid PAN Number", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtGstNumber").val())) {
                        toastr.warning("Please enter a valid GST Number", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtMobileNumber").val())) {
                        toastr.warning("Please enter a valid Mobile Number", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtWhatsAppNumber").val())) {
                        toastr.warning("Please enter a valid Whatsapp Number", "Warning");
                        return;
                    }
                    if (myDropzone.files.length > 0) {
                        myDropzone.processQueue();
                    } else {
                        toastr.warning("Please fill form details ", "Warning");
                    }
                });
                $("#btnSavenewFranchise").click(function (event) {
                    isNewFranchise = true;
                    isUpdateFranchise = false;
                    if (IsNullOrEmpty($("#txtFranchiseName").val())) {
                        toastr.warning("Please enter a valid Franchise Name", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtFranchiseCode").val())) {
                        toastr.warning("Please enter a valid Franchise Code", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("txtAddress").val())) {
                        toastr.warning("Please enter a valid Franchise Address", "Warning");
                        return;
                    }
                    if (!isValidateSelect($("#ddlCity").val())) {
                        toastr.warning("Please select a valid Franchise City", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtPinCode").val())) {
                        toastr.warning("Please enter a valid Franchise Pincode", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtContactPerson").val())) {
                        toastr.warning("Please enter a valid Contact Person", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtEmailId").val())) {
                        toastr.warning("Please enter a valid Email Id", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtPanNumber").val())) {
                        toastr.warning("Please enter a valid PAN Number", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtGstNumber").val())) {
                        toastr.warning("Please enter a valid GST Number", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtMobileNumber").val())) {
                        toastr.warning("Please enter a valid Mobile Number", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtWhatsAppNumber").val())) {
                        toastr.warning("Please enter a valid Whatsapp Number", "Warning");
                        return;
                    }
                    if (myDropzone.files.length > 0) {
                        myDropzone.processQueue();
                    }
                    else {
                        toastr.warning("Please fill form details ", "Warning");
                    }
                });
                if (dropzone.children.length > 2) {
                    dropzone.removeChild(dropzone.children[1]);
                }
                $("#btnUpdateFranchise").click(function (event) {
                    isNewFranchise = false;
                    isUpdateFranchise = true;
                    if (IsNullOrEmpty($("#txtFranchiseName").val())) {
                        toastr.warning("Please enter a valid Franchise Name", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtFranchiseCode").val())) {
                        toastr.warning("Please enter a valid Franchise Code", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtAddress").val())) {
                        toastr.warning("Please enter a valid Franchise Address", "Warning");
                        return;
                    }
                    if (!isValidateSelect($("#ddlCity").val())) {
                        toastr.warning("Please select a valid Franchise City", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtPinCode").val())) {
                        toastr.warning("Please enter a valid Franchise Pincode", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtContactPerson").val())) {
                        toastr.warning("Please enter a valid Contact Person", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtEmailId").val())) {
                        toastr.warning("Please enter a valid Email Id", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtPanNumber").val())) {
                        toastr.warning("Please enter a valid PAN Number", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtGstNumber").val())) {
                        toastr.warning("Please enter a valid GST Number", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtMobileNumber").val())) {
                        toastr.warning("Please enter a valid Mobile Number", "Warning");
                        return;
                    }
                    if (IsNullOrEmpty($("#txtWhatsAppNumber").val())) {
                        toastr.warning("Please enter a valid Whatsapp Number", "Warning");
                        return;
                    }
                    if (myDropzone.files.length > 0) {
                        myDropzone.processQueue();
                    }
                    else {
                        UpdateFranchise();
                    }
                });

            },
            success: function (file, response) {
                if (isUpdateFranchise) {
                    const dropzone = document.getElementById('dropzone');
                    if (dropzone.children[1]) {
                        dropzone.removeChild(dropzone.children[1]);
                    }
                    UpdateFranchise(response.fileName);
                }
                else {
                    SaveFranchise(response.fileName);
                    if (isNewFranchise) {
                        $('#franchiseForm')[0].reset();
                        myDropzone.removeAllFiles();
                    }
                }
            },
            removedfile: function (file) {
                var fileName = $("#dropzone").val();
                if (fileName) {
                    $.ajax({
                        url: deleteUploadUrl,
                        type: "POST",
                        data: { fileName: fileName },
                        success: function (response) {
                            $("#dropzone").val("");
                        },
                        error: function (error) {
                            toastr.error("Error removing file.", "Error");
                        }
                    });
                }
                var _ref;
                return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
            },
            error: (file, response) => {
                toastr.warning(response, "Warning");
                this.removeFile(file);
            },
            accept: function (file, done) {
                if (this.files.length > 1) {
                    this.removeFile(file);
                    toastr.warning("Only one file can be uploaded.", "Warning");
                } else {
                    done();
                }
            }
        });

    GetAllCityList();

    $("#btnViewButton").on("click", function () {
        FetchFranchise();
        $("#addFranchiseDiv").css('display', 'none');
        $("#backButton").css('display', 'block');
    });

    $("#cancleButton").on("click", function () {
        FetchFranchise();
        $("#addFranchiseDiv").css('display', 'none');
        $("#backButton").css('display', 'block');
    });
    function validatePanNumber(number) {
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(number);
    }
    function validateGstNumber(number) {
        return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/.test(number);
    }

    $('#backButton').on('click', function () {
        window.location.reload(true);
    });
    $("#txtFranchiseName").on("change", function () {
        if (!/^[A-Za-z0-9 ]+$/.test($(this).val())) {
            toastr.warning("Please enter a valid Franchise  Name", "Warning");
            $(this).focus();
            return;
        }
    });
    $("#txtFranchiseCode").on("change", function () {
        if (!isAlphaNumeric($(this).val())) {
            toastr.warning("Please enter a valid Franchise  Code", "Warning");
            $(this).focus();
            return;
        }
    });
    $("#txtAddress").on("change", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a valid Franchise  Address", "Warning");
            $(this).focus();
            return;
        }
    });
    $("#ddlCity").on("keypress", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please enter a valid Franchise  City", "Warning");
            $(this).focus();
            return;
        }
    });
    $("#txtPinCode").on("change", function () {
        if (!/^\d{6}$/.test($(this).val())) {
            toastr.warning("Please enter a valid Pin Code", "Warning");
            $(this).focus();
            return;
        }
    })
    $("#txtContactPerson").on("change", function () {
        if (!isAlphabets($(this).val())) {
            toastr.warning("Only letters allowed", "Warning");
            $(this).focus();
            return;
        }
    })
    $("#txtWhatsAppNumber").on("change", function () {
        if (!isMobile($(this).val())) {
            toastr.warning("Please enter a valid Whatsapp Number", "Warning");
            $(this).focus();
            return;
        }
    })
    $("#txtMobileNumber").on("change", function () {
        if (!isMobile($(this).val())) {
            toastr.warning("Please enter a valid Mobile Number", "Warning");
            $(this).focus();
            return;
        }
    })
    $("#txtEmailId").on("change", function () {
        if (!isValidateEmail($(this).val())) {
            toastr.warning("Please enter a valid Email", "Warning");
            $(this).focus();
            return;
        }
    })
    $("#txtPanNumber").on("change", function () {
        if (!validatePanNumber($(this).val())) {
            toastr.warning("Please enter a valid PAN Number", "Warning");
            $(this).focus();
            return;
        }
    })
    $("#txtGSTNumber").on("change", function () {
        if (!validateGstNumber($(this).val())) {
            toastr.warning("Please enter a valid GST Number", "Warning");
            return;
        }
    })

    function SaveFranchise(fileName) {

        var franchiseName = $("#txtFranchiseName").val();
        var franchiseCode = $("#txtFranchiseCode").val();
        var franchiseAddress = $("#txtAddress").val();
        var franchiseCity = $("#ddlCity").val();
        var franchisePincode = $("#txtPinCode").val();
        var contactPerson = $("#txtContactPerson").val();
        var whatsappNumber = $("#txtWhatsAppNumber").val();
        var mobileNumber = $("#txtMobileNumber").val();
        var emailId = $("#txtEmailId").val();
        var panNumber = $("#txtPanNumber").val();
        var gstNumber = $("#txtGstNumber").val();
        var franchiseLogo = fileName;

        if (IsNullOrEmpty(franchiseName)) {
            toastr.warning("Please enter a valid Franchise Name", "Warning");
            return;
        }
        if (IsNullOrEmpty(franchiseCode)) {
            toastr.warning("Please enter a valid Franchise Code", "Warning");
            return;
        }
        if (IsNullOrEmpty(franchiseAddress)) {
            toastr.warning("Please enter a valid Franchise Address", "Warning");
            return;
        }
        if (!isValidateSelect(franchiseCity)) {
            toastr.warning("Please select a valid Franchise City", "Warning");
            return;
        }
        if (IsNullOrEmpty(franchisePincode)) {
            toastr.warning("Please enter a valid Franchise Pincode", "Warning");
            return;
        }
        if (IsNullOrEmpty(contactPerson)) {
            toastr.warning("Please enter a valid Contact Person", "Warning");
            return;
        }
        if (IsNullOrEmpty(emailId)) {
            toastr.warning("Please enter a valid Email Id", "Warning");
            return;
        }
        if (IsNullOrEmpty(panNumber)) {
            toastr.warning("Please enter a valid PAN Number", "Warning");
            return;
        }
        if (IsNullOrEmpty(gstNumber)) {
            toastr.warning("Please enter a valid GST Number", "Warning");
            return;
        }
        if (IsNullOrEmpty(mobileNumber)) {
            toastr.warning("Please enter a valid Mobile Number", "Warning");
            return;
        }
        if (IsNullOrEmpty(whatsappNumber)) {
            toastr.warning("Please enter a valid Whatsapp Number", "Warning");
            return;
        }

        var saveUrl = '/Franchise/FranchiseSave'
        var formData = {
            CompanyName: franchiseName,
            AddressLine: franchiseAddress,
            CityId: franchiseCity,
            PinCode: franchisePincode,
            ContactPerson: contactPerson,
            ContactNo: mobileNumber,
            MobNo: mobileNumber,
            WhatsAppNo: whatsappNumber,
            Email: emailId,
            PANNo: panNumber,
            GSTNo: gstNumber,
            LogoImage: franchiseLogo,
            LinkId: linkId
        }
        $.ajax({
            url: saveUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                toastr.success("Franchise submitted successfully!");
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to submitFranchise", "Error");
            }
        });
    };
    function GetAllCityList() {
        var getcityUrl = '/Customer/GetAllCity'
        $.ajax({
            url: getcityUrl,
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
});
function FetchFranchise() {
    $("#tableDiv").show();
    var fetchFranchiseUrl = '/Franchise/GetFranchiseAll';
    $.ajax({
        url: fetchFranchiseUrl,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            let franchiseList = response.filter(x => x.companyTypeId == 2);
            franchiseViewModelDto = response;
            if ($.fn.DataTable.isDataTable('#tableFranchise')) {
                $('#tableFranchise').DataTable().clear().destroy();
            }
            $('#tableFranchise').DataTable({
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
                "data": franchiseList,
                "columns": [
                    {
                        "data": "logoImage",
                        "render": function (data) {
                            return `<img src="../../franchiselogo/${data}" style="height:40px;width:60px" alt="Logo" />`
                        }
                    },
                    { "data": "companyName" },
                    { "data": "addressLine" },
                    { "data": "cityId" },
                    { "data": "pinCode" },
                    { "data": "contactPerson" },
                    { "data": "contactNo" },
                    { "data": "mobNo" },
                    { "data": "whatsAppNo" },
                    { "data": "email" },
                    { "data": "panNo" },
                    { "data": "gstNo" },
                    {
                        "data": function (row) {
                            return { CompanyId: row.companyId, Logofile: row.logoImage }
                        },
                        "render": function (data, type, row) {
                            return `<div class="btn-group" role="group">
        <button type="button" class="btn btn-sm btn-primary" onclick="EditFranchise(${data.CompanyId})">
            <i class="ti ti-edit"></i> Edit
        </button>
        <button type="button" class="btn btn-sm btn-danger" onclick="DeleteFranchise(${data.CompanyId},'${data.Logofile}')">
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
};
function EditFranchise(companyId) {
    var data = franchiseViewModelDto.filter(x => x.companyId == companyId);
    var formData = data[0];
    $('#tableDiv').hide();
    $("#backButton").css('display', 'none');
    $("#addFranchiseDiv").css('display', 'Block');
    $("#btnSaveFranchise").hide();
    $("#btnUpdateFranchise").show();
    $("#btnSavenewFranchise").hide();
    $("#btnViewButton").hide();
    $("#cancleButton").removeClass('d-none')
    const dropzone = document.getElementById('dropzone');
    if (dropzone.children[1]) {
        dropzone.removeChild(dropzone.children[1]);
    }
    $("#txtCompanyId").val(formData.companyId);
    $("#txtFranchiseName").val(formData.companyName);
    $("#txtFranchiseCode").val(formData.companyTypeId);
    $("#txtAddress").val(formData.addressLine);
    $("#ddlCity").selectpicker('val', formData.cityId);
    $('#ddlCity').selectpicker('refresh');
    $("#txtPinCode").val(formData.pinCode);
    $("#txtContactPerson").val(formData.contactPerson);
    $("#txtWhatsAppNumber").val(formData.whatsAppNo);
    $("#txtMobileNumber").val(formData.mobNo);
    $("#txtEmailId").val(formData.email);
    $("#txtPanNumber").val(formData.panNo);
    $("#txtGstNumber").val(formData.gstNo);
    var parentCompanyId = formData.parentCompanyId;
    var logoImage = formData.logoImage;
    $("#txtUploadedFile").val(logoImage);
    $("#dropzone").append('<div class="dz-preview dz-image-preview"><div class="dz-image"><img data-dz-thumbnail style="width: 120px; height: 120px; object-fit: cover;" src="../../franchiselogo/' + logoImage + '"></div></div>');
    $(".dz-message").hide();
};
function UpdateFranchise(fileName) {
    var logoFileName;
    if (fileName) {
        logoFileName = fileName
    }
    else {
        logoFileName = $("#txtUploadedFile").val();
    }
    var formData = {
        CompanyId: $("#txtCompanyId").val(),
        CompanyName: $("#txtFranchiseName").val(),
        AddressLine: $("#txtAddress").val(),
        CityId: $("#ddlCity").val(),
        PinCode: $("#txtPinCode").val(),
        ContactPerson: $("#txtContactPerson").val(),
        ContactNo: $("#txtMobileNumber").val(),
        MobNo: $("#txtMobileNumber").val(),
        WhatsAppNo: $("#txtWhatsAppNumber").val(),
        Email: $("#txtEmailId").val(),
        PANNo: $("#txtPanNumber").val(),
        GSTNo: $("#txtGstNumber").val(),
        LogoImage: logoFileName,
        LinkId: linkId

    }
    var editFranchiseUrl = '/Franchise/EditFranchise';
    $.ajax({
        type: "PUT",
        url: editFranchiseUrl,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(formData),
        dataType: "json",
        success: function (response) {
            if (response.result == "Success") {
                toastr.success("Franchise Updated successfully!");
                $("#addFranchiseDiv").css('display', 'none');
                FetchFranchise();
                $("#backButton").show();

            }
            else {
                toastr.error("Failed to update franchise");
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to update franchise");
        }
    });
    if (fileName) {
        var deleteUploadUrl = '/Franchise/DeleteUpload';
        var deletefileName = $("#txtUploadedFile").val();
        $.ajax({
            url: deleteUploadUrl,
            type: "POST",
            dataType: "json",
            data: { fileName: deletefileName },
            success: function (response) {
            },
            error: function (xhr, status, error) {
                toastr.error("Fail	ed to fetch data!", "Error");
            }
        });
    }
}
function DeleteFranchise(companyId, fileName) {
    var deleteFranchiseUrl = '/Franchise/DeleteFranchise/' + companyId;
    var deleteUploadUrl = '/Franchise/DeleteUpload';
    $.ajax({
        url: deleteFranchiseUrl,
        type: "DELETE",
        dataType: "json",
        data: JSON.stringify(companyId),
        success: function (response) {
            FetchFranchise();
            $("#backButton").css('display', 'block');
        },
        error: function (xhr, status, error) {
            toastr.error("Fail	ed to fetch data!", "Error");
        }
    });
    $.ajax({
        url: deleteUploadUrl,
        type: "POST",
        dataType: "json",
        data: { fileName: fileName },
        success: function (response) {
        },
        error: function (xhr, status, error) {
            toastr.error("Fail	ed to fetch data!", "Error");
        }
    })
};

