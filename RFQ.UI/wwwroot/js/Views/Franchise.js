const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('LinkId');
var myDropzone;
$(document).ready(function () {
    GetAllCityList();
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
    myDropzone = new Dropzone("#dropzone",{
            url: uploadUrl,
            paramName: "file",
            maxFiles: 1,
            parallelUploads: 1,
            maxFilesize: 1,
            addRemoveLinks: true,
            autoProcessQueue: false,
            acceptedFiles: "image/*",
            init: function () {
                $("#btnSaveFranchise").on('click', function (event) {
                    event.preventDefault();
                    isNewFranchise = false;
                    isUpdateFranchise = false;
                    if (myDropzone.files.length > 0) {
                        if (OnSubmitValidation()) {
                            myDropzone.processQueue();
                        }
                    } else {
                        toastr.warning("Please Fill Form Details ", "Validation Error");
                    }
                });
                $("#btnSavenewFranchise").on('click', function (event) {
                    isNewFranchise = true;
                    isUpdateFranchise = false;
                    if (myDropzone.files.length > 0) {
                        if (OnSubmitValidation()) {
                            myDropzone.processQueue();
                        }
                    }
                    else {
                        toastr.warning("Please Fill Form Details ", "Validation Error");
                    }
                });
                if (dropzone.children.length > 2) {
                    dropzone.removeChild(dropzone.children[1]);
                }
                $("#btnUpdateFranchise").on('click', function (event) {
                    isNewFranchise = false;
                    isUpdateFranchise = true;
                    if (myDropzone.files.length > 0) {
                        if (OnSubmitValidation()) {
                            if (myDropzone.files[0].status == "queued") {
                                myDropzone.processQueue();
                            }
                            else {
                                UpdateFranchise(null);
                            }
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
}
function CheckValidation() {
    $("#txtFranchiseName").on("blur", function () {
        if (!/^[A-Za-z0-9 ]+$/.test($(this).val())) {
            toastr.warning("Please enter a valid Franchise  Name", "Validation Error");
            return;
        }
    });
    $("#txtAddress").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a valid Franchise  Address", "Validation Error");
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
    $("#txtContactPerson").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a valid Contact Person", "Validation Error");
            return;
        }
    })
    $("#txtContactNumber").on("blur", function () {
        if (!isMobile($(this).val())) {
            toastr.warning("Please enter a valid Contact Number", "Validation Error");
            return;
        }
    })
    $("#txtWhatsAppNumber").on("blur", function () {
        if (!isMobile($(this).val())) {
            toastr.warning("Please enter a valid Whatsapp Number", "Validation Error");
            return;
        }
    })
    $("#txtMobileNumber").on("blur", function () {
        if (!isMobile($(this).val())) {
            toastr.warning("Please enter a valid Mobile Number", "Validation Error");
            return;
        }
    })
    $("#txtEmailId").on("blur", function () {
        if (!isValidateEmail($(this).val())) {
            toastr.warning("Please enter a valid Email", "Validation Error");
            return;
        }
    })
    $("#txtPanNumber").on("blur", function () {
        if (!ValidatePanNumber($(this).val())) {
            toastr.warning("Please enter a valid PAN Number", "Validation Error");
            return;
        }
    })
    $("#txtGstNumber").on("blur", function () {
        if (!ValidateGstNumber($(this).val())) {
            toastr.warning("Please enter a valid GST Number", "Validation Error");
            return;
        }
    })

}
function OnSubmitValidation() {
    if (IsNullOrEmpty($("#txtFranchiseName").val()) || !/^[A-Za-z0-9 ]+$/.test($("#txtFranchiseName").val())) {
        toastr.warning("Please enter a valid Franchise Name", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtAddress").val())) {
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
    if (IsNullOrEmpty($("#txtContactPerson").val())) {
        toastr.warning("Please enter a valid Contact Person", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtContactNumber").val()) || !isMobile($("#txtContactNumber").val())) {
        toastr.warning("Please enter a valid Contact Number", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtEmailId").val()) || !isValidateEmail($("#txtEmailId").val())) {
        toastr.warning("Please enter a valid Email Id", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtPanNumber").val()) || !ValidatePanNumber($("#txtPanNumber").val())) {
        toastr.warning("Please enter a valid PAN Number", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtGstNumber").val()) || !ValidateGstNumber($("#txtGstNumber").val())) {
        toastr.warning("Please enter a valid GST Number", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtMobileNumber").val()) || !isMobile($("#txtMobileNumber").val())) {
        toastr.warning("Please enter a valid Mobile Number", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtWhatsAppNumber").val()) || !isMobile($("#txtWhatsAppNumber").val())) {
        toastr.warning("Please enter a valid Whatsapp Number", "Validation Error");
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
            toastr.error("Failed to Fetch Data!", "Error");
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
            toastr.success("Franchise Detials Submitted Successfully!");
            if (typeof callback === "function") {
                callback(companyId);
            }
        },
        error: function (xhr, status, error) {
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
    var fetchFranchiseUrl = '/Franchise/GetFranchiseAll';
    $.ajax({
        url: fetchFranchiseUrl,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            let franchiseList = response.filter(x => x.companyTypeId == 2);
            franchiseViewModelDto = response;
            if ($.fn.DataTable.isDataTable("#franchiseTable")) {
                $("#franchiseTable").DataTable().clear();
            }
            const table = $("#franchiseTable").DataTable();
            franchiseList.forEach(item => {
                table.row.add([
                    `<img src="../../franchiselogo/${item.logoImage}" alt="Logo" height="40">`,
                    item.companyName,
                    item.addressLine,
                    item.email,
                    item.contactPerson,
                    item.contactNo,
                    item.mobNo,
                    item.gstNo,
                    `
           <div class="action-items" style="cursor:pointer;">
                    <a class="icon-btn" onclick="EditFranchise(${item.companyId})"><i class="ri-edit-2-line"></i></a>
                    <a class="icon-btn" onclick="DeleteFranchise(${item.companyId},'${item.logoImage}')"><i class="ri-delete-bin-3-line"></i></a>
            </div>
            `
                ]);
            });

            // Redraw table with new data
            table.draw();

            // Update total list count
            $('#totalList').text(`Total List: ${franchiseList.length}`);

        }
    });
}
function EditFranchise(companyId) {
    var data = franchiseViewModelDto.filter(x => x.companyId == companyId);
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
                toastr.success("Franchise Details Updated Successfully!");
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
                toastr.success("Franchise Details Deleted Successfully!");
                FetchFranchise();
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Delete Franchise Details!", "Error");
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
        }
    })
};
