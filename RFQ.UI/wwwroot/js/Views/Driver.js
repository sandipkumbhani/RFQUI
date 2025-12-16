if (typeof myDropzone === 'undefined') var myDropzone = null;
if (typeof uploadedFileName === 'undefined') var uploadedFileName = '';
if (typeof driverTypeMap === 'undefined') var driverTypeMap = {};
if (typeof list === 'undefined') var list = [];
if (typeof isDLEKycClicked === 'undefined') var isDLEKycClicked = false;
if (typeof orderColumn === 'undefined') var orderColumn = '';
if (typeof orderDir === 'undefined') var orderDir = '';
if (typeof fetchDriverUrl === 'undefined') var fetchDriverUrl = '/Driver/ViewDriver';
if (typeof companyId === 'undefined') var companyId = null;
if (typeof profileid === 'undefined') var profileid = '';

//let myDropzone;
//let uploadedFileName;
//let driverTypeMap = {};
//let list;
//let isDLEKycClicked = false;
//var orderColumn = '';
//var orderDir = '';
//var fetchDriverUrl = '/Driver/ViewDriver';
//var companyId;
//var profileid = '';

$(document).ready(function () {
    companyId = getCookieValue('companyid');
    profileid = getCookieValue('profileid');
    //locationid = getCookieValue('locationid');
    //if (profileid == EnumInternalMaster.ADMIN) {
    //    $('#ddlLocation').prop('disabled', true);
    //}
    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir); // update for next click

        $('th.sortable').not(this).data('order', 'asc');

        FetchDataForTable('driverTable', fetchDriverUrl, orderColumn, orderDir.toUpperCase(), 'EditDriver', 'DeleteDriver', 'driverId');
    });

    InitializeFields();
    GetAllCityList("ddlCity");
    GetDriverType();
    DlEKycclick();
    FetchDriverList();
    FetchDriverCode();
    $("#btnAdd").on("click", function () {
        $("#tableDiv").css('display', 'none ');
        $("#formDiv").css('display', 'block');
        FetchDriverCode();
    });
    $("#btnCancel").on("click", function () {
        FetchDriverList();
    });
    $('#tableDivLink').on('click', function (e) {
        e.preventDefault(); // prevent default anchor behavior
        FetchDriverList();
    });
});

