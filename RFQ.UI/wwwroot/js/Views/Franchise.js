const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('LinkId');
var myDropzone;
var orderColumn = '';
var orderDir = '';
var fetchFranchiseUrl = '/Franchise/GetAllFranchise';
$(document).ready(function () {

    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir); // update for next click

        $('th.sortable').not(this).data('order', 'asc');

        FetchDataForTable('franchiseTable', fetchFranchiseUrl, orderColumn, orderDir.toUpperCase(), IsEdit, IsView, IsCancel);
    });
    GetAllCityList("ddlCity");
    CheckValidation();
    FetchFranchise();
    document.querySelectorAll("#txtGstNumber, #txtPanNumber").forEach(function (element) {
        element.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
        });
    });
    $("#btnCancel").on("click", function () {
        FetchFranchise();
    });
    $("#btnAddFranchise").on("click", function () {
        $('#franchiseForm').find('input, select, textarea, button, a').prop('disabled', false);
        $("#tableDiv").css('display', 'none ');
        $("#formDiv").css('display', 'block');
    });
    $('#tableDivLink').on('click', function (e) {
        e.preventDefault(); // prevent default anchor behavior
        FetchFranchise();
    });
});

Initialize();
function Initialize() {
    Dropzone.autoDiscover = false;
    var uploadUrl = "/Franchise/Upload";
    var deleteUploadUrl = "/Franchise/DeleteUpload";
    if (Dropzone.instances.length > 0) {
        Dropzone.instances.forEach(dz => dz.destroy());
    }
    let isNewFranchise = false;
    let isUpdateFranchise = false;
    myDropzone = new Dropzone("#dropzone", {
        url: uploadUrl,
        paramName: "file",
        maxFiles: 1,
        parallelUploads: 1,
        maxFilesize: 4,
        addRemoveLinks: true,
        autoProcessQueue: false,
        acceptedFiles: "image/*",
        init: function () {
            $("#btnSaveFranchise").on('click', function (event) {
                event.preventDefault();
                isNewFranchise = false;
                isUpdateFranchise = false;
                if (OnSubmitValidation()) {
                    if (myDropzone.files.length > 0) {
                        myDropzone.processQueue();
                    }
                    else {
                        SaveFranchise(null, function (companyId) {
                            if (companyId > 0) {
                                FetchFranchise();
                            }
                        });
                    }
                }
            });
            $("#btnSavenewFranchise").on('click', function (event) {
                isNewFranchise = true;
                isUpdateFranchise = false;
                if (OnSubmitValidation()) {
                    if (myDropzone.files.length > 0) {
                        myDropzone.processQueue();
                    }
                    else {
                        SaveFranchise(null, function (companyId) {
                            if (companyId > 0) {
                                $('#franchiseForm')[0].reset();
                                myDropzone.removeAllFiles();
                                $('#ddlCity').val(null).trigger('change');
                                $("#btnSaveFranchise").show();
                                $("#btnUpdateFranchise").hide();
                                $("#btnSavenewFranchise").show();
                                setTimeout(() => {
                                    ResetAttachmentRepeater();
                                }, 1000);
                            }
                        });
                    }
                }
            });
            if (dropzone.children.length > 2) {
                dropzone.removeChild(dropzone.children[1]);
            }
            $("#btnUpdateFranchise").on('click', function (event) {
                isNewFranchise = false;
                isUpdateFranchise = true;
                if (OnSubmitValidation()) {
                    if (myDropzone.files.length > 0) {
                        if (myDropzone.files[0].status == "queued") {
                            myDropzone.processQueue();
                        }
                        else {
                            UpdateFranchise(null);
                        }
                    }
                    else {
                        UpdateFranchise(null);
                    }
                }
                else {
                    toastr.warning("Please Fill Form Details ", "Validation Error");
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
                    if (companyId > 0) {
                        if (isNewFranchise) {
                            $('#franchiseForm')[0].reset();
                            myDropzone.removeAllFiles();
                            $('#ddlCity').val(null).trigger('change');
                            $("#btnSaveFranchise").show();
                            $("#btnUpdateFranchise").hide();
                            $("#btnSavenewFranchise").show();
                            setTimeout(() => {
                                ResetAttachmentRepeater();
                            }, 1000);
                        }
                        else {
                            FetchFranchise();
                        }
                    }
                })
            }
        },
        removedfile: function (file) {
            var fileName = $("#hdnUploadedFile").val();
            if (fileName) {
                $.ajax({
                    url: deleteUploadUrl,
                    type: "POST",
                    data: { fileName: fileName },
                    success: function (response) {
                        $("#dropzone").val("");
                        $("#hdnUploadedFile").val("");
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
}
function CheckValidation() {
    $("#txtFranchiseName").on("blur", function () {
        if (!/^[A-Za-z0-9 ]+$/.test($(this).val())) {
            toastr.warning("Please enter a valid Franchise  Name", "Validation Error");
            return;
        }
    });
    $("#from-search-box").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a valid Franchise  Address", "Validation Error");
            return;
        }
    });
    $("#txtContactNumber").on("blur", function () {
        if (!IsNullOrEmpty($(this).val()) && !isMobile($(this).val())) {
            toastr.warning("Please enter a valid Contact No", "Validation Error");
            return;
        }
    });
    $("#txtMobileNumber").on("blur", function () {
        if (!IsNullOrEmpty($(this).val()) && !isMobile($(this).val())) {
            toastr.warning("Please enter a valid Mobile No", "Validation Error");
            return;
        }
    });
    $("#ddlCity").on("keypress", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please select a valid Franchise City", "Validation Error");
            return;
        }
    });
    $("#txtPinCode").on("blur", function () {
        if (!ValidatePinCode($(this).val())) {
            toastr.warning("Please enter a valid Pin Code", "Validation Error");
            return;
        }
    })
    $("#txtWhatsAppNumber").on("blur", function () {
        if (!isMobile($(this).val())) {
            toastr.warning("Please enter a valid Whatsapp Number", "Validation Error");
            return;
        }
    })
    $("#txtEmailId").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            return;
        }
        else {
            if (!isValidateEmail($(this).val())) {
                toastr.warning("Please enter a valid Email Id", "Validation Error");
                return;
            }
        }
    });
    $("#txtPanNumber").on("blur", function () {
        if (!ValidatePanNumber($(this).val())) {
            toastr.warning("Please enter a valid PAN Number", "Validation Error");
            return;
        }
    })
    $("#txtGstNumber").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            return;
        }
        else {
            if (!ValidateGstNumber($(this).val())) {
                toastr.warning("Please enter a valid GST Number", "Validation Error");
                return;
            }
        }
    });
}
function OnSubmitValidation() {
    if (IsNullOrEmpty($("#txtFranchiseName").val()) || !/^[A-Za-z0-9 ]+$/.test($("#txtFranchiseName").val())) {
        toastr.warning("Please enter a valid Franchise Name", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#from-search-box").val())) {
        toastr.warning("Please enter a valid Franchise Address", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlCity").val())) {
        toastr.warning("Please select a valid Franchise City", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtPinCode").val()) || !ValidatePinCode($("#txtPinCode").val())) {
        toastr.warning("Please enter a valid Franchise Pincode", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtPanNumber").val()) || !ValidatePanNumber($("#txtPanNumber").val())) {
        toastr.warning("Please enter a valid PAN Number", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtWhatsAppNumber").val()) || !isMobile($("#txtWhatsAppNumber").val())) {
        toastr.warning("Please enter a valid Whatsapp Number", "Validation Error");
        return false;
    }
    return true;
}
function SaveFranchise(fileName, callback) {
    var franchiseName = $("#txtFranchiseName").val();
    var franchiseAddress = $("#from-search-box").val();
    var franchiseCity = $("#ddlCity").val();
    var franchisePincode = $("#txtPinCode").val();
    var contactPerson = $("#txtContactPerson").val();
    var contactNumber = $("#txtContactNumber").val();
    var whatsappNumber = $("#txtWhatsAppNumber").val();
    var mobileNumber = $("#txtMobileNumber").val();
    var emailId = $("#txtEmailId").val();
    var panNumber = $("#txtPanNumber").val();
    var gstNumber = $("#txtGstNumber").val();
    var franchiseLogo = fileName ? fileName:"";
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
            if (response && response.success === true) {
                let companyId = response.data.companyId;

                Saveattachment(companyId);
                toastr.success("Franchise Details Submitted Successfully!");
                addMasterUserActivityLog(0, LogType.Create, "Franchise Details Submitted Successfully!", 0);

                if (typeof callback === "function") {
                    callback(companyId);
                }
            } else {
                // Backend returned success: false (e.g., duplicate)
                toastr.warning(response.message || "Franchise could not be saved.");

                if (typeof callback === "function") {
                    callback(null);
                }
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error:", {
                status: status,
                error: error,
                responseText: xhr.responseText
            });

            toastr.error("Failed to Submit Franchise Details!", "Error");

            if (typeof callback === "function") {
                callback(null);
            }
        }
    });

    return companyId;
};
function FetchFranchise() {
    $("#tableDiv").css('display', 'block');
    $("#formDiv").css('display', 'none');
    $('#franchiseForm')[0].reset();
    myDropzone.removeAllFiles();
    $('#ddlCity').val(null).trigger('change');
    $("#btnSaveFranchise").show();
    $("#btnUpdateFranchise").hide();
    $("#btnSavenewFranchise").show();
    ResetAttachmentRepeater();
    FetchDataForTable('franchiseTable', fetchFranchiseUrl, orderColumn, orderDir.toUpperCase(), IsEdit, IsView, IsCancel);
}


$('#franchiseTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchFranchise();
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchFranchise();
});
function EditFranchise(companyId) {
    $('#franchiseForm').find('input, select, textarea, button, a').prop('disabled', false);
    if ($("#btnUpdateFranchise").hasClass('d-none')) {
        $("#btnUpdateFranchise").removeClass('d-none');
    }
    var data = viewModelDto.filter(x => x.companyId == companyId);
    var formData = data[0];
    FetchMasterAttachment(formData.linkId, companyId, function (list) {
        var attachmentData = list;
        $('#tableDiv').css('display', 'none');
        $("#formDiv").css('display', 'Block');
        $("#btnSaveFranchise").hide();
        $("#btnUpdateFranchise").show();
        $("#btnSavenewFranchise").hide();
        $("#hdnCompanyId").val(formData.companyId);
        $("#txtFranchiseName").val(formData.companyName);
        $("#txtFranchiseCode").val(formData.companyTypeId);
        $("#from-search-box").val(formData.addressLine);
        $("#ddlCity").val(formData.cityId).trigger('change');
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
        if (logoImage) {
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
        }
        if (attachmentData.length > 0) {
            EditMasterAttachment(attachmentData);
        }
    })
};
function UpdateFranchise(fileName) {
    var logoFileName = fileName ? fileName : $("#hdnUploadedFile").val();
    var formData = {
        CompanyId: $("#hdnCompanyId").val(),
        CompanyName: $("#txtFranchiseName").val(),
        AddressLine: $("#from-search-box").val(),
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
                toastr.success("Franchise Details Updated Successfully!");
                addMasterUserActivityLog(0, LogType.Update, "Franchise Details Updated Successfully!", 0);
                FetchFranchise();
            }
            else {
                toastr.error("Failed to Update Franchise Details!", "Error");
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Update Franchise Details!", "Error");
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
function DeleteFranchise(companyId, fileName, linkId) {
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
            var deleteFranchiseUrl = '/Franchise/DeleteFranchise/' + companyId;
            var deleteUploadUrl = '/Franchise/DeleteUpload';

            FetchMasterAttachment(linkId, companyId, function (list) {
                var result = list;

                $.ajax({
                    url: deleteFranchiseUrl,
                    type: "DELETE",
                    dataType: "json",
                    data: JSON.stringify(companyId),
                    success: function (response) {
                        if (result.length > 0) {
                            DeleteMasterAttachment(result[0].attachmentId);
                        }
                        toastr.success("Franchise Details Deleted Successfully!");
                        addMasterUserActivityLog(0, LogType.Delete, "Franchise Details Deleted Successfully!", 0);
                        $('#currentPage').val(1);
                        FetchFranchise();

                        // After successful franchise delete, delete the upload
                        $.ajax({
                            url: deleteUploadUrl,
                            type: "POST",
                            dataType: "json",
                            data: { fileName: fileName },
                            success: function (response) {
                                // Optional: You can add success logic here if needed
                            },
                            error: function (xhr, status, error) {
                                // Optional: Handle upload delete error if needed
                            }
                        });

                    },
                    error: function (xhr, status, error) {
                        toastr.error("Failed to Delete Franchise Details!", "Error");
                    }
                });
            });
        }
    });
}

function ViewFranchise(companyId) {
    EditFranchise(companyId);
    $('#franchiseForm').find('input, select, textarea, button, a').prop('disabled', true);
    $("#btnUpdateFranchise").addClass('d-none');
}

