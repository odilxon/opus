/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!***********************************************************************************!*\
  !*** ../../../themes/metronic/html/demo1/src/js/custom/apps/file-manager/list.js ***!
  \***********************************************************************************/


// Class definition
var KTFileManagerList = function () {
    // Define shared variables
    var datatable;
    var table

    // Private functions
    var initDatatable = function () {
        // Set date data order
        const tableRows = table.querySelectorAll('tbody tr');

        tableRows.forEach(row => {
            const dateRow = row.querySelectorAll('td');
            const dateCol = dateRow[3]; // select date from 4th column in table
            const realDate = moment(dateCol.innerHTML, "DD MMM YYYY, LT").format();
            dateCol.setAttribute('data-order', realDate);
        });

        const foldersListOptions = {
            "info": false,
            'order': [],
            "scrollY": "700px",
            "scrollCollapse": true,
            "paging": false,
            'ordering': false,
            'columns': [
                { data: 'checkbox' },
                { data: 'name' },
                { data: 'size' },
                { data: 'date' },
                { data: 'action' },
            ],
            'language': {
                emptyTable: `<div class="d-flex flex-column flex-center">
                    <img src="assets/media/illustrations/sketchy-1/5.png" class="mw-400px" />
                    <div class="fs-1 fw-bolder text-dark">No items found.</div>
                    <div class="fs-6">Start creating new folders or uploading a new file!</div>
                </div>`
            }
        };

        const filesListOptions = {
            "info": false,
            'order': [],
            'pageLength': 10,
            "lengthChange": false,
            'ordering': false,
            'columns': [
                { data: 'checkbox' },
                { data: 'name' },
                { data: 'size' },
                { data: 'date' },
                { data: 'action' },
            ],
            'language': {
                emptyTable: `<div class="d-flex flex-column flex-center">
                    <img src="assets/media/illustrations/sketchy-1/5.png" class="mw-400px" />
                    <div class="fs-1 fw-bolder text-dark mb-4">No items found.</div>
                    <div class="fs-6">Start creating new folders or uploading a new file!</div>
                </div>`
            },
            conditionalPaging: true
        };

        // Define datatable options to load
        var loadOptions;
        if(table.getAttribute('data-kt-filemanager-table') === 'folders'){
            loadOptions = foldersListOptions;
        } else {
            loadOptions = filesListOptions;
        }        

        // Init datatable --- more info on datatables: https://datatables.net/manual/
        datatable = $(table).DataTable(loadOptions);

        // Re-init functions on every table re-draw -- more info: https://datatables.net/reference/event/draw
        datatable.on('draw', function () {
            initToggleToolbar();
            handleDeleteRows();
            toggleToolbars();
            resetNewFolder();
            KTMenu.createInstances();
            initCopyLink();
            countTotalItems();
        });
    }

    // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
    var handleSearchDatatable = () => {
        const filterSearch = document.querySelector('[data-kt-filemanager-table-filter="search"]');
        filterSearch.addEventListener('keyup', function (e) {
            datatable.search(e.target.value).draw();
        });
    }

    // Delete customer
    var handleDeleteRows = () => {
        // Select all delete buttons
        const deleteButtons = table.querySelectorAll('[data-kt-filemanager-table-filter="delete_row"]');

        deleteButtons.forEach(d => {
            // Delete button on click
            d.addEventListener('click', function (e) {
                e.preventDefault();

                // Select parent row
                const parent = e.target.closest('tr');

                // Get customer name
                const fileName = parent.querySelectorAll('td')[1].innerText;

                // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
                Swal.fire({
                    text: "Are you sure you want to delete " + fileName + "?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes, delete!",
                    cancelButtonText: "No, cancel",
                    customClass: {
                        confirmButton: "btn fw-bold btn-danger",
                        cancelButton: "btn fw-bold btn-active-light-primary"
                    }
                }).then(function (result) {
                    if (result.value) {
                        Swal.fire({
                            text: "You have deleted " + fileName + "!.",
                            icon: "success",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary",
                            }
                        }).then(function () {
                            // Remove current row
                            datatable.row($(parent)).remove().draw();
                        });
                    } else if (result.dismiss === 'cancel') {
                        Swal.fire({
                            text: customerName + " was not deleted.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary",
                            }
                        });
                    }
                });
            })
        });
    }

    // Init toggle toolbar
    var initToggleToolbar = () => {
        // Toggle selected action toolbar
        // Select all checkboxes
        var checkboxes = table.querySelectorAll('[type="checkbox"]');
        if(table.getAttribute('data-kt-filemanager-table') === 'folders'){
            checkboxes =  document.querySelectorAll('#kt_file_manager_list_wrapper [type="checkbox"]');
        }

        // Select elements
        const deleteSelected = document.querySelector('[data-kt-filemanager-table-select="delete_selected"]');

        // Toggle delete selected toolbar
        checkboxes.forEach(c => {
            // Checkbox on click event
            c.addEventListener('click', function () {
                console.log(c);
                setTimeout(function () {
                    toggleToolbars();
                }, 50);
            });
        });

        // Deleted selected rows
        deleteSelected.addEventListener('click', function () {
            // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
            Swal.fire({
                text: "Are you sure you want to delete selected files or folders?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, delete!",
                cancelButtonText: "No, cancel",
                customClass: {
                    confirmButton: "btn fw-bold btn-danger",
                    cancelButton: "btn fw-bold btn-active-light-primary"
                }
            }).then(function (result) {
                if (result.value) {
                    Swal.fire({
                        text: "You have deleted all selected  files or folders!.",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    }).then(function () {
                        // Remove all selected customers
                        checkboxes.forEach(c => {
                            if (c.checked) {
                                datatable.row($(c.closest('tbody tr'))).remove().draw();
                            }
                        });

                        // Remove header checked box
                        const headerCheckbox = table.querySelectorAll('[type="checkbox"]')[0];
                        headerCheckbox.checked = false;
                    });
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "Selected  files or folders was not deleted.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    });
                }
            });
        });
    }

    // Toggle toolbars
    const toggleToolbars = () => {
        // Define variables
        const toolbarBase = document.querySelector('[data-kt-filemanager-table-toolbar="base"]');
        const toolbarSelected = document.querySelector('[data-kt-filemanager-table-toolbar="selected"]');
        const selectedCount = document.querySelector('[data-kt-filemanager-table-select="selected_count"]');

        // Select refreshed checkbox DOM elements 
        const allCheckboxes = table.querySelectorAll('tbody [type="checkbox"]');

        // Detect checkboxes state & count
        let checkedState = false;
        let count = 0;

        // Count checked boxes
        allCheckboxes.forEach(c => {
            if (c.checked) {
                checkedState = true;
                count++;
            }
        });

        // Toggle toolbars
        if (checkedState) {
            selectedCount.innerHTML = count;
            toolbarBase.classList.add('d-none');
            toolbarSelected.classList.remove('d-none');
        } else {
            toolbarBase.classList.remove('d-none');
            toolbarSelected.classList.add('d-none');
        }
    }

    // Handle new folder
    const handleNewFolder = () => {
        // Select button
        const newFolder = document.getElementById('kt_file_manager_new_folder');

        // Handle click action
        newFolder.addEventListener('click', e => {
            e.preventDefault();

            // Ignore if input already exist
            if (table.querySelector('#kt_file_manager_new_folder_row')) {
                return;
            }

            // Create new row elements
            const rowElement = document.createElement('tr');
            const rowWrapper = document.createElement('div');
            const rowCol1 = document.createElement('td'); // Checkbox column
            const rowCol2 = document.createElement('td'); // Name column
            const rowCol3 = document.createElement('td'); // Size column
            const rowCol4 = document.createElement('td'); // Date column
            const rowCol5 = document.createElement('td'); // Action column
            const rowInput = document.createElement('input');
            const rowButton = document.createElement('button');
            const cancelButton = document.createElement('button');
            const folderIcon = document.createElement('span');

            // Set folder icon
            const folderIconClasses = ['svg-icon', 'svg-icon-2x', 'svg-icon-primary', 'me-4'];
            const folderUploadIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"> <path opacity="0.3" d="M10 4H21C21.6 4 22 4.4 22 5V7H10V4Z" fill="black"></path> <path d="M9.2 3H3C2.4 3 2 3.4 2 4V19C2 19.6 2.4 20 3 20H21C21.6 20 22 19.6 22 19V7C22 6.4 21.6 6 21 6H12L10.4 3.60001C10.2 3.20001 9.7 3 9.2 3Z" fill="black"></path> </svg>`;
            folderIcon.classList.add(...folderIconClasses);
            folderIcon.innerHTML = folderUploadIcon;

            // Set general row attributes
            rowElement.setAttribute('id', 'kt_file_manager_new_folder_row');
            rowCol2.classList.add('fv-row');
            const rowWrapperClasses = ['d-flex', 'align-items-center'];
            rowWrapper.classList.add(...rowWrapperClasses);

            // Set input element attributes
            const inputClasses = ['form-control', 'mw-250px', 'me-3'];
            rowInput.setAttribute('type', 'text');
            rowInput.setAttribute('name', 'new_folder_name')
            rowInput.setAttribute('placeholder', 'Enter the folder name');
            rowInput.classList.add(...inputClasses);

            // Set button element attributes
            const rowButtonClasses = ['btn', 'btn-icon', 'btn-light-primary', 'me-3'];
            const buttonIcon = `<span class="svg-icon svg-icon-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9.89557 13.4982L7.79487 11.2651C7.26967 10.7068 6.38251 10.7068 5.85731 11.2651C5.37559 11.7772 5.37559 12.5757 5.85731 13.0878L9.74989 17.2257C10.1448 17.6455 10.8118 17.6455 11.2066 17.2257L18.1427 9.85252C18.6244 9.34044 18.6244 8.54191 18.1427 8.02984C17.6175 7.47154 16.7303 7.47154 16.2051 8.02984L11.061 13.4982C10.7451 13.834 10.2115 13.834 9.89557 13.4982Z" fill="black"></path>
                </svg>
            </span>`;
            const buttonIndicatorLabel = document.createElement('span');
            buttonIndicatorLabel.classList.add('indicator-label');
            buttonIndicatorLabel.innerHTML = buttonIcon;
            const buttonIndicatorProgress = document.createElement('span');
            const spinnerIcon = document.createElement('span');
            const spinnerClasses = ['spinner-border', 'spinner-border-sm', 'align-middle'];
            spinnerIcon.classList.add(...spinnerClasses);
            buttonIndicatorProgress.classList.add('indicator-progress');
            buttonIndicatorProgress.appendChild(spinnerIcon);
            rowButton.appendChild(buttonIndicatorLabel);
            rowButton.appendChild(buttonIndicatorProgress);
            rowButton.classList.add(...rowButtonClasses);
            rowButton.setAttribute('id', 'kt_file_manager_add_folder');

            // Set cancel button element attributes
            const cancelButtonClasses = ['btn', 'btn-icon', 'btn-light-danger'];
            const cancelIcon = `<span class="svg-icon svg-icon-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect opacity="0.5" x="7.05025" y="15.5356" width="12" height="2" rx="1" transform="rotate(-45 7.05025 15.5356)" fill="black"/>
                    <rect x="8.46447" y="7.05029" width="12" height="2" rx="1" transform="rotate(45 8.46447 7.05029)" fill="black"/>
                </svg>
            </span>`;
            const cancelIndicator = buttonIndicatorLabel.cloneNode(true);
            cancelIndicator.innerHTML = cancelIcon;
            const cancelSpinner = buttonIndicatorProgress.cloneNode(true);
            cancelButton.append(cancelIndicator);
            cancelButton.append(cancelSpinner);
            cancelButton.classList.add(...cancelButtonClasses);
            cancelButton.setAttribute('id', 'kt_file_manager_cancel_folder');

            // Append elements into row
            rowWrapper.append(folderIcon);
            rowWrapper.append(rowInput);
            rowWrapper.append(rowButton);
            rowWrapper.append(cancelButton);
            rowCol2.append(rowWrapper);
            rowElement.append(rowCol1);
            rowElement.append(rowCol2);
            rowElement.append(rowCol3);
            rowElement.append(rowCol4);
            rowElement.append(rowCol5);

            // Add new blank row to datatable
            const tableBody = table.querySelector('tbody');
            tableBody.prepend(rowElement);

            // Define validator
            // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
            var validator = FormValidation.formValidation(
                rowCol2,
                {
                    fields: {
                        'new_folder_name': {
                            validators: {
                                notEmpty: {
                                    message: 'Folder name is required'
                                }
                            }
                        },
                    },
                    plugins: {
                        trigger: new FormValidation.plugins.Trigger(),
                        bootstrap: new FormValidation.plugins.Bootstrap5({
                            rowSelector: '.fv-row',
                            eleInvalidClass: '',
                            eleValidClass: ''
                        })
                    }
                }
            );

            // Handle add new folder button
            rowButton.addEventListener('click', e => {
                e.preventDefault();

                // Activate indicator
                rowButton.setAttribute("data-kt-indicator", "on");

                // Validate form before submit
                if (validator) {
                    validator.validate().then(function (status) {
                        console.log('validated!');

                        if (status == 'Valid') {
                            // Simulate process for demo only
                            setTimeout(function () {
                                // Duplicate checkbox and action dropdown
                                const action = `<div class="d-flex justify-content-end">                            
                                    <!--begin::Share link-->
                                    <div class="ms-2" data-kt-filemanger-table="copy_link">
                                        <button type="button" class="btn btn-sm btn-icon btn-light btn-active-light-primary" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                                            <span class="svg-icon svg-icon-5 m-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path opacity="0.3" d="M18.4 5.59998C18.7766 5.9772 18.9881 6.48846 18.9881 7.02148C18.9881 7.55451 18.7766 8.06577 18.4 8.44299L14.843 12C14.466 12.377 13.9547 12.5887 13.4215 12.5887C12.8883 12.5887 12.377 12.377 12 12C11.623 11.623 11.4112 11.1117 11.4112 10.5785C11.4112 10.0453 11.623 9.53399 12 9.15698L15.553 5.604C15.9302 5.22741 16.4415 5.01587 16.9745 5.01587C17.5075 5.01587 18.0188 5.22741 18.396 5.604L18.4 5.59998ZM20.528 3.47205C20.0614 3.00535 19.5074 2.63503 18.8977 2.38245C18.288 2.12987 17.6344 1.99988 16.9745 1.99988C16.3145 1.99988 15.661 2.12987 15.0513 2.38245C14.4416 2.63503 13.8876 3.00535 13.421 3.47205L9.86801 7.02502C9.40136 7.49168 9.03118 8.04568 8.77863 8.6554C8.52608 9.26511 8.39609 9.91855 8.39609 10.5785C8.39609 11.2384 8.52608 11.8919 8.77863 12.5016C9.03118 13.1113 9.40136 13.6653 9.86801 14.132C10.3347 14.5986 10.8886 14.9688 11.4984 15.2213C12.1081 15.4739 12.7616 15.6039 13.4215 15.6039C14.0815 15.6039 14.7349 15.4739 15.3446 15.2213C15.9543 14.9688 16.5084 14.5986 16.975 14.132L20.528 10.579C20.9947 10.1124 21.3649 9.55844 21.6175 8.94873C21.8701 8.33902 22.0001 7.68547 22.0001 7.02551C22.0001 6.36555 21.8701 5.71201 21.6175 5.10229C21.3649 4.49258 20.9947 3.93867 20.528 3.47205Z" fill="black"></path>
                                                    <path d="M14.132 9.86804C13.6421 9.37931 13.0561 8.99749 12.411 8.74695L12 9.15698C11.6234 9.53421 11.4119 10.0455 11.4119 10.5785C11.4119 11.1115 11.6234 11.6228 12 12C12.3766 12.3772 12.5881 12.8885 12.5881 13.4215C12.5881 13.9545 12.3766 14.4658 12 14.843L8.44699 18.396C8.06999 18.773 7.55868 18.9849 7.02551 18.9849C6.49235 18.9849 5.98101 18.773 5.604 18.396C5.227 18.019 5.0152 17.5077 5.0152 16.9745C5.0152 16.4413 5.227 15.93 5.604 15.553L8.74701 12.411C8.28705 11.233 8.28705 9.92498 8.74701 8.74695C8.10159 8.99737 7.5152 9.37919 7.02499 9.86804L3.47198 13.421C2.52954 14.3635 2.00009 15.6417 2.00009 16.9745C2.00009 18.3073 2.52957 19.5855 3.47202 20.528C4.41446 21.4704 5.69269 21.9999 7.02551 21.9999C8.35833 21.9999 9.63656 21.4704 10.579 20.528L14.132 16.975C14.5987 16.5084 14.9689 15.9544 15.2215 15.3447C15.4741 14.735 15.6041 14.0815 15.6041 13.4215C15.6041 12.7615 15.4741 12.108 15.2215 11.4983C14.9689 10.8886 14.5987 10.3347 14.132 9.86804Z" fill="black"></path>
                                                </svg>
                                            </span>
                                        </button>
                                        <!--begin::Menu-->
                                        <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-300px" data-kt-menu="true">
                                            <!--begin::Card-->
                                            <div class="card card-flush">
                                                <div class="card-body p-5">
                                                    <!--begin::Loader-->
                                                    <div class="d-flex" data-kt-filemanger-table="copy_link_generator">
                                                        <!--begin::Spinner-->
                                                        <div class="me-5" data-kt-indicator="on">
                                                            <span class="indicator-progress">
                                                                <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                                                            </span>
                                                        </div>
                                                        <!--end::Spinner-->

                                                        <!--begin::Label-->
                                                        <div class="fs-6 text-dark">Generating Share Link...</div>
                                                        <!--end::Label-->
                                                    </div>
                                                    <!--end::Loader-->

                                                    <!--begin::Link-->
                                                    <div class="d-flex flex-column text-start d-none" data-kt-filemanger-table="copy_link_result">
                                                        <div class="d-flex mb-5">
                                                            <?php echo Theme::getSvgIcon('icons/duotune/arrows/arr084.svg', "svg-icon-1 svg-icon-success me-3") ?>
                                                            <div class="fs-6 text-dark">Share Link Generated</div>
                                                        </div>
                                                        <input type="text" class="form-control form-control-sm" value="https://path/to/file/or/folder/" />
                                                        <div class="text-muted fw-normal fs-8 px-3">Read only. <a href="<?php echo Theme::getPageUrl('apps/file-manager/settings/') ?>">Change permissions</a></div>
                                                    </div>
                                                    <!--end::Link-->
                                                </div>
                                            </div>
                                            <!--end::Card-->
                                        </div>
                                        <!--end::Menu-->
                                        <!--end::Share link-->
                                    </div>
                            
                                    <!--begin::More-->
                                    <div class="ms-2">
                                        <button type="button" class="btn btn-sm btn-icon btn-light btn-active-light-primary" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                                            <span class="svg-icon svg-icon-5 m-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <rect x="10" y="10" width="4" height="4" rx="2" fill="black"></rect>
                                                    <rect x="17" y="10" width="4" height="4" rx="2" fill="black"></rect>
                                                    <rect x="3" y="10" width="4" height="4" rx="2" fill="black"></rect>
                                                </svg>
                                            </span>
                                        </button>
                                        <!--begin::Menu-->
                                        <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-150px py-4" data-kt-menu="true">
                                            <!--begin::Menu item-->
                                            <div class="menu-item px-3">
                                                <a href="<?php echo Theme::getPageUrl('apps/file-manager/files') ?>" class="menu-link px-3">
                                                    View
                                                </a>
                                            </div>
                                            <!--end::Menu item-->

                                            <!--begin::Menu item-->
                                            <div class="menu-item px-3">
                                                <a href="#" class="menu-link px-3" data-kt-filemanager-table="rename">
                                                    Rename
                                                </a>
                                            </div>
                                            <!--end::Menu item-->

                                            <!--begin::Menu item-->
                                            <div class="menu-item px-3">
                                                <a href="#" class="menu-link px-3">
                                                    Download Folder
                                                </a>
                                            </div>
                                            <!--end::Menu item-->

                                            <!--begin::Menu item-->
                                            <div class="menu-item px-3">
                                                <a href="#" class="menu-link px-3" data-kt-filemanager-table-filter="move_row" data-bs-toggle="modal" data-bs-target="#kt_modal_move_to_folder">
                                                    Move to folder
                                                </a>
                                            </div>
                                            <!--end::Menu item-->

                                            <!--begin::Menu item-->
                                            <div class="menu-item px-3">
                                                <a href="#" class="menu-link text-danger px-3" data-kt-filemanager-table-filter="delete_row">
                                                    Delete
                                                </a>
                                            </div>
                                            <!--end::Menu item-->
                                        </div>
                                        <!--end::Menu-->
                                        <!--end::More-->
                                    </div>
                                </div>`;
                                const checkbox = `<div class="form-check form-check-sm form-check-custom form-check-solid"><input class="form-check-input" type="checkbox" value="1" /></div>`;

                                // Create folder link
                                const folderLink = document.createElement('a');
                                const folderLinkClasses = ['text-gray-800', 'text-hover-primary'];
                                folderLink.setAttribute('href', '?page=apps/file-manager/blank');
                                folderLink.classList.add(...folderLinkClasses);
                                folderLink.innerText = rowInput.value;

                                const newRow = datatable.row.add({
                                    'checkbox': checkbox,
                                    'name': folderIcon.outerHTML + folderLink.outerHTML,
                                    "size": '-',
                                    "date": '-',
                                    'action': action
                                }).node();
                                $(newRow).find('td').eq(4).attr('data-kt-filemanager-table', 'action_dropdown');
                                $(newRow).find('td').eq(4).addClass('text-end'); // Add custom class to last 'td' element --- more info: https://datatables.net/forums/discussion/22341/row-add-cell-class

                                // Re-sort datatable to allow new folder added at the top
                                var index = datatable.row(0).index(),
                                    rowCount = datatable.data().length - 1,
                                    insertedRow = datatable.row(rowCount).data(),
                                    tempRow;

                                for (var i = rowCount; i > index; i--) {
                                    tempRow = datatable.row(i - 1).data();
                                    datatable.row(i).data(tempRow);
                                    datatable.row(i - 1).data(insertedRow);
                                }

                                toastr.options = {
                                    "closeButton": true,
                                    "debug": false,
                                    "newestOnTop": false,
                                    "progressBar": false,
                                    "positionClass": "toast-top-right",
                                    "preventDuplicates": false,
                                    "showDuration": "300",
                                    "hideDuration": "1000",
                                    "timeOut": "5000",
                                    "extendedTimeOut": "1000",
                                    "showEasing": "swing",
                                    "hideEasing": "linear",
                                    "showMethod": "fadeIn",
                                    "hideMethod": "fadeOut"
                                };

                                toastr.success(rowInput.value + ' was created!');

                                // Disable indicator
                                rowButton.removeAttribute("data-kt-indicator");

                                datatable.draw(false);

                            }, 2000);
                        } else {
                            // Disable indicator
                            rowButton.removeAttribute("data-kt-indicator");
                        }
                    });
                }
            });

            // Handle cancel new folder button
            cancelButton.addEventListener('click', e => {
                e.preventDefault();

                // Activate indicator
                cancelButton.setAttribute("data-kt-indicator", "on");

                setTimeout(function(){
                    // Disable indicator
                    cancelButton.removeAttribute("data-kt-indicator");

                    // Toggle toastr
                    toastr.options = {
                        "closeButton": true,
                        "debug": false,
                        "newestOnTop": false,
                        "progressBar": false,
                        "positionClass": "toast-top-right",
                        "preventDuplicates": false,
                        "showDuration": "300",
                        "hideDuration": "1000",
                        "timeOut": "5000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    };

                    toastr.error('Cancelled new folder creation');
                    resetNewFolder();
                },1000);
            });
        });
    }

    // Reset add new folder input
    const resetNewFolder = () => {
        const newFolderRow = table.querySelector('#kt_file_manager_new_folder_row');

        if (newFolderRow) {
            newFolderRow.parentNode.removeChild(newFolderRow);
        }
    }

    // Handle rename file or folder
    const handleRename = () => {
        const renameButton = table.querySelectorAll('[data-kt-filemanager-table="rename"]');
        let nameValue;

        renameButton.forEach(button => {
            button.addEventListener('click', e => {
                e.preventDefault();

                // Select parent row
                const parent = e.target.closest('tr');

                // Get name column
                const nameCol = parent.querySelectorAll('td')[1];
                const colIcon = nameCol.querySelector('.svg-icon');
                nameValue = nameCol.innerText;

                // Set rename input template
                const renameInput = `<div class="fv-row"><div class="d-flex align-items-center">
                    ${colIcon.outerHTML}
                    <input type="text" id="kt_file_manager_rename_input" name="rename_folder_name" placeholder="Enter the new folder name" class="form-control mw-250px me-3" value="${nameValue}" />
                    <button class="btn btn-icon btn-light-primary me-3" id="kt_file_manager_rename_folder">
                        <span class="svg-icon svg-icon-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9.89557 13.4982L7.79487 11.2651C7.26967 10.7068 6.38251 10.7068 5.85731 11.2651C5.37559 11.7772 5.37559 12.5757 5.85731 13.0878L9.74989 17.2257C10.1448 17.6455 10.8118 17.6455 11.2066 17.2257L18.1427 9.85252C18.6244 9.34044 18.6244 8.54191 18.1427 8.02984C17.6175 7.47154 16.7303 7.47154 16.2051 8.02984L11.061 13.4982C10.7451 13.834 10.2115 13.834 9.89557 13.4982Z" fill="black"/>
                            </svg>
                        </span>
                    </button>
                    <button class="btn btn-icon btn-light-danger" id="kt_file_manager_rename_folder_cancel">
                        <span class="indicator-label">
                            <span class="svg-icon svg-icon-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <rect opacity="0.5" x="7.05025" y="15.5356" width="12" height="2" rx="1" transform="rotate(-45 7.05025 15.5356)" fill="black"/>
                                    <rect x="8.46447" y="7.05029" width="12" height="2" rx="1" transform="rotate(45 8.46447 7.05029)" fill="black"/>
                                </svg>
                            </span>
                        </span>
                        <span class="indicator-progress"><span class="spinner-border spinner-border-sm align-middle"></span></span>
                    </button>
                </div></div>`;

                // Swap current column content with input template
                nameCol.innerHTML = renameInput;

                // Rename file / folder validator
                var renameValidator = FormValidation.formValidation(
                    nameCol,
                    {
                        fields: {
                            'rename_folder_name': {
                                validators: {
                                    notEmpty: {
                                        message: 'Name is required'
                                    }
                                }
                            },
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            bootstrap: new FormValidation.plugins.Bootstrap5({
                                rowSelector: '.fv-row',
                                eleInvalidClass: '',
                                eleValidClass: ''
                            })
                        }
                    }
                );

                // Rename input button action
                const renameInputButton = document.querySelector('#kt_file_manager_rename_folder');
                renameInputButton.addEventListener('click', e => {
                    e.preventDefault();

                    // Detect if valid
                    if (renameValidator) {
                        renameValidator.validate().then(function (status) {
                            console.log('validated!');

                            if (status == 'Valid') {
                                // Pop up confirmation
                                Swal.fire({
                                    text: "Are you sure you want to rename " + nameValue + "?",
                                    icon: "warning",
                                    showCancelButton: true,
                                    buttonsStyling: false,
                                    confirmButtonText: "Yes, rename it!",
                                    cancelButtonText: "No, cancel",
                                    customClass: {
                                        confirmButton: "btn fw-bold btn-danger",
                                        cancelButton: "btn fw-bold btn-active-light-primary"
                                    }
                                }).then(function (result) {
                                    if (result.value) {
                                        Swal.fire({
                                            text: "You have renamed " + nameValue + "!.",
                                            icon: "success",
                                            buttonsStyling: false,
                                            confirmButtonText: "Ok, got it!",
                                            customClass: {
                                                confirmButton: "btn fw-bold btn-primary",
                                            }
                                        }).then(function () {
                                            // Get new file / folder name value
                                            const newValue = document.querySelector('#kt_file_manager_rename_input').value;

                                            // New column data template
                                            const newData = `<div class="d-flex align-items-center">
                                                ${colIcon.outerHTML}
                                                <a href="?page=apps/file-manager/files/" class="text-gray-800 text-hover-primary">${newValue}</a>
                                            </div>`;

                                            // Draw datatable with new content -- Add more events here for any server-side events
                                            datatable.cell($(nameCol)).data(newData).draw();
                                        });
                                    } else if (result.dismiss === 'cancel') {
                                        Swal.fire({
                                            text: nameValue + " was not renamed.",
                                            icon: "error",
                                            buttonsStyling: false,
                                            confirmButtonText: "Ok, got it!",
                                            customClass: {
                                                confirmButton: "btn fw-bold btn-primary",
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });

                // Cancel rename input
                const cancelInputButton = document.querySelector('#kt_file_manager_rename_folder_cancel');
                cancelInputButton.addEventListener('click', e => {
                    e.preventDefault();

                    // Simulate process for demo only
                    cancelInputButton.setAttribute("data-kt-indicator", "on");

                    setTimeout(function () {
                        const revertTemplate = `<div class="d-flex align-items-center">
                            ${colIcon.outerHTML}
                            <a href="?page=apps/file-manager/files/" class="text-gray-800 text-hover-primary">${nameValue}</a>
                        </div>`;

                        // Remove spinner
                        cancelInputButton.removeAttribute("data-kt-indicator");

                        // Draw datatable with new content -- Add more events here for any server-side events
                        datatable.cell($(nameCol)).data(revertTemplate).draw();
                    }, 1000);
                });
            });
        });
    }

    // Init dropzone
    const initDropzone = () => {
        // set the dropzone container id
        const id = "#kt_modal_upload_dropzone";
        const dropzone = document.querySelector(id);

        // set the preview element template
        var previewNode = dropzone.querySelector(".dropzone-item");
        previewNode.id = "";
        var previewTemplate = previewNode.parentNode.innerHTML;
        previewNode.parentNode.removeChild(previewNode);

        var myDropzone = new Dropzone(id, { // Make the whole body a dropzone
            url: "path/to/your/server", // Set the url for your upload script location
            parallelUploads: 10,
            previewTemplate: previewTemplate,
            maxFilesize: 1, // Max filesize in MB
            autoProcessQueue: false, // Stop auto upload
            autoQueue: false, // Make sure the files aren't queued until manually added
            previewsContainer: id + " .dropzone-items", // Define the container to display the previews
            clickable: id + " .dropzone-select" // Define the element that should be used as click trigger to select files.
        });

        myDropzone.on("addedfile", function (file) {
            // Hook each start button
            file.previewElement.querySelector(id + " .dropzone-start").onclick = function () {
                // myDropzone.enqueueFile(file); -- default dropzone function

                // Process simulation for demo only
                const progressBar = file.previewElement.querySelector('.progress-bar');
                progressBar.style.opacity = "1";
                var width = 1;
                var timer = setInterval(function () {
                    if (width >= 100) {
                        myDropzone.emit("success", file);
                        myDropzone.emit("complete", file);
                        clearInterval(timer);
                    } else {
                        width++;
                        progressBar.style.width = width + '%';
                    }
                }, 20);
            };

            const dropzoneItems = dropzone.querySelectorAll('.dropzone-item');
            dropzoneItems.forEach(dropzoneItem => {
                dropzoneItem.style.display = '';
            });
            dropzone.querySelector('.dropzone-upload').style.display = "inline-block";
            dropzone.querySelector('.dropzone-remove-all').style.display = "inline-block";
        });

        // Hide the total progress bar when nothing's uploading anymore
        myDropzone.on("complete", function (file) {
            const progressBars = dropzone.querySelectorAll('.dz-complete');
            setTimeout(function () {
                progressBars.forEach(progressBar => {
                    progressBar.querySelector('.progress-bar').style.opacity = "0";
                    progressBar.querySelector('.progress').style.opacity = "0";
                    progressBar.querySelector('.dropzone-start').style.opacity = "0";
                });
            }, 300);
        });

        // Setup the buttons for all transfers
        dropzone.querySelector(".dropzone-upload").addEventListener('click', function () {
            // myDropzone.processQueue(); --- default dropzone process

            // Process simulation for demo only
            myDropzone.files.forEach(file => {
                const progressBar = file.previewElement.querySelector('.progress-bar');
                progressBar.style.opacity = "1";
                var width = 1;
                var timer = setInterval(function () {
                    if (width >= 100) {
                        myDropzone.emit("success", file);
                        myDropzone.emit("complete", file);
                        clearInterval(timer);
                    } else {
                        width++;
                        progressBar.style.width = width + '%';
                    }
                }, 20);
            });
        });

        // Setup the button for remove all files
        dropzone.querySelector(".dropzone-remove-all").addEventListener('click', function () {
            Swal.fire({
                text: "Are you sure you would like to remove all files?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, remove it!",
                cancelButtonText: "No, return",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    dropzone.querySelector('.dropzone-upload').style.display = "none";
                    dropzone.querySelector('.dropzone-remove-all').style.display = "none";
                    myDropzone.removeAllFiles(true);
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "Your files was not removed!.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            });
        });

        // On all files completed upload
        myDropzone.on("queuecomplete", function (progress) {
            const uploadIcons = dropzone.querySelectorAll('.dropzone-upload');
            uploadIcons.forEach(uploadIcon => {
                uploadIcon.style.display = "none";
            });
        });

        // On all files removed
        myDropzone.on("removedfile", function (file) {
            if (myDropzone.files.length < 1) {
                dropzone.querySelector('.dropzone-upload').style.display = "none";
                dropzone.querySelector('.dropzone-remove-all').style.display = "none";
            }
        });
    }

    // Init copy link
    const initCopyLink = () => {
        // Select all copy link elements
        const elements = table.querySelectorAll('[data-kt-filemanger-table="copy_link"]');

        elements.forEach(el => {
            // Define elements
            const button = el.querySelector('button');
            const generator = el.querySelector('[data-kt-filemanger-table="copy_link_generator"]');
            const result = el.querySelector('[data-kt-filemanger-table="copy_link_result"]');
            const input = el.querySelector('input');

            // Click action
            button.addEventListener('click', e => {
                e.preventDefault();

                // Reset toggle
                generator.classList.remove('d-none');
                result.classList.add('d-none');

                var linkTimeout;
                clearTimeout(linkTimeout);
                linkTimeout = setTimeout(() => {
                    generator.classList.add('d-none');
                    result.classList.remove('d-none');
                    input.select();
                }, 2000);
            });
        });
    }

    // Handle move to folder
    const handleMoveToFolder = () => {
        const element = document.querySelector('#kt_modal_move_to_folder');
        const form = element.querySelector('#kt_modal_move_to_folder_form');
        const saveButton = form.querySelector('#kt_modal_move_to_folder_submit');
        const moveModal = new bootstrap.Modal(element);

        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        var validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    'move_to_folder': {
                        validators: {
                            notEmpty: {
                                message: 'Please select a folder.'
                            }
                        }
                    },
                },

                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
                    })
                }
            }
        );

        saveButton.addEventListener('click', e => {
            e.preventDefault();

            saveButton.setAttribute("data-kt-indicator", "on");

            if (validator) {
                validator.validate().then(function (status) {
                    console.log('validated!');

                    if (status == 'Valid') {
                        // Simulate process for demo only
                        setTimeout(function () {

                            Swal.fire({
                                text: "Are you sure you would like to move to this folder",
                                icon: "warning",
                                showCancelButton: true,
                                buttonsStyling: false,
                                confirmButtonText: "Yes, move it!",
                                cancelButtonText: "No, return",
                                customClass: {
                                    confirmButton: "btn btn-primary",
                                    cancelButton: "btn btn-active-light"
                                }
                            }).then(function (result) {
                                if (result.isConfirmed) {
                                    form.reset(); // Reset form	
                                    moveModal.hide(); // Hide modal			

                                    toastr.options = {
                                        "closeButton": true,
                                        "debug": false,
                                        "newestOnTop": false,
                                        "progressBar": false,
                                        "positionClass": "toast-top-right",
                                        "preventDuplicates": false,
                                        "showDuration": "300",
                                        "hideDuration": "1000",
                                        "timeOut": "5000",
                                        "extendedTimeOut": "1000",
                                        "showEasing": "swing",
                                        "hideEasing": "linear",
                                        "showMethod": "fadeIn",
                                        "hideMethod": "fadeOut"
                                    };

                                    toastr.success('1 item has been moved.');

                                    saveButton.removeAttribute("data-kt-indicator");
                                } else {
                                    Swal.fire({
                                        text: "Your action has been cancelled!.",
                                        icon: "error",
                                        buttonsStyling: false,
                                        confirmButtonText: "Ok, got it!",
                                        customClass: {
                                            confirmButton: "btn btn-primary",
                                        }
                                    });

                                    saveButton.removeAttribute("data-kt-indicator");
                                }
                            });
                        }, 500);
                    } else {
                        saveButton.removeAttribute("data-kt-indicator");
                    }
                });
            }
        });
    }

    // Count total number of items
    const countTotalItems = () => {
        const counter = document.getElementById('kt_file_manager_items_counter');

        // Count total number of elements in datatable --- more info: https://datatables.net/reference/api/count()
        counter.innerText = datatable.rows().count() + ' items'; 
    }

    // Public methods
    return {
        init: function () {
            table = document.querySelector('#kt_file_manager_list');

            if (!table) {
                return;
            }

            initDatatable();
            initToggleToolbar();
            handleSearchDatatable();
            handleDeleteRows();
            handleNewFolder();
            initDropzone();
            initCopyLink();
            handleRename();
            handleMoveToFolder();
            countTotalItems();
            KTMenu.createInstances();
        }
    }
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTFileManagerList.init();
});
/******/ })()
;
//# sourceMappingURL=list.js.map