DropzoneInitialize();
function ResetForm() {
    $("#driverForm")[0].reset();
    $("#txtUploadedPhoto").val("");
    $("#numLicenseNo").prop("disabled", false);
    $("#txtDateOfBirth").prop("disabled", false);
    $('#ddlCity').val(null).trigger('change');
    $('#ddlDriverType').val(null).trigger('change');
    $(".dz-preview").remove();
    $(".dz-message").show();
}
function DropzoneInitialize() {
    Dropzone.autoDiscover = false;
    var uploadUrl = '/Driver/Upload';
    if (Dropzone.instances.length > 0) {
        Dropzone.instances.forEach(dz => dz.destroy());
    }
    myDropzone = new Dropzone("#dropzone", {
        url: uploadUrl,
        paramName: "file",
        maxFiles: 1,
        parallelUploads: 1,
        maxFilesize: 1,
        addRemoveLinks: true,
        autoProcessQueue: false,
        acceptedFiles: "image/*",
        init: function () {
            const dz = this;

            $("#licenseEKycButton").on('click', function () {
                isDLEKycClicked = true;
            });

            $("#btnSaveDriver").on('click', function (event) {
                event.preventDefault();

                if (!ValidationCheck()) {
                    return false;
                }

                if (dz.files.length > 0 && dz.getQueuedFiles().length > 0) {
                    dz.processQueue(); // Upload first, then SaveDriver will be triggered in Dropzone success handler
                }
                else if (dz.files.length > 0 && dz.getQueuedFiles().length === 0) {
                    SaveDriver(uploadedFileName || "", function (driverId) {
                        if (driverId > 0) {
                            FetchDriverList(); // <-- Replaced here
                        }
                    });
                }
                else {
                    SaveDriver("", function (driverId) {
                        if (driverId > 0) {
                            FetchDriverList();
                        }
                    });
                }
            });


            $("#btnUpdateDriver").on('click', function (event) {
                event.preventDefault();

                if (!ValidationCheck()) {
                    return false;
                }

                // Case 1: Files exist and are queued for upload
                if (dz.files.length > 0 && dz.getQueuedFiles().length > 0) {
                    dz.processQueue(); // Will call UpdateDriver in Dropzone 'success' handler
                }
                // Case 2: Files exist but already uploaded
                else if (dz.files.length > 0 && dz.getQueuedFiles().length === 0) {
                    UpdateDriver(uploadedFileName || "");
                }
                // Case 3: No new file uploaded, use existing photo if any
                else {
                    var existingPhoto = $("#txtUploadedPhoto").val();

                    UpdateDriver(existingPhoto || "");
                }
            });


            $("#btnSaveNewDriver").on('click', function (event) {
                event.preventDefault();

                if (!ValidationCheck()) {
                    return false;
                }

                if (dz.files.length > 0) {
                    if (dz.getQueuedFiles().length > 0) {
                        dz.processQueue(); // Waits for Dropzone to upload
                    } else {
                        SaveDriver(uploadedFileName || "", function (driverId) {
                            if (driverId > 0) {
                                $("#btnSaveDriver").show();
                                $("#btnUpdateDriver").hide();
                                $("#btnSaveNewDriver").show();
                                ResetForm();
                                setTimeout(() => {
                                    ResetAttachmentRepeater();
                                }, 1000);
                            }
                        });
                    }
                } else {
                    // No files to upload, proceed to save without a photo
                    SaveDriver("", function (driverId) {
                        if (driverId > 0) {
                            $("#btnSaveDriver").show();
                            $("#btnUpdateDriver").hide();
                            $("#btnSaveNewDriver").show();
                            ResetForm();
                            setTimeout(() => {
                                ResetAttachmentRepeater();
                            }, 1000);
                        }
                    });
                }
            });

        },
        success: function (file, response) {
            uploadedFileName = response.fileName;
            if (clickedButton === "btnSaveDriver") {
                SaveDriver(uploadedFileName, function (driverId) {
                    if (driverId > 0) {
                        // Redirect replaced with FetchDriverList function
                        FetchDriverList();
                    }
                });
            } else if (clickedButton === "btnUpdateDriver") {
                UpdateDriver(uploadedFileName);
            } else if (clickedButton === "btnSaveNewDriver") {
                SaveDriver(uploadedFileName, function (driverId) {
                    if (driverId > 0) {
                        $("#btnSaveDriver").show();
                        $("#btnUpdateDriver").hide();
                        $("#btnSaveNewDriver").show();
                        ResetForm();
                        setTimeout(() => {
                            ResetAttachmentRepeater();
                        }, 1000);

                        // Optionally call FetchDriverList here too if needed
                        FetchDriverList();
                    }
                });
            }
        }
    });
}
function SaveDriver(uploadedFileName, callback) {
    var driverType = $("#ddlDriverType").val();
    var licenseNo = $("#numLicenseNo").val();
    var driverName = $("#txtDriverName").val();
    var dlIssueDate = $("#txtDLIssueDate").val() ? $("#txtDLIssueDate").val() : null;
    var dlIssueRto = $("#txtDLIssuingRTO").val();
    var dateOfBirth = $("#txtDateOfBirth").val();
    var driverCode = $("#txtDriverCode").val();
    var dlExpiryDate = $("#txtDLExpiryDate").val() ? $("#txtDLExpiryDate").val() : null;
    var whatsappNumber = $("#numWhatsapp").val();
    var address = $("#from-search-box").val();
    var city = $("#ddlCity").val();
    var mobileNumber = $("#numMobile").val();
    var pincode = $("#numPincode").val();
    var verifiedOn = $("#txtVerifiedOn").val() ? $("#txtVerifiedOn").val() : null;
    var uploadPhoto = uploadedFileName ? uploadedFileName : null;
    var createUser = $("#createlogin").is(":checked");
    var driverId = 0;

    var saveUrl = '/Driver/DriverSave';
    var formData = {
        DriverTypeId: driverType,
        LicenseNo: licenseNo,
        DriverName: driverName,
        LicenseIssueDate: dlIssueDate,
        LicenseIssueCityId: 1,
        DateOfBirth: dateOfBirth,
        DriverCode: driverCode,
        LicenseExpDate: dlExpiryDate,
        WhatsAppNo: whatsappNumber,
        AddressLine: address,
        CityId: city,
        MobNo: mobileNumber,
        PinCode: pincode,
        LinkId: GetQueryParam("LinkId"),
        DLIssuingRto: dlIssueRto,
        VarifiedOn: verifiedOn,
        DriverImagePath: uploadPhoto
    };

    if (createUser) {
        var userCreate = {
            //LocationId: locationId,
            ProfileId: EnumProfile.Driver,
            LoginId: whatsappNumber,
            Password: whatsappNumber,
            CompanyId: companyId
        }
        $.ajax({
            url: '/Home/UserSave/',
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(userCreate),
            dataType: "json",
            success: function (response) {
                if (response.result == "success") {
                    toastr.success("Driver Login Create Successfully!");
                }
                else {
                    toastr.error("User with this WhatsApp number already exists.", "Error");
                }
            },
            error: function (req, status, error) {
                toastr.error(xhr.responseText);
            }
        });
    }

    $.ajax({
        url: saveUrl,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {
            if (!IsNullOrEmpty(response)) {
                toastr.success("Driver Details Saved Successfully!", "Success");
                addMasterUserActivityLog(0, LogType.Create, "Driver Details Saved Successfully!", 0);
                FetchDriverList();
            }
            else {
                toastr.error(response.message || "Failed to Submit Driver Details.", "Error");
            }
        },
        error: function (xhr, status, error) {
            toastr.error(xhr.responseText);
        }
    });

}
function FetchDriverList() {
    $("#tableDiv").css('display', 'block');
    $("#formDiv").css('display', 'none');
    $("#btnSaveDriver").show();
    $("#btnUpdateDriver").hide();
    $("#btnSaveNewDriver").show();
    ResetForm();
    ResetAttachmentRepeater();
    FetchDataForTable('driverTable', fetchDriverUrl, orderColumn, orderDir.toUpperCase(), 'EditDriver', 'DeleteDriver', 'driverId');
};

