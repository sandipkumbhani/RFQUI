$(document).ready(function () {
    var GetAttachmentUrl = '/MasterAttachment/GetAllMasterAttachmentType';
    var attachmentType = [{ value: null, text: "Select AttachmentType", disabled: true, selected: true }];
    var attachmentList = [];
    $.ajax({
        url: GetAttachmentUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            if (response && response.length > 0) {
                $.each(response, function (index, type) {
                    attachmentType.push({ value: type.attachmentTypeId, text: type.attachmentTypeName })
                });
                //$.each(attachmentType, function (index, item) {
                //    $('.ddlAttachment').append($('<option>', {
                //        value: item.value,
                //        text: item.text
                //    }));

                //});
                    $.each(attachmentType, function (index, item) {
                        const option = $('<option>', {
                            value: item.value,
                            text: item.text
                        });

                        if (item.disabled) option.prop('disabled', true);
                        if (item.selected) option.prop('selected', true);

                        $('.ddlAttachment').append(option);
                    });
            }
            else {
                $('.ddlAttachment').empty().append('<option value="">No Attachment Available</option>');
            }

        },
        error: function (xhr, status, error) {
            toastr.error("Failed to MasterAttachmentType ", "Error");
        }
    });
    
})
$(document).on('change blur', '[data-repeater-item] .ddlAttachment', function () {
    const selectedValue = $(this).val();
    if (selectedValue=="null") {
        toastr.warning("Please select Attachment Type", "Warning");
        return;
    }
});
$(document).on('click', '.upload-btn', function () {
    var uploadUrl = '/MasterAttachment/UploadAttachment';
    const $row = $(this).closest('[data-repeater-item]');
    const fileInput = $row.find('.file-upload')[0].files[0];
    const spanText = $row.find('#spanText');
    if (!fileInput) {
        alert("Please choose a file.");
        return;
    }
    const formData = new FormData();
    formData.append("file", fileInput);
    $.ajax({
        url: uploadUrl,
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            $row.find('#hdnUplodedFileName').val(response.fileName); 
            $row.find("#fileLink").attr("href", `../../AttachmentFiles/${response.fileName}`);
            spanText.text(response.fileName); 
            toastr.success("Master Attachment submitted successfully!");
        },
        error: function () {
            alert("Upload failed. Please try again.");
        }
    });
});
$(document).on('click', '.btnDeleteAttachment', function () {
    var deleteUrl = '/MasterAttachment/DeleteAttachment'

    const $row = $(this).closest('[data-repeater-item]');

    const fileName = $row.find("#hdnUplodedFileName").val();
    const attachmentId = $row.find("#hdnAttachmentId").val();

    // Delete attachmentId store in session
    var deletedAttachments = JSON.parse(sessionStorage.getItem('deletedAttachments')) || [];
    if (!deletedAttachments.includes(attachmentId)) {
        deletedAttachments.push(attachmentId);
    }
    sessionStorage.setItem('deletedAttachments', JSON.stringify(deletedAttachments));

    if (!fileName) {
        toastr.warning("No file available to delete.", "Warning");
        return;
    }

    if (!confirm("Are you sure you want to delete this file?")) {
        return;
    }
    $.ajax({
        url: deleteUrl,
        type: "POST",
        data: { fileName: fileName },
        dataType: "json",
        success: function (response) {
            if (response.result === "Success") {
                toastr.success("Attachment deleted successfully", "Success");
            } else {
                toastr.error(response.message || "An error occurred while deleting the attachment.", "Error");
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to delete attachment. Please try again.", "Error");
        }
    });
});
function GetAttachmentList(repeaterItemName, transactionId) {
    let repeaterItems = document.querySelectorAll("[data-repeater-item]");
    let attachmentDetails = [];
    var linkd = GetQueryParam("LinkId");

    repeaterItems.forEach((item, index) => {

        let fileName = item.querySelector("#txtFileName")?.value || "N/A";
        let attachmentType = item.querySelector(".ddlAttachment")?.selectedOptions[0]?.value || "N/A";
        let fileUpload = item.querySelector("#fileUpload");
        let filePath = item.querySelector("#hdnUplodedFileName")?.value

        attachmentDetails.push({
            AttachmentName: fileName,
            AttachmentTypeId: attachmentType,
            AttachmentPath: filePath,
            ReferenceLinkId: parseInt(linkd),
            TransactionId: transactionId
        });
    });
    return attachmentDetails;
}
function Saveattachment(transactionId) {
    var attachmentListData = GetAttachmentList("[data-repeater-item]", transactionId);
    var attachmentSaveUrl = '/MasterAttachment/MasterAttachmentSave';
    $.ajax({
        url: attachmentSaveUrl,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(attachmentListData),
        success: function (response) {
            toastr.success("Attachment saved successfully");
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to save attachment", "Error");
        }
    });
}
function FetchMasterAttachment(linkid, transactionid, callback) {
    var fetchMasterAttachmentUrl = '/MasterAttachment/GetAllMasterAttachment';
    $.ajax({
        url: fetchMasterAttachmentUrl + "?linkid=" + linkid + "&transactionid=" + transactionid,
        type: "GET",
        dataType: "json",
        success: function (response) {

            list = response; 
            if (callback) {
                callback(list); 
            }
        }
    });
}
function DeleteMasterAttachment(attachmentId) {
    var deleteMasterAttachmentUrl = '/MasterAttachment/DeleteMasterAttachment/' + attachmentId
    $.ajax({
        url: deleteMasterAttachmentUrl,
        type: "DELETE",
        dataType: "json",
        data: JSON.stringify(attachmentId),
        success: function (response) {

            let result =[];
            response.forEach((item, index) => {
                result.push(item.attachmentPath);
            })
            var deleteUrl = '/MasterAttachment/DeleteAttachment'
            result.forEach((value, index) => {
                $.ajax({
                    url: deleteUrl,
                    type: "POST",
                    data: { fileName: value },
                    dataType: "json",
                    success: function (response) {
                        if (response.result === "Success") {
                        } else {
                            toastr.error(response.message || "An error occurred while deleting the attachment.", "Error");
                        }
                    },
                    error: function (xhr, status, error) {
                        toastr.error("Failed to delete attachment. Please try again.", "Error");
                    }
                });
            })
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to fetch data!", "Error");
        }
    });
}
function DeleteAttachmentAPI(attachmentId) {
    if (attachmentId) {
        var deleteAttachmentUrl = '/MasterAttachment/DeleteMasterAttachmentTable/'
        $.ajax({
            url: deleteAttachmentUrl + attachmentId,
            type: "DELETE",
            success: function (response) {
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to delete attachment", "Error");
            }
        });
    }
}
function EditMasterAttachment(attachmentData) {
    const repeaterList = $("[data-repeater-list='kt_docs_repeater_basic']");

    repeaterList.find("[data-repeater-item]").not(":first").remove();

    attachmentData.forEach((attachment, index) => {

        let currentItem;
        if (index === 0) {
            currentItem = repeaterList.find("[data-repeater-item]").first();
        } else {

            $("[data-repeater-create]").click();
            currentItem = repeaterList.find("[data-repeater-item]").last();
        }
        currentItem.find("#hdnAttachmentId").val(attachment.attachmentId);
        currentItem.find("#txtFileName").val(attachment.attachmentName);
        currentItem.find(".ddlAttachment").val(attachment.attachmentTypeId).trigger("change");
        currentItem.find("#hdnUplodedFileName").val(attachment.attachmentPath);
        currentItem.find("#fileLink").attr("href", `../../AttachmentFiles/${attachment.attachmentPath}`);
    });
}