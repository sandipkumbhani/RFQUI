var productListDto;
var orderColumn = '';
var orderDir = '';
var fetchProductUrl = '/Product/GetAllProducts';

$(document).ready(function () {
    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir); // update for next click

        $('th.sortable').not(this).data('order', 'asc');

        FetchDataForTable('productTable', fetchProductUrl, orderColumn, orderDir.toUpperCase(), 'EditProduct', 'DeleteProduct', 'itemId');
    });
    $("#btnCancel").on("click", function () {
        FetchProduct();
    });
    $('#listSectionLink').on('click', function (e) {
        e.preventDefault(); // prevent default anchor behavior
        $('#formSection').hide(); // hide the add/edit form
        $('#listSection').show(); // show the list
    });
    $("#btnSaveProduct, #btnSavenewProduct").on('click', function () {
        var action = $(this).data('action');
        SaveProduct(action);
    });

    //CheckValidation();
    FetchProduct();
    UpdateProduct();
});

$("#btnAdd").on("click", function (e) {
    e.preventDefault();
    $("#listSection").hide();
    $("#formSection").show();
    $('#productForm').find('input, select, textarea, button, a').prop('disabled', false);
});

function CheckNullValidation() {
    var itemName = $('#txtItemName').val();
    if (IsNullOrEmpty(itemName)) {
        toastr.warning("Please enter Item Name", "Validation Error");
        return false;
    }
    return true;
}
function SaveProduct(action) {
    if (!CheckNullValidation()) {
        return;
    }
    var saveProductUrl = "/Product/ProductSave";
    var itemName = $("#txtItemName").val();
    var formData = {
        ItemName: itemName
    };
    if (action == "save") {
        $.ajax({
            url: saveProductUrl,
            method: 'POST',
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(formData),
            success: function (response) {
                if (!IsNullOrEmpty(response) && response) {
                    toastr.success("Item Save Successfully!");
                    addMasterUserActivityLog(0, LogType.Create, "Item Save Successfully!", 0);
                    if (typeof this.completeOnSuccess === "function") {
                        this.completeOnSuccess();
                    }
                } else {
                    toastr.warning(response.message, "warning");
                }
            },
            error: function (xhr, status, error) {
                if (xhr.status == 409)
                    toastr.warning(xhr.responseText, "Already exists");
                else
                    toastr.error("Failed to Add Item Details");
            },
            completeOnSuccess: function () {
                FetchProduct();
            }
        });
    }
    else if (action === "saveNew") {
        $.ajax({
            url: saveProductUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (!IsNullOrEmpty(response) && response) {
                    toastr.success("Item Save Successfully!", "Success");
                    addMasterUserActivityLog(0, LogType.Create, "Item Save Successfully!", 0);
                    $('#productForm')[0].reset();
                } else {
                    toastr.error("Failed to Add Item Details.", "Error");
                }
            },
            error: function (xhr, status, error) {
                if (xhr.status == 409)
                    toastr.warning(xhr.responseText, "Already exists");
                else
                    toastr.error("Failed to Add Item Details");
            }
        });
    }
}
function FetchProduct() {
    $("#formSection").hide();
    $("#listSection").show();
    $('#productForm')[0].reset();
    $("#btnUpdateProduct").hide();
    $("#btnSavenewProduct").show();
    $("#btnSaveProduct").show();
    FetchDataForTable('productTable', fetchProductUrl, orderColumn, orderDir.toUpperCase(), 'EditProduct', 'DeleteProduct','itemId');
}

$('#productTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchProduct();
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchProduct();
});
function EditProduct(itemId) {
    if ($("#btnUpdateProduct").hasClass('d-none')) {
        $("#btnUpdateProduct").removeClass('d-none');
        $('#productForm').find('input, select, textarea, button, a').prop('disabled', false);
    }
    var data = viewModelDto.filter(x => x.itemId == itemId);
    var formData = data[0];
    $('#listSection').css('display', 'none');
    $("#formSection").css('display', 'Block');
    $("#backButton").css('display', 'none');
    $("#addProductDiv").css('display', 'Block');
    $("#btnSaveProduct").hide();
    $("#btnUpdateProduct").show();
    $("#btnSavenewProduct").hide();
    $("#btnViewButton").hide();
    $("#btnCancel").removeClass('d-none');
    $("#txtItemName").val(formData.itemName);
    $("#hdnItemId").val(formData.itemId);
}
function UpdateProduct() {
    $("#btnUpdateProduct").on('click', function (e) {
        e.preventDefault();
        if (!CheckNullValidation()) {
            return;
        }
        var updateProductUrl = '/Product/EditProduct';
        var formData = {
            ItemId: $("#hdnItemId").val(),
            ItemName: $("#txtItemName").val()
        }
        $.ajax({
            url: updateProductUrl,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                if (!IsNullOrEmpty(response) && response) {
                    toastr.success("Product Updated Successfully!");
                    addMasterUserActivityLog(0, LogType.Update, "Product Updated Successfully!", 0);
                    FetchProduct();
                }
                else {
                    toastr.error("Failed to update Product", "Error");
                }
            },
            error: function (xhr, status, error) {
                if (xhr.status == 409)
                    toastr.warning(xhr.responseText, "Already exists");
                else
                    toastr.error("Failed to Add Item Details");
            }
        });
    });
}
function DeleteProduct(itemId) {
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
            var deleteProductUrl = '/Product/DeleteProduct/' + itemId;
            $.ajax({
                url: deleteProductUrl,
                type: "DELETE",
                dataType: "json",
                data: JSON.stringify(itemId),
                success: function (response) {
                    toastr.success("Product Deleted Successfully!");
                    addMasterUserActivityLog(0, LogType.Delete, "Product Deleted Successfully!", 0);
                    $('#currentPage').val(1);
                    FetchProduct();
                },
                error: function (xhr, status, error) {
                    toastr.error("Failed to Delete Product!", "Error");
                }
            });
        }
    });
}
function ViewProduct(itemId) {
    EditProduct(itemId);
    $('#productForm').find('input, select, textarea, button, a').prop('disabled', true);
    $("#btnUpdateProduct").addClass('d-none');
}