$('#driverTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchDriverList();
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchDriverList();
});
function EditDriver(driverId) {
    if ($("#btnUpdateDriver").hasClass('d-none')) {
        $("#btnUpdateDriver").removeClass('d-none');
    }
    var data = viewModelDto.filter(x => x.driverId == driverId);
    var formData = data[0];
    FetchMasterAttachment(formData.linkId, driverId, function (list) {
        var attachmentData = list;
        $('#tableDiv').css('display', 'none');
        $("#formDiv").css('display', 'Block');
        $("#btnSaveDriver").hide();
        $("#btnUpdateDriver").show();
        $("#btnSaveNewDriver").hide();

        const dropzone = document.getElementById('dropzone');
        if (dropzone.children[1]) {
            dropzone.removeChild(dropzone.children[1]);
        }
        console.log(formData);
        $("#hdDriverId").val(formData.driverId);
        $("#ddlDriverType").val(formData.driverTypeId).trigger('change');
        $("#numLicenseNo").val(formData.licenseNo).prop("disabled", true);
        $("#txtDateOfBirth").val(FormatDateToLocal(formData.dateOfBirth)).prop("disabled", true);
        $("#txtDriverCode").val(formData.driverCode);
        $("#txtDLIssueDate").val(FormatDateToLocal(formData.licenseIssueDate));
        $("#txtDLIssuingRTO").val(formData.dlIssuingRto);

        //var dlIssueRto = $("#txtDLIssuingRTO").val();
        $("#txtDLExpiryDate").val(FormatDateToLocal(formData.licenseExpDate));
        $("#numWhatsapp").val(formData.whatsAppNo);
        $("#from-search-box").val(formData.addressLine);
        $("#numMobile").val(formData.mobNo);
        $("#numPincode").val(formData.pinCode);
        $("#txtDriverName").val(formData.driverName);
        $("#ddlCity").val(formData.cityId).trigger('change');
        var uploadPhoto = formData.driverImagePath;
        $("#txtUploadedPhoto").val(uploadPhoto);
        $("#txtVerifiedOn").val(formData.varifiedOn);
        $("#dropzone").append('<div class="dz-preview dz-image-preview"><div class="dz-image"><img data-dz-thumbnail style="width: 120px; height: 120px; object-fit: cover;" src="../../driverphoto/' + uploadPhoto + '"></div></div>');
        $(".dz-message").hide();
        if (attachmentData.length > 0) {
            EditMasterAttachment(attachmentData);
        }
    });
}
function UpdateDriver(fileName) {

    var logoFileName = fileName || $("#txtUploadedPhoto").val() ? $("#txtUploadedPhoto").val() : null;
    var formData = {
        DriverId: $("#hdDriverId").val(),
        DriverTypeId: $("#ddlDriverType").val(),
        LicenseNo: $("#numLicenseNo").val(),
        DriverName: $("#txtDriverName").val(),
        LicenseIssueDate: $("#txtDLIssueDate").val() ? $("#txtDLIssueDate").val() : null,
        DLIssuingRto: $("#txtDLIssuingRTO").val(),
        DateOfBirth: $("#txtDateOfBirth").val(),
        DriverCode: $("#txtDriverCode").val(),
        LicenseExpDate: $("#txtDLExpiryDate").val() ? $("#txtDLExpiryDate").val() : null,
        WhatsAppNo: $("#numWhatsapp").val(),
        AddressLine: $("#from-search-box").val(),
        CityId: $("#ddlCity").val(),
        MobNo: $("#numMobile").val(),
        PinCode: $("#numPincode").val(),
        VarifiedOn: $("txtVerifiedOn").val() ? $("txtVerifiedOn").val() : null,

        LinkId: GetQueryParam("LinkId"),
        DriverImagePath: logoFileName
        //DriverImagePath: logoFileName ? logoFileName : null
    }
    DeleteAttachmentAPI(formData.DriverId);
    var editDriverUrl = '/Driver/UpdateDriver';
    $.ajax({
        type: "PUT",
        url: editDriverUrl,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(formData),
        dataType: "json",
        success: function (response) {
            if (response.result === "success") {
                toastr.success("Driver Details Updated Successfully!");
                addMasterUserActivityLog(0, LogType.Update, "Driver Details Updated Successfully!", 0);
                const transactionId = $("#hdDriverId").val();
                UpdateAttachmentData(transactionId);
                FetchDriverList();
            }
            else {
                toastr.error("Failed to Update Driver Details!", "Error");
            }
        },
        error: function (xhr, status, error) {
            toastr.error(xhr.responseText);
        }
    });
    if (fileName) {
        var deleteUploadUrl = '/Driver/DeleteUpload';
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
}
function DlEKycclick() {
    $("#licenseEKycButton").on("click", function (event) {
        event.preventDefault();
        var licenseNo = $("#numLicenseNo").val();
        var dateOfBirth = $("#txtDateOfBirth").val();

        if (!ValidateLicenseNo(licenseNo)) {
            toastr.warning("Please enter a valid License No", "Validation Error");
            return false;
        }

        if (IsNullOrEmpty(dateOfBirth)) {
            toastr.warning("Please enter a valid DateOfBirth", "Validation Error");
            return false;
        }

        var Body = {
            DrivingLicenseNo: licenseNo,
            DateOfBirth: dateOfBirth,

        }

        var GetUrl = '/Driver/GetDlKycDetails';
        $.ajax({
            url: GetUrl,
            type: "Post",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(Body),
            success: function (response) {
                var Data = response;
                var drivingLicenseModel = response.drivingLicenseModel;
                var base64String = Data.drivingLicenseModel.photo;
                const dropzone = document.getElementById('dropzone');
                if (!IsNullOrEmpty(dropzone) && dropzone.children[1]) {
                    dropzone.removeChild(dropzone.children[1]);
                }
                $("#txtDriverName").val(drivingLicenseModel.fullName);
                $("#txtDLIssueDate").val(new Date(drivingLicenseModel.validityIssueDate).toISOString().split('T')[0]);
                $("#txtDLExpiryDate").val(new Date(drivingLicenseModel.validityExpiryDate).toISOString().split('T')[0]);
                $("#txtDLIssuingRTO").val(drivingLicenseModel.rtoAuthority),
                    $("#from-search-box").val(drivingLicenseModel.presentAddress);
                $("#numPincode").val(drivingLicenseModel.pincode);
                $("#txtVerifiedOn").val(new Date().toISOString().split('T')[0]),
               
                $("#txtUploadedPhoto").val(drivingLicenseModel.photo);

                function base64ToFile(base64String, filename) {
                    const arr = base64String.split(",");
                    const mime = arr[0].match(/:(.*?);/)[1];
                    const bstr = atob(arr[1]);
                    let n = bstr.length;
                    const u8arr = new Uint8Array(n);

                    while (n--) {
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    return new File([u8arr], filename, { type: mime });
                }

                const uniqueFileNameGenrate = `driver_photo_${Date.now()}.jpg`;
                const file = base64ToFile("data:image/jpeg;base64," + base64String, uniqueFileNameGenrate);

                if (myDropzone) {
                    myDropzone.removeAllFiles(true);
                    myDropzone.addFile(file);
                    myDropzone.processQueue();
                }
            },
            error: function (xhr, status, error) {
                toastr.error(xhr.responseText);
                $("#txtDriverName").val('');
                $("#txtDLIssueDate").val('');
                $("#txtDLExpiryDate").val('');
                $("#txtDLIssuingRTO").val('');
                $("#from-search-box").val('');
                $("#numPincode").val('');
                $("#txtVerifiedOn").val('');
                $("#txtUploadedPhoto").val('');
            }
        });
    });
}
function GetDriverType() {
    var GetUrl = '/Driver/GetDriverType';
    $.ajax({
        url: GetUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            response.forEach(category => {
                driverTypeMap[category.internalMasterId] = category.internalMasterName;
            });
            const dropdown = document.getElementById("ddlDriverType");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select Driver Type";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            dropdown.appendChild(placeholderOption);
            response.forEach(category => {
                const option = document.createElement("option");
                option.value = category.internalMasterId;
                option.textContent = category.internalMasterName;
                dropdown.appendChild(option);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function DeleteDriver(driverId, fileName, linkId) {
    if (IsNullOrEmpty(linkId)) {
        linkId = GetQueryParam("LinkId");
    }
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
            var deleteDriverUrl = '/Driver/DeleteDriver/' + driverId;
            var deleteUploadUrl = '/Driver/DeleteUpload';
            FetchMasterAttachment(linkId, driverId, function (list) {
                var result = list;
                $.ajax({
                    url: deleteDriverUrl,
                    type: "DELETE",
                    dataType: "json",
                    data: JSON.stringify(driverId),
                    success: function (response) {
                        if (result.length > 0) {
                            DeleteMasterAttachment(result[0].attachmentId);
                        }
                        toastr.success("Driver Details Deleted Successfully!");
                        addMasterUserActivityLog(0, LogType.Delete, "Driver Details Deleted Successfully!", 0);
                        $('#currentPage').val(1);
                        FetchDriverList();

                        // After successful delete, delete uploaded file
                        $.ajax({
                            url: deleteUploadUrl,
                            type: "POST",
                            dataType: "json",
                            data: { fileName: fileName },
                            success: function (response) {
                                // Optional: Add success handling here
                            },
                            error: function (xhr, status, error) {
                                toastr.error("Failed to Delete Driver Upload!", "Error");
                            }
                        });
                    },
                    error: function (xhr, status, error) {
                        toastr.error("Failed to Delete Driver Details!", "Error");
                    }
                });
            });
        }
    });
}
function ValidateLicenseNo(number) {
    return /^[A-Z]{2}[0-9]{2}(19|20)[0-9]{2}[0-9]{7}$/.test(number);
}
function InitializeFields() {

    $("#ddlDriverType").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please select a valid Driver Type", "Validation Error");
            return;
        }
    });

    $("#numLicenseNo").on("blur", function () {
        if (!ValidateLicenseNo($(this).val())) {
            toastr.warning("Please enter a valid License No", "Validation Error");
            return;
        }
    });

    $("#txtDateOfBirth").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a valid DateOfBirth", "Validation Error");
            return;
        }
    });

    $("#ddlCity").on("blur", function () {
        const selectedIndex = $(this).prop("selectedIndex");
        if (!isValidateSelect($(this).val(), selectedIndex)) {
            toastr.warning("Please select a valid City", "Validation Error");
            return;
        }
    });

    $("#txtDriverCode").on("blur", function () {
        if (!isAlphaNumeric($(this).val())) {
            toastr.warning("Please enter a valid Driver Code", "Validation Error");
            return;
        }
    });

    $("#numWhatsapp").on("blur", function () {
        if (!isMobile($(this).val())) {
            toastr.warning("Please enter a valid WhatsApp No", "Validation Error");
            return;
        }
    });

    //$("#numMobile").on("blur", function () {
    //    if (!isMobile($(this).val())) {
    //        toastr.warning("Please enter a valid Mobile No", "Validation Error");
    //        return;
    //    }
    //});
}
function ValidationCheck() {
    if (IsNullOrEmpty($("#ddlDriverType").val())) {
        toastr.warning("Please select a valid Driver Type", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#numLicenseNo").val()) || !ValidateLicenseNo($("#numLicenseNo").val())) {
        toastr.warning("Please enter a valid License No", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtDateOfBirth").val())) {
        toastr.warning("Please enter a valid DateOfBirth", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtDriverName").val())) {
        toastr.warning("Please enter a valid Driver Name", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtDLIssueDate").val())) {
        toastr.warning("Please enter a DL Issue Date", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtDLExpiryDate").val())) {
        toastr.warning("Please enter a valid DL Expiry Date ", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#ddlCity").val()) || !isValidateSelect($("#ddlCity").val(), $("#ddlCity").prop("selectedIndex"))) {
        toastr.warning("Please select a valid City", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtDriverCode").val()) || !isAlphaNumeric($("#txtDriverCode").val())) {
        toastr.warning("Please enter a valid Driver Code", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#numWhatsapp").val()) || !isMobile($("#numWhatsapp").val())) {
        toastr.warning("Please enter a valid WhatsApp No", "Validation Error");
        return false;
    }

    //if (IsNullOrEmpty($("#numMobile").val()) || !isMobile($("#numMobile").val())) {
    //    toastr.warning("Please enter a valid Mobile No", "Validation Error");
    //    return false;
    //}
    return true;
}
function ViewDriver(driverId) {
    EditDriver(driverId);
    $('#driverForm').find('input, select, textarea, button, a').prop('disabled', true);
    $("#btnUpdateDriver").addClass('d-none');
}
function FetchDriverCode() {
    $.ajax({
        url: "/Driver/GetDriverCode",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            $("#txtDriverCode").val(response.result);
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Driver Code!", "Error");
        }
    });
}

