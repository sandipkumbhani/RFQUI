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
        localStorage.setItem("uploadedFileName", null);
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
    $('#ddlCity').val(0).trigger('change');
    $('#ddlDriverType').val(0).trigger('change');
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

            dz.on("addedfile", function (file) {
                console.log("dz File added:", file.name);
                // Allow only 1 file
                if (dz.files.length > 1) {
                    dz.removeFile(dz.files[0]);
                }
                $(".dz-message").hide();
                $(".dz-error-message").hide();
                // this is call to call upload Api after adding file to dropzone
                setTimeout(() => {
                    dz.processQueue();
                }, 100);
            });

            // Use Dropzone default remove button
            dz.on("removedfile", function (file) {
                console.log("File cancelled:", file.name);
                uploadedFileName = null;
                localStorage.setItem("uploadedFileName", uploadedFileName);
                $(".dz-message").show();
            });

        },
        success: function (file, response) {
            uploadedFileName = response.base64;
            localStorage.setItem("uploadedFileName", uploadedFileName);
        },
        error: function (file, response) {
            localStorage.setItem("uploadedFileName", null);
        }
    });
}

function SaveDriver(uploadedFileName, callback) {
    var driverType = parseInt($("#ddlDriverType").val());
    var licenseNo = getVal("#numLicenseNo");
    var driverName = $("#txtDriverName").val().trim();
    var dlIssueDate = getVal("#txtDLIssueDate");
    var dlIssueRto = getVal("#txtDLIssuingRTO");
    var dateOfBirth = getVal("#txtDateOfBirth");
    var driverCode = getVal("#txtDriverCode");
    var dlExpiryDate = getVal("#txtDLExpiryDate");
    var whatsappNumber = getVal("#numWhatsapp");
    var address = getVal("#from-search-box");
    var city = parseInt($("#ddlCity").val());
    var mobileNumber = getVal("#numMobile");
    var pincode = getVal("#numPincode");
    var verifiedOn = getVal("#txtVerifiedOn");
    var uploadPhoto = !IsNullOrEmpty(uploadedFileName) ? uploadedFileName : null;
    var createUser = $("#createlogin").is(":checked");
    var LinkId = GetQueryParam("LinkId");
    var companyId = GetQueryParam("companyid") || 0;

    var saveUrl = '/Driver/DriverSave';
    var formData = {
        DriverId: 0,
        CompanyId: companyId,
        DriverTypeId: driverType,
        DriverName: driverName,
        DriverCode: driverCode,
        LicenseNo: licenseNo,
        DateOfBirth: dateOfBirth,
        LicenseIssueDate: dlIssueDate,
        LicenseIssueCityId: 0,
        LicenseExpDate: dlExpiryDate,
        MobNo: mobileNumber,
        WhatsAppNo: whatsappNumber,
        AddressLine: address,
        CityId: city,
        PinCode: pincode,
        DriverImagePath: !IsNullOrEmpty(uploadPhoto) ? uploadPhoto : null,
        DLIssuingRto: dlIssueRto,
        VarifiedOn: verifiedOn,
        LinkId: LinkId,
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
        success: async function (response) {
            if (!IsNullOrEmpty(response)) {
                await Saveattachment(response.driverId);
                toastr.success("Driver Details Saved Successfully!", "Success");
                addMasterUserActivityLog(0, LogType.Create, "Driver Details Saved Successfully!", 0);
                FetchDriverList();
            }
            else {
                toastr.error(response.message || "Failed to Save Driver Details.", "Error");
            }
        },
        error: function (xhr, status, error) {
            if (xhr.status == 409)
                toastr.warning(xhr.responseText, "Already exists");
            else
                toastr.error(xhr.responseText || "Failed to Save Driver Details.", "Error");
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
        $("#hdDriverId").val(formData.driverId);
        $("#ddlDriverType").val(formData.driverTypeId).trigger('change');
        $("#numLicenseNo").val(formData.licenseNo);
        $("#txtDateOfBirth").val(FormatDateToLocal(formData.dateOfBirth));
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

        if (!IsNullOrEmpty(uploadPhoto)) {
            if (myDropzone) {
                const fileName = `driver_photo_${Date.now()}.jpg`;
                const file = base64ToFile(uploadPhoto, fileName);

                // Clear old files (optional)
                myDropzone.removeAllFiles(true);

                // Add file to Dropzone
                myDropzone.addFile(file);

                // Start upload
                myDropzone.processQueue();
                $(".dz-message").hide();
            }
        }

        if (attachmentData.length > 0) {
            EditMasterAttachment(attachmentData);
        }
    });
}
function UpdateDriver(fileName) {
    var formData = {
        DriverId: $("#hdDriverId").val() || 0,
        DriverTypeId: $("#ddlDriverType").val(),
        LicenseNo: getVal("#numLicenseNo"),
        DriverName: $("#txtDriverName").val().trim(),
        LicenseIssueDate: getVal("#txtDLIssueDate"),
        DLIssuingRto: getVal("#txtDLIssuingRTO"),
        DateOfBirth: getVal("#txtDateOfBirth"),
        DriverCode: getVal("#txtDriverCode"),
        LicenseExpDate: getVal("#txtDLExpiryDate"),
        WhatsAppNo: getVal("#numWhatsapp"),
        AddressLine: !IsNullOrEmpty($("#from-search-box").val()) ? $("#from-search-box").val() : "",
        CityId: $("#ddlCity").val(),
        MobNo: getVal("#numMobile"),
        PinCode: getVal("#numPincode"),
        VarifiedOn: getVal("#txtVerifiedOn"),
        LinkId: GetQueryParam("LinkId") || 0,
        DriverImagePath: !IsNullOrEmpty(fileName) ? fileName : null
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
            if (!IsNullOrEmpty(response)) {
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
            if (xhr.status == 409)
                toastr.warning(xhr.responseText, "Already exists");
            else
                toastr.error(xhr.responseText || "Failed to Update Driver Details.", "Error");
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

                var base64String = Data.drivingLicenseModel.photo;
                const uniqueFileNameGenrate = `driver_photo_${Date.now()}.jpg`;
                const file = base64ToFile("data:image/jpeg;base64," + base64String, uniqueFileNameGenrate);
                if (myDropzone) {
                    // Clear old & add new
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
            dropdown.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
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
function InitializeFields() {

    $("#ddlDriverType").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please select a valid Driver Type", "Validation Error");
            return;
        }
    });

    $("#numLicenseNo").on("blur", function () {
        if (!IsNullOrEmpty($(this).val())) {
            if (!ValidateLicenseNo($(this).val())) {
                toastr.warning("Please enter a valid License No", "Validation Error");
                return;
            }
        }
    });

    //$("#txtDateOfBirth").on("blur", function () {
    //    if (IsNullOrEmpty($(this).val())) {
    //        toastr.warning("Please enter a valid DateOfBirth", "Validation Error");
    //        return;
    //    }
    //});

    $("#ddlCity").on("blur", function () {
        const selectedIndex = $(this).prop("selectedIndex");
        if (!isValidateSelect($(this).val(), selectedIndex)) {
            toastr.warning("Please select a valid City", "Validation Error");
            return;
        }
    });

    //$("#txtDriverCode").on("blur", function () {
    //    if (!isAlphaNumeric($(this).val())) {
    //        toastr.warning("Please enter a valid Driver Code", "Validation Error");
    //        return;
    //    }
    //});

    //$("#numWhatsapp").on("blur", function () {
    //    if (!isMobile($(this).val())) {
    //        toastr.warning("Please enter a valid WhatsApp No", "Validation Error");
    //        return;
    //    }
    //});

    //$("#numMobile").on("blur", function () {
    //    if (!isMobile($(this).val())) {
    //        toastr.warning("Please enter a valid Mobile No", "Validation Error");
    //        return;
    //    }
    //});

    $("#btnSaveDriver").on('click', function (event) {
        event.preventDefault();
        if (!ValidationCheck()) {
            return false;
        }
        const uploadedFileName = localStorage.getItem("uploadedFileName");
        SaveDriver(uploadedFileName, function (driverId) {
            if (driverId > 0) {
                FetchDriverList();
            }
        });
    });

    $("#btnSaveNewDriver").on('click', function (event) {
        event.preventDefault();
        if (!ValidationCheck()) {
            return false;
        }
        const uploadedFileName = localStorage.getItem("uploadedFileName");
        console.log(uploadedFileName);
        SaveDriver(uploadedFileName, function (driverId) {
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
    });

    $("#btnUpdateDriver").on('click', function (event) {
        event.preventDefault();
        if (!ValidationCheck()) {
            return false;
        }
        const uploadedFileName = localStorage.getItem("uploadedFileName");
        UpdateDriver(uploadedFileName);
    });


}
function ValidationCheck() {
    if (IsNullOrEmpty($("#ddlDriverType").val())) {
        toastr.warning("Please select a valid Driver Type", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtDriverName").val())) {
        toastr.warning("Please enter a valid Driver Name", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#ddlCity").val()) || !isValidateSelect($("#ddlCity").val(), $("#ddlCity").prop("selectedIndex"))) {
        toastr.warning("Please select a valid City", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#from-search-box").val())) {
        toastr.warning("Please enter an address", "Validation Error");
        return false;
    }

    //if (IsNullOrEmpty($("#numLicenseNo").val()) || !ValidateLicenseNo($("#numLicenseNo").val())) {
    //    toastr.warning("Please enter a valid License No", "Validation Error");
    //    return false;
    //}

    //if (IsNullOrEmpty($("#txtDateOfBirth").val())) {
    //    toastr.warning("Please enter a valid DateOfBirth", "Validation Error");
    //    return false;
    //}

    //if (IsNullOrEmpty($("#txtDLIssueDate").val())) {
    //    toastr.warning("Please enter a DL Issue Date", "Validation Error");
    //    return false;
    //}

    //if (IsNullOrEmpty($("#txtDLExpiryDate").val())) {
    //    toastr.warning("Please enter a valid DL Expiry Date ", "Validation Error");
    //    return false;
    //}

    //if (IsNullOrEmpty($("#txtDriverCode").val()) || !isAlphaNumeric($("#txtDriverCode").val())) {
    //    toastr.warning("Please enter a valid Driver Code", "Validation Error");
    //    return false;
    //}

    //if (IsNullOrEmpty($("#numWhatsapp").val()) || !isMobile($("#numWhatsapp").val())) {
    //    toastr.warning("Please enter a valid WhatsApp No", "Validation Error");
    //    return false;
    //}

    //if (IsNullOrEmpty($("#numMobile").val()) || !isMobile($("#numMobile").val())) {
    //    toastr.warning("Please enter a valid Mobile No", "Validation Error");
    //    return false;
    //}
    return true;
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
