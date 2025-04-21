const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('LinkId');
var myDropzone;
$(document).ready(function () {

    Dropzone.autoDiscover = false;
    var uploadUrl = "/Franchise/Upload";
    var deleteUploadUrl = "/Franchise/DeleteUpload";

    if (Dropzone.instances.length > 0) {
        Dropzone.instances.forEach(dz => dz.destroy());
    }
    let isNewFranchise = false;
    let isUpdateFranchise = false;
    GetAllCityList();
    CheckValidation();
    myDropzone = new Dropzone("#dropzone",
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
                    if (myDropzone.files.length > 0) {
                        if (CheckNullValidation()) {
                            myDropzone.processQueue();
                        }
                    } else {
                        toastr.warning("Please fill form details ", "Warning");
                    }
                });
                $("#btnSavenewFranchise").click(function (event) {
                    isNewFranchise = true;
                    isUpdateFranchise = false;
                    if (myDropzone.files.length > 0) {
                        if (CheckNullValidation()) {
                            myDropzone.processQueue();
                        }
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
                    if (myDropzone.files.length > 0) {
                        if (CheckNullValidation()) {
                            if (myDropzone.files[0].status == "queued") {
                                myDropzone.processQueue();
                            }
                            else {
                                UpdateFranchise(null);
                            }
                        }
                    }
                    else {
                        toastr.warning("Please fill form details ", "Warning");
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
                    SaveFranchise(response.fileName, function (companyId) {
                        if (companyId >0) {
                            if (isNewFranchise) {
                                $('#franchiseForm')[0].reset();
                                myDropzone.removeAllFiles();
                                $('#ddlCity').val("");
                                $('#ddlCity').selectpicker('refresh');
                                setTimeout(() => {
                                    $('#attachmentRow').clear();
                                }, 1000);
                            }
                            else {
                                window.location.href = "../Dashboard/Dashboard";
                            }
                        }
                    })
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
    $("#btnViewButton").on("click", function () {
        FetchFranchise();
        $("#addFranchiseDiv").css('display', 'none');
        $("#backButton").css('display', 'block');
    });

    $("#btnCancel").on("click", function () {
        FetchFranchise();
        $("#addFranchiseDiv").css('display', 'none');
        $("#backButton").css('display', 'block');
    });

    $('#backButton').on('click', function () {
        window.location.reload(true);
    });
});
function ValidatePanNumber(number) {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(number);
}
function ValidateGstNumber(number) {
    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/.test(number);
}
function CheckValidation() {
    $("#txtFranchiseName").on("blur", function () {
        if (!/^[A-Za-z0-9 ]+$/.test($(this).val())) {
            toastr.warning("Please enter a valid Franchise  Name", "Warning");
            return;
        }
    });
    $("#txtAddress").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a valid Franchise  Address", "Warning");
            return;
        }
    });
    $("#ddlCity").on("keypress", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please enter a valid Franchise City", "Warning");
            return;
        }
    });
    $("#txtPinCode").on("blur", function () {
        if (!/^\d{6}$/.test($(this).val())) {
            toastr.warning("Please enter a valid Pin Code", "Warning");
            return;
        }
    })
    $("#txtContactPerson").on("blur", function () {
        if (!isAlphabets($(this).val())) {
            toastr.warning("Only Letters allowed", "Warning");
            return;
        }
    })
    $("#txtContactNumber").on("blur", function () {
        if (!isMobile($(this).val())) {
            toastr.warning("Please enter a valid Contact Number", "Warning");
            return;
        }
    })
    $("#txtWhatsAppNumber").on("blur", function () {
        if (!isMobile($(this).val())) {
            toastr.warning("Please enter a valid Whatsapp Number", "Warning");
            return;
        }
    })
    $("#txtMobileNumber").on("blur", function () {
        if (!isMobile($(this).val())) {
            toastr.warning("Please enter a valid Mobile Number", "Warning");
            return;
        }
    })
    $("#txtEmailId").on("blur", function () {
        if (!isValidateEmail($(this).val())) {
            toastr.warning("Please enter a valid Email", "Warning");
            return;
        }
    })
    $("#txtPanNumber").on("input", function () {
        if (!isAlphaNumeric($(this).val())) {
            toastr.warning("Please enter a valid Pan Number", "Warning");
            return;
        }
    });
    $("#txtGSTNumber").on("input", function () {
        if (!isAlphaNumeric($(this).val())) {
            toastr.warning("Please enter a valid Gst Number", "Warning");
            return;
        }
    });
    $("#txtPanNumber").on("blur", function () {
        if (!ValidatePanNumber($(this).val())) {
            toastr.warning("Please enter a valid PAN Number", "Warning");
            return;
        }
    })
    $("#txtGSTNumber").on("blur", function () {
        if (!ValidateGstNumber($(this).val())) {
            toastr.warning("Please enter a valid GST Number", "Warning");
            return;
        }
    })
}
function CheckNullValidation() {
    if (IsNullOrEmpty($("#txtFranchiseName").val())) {
        toastr.warning("Please enter a valid Franchise Name", "Warning");
        return false;
    }
    if (IsNullOrEmpty($("#txtAddress").val())) {
        toastr.warning("Please enter a valid Franchise Address", "Warning");
        return false;
    }
    if (!isValidateSelect($("#ddlCity").val())) {
        toastr.warning("Please select a valid Franchise City", "Warning");
        return false;
    }
    if (IsNullOrEmpty($("#txtPinCode").val())) {
        toastr.warning("Please enter a valid Franchise Pincode", "Warning");
        return false;
    }
    if (IsNullOrEmpty($("#txtContactPerson").val())) {
        toastr.warning("Please enter a valid Contact Person", "Warning");
        return false;
    }
    if (IsNullOrEmpty($("#txtContactNumber").val())) {
        toastr.warning("Please enter a valid Contact Number", "Warning");
        return false;
    }
    if (IsNullOrEmpty($("#txtEmailId").val())) {
        toastr.warning("Please enter a valid Email Id", "Warning");
        return false;
    }
    if (IsNullOrEmpty($("#txtPanNumber").val())) {
        toastr.warning("Please enter a valid PAN Number", "Warning");
        return false;
    }
    if (IsNullOrEmpty($("#txtGstNumber").val())) {
        toastr.warning("Please enter a valid GST Number", "Warning");
        return false;
    }
    if (IsNullOrEmpty($("#txtMobileNumber").val())) {
        toastr.warning("Please enter a valid Mobile Number", "Warning");
        return false;
    }
    if (IsNullOrEmpty($("#txtWhatsAppNumber").val())) {
        toastr.warning("Please enter a valid Whatsapp Number", "Warning");
        return false;
    }
    return true;
}
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
function SaveFranchise(fileName, callback) {
    var franchiseName = $("#txtFranchiseName").val();
    var franchiseAddress = $("#txtAddress").val();
    var franchiseCity = $("#ddlCity").val();
    var franchisePincode = $("#txtPinCode").val();
    var contactPerson = $("#txtContactPerson").val();
    var contactNumber = $("#txtContactNumber").val();
    var whatsappNumber = $("#txtWhatsAppNumber").val();
    var mobileNumber = $("#txtMobileNumber").val();
    var emailId = $("#txtEmailId").val();
    var panNumber = $("#txtPanNumber").val();
    var gstNumber = $("#txtGstNumber").val();
    var franchiseLogo = fileName;
    var companyId = 0;
    var saveUrl = '/Franchise/FranchiseSave'
    var formData = {
        CompanyName: franchiseName,
        AddressLine: franchiseAddress,
        CityId: franchiseCity,
        PinCode: franchisePincode,
        ContactPerson: contactPerson,
        ContactNo: contactNumber,
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
            let companyId = response.result.companyId;
            Saveattachment(companyId);
            toastr.success("Franchise submitted successfully!");
            if (typeof callback === "function") {
                callback(companyId);
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to submitFranchise", "Error");
            if (typeof callback === "function") {
                callback(null);
            }
        }
    });
    return companyId;
};
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
    FetchMasterAttachment(formData.linkId, companyId, function (list) {
        var attachmentData = list;
        $('#tableDiv').hide();
        $("#backButton").css('display', 'none');
        $("#addFranchiseDiv").css('display', 'Block');
        $("#btnSaveFranchise").hide();
        $("#btnUpdateFranchise").show();
        $("#btnSavenewFranchise").hide();
        $("#btnViewButton").hide();
        $("#btnCancel").removeClass('d-none')
        $("#hdnCompanyId").val(formData.companyId);
        $("#txtFranchiseName").val(formData.companyName);
        $("#txtFranchiseCode").val(formData.companyTypeId);
        $("#txtAddress").val(formData.addressLine);
        $("#ddlCity").selectpicker('val', formData.cityId);
        $('#ddlCity').selectpicker('refresh');
        $("#txtPinCode").val(formData.pinCode);
        $("#txtContactPerson").val(formData.contactPerson);
        $("#txtContactNumber").val(formData.contactNo);
        $("#txtWhatsAppNumber").val(formData.whatsAppNo);
        $("#txtMobileNumber").val(formData.mobNo);
        $("#txtEmailId").val(formData.email);
        $("#txtPanNumber").val(formData.panNo);
        $("#txtGstNumber").val(formData.gstNo);
        var parentCompanyId = formData.parentCompanyId;
        var logoImage = formData.logoImage;
        $("#hdnUploadedFile").val(logoImage);
        const mockFile = { name: logoImage, size: 1234 };
        const imageUrl = `../../franchiselogo/${logoImage}`;
        if (myDropzone) {
            myDropzone.removeAllFiles(true);
            myDropzone.emit("addedfile", mockFile);
            myDropzone.emit("thumbnail", mockFile, imageUrl);
            myDropzone.emit("complete", mockFile);
            myDropzone.files.push(mockFile);
            setTimeout(() => {
                const thumbnailImg = document.querySelector(".dz-image img[data-dz-thumbnail]");
                if (thumbnailImg) {
                    thumbnailImg.style.width = "120px";
                    thumbnailImg.style.height = "120px";
                    thumbnailImg.style.objectFit = "cover";
                }
            }, 100);
        }
        if (attachmentData.length > 0) {
            EditMasterAttachment(attachmentData);
        }
    })
};
function UpdateFranchise(fileName) {
    var logoFileName;
    if (fileName) {
        logoFileName = fileName;
    }
    else {
        logoFileName = $("#hdnUploadedFile").val();
    }
    var formData = {
        CompanyId: $("#hdnCompanyId").val(),
        CompanyName: $("#txtFranchiseName").val(),
        AddressLine: $("#txtAddress").val(),
        CityId: $("#ddlCity").val(),
        PinCode: $("#txtPinCode").val(),
        ContactPerson: $("#txtContactPerson").val(),
        ContactNo: $("#txtContactNumber").val(),
        MobNo: $("#txtMobileNumber").val(),
        WhatsAppNo: $("#txtWhatsAppNumber").val(),
        Email: $("#txtEmailId").val(),
        PANNo: $("#txtPanNumber").val(),
        GSTNo: $("#txtGstNumber").val(),
        LogoImage: logoFileName,
        LinkId: linkId

    }
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
            TransactionId: $("#hdnCompanyId").val()
        });
    });
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
        var deletefileName = $("#hdnUploadedFile").val();
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
    $.ajax({
        type: "PUT",
        url: "/MasterAttachment/UpdateMasterAttachment",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(updateAttachmentDetails),
        dataType: "json",
        success: function (response) {
            if (response.result == "success") {
                companyId = $("#hdnCompanyId").val();
                Saveattachment(companyId);
            } else {
                $("#dataDiv").html("Failed to update profile.");
            }
        },
        error: function (xhr, status, error) {
            $("#dataDiv").html("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText);
        }
    });

    var deletedAttachments = JSON.parse(sessionStorage.getItem('deletedAttachments')) || [];
    $.each(deletedAttachments, function (index, value) {
        DeleteAttachmentAPI(value);
    });
}
function DeleteFranchise(companyId, fileName) {
    var deleteFranchiseUrl = '/Franchise/DeleteFranchise/' + companyId;
    var deleteUploadUrl = '/Franchise/DeleteUpload';
    var result;
    FetchMasterAttachment(linkId, companyId, function (list) {
        result = list;
    
    $.ajax({
        url: deleteFranchiseUrl,
        type: "DELETE",
        dataType: "json",
        data: JSON.stringify(companyId),
        success: function (response) {
            if (result.length > 0) {
                DeleteMasterAttachment(result[0].attachmentId);
            }
            toastr.success("Franchise deleted successfully!");
            FetchFranchise();
            $("#backButton").css('display', 'block');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to delete franchise!", "Error");
        }
    });
    })
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
