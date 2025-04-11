$(document).ready(function () {
    var productListDto;
    InitializeJquery();
    CheckValidation();  
})
$('#btnSaveProduct').click(function (event) {
    event.preventDefault();
    SaveProduct();
});
$('#btnSavenewProduct').click(function (event) {
    SaveProduct();
    $('#productForm')[0].reset();
});
$('#btnViewButton').click(function () {
    FetchProduct();
    $("#addProductDiv").css('display', 'none');
    $("#backButton").css('display', 'block');
});
$('#btnUpdateProduct').click(function () {
    UpdateProduct();
})
function InitializeJquery() {
    $('#backButton').on('click', function () {
        window.location.reload(true);
    });
}
function CheckValidation() {
    $("#txtItemName").on('blur change', function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter Item Name");
            return;
        }
    })
}
function CheckNullValidation() {
    var itemName = $('#txtItemName').val();
    if (IsNullOrEmpty(itemName)) {
        toastr.warning("Please enter Item Name");
        return false;
    }
    return true;
}
function SaveProduct() {
    if (!CheckNullValidation()) {
        return;
    }
    var saveProductUrl = "/Product/ProductSave";
    var itemName = $("#txtItemName").val();
    var formData = {
        ItemName: itemName
    };
    $.ajax({
        url: saveProductUrl,
        method: 'POST',
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify(formData),
        success: function (response) {
            debugger;
            if (response.result == "Success") {
                toastr.success("Item save successfully!");
            }
            else {
                toastr.error("Failed to save Item!");
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to save Item!");

        }
    });
}

function FetchProduct() {
    $("#tableDiv").show();
    var fetchProductUrl = "/Product/GetAllProducts";
    $.ajax({
        url: fetchProductUrl,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            let productList = response;
            productListDto = response;
            if ($.fn.DataTable.isDataTable('#tableProduct')) {
                $('#tableProduct').DataTable().clear().destroy();
            }
            $('#tableProduct').DataTable({
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
                "data": productList,
                "columns": [
                    { "data": "companyName"},
                    { "data": "itemName" },
                    {
                        "data": "itemId",
                        "render": function (data, type, row) {
                            return `<div class="btn-group" role="group">
                                                 <button type="button" class="btn btn-sm btn-primary" onclick="EditProduct(${data})">
                                                     <i class="ti ti-edit"></i> Edit
                                                 </button>
                                                 <button type="button" class="btn btn-sm btn-danger" onclick="DeleteProduct(${data})">
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
            toastr.error("Failed to fetch data!", "Error");
        }
    });
}

function EditProduct(itemId) {
    var data = productListDto.filter(x => x.itemId == itemId);
    var formData = data[0];
    $('#tableDiv').hide();
    $("#backButton").css('display', 'none');
    $("#addProductDiv").css('display', 'Block');
    $("#btnSaveProduct").hide();
    $("#btnUpdateProduct").show();
    $("#btnSavenewProduct").hide();
    $("#btnViewButton").hide();
    $("#txtItemName").val(formData.itemName);
    $("#hdnItemId").val(formData.itemId);
}

function UpdateProduct() {
    CheckNullValidation();
    var updateProductUrl = '/Product/EditProduct';
    var formData = {
        ItemId: $("#hdnItemId").val(),
        ItemName : $("#txtItemName").val()
    }
    $.ajax({
        url: updateProductUrl,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {
            if (response.result == 'Success') {
                toastr.success("Product updated successfully!");
                $("#addProductDiv").hide();
                $("#backButton").show();
                $("#tableDiv").show();
                FetchProduct();
            }
            else {
                toastr.error("Failed to update Product", "Error");
            }   
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to submit Vehicle Type", "Error");
        }
    });
}

function DeleteProduct(itemId) {
    var deleteProductUrl = '/Product/DeleteProduct/' + itemId;
    $.ajax({
        url: deleteProductUrl,
        type: "DELETE",
        dataType: "json",
        data: JSON.stringify(itemId),
        success: function (response) {
            toastr.success("Product deleted successfully!");
            FetchProduct();
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to delete Product", "Error");
        }
    });
}