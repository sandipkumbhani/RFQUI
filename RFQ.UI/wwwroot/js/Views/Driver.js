let myDropzone;
let uploadedFileName;
let driverTypeMap = {};
let list;
let isDLEKycClicked = false;
const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('LinkId');
$(document).ready(function () {
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

            $("#licenseEKycButton").click(function () {
                isDLEKycClicked = true;
            });

            $("#btnSaveDriver").click(function (event) {
                event.preventDefault();

                if (!isDLEKycClicked) {
                    toastr.warning("Please Complete DL E-KYC Before Saving!");
                    return false;
                }
                if (!ValidationCheck()) {
                    return false;
                }
                if (dz.files.length > 0) {
                    if (dz.getQueuedFiles().length > 0) {
                        dz.processQueue();
                    } else {
                        if (uploadedFileName) {
                            SaveDriver(uploadedFileName);
                        } else {
                            toastr.warning("Please Upload a Driver Photo", "Validation Error");
                        }
                    }
                } else {
                    toastr.warning("Please Upload a Driver Photo", "Validation Error");
                }
            });
            $("#btnUpdateDriver").click(function (event) {
                event.preventDefault();
                if (!ValidationCheck()) {
                    return false;
                }
                if (dz.files.length > 0) {
                    if (dz.getQueuedFiles().length > 0) {
                        dz.processQueue();
                    } else {
                        if (uploadedFileName) {
                            UpdateDriver(uploadedFileName);
                        } else {
                            toastr.warning("Please Upload a Driver Photo For The Update", "Validation Error");
                        }
                    }
                } else {
                    var existingPhoto = $("#txtUploadedPhoto").val();
                    if (existingPhoto) {
                        UpdateDriver(existingPhoto);
                    } else {
                        toastr.warning("Please Upload a Driver Photo For The Update", "Validation Error");
                    }
                }
            });

            $("#btnSaveNewDriver").click(function (event) {
                event.preventDefault();

                if (!isDLEKycClicked) {
                    toastr.warning("Please Complete DL E-KYC Before Saving!");
                    return false;
                }
                if (!ValidationCheck()) {
                    return false;
                }
                if (dz.files.length > 0) {
                    if (dz.getQueuedFiles().length > 0) {
                        dz.processQueue();
                    } else {
                        if (uploadedFileName) {
                            SaveDriver(uploadedFileName);
                            ResetForm();
                        } else {
                            toastr.warning("Please Upload a Driver Photo", "Validation Error");
                        }
                    }
                } else {
                    toastr.warning("Please Upload a Driver Photo", "Validation Error");
                }

            });
        },
        success: function (file, response) {
            uploadedFileName = response.fileName;
            if ($(this).attr("id") === "btnSaveDriver") {
                SaveDriver(uploadedFileName);
            } else if ($(this).attr("id") === "btnUpdateDriver") {
                UpdateDriver(uploadedFileName);
            } else if ($(this).attr("id") === "btnSaveNewDriver") {
                SaveDriver(uploadedFileName);
            }
        }
    });
    function ResetForm() {
        $("#driverForm")[0].reset();
        $("#txtUploadedPhoto").val("");
        $("#ddlDriverType").val("").change();
        $("#ddlDriverType").selectpicker("refresh");
        $("#ddlCity").val("").change();
        $("#ddlCity").selectpicker("refresh");
        $(".dz-preview").remove();
        $(".dz-message").show();
    }

    InitializeFields();
    GetAllCityList();
    GetDriverType();
    DlEKycclick();

    $(document).on("click", "#btnView", function () {
        FetchDriverList();
        $("#addDriverDiv").css('display', 'none')
        $("#backButton").css('display', 'Block');
    });

    $('#backButton').click(function () {
        window.location.reload(true);
    });

    $("#cancleButton").on('click', function () {
        FetchDriverList();
        $("#addDriverDiv").css('display', 'none')
        $("#backButton").css('display', 'Block');
    })
});
function SaveDriver(uploadedFileName) {
    var driverType = $("#ddlDriverType").val();
    var licenseNo = $("#numLicenseNo").val();
    var driverName = $("#txtDriverName").val();
    var dlIssueDate = $("#txtDLIssueDate").val();
    var dlIssueRto = $("#txtDLIssuingRTO").val();
    var dateOfBirth = $("#txtDateOfBirth").val();
    var driverCode = $("#txtDriverCode").val();
    var dlExpiryDate = $("#txtDLExpiryDate").val();
    var whatsappNumber = $("#numWhatsapp").val();
    var address = $("#txtAddress").val();
    var city = $("#ddlCity").val();
    var mobileNumber = $("#numMobile").val();
    var pincode = $("#numPincode").val();
    // var verifiedOn = $("#txtVerifiedOn").val();
    var uploadPhoto = uploadedFileName;
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
        LinkId: linkId,
        DriverImagePath: uploadPhoto
    };


    $.ajax({
        url: saveUrl,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {
            var driverId = response.result.result.driverId;
            Saveattachment(driverId);
            toastr.success("Driver Details Submitted Successfully!");
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Submit Driver Details", "Error");
        }
    });
    return driverId;
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

    $('.selectpicker').selectpicker('refresh');
}
function FetchDriverList() {
    $('#tableDiv').show();
    var fetchDriverUrl = '/Driver/ViewDriver';
    $.ajax({
        url: fetchDriverUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {

            let trlist = response;
            driverResponseDtos = response;
            // Destroy existing DataTable if exists
            if ($.fn.DataTable.isDataTable('#tableDriver')) {
                $('#tableDriver').DataTable().clear().destroy();
            }

            $('#tableDriver').DataTable({
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
                "ordering": false,
                "data": trlist,
                "columns": [
                    {
                        "data": "driverImagePath",
                        "render": function (data) {
                            return `<img src="../../driverphoto/${data}" style="height:60px;width:60px" alt="Photo"/>`;
                        }
                    },
                    { "data": "licenseNo" },
                    { "data": "driverName" },
                    {
                        "data": "driverTypeId",
                        "render": function (data) {
                            return driverTypeMap[data] || "Unknown Type";
                        }
                    },
                    { "data": "mobNo" },
                    { "data": "addressLine" },
                    {
                        "data": function (row) {
                            return { DriverId: row.driverId, Logofile: row.driverImagePath }
                        },
                        "render": function (data, type, row) {
                            return `<div class="btn-group" role="group">
                                <button type="button" class="btn btn-sm btn-primary" onclick="EditDriver(${data.DriverId})">
                                        <i class="ti ti-edit"></i> Edit
                                </button>
                                <button type="button" class="btn btn-sm btn-danger" onclick="DeleteDriver(${data.DriverId},'${data.Logofile}')">
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
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
};
function FormatDateToLocal(dateString) {
    const date = new Date(dateString);
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().split('T')[0];
}
function EditDriver(driverId) {
    var data = driverResponseDtos.filter(x => x.driverId == driverId);
    var formData = data[0];
    FetchMasterAttachment(formData.linkId, driverId, function (list) {
        var attachmentData = list;

        $('#tableDiv').hide();
        $("#backButton").css('display', 'none');
        $("#addDriverDiv").css('display', 'Block');
        $("#btnSaveDriver").hide();
        $("#btnUpdateDriver").show();
        $("#cancleButton").removeClass('d-none');
        $("#btnSaveNewDriver").hide();
        $("#btnView").hide();

        const dropzone = document.getElementById('dropzone');
        if (dropzone.children[1]) {
            dropzone.removeChild(dropzone.children[1]);
        }

        $("#hdDriverId").val(formData.driverId);
        $("#ddlDriverType").val(formData.driverTypeId).change();
        $("#numLicenseNo").val(formData.licenseNo).prop("disabled", true);
        $("#txtDateOfBirth").val(FormatDateToLocal(formData.dateOfBirth)).prop("disabled", true);
        $("#txtDriverCode").val(formData.driverCode);
        $("#txtDLIssueDate").val(formData.licenseIssueDate);
        $("#txtDLExpiryDate").val(formData.licenseExpDate);
        $("#numWhatsapp").val(formData.whatsAppNo);
        $("#txtAddress").val(formData.addressLine);
        $("#numMobile").val(formData.mobNo);
        $("#numPincode").val(formData.pinCode);
        $("#txtDriverName").val(formData.driverName);
        $("#ddlCity").val(formData.cityId).change();
        var uploadPhoto = formData.driverImagePath;
        $("#txtUploadedPhoto").val(uploadPhoto);
        $("#dropzone").append('<div class="dz-preview dz-image-preview"><div class="dz-image"><img data-dz-thumbnail style="width: 120px; height: 120px; object-fit: cover;" src="../../driverphoto/' + uploadPhoto + '"></div></div>');
        $(".dz-message").hide();
        if (attachmentData.length > 0) {
            EditMasterAttachment(attachmentData);
        }
    });
}
function UpdateDriver(fileName) {

    var logoFileName = fileName || $("#txtUploadedPhoto").val();
    var formData = {
        DriverId: $("#hdDriverId").val(),
        DriverTypeId: $("#ddlDriverType").val(),
        LicenseNo: $("#numLicenseNo").val(),
        DriverName: $("#txtDriverName").val(),
        LicenseIssueDate: $("#txtDLIssueDate").val(),
        DateOfBirth: $("#txtDateOfBirth").val(),
        DriverCode: $("#txtDriverCode").val(),
        LicenseExpDate: $("#txtDLExpiryDate").val(),
        WhatsAppNo: $("#numWhatsapp").val(),
        AddressLine: $("#txtAddress").val(),
        CityId: $("#ddlCity").val(),
        MobNo: $("#numMobile").val(),
        PinCode: $("#numPincode").val(),
        LinkId: linkId,
        DriverImagePath: logoFileName
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
            TransactionId: $("#hdDriverId").val()
        });
    });
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
                $("#addDriverDiv").css('display', 'none');
                FetchDriverList();
                $("#backButton").show();
            }
            else {
                toastr.error("Failed to Update Driver Details!","Error");
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Update Driver Details!", "Error");
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
    $.ajax({
        type: "PUT",
        url: "/MasterAttachment/UpdateMasterAttachment",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(updateAttachmentDetails),
        dataType: "json",
        success: function (response) {
            if (response.result == "success") {
                driverId = $("#hdDriverId").val();
                Saveattachment(driverId);
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
function FormatDateForInput(dateString) {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
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
                var drivingLicenseModel = response.drivingLicenseModel
                var base64String = Data.drivingLicenseModel.photo;


                $("#txtDriverName").val(drivingLicenseModel.fullName),
                $("#txtDLIssueDate").val(FormatDateForInput(drivingLicenseModel.validityIssueDate));
                $("#txtDLExpiryDate").val(FormatDateForInput(drivingLicenseModel.validityExpiryDate));
                // $("#txtDLIssuingRTO").val(drivingLicenseModel.rtoAuthority),
                $("#txtAddress").val(drivingLicenseModel.presentAddress),
                $("#numPincode").val(drivingLicenseModel.pincode),

                document.getElementById("txtUploadedPhoto").value = base64String;
                $("#txtUploadedPhoto").val(drivingLicenseModel.photo),

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
                } else {
                    console.error("Dropzone is not initialized.");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Driver", "Validation Error");
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
            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function DeleteDriver(driverId, fileName) {
    var deleteDriverUrl = '/Driver/DeleteDriver/' + driverId;
    var deleteUploadUrl = '/Driver/DeleteUpload';
    FetchMasterAttachment(linkId, driverId, function (list) {
        result = list;
        $.ajax({
            url: deleteDriverUrl,
            type: "DELETE",
            dataType: "json",
            data: JSON.stringify(driverId),
            success: function (response) {
                DeleteMasterAttachment(result[0].attachmentId);
                FetchDriverList();
                $("#backButton").css('display', 'block');
            },
            error: function (xhr, status, error) {
                toastr.error("Fail	ed to fetch data!", "Validation Error");
            }
        });
    })
    $.ajax({
        url: deleteUploadUrl,
        type: "POST",
        dataType: "json",
        data: { fileName: fileName },
        success: function (response) {
            toastr.success("Driver Details Deleted Successfully!");
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Delete Driver Details!", "Error");
        }
    })
};
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

    $("#numMobile").on("blur", function () {
        if (!isMobile($(this).val())) {
            toastr.warning("Please enter a valid Mobile No", "Validation Error");
            return;
        }
    });
}
function ValidationCheck() {

    if (IsNullOrEmpty($("#txtDriverName").val())) {
        toastr.warning("Please complete DL E-KYC before saving!","Validation Error");
        return false;
    }

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

    if (IsNullOrEmpty($("#numMobile").val()) || !isMobile($("#numMobile").val())) {
        toastr.warning("Please enter a valid Mobile No", "Validation Error");
        return false;
    }
    return true;
}