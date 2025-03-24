(function ($) {
    "use strict";

    $(window).on('load resize', function () {
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

        if (viewportWidth <= 992) {
            $('#app_sidebar').addClass('drawer drawer-start'); // Add class if viewport width <= 992
        } else {
            $('#app_sidebar').removeClass('drawer drawer-start'); // Remove class if viewport width >= 993
        }
    });


    // left sidebar open
    $(".show-drawer,.left-sidebar-overlay").on("click",
        function () {
            $("#app_sidebar").toggleClass("drawer-on");
        }
    );

    $(document).ready(function () {
        $(".menu-accordion").click(function () {
            $(this).children(".menu-sub-accordion").slideToggle().toggleClass("show");
            $(this).toggleClass("show");
            $(this).siblings().removeClass("show").find(".menu-sub-accordion").slideUp().removeClass("show");
        });
    });

    $('.app-sidebar-toggle').click(function (e) {
        e.preventDefault();
        $("body").toggleClass("is-open");
        //jQuery(".off-canvas").toggleClass("is-show");
    });


    // Listen for click on toggle checkbox
    $('#select-all').click(function (event) {
        if (this.checked) {
            // Iterate each checkbox
            $(':checkbox').each(function () {
                this.checked = true;
            });
        } else {
            $(':checkbox').each(function () {
                this.checked = false;
            });
        }
    });









    if (document.querySelectorAll('input[type="file"].visually-hidden')) {
        document.querySelectorAll('input[type="file"].visually-hidden').forEach((element) => {
            element.parentElement.title = element.nextElementSibling.innerText;

            element.addEventListener('change', (event) => {
                event.target.parentElement.title = event.target.nextElementSibling.innerText = event.target.files[0].name;
            })
        })
    }

    // $(document).ready(function () {
    //     $("#datatable_gst").DataTable();
    // });


    $(document).ready(function () {
        // Initialize DataTable
        var table = $('#datatable_gst').DataTable({
            paging: true,
            searching: true,
            ordering: true,
            info: true,
            layout: {
                bottomEnd: {
                    paging: {
                        firstLast: false
                    }
                }
            }
        });

        // Custom Search Input
        $('#customSearch').on('keyup', function () {
            table.search(this.value).draw();
        });

        // Clear Search Input
        $('#clearSearch').on('click', function () {
            $('#customSearch').val('');
            table.search('').draw();
        });

        // Dropdown Actions
        $('#exportCsv').on('click', function () {
            alert('Export as CSV clicked');
            // Add your CSV export logic here
        });

        $('#exportPdf').on('click', function () {
            alert('Export as PDF clicked');
            // Add your PDF export logic here
        });

        $('#refreshTable').on('click', function () {
            table.ajax.reload(); // Reload table data (if using AJAX)
            alert('Table refreshed');
        });
    });

    $(document).ready(function () {
        // Initialize DataTable
        var table = $('#datatable_vtd').DataTable({
            paging: true,
            searching: true,
            ordering: true,
            info: true,
            layout: {
                bottomEnd: {
                    paging: {
                        firstLast: false
                    }
                }
            }
        });

        // Custom Search Input
        $('#customSearch').on('keyup', function () {
            table.search(this.value).draw();
        });

        // Clear Search Input
        $('#clearSearch').on('click', function () {
            $('#customSearch').val('');
            table.search('').draw();
        });

        // Dropdown Actions
        $('#exportCsv').on('click', function () {
            alert('Export as CSV clicked');
            // Add your CSV export logic here
        });

        $('#exportPdf').on('click', function () {
            alert('Export as PDF clicked');
            // Add your PDF export logic here
        });

        $('#refreshTable').on('click', function () {
            table.ajax.reload(); // Reload table data (if using AJAX)
            alert('Table refreshed');
        });
    });

    $(document).ready(function () {
        // Initialize DataTable
        var table = $('#datatable_ard').DataTable({
            paging: true,
            searching: true,
            ordering: true,
            info: true,
            layout: {
                bottomEnd: {
                    paging: {
                        firstLast: false
                    }
                }
            }
        });

        // Custom Search Input
        $('#customSearch').on('keyup', function () {
            table.search(this.value).draw();
        });

        // Clear Search Input
        $('#clearSearch').on('click', function () {
            $('#customSearch').val('');
            table.search('').draw();
        });

        // Dropdown Actions
        $('#exportCsv').on('click', function () {
            alert('Export as CSV clicked');
            // Add your CSV export logic here
        });

        $('#exportPdf').on('click', function () {
            alert('Export as PDF clicked');
            // Add your PDF export logic here
        });

        $('#refreshTable').on('click', function () {
            table.ajax.reload(); // Reload table data (if using AJAX)
            alert('Table refreshed');
        });
    });

    jQuery(document).ready(function () {
        jQuery('#kt_docs_repeater_basic').repeater({
            initEmpty: false,
            defaultValues: {
                'text-input': 'foo'
            },
            show: function () {
                jQuery(this).slideDown();
            },
            hide: function (deleteElement) {
                jQuery(this).slideUp(deleteElement);
            }
        });
    });

})(jQuery);