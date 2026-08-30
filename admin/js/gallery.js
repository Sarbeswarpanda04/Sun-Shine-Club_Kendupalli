/* =========================================================
   SUN SHINE CLUB
   ADMIN GALLERY
   File: admin/js/gallery.js

   Cloudflare R2 Media Manager
========================================================= */

import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


/* =========================================================
   CONFIGURATION
========================================================= */

const WORKER_URL =
    "https://sunshineclub-media-api.still-mouse-2d92.workers.dev";

const PUBLIC_R2_BASE_URL =
    "https://pub-0ea4b0b9de9b4d6db5c369669418e7ef.r2.dev";


/* =========================================================
   STATE
========================================================= */

let currentUser = null;

let currentPrefix = "";

let currentObjects = [];

let currentFolders = [];

let selectedFiles = [];

let selectedPreviewObject = null;

let selectedDeleteObject = null;

let currentView = "grid";

let searchTerm = "";

let fileTypeFilter = "all";

let sortMode = "name";

let toastTimer = null;


/* =========================================================
   DOM
========================================================= */

const loadingEl =
    document.getElementById("galleryLoading");

const errorEl =
    document.getElementById("galleryError");

const errorMessageEl =
    document.getElementById("galleryErrorMessage");

const emptyEl =
    document.getElementById("galleryEmpty");

const foldersSection =
    document.getElementById("galleryFolders");

const folderGrid =
    document.getElementById("folderGrid");

const filesSection =
    document.getElementById("galleryFiles");

const mediaGrid =
    document.getElementById("mediaGrid");

const breadcrumbEl =
    document.getElementById("galleryBreadcrumb");

const totalFilesEl =
    document.getElementById("totalFiles");

const totalFoldersEl =
    document.getElementById("totalFolders");

const totalImagesEl =
    document.getElementById("totalImages");

const totalStorageEl =
    document.getElementById("totalStorage");

const folderCountEl =
    document.getElementById("folderCount");

const fileResultCountEl =
    document.getElementById("fileResultCount");

const searchEl =
    document.getElementById("gallerySearch");

const fileTypeEl =
    document.getElementById("fileTypeFilter");

const sortEl =
    document.getElementById("sortFiles");

const gridViewBtn =
    document.getElementById("gridViewBtn");

const listViewBtn =
    document.getElementById("listViewBtn");

const refreshBtn =
    document.getElementById("refreshGalleryBtn");

const uploadBtn =
    document.getElementById("uploadBtn");

const createFolderBtn =
    document.getElementById("createFolderBtn");

const retryBtn =
    document.getElementById("retryGalleryBtn");


/* =========================================================
   MODALS
========================================================= */

const uploadModal =
    document.getElementById("uploadModal");

const folderModal =
    document.getElementById("folderModal");

const previewModal =
    document.getElementById("previewModal");

const deleteModal =
    document.getElementById("deleteModal");


/* =========================================================
   UPLOAD
========================================================= */

const fileInput =
    document.getElementById("fileInput");

const uploadDropzone =
    document.getElementById("uploadDropzone");

const selectedFilesEl =
    document.getElementById("selectedFiles");

const startUploadBtn =
    document.getElementById("startUploadBtn");

const uploadFolderLabel =
    document.getElementById("uploadFolderLabel");


/* =========================================================
   FOLDER
========================================================= */

const folderNameInput =
    document.getElementById("folderName");

const folderParentPrefix =
    document.getElementById("folderParentPrefix");

const confirmFolderBtn =
    document.getElementById("confirmFolderBtn");


/* =========================================================
   PREVIEW
========================================================= */

const previewContent =
    document.getElementById("previewContent");

const previewName =
    document.getElementById("previewName");

const previewDetails =
    document.getElementById("previewDetails");

const copyUrlBtn =
    document.getElementById("copyUrlBtn");

const openUrlBtn =
    document.getElementById("openUrlBtn");

const previewDeleteBtn =
    document.getElementById("previewDeleteBtn");


/* =========================================================
   DELETE
========================================================= */

const deleteFileName =
    document.getElementById("deleteFileName");

const confirmDeleteBtn =
    document.getElementById("confirmDeleteBtn");


/* =========================================================
   TOAST
========================================================= */

const toastEl =
    document.getElementById("galleryToast");

const toastMessageEl =
    document.getElementById("toastMessage");

const toastIconEl =
    document.getElementById("toastIcon");


/* =========================================================
   STATE CSS SAFETY
========================================================= */

/*
    This prevents existing gallery.css rules from forcing
    hidden elements to display.

    This is important for your current problem where:
    
        Loading
        Unable to load media
        No media found

    were appearing together with the actual images.
*/

const galleryStateStyle =
    document.createElement("style");

galleryStateStyle.textContent = `

    #galleryLoading[hidden],
    #galleryError[hidden],
    #galleryEmpty[hidden],
    #galleryFolders[hidden],
    #galleryFiles[hidden] {
        display: none !important;
    }

`;

document.head.appendChild(
    galleryStateStyle
);


/* =========================================================
   AUTHENTICATION
========================================================= */

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            currentUser = null;

            window.location.href =
                "index.html";

            return;
        }


        currentUser = user;


        try {

            await loadCurrentFolder();

        } catch (error) {

            console.error(
                "Initial gallery load failed:",
                error
            );

            showError(
                error.message ||
                "Unable to load media."
            );

        }

    }
);


/* =========================================================
   FIREBASE AUTH HEADERS
========================================================= */

async function getAuthHeaders(
    json = false
) {

    if (!currentUser) {

        throw new Error(
            "Authentication required."
        );

    }


    const token =
        await currentUser.getIdToken();


    const headers = {

        Authorization:
            `Bearer ${token}`

    };


    if (json) {

        headers["Content-Type"] =
            "application/json";

    }


    return headers;

}


/* =========================================================
   API REQUEST
========================================================= */

async function apiRequest(
    url,
    options = {}
) {

    const isJson =
        options.body &&
        typeof options.body === "string";


    const headers =
        await getAuthHeaders(
            isJson
        );


    const response =
        await fetch(
            url,
            {
                ...options,

                headers: {
                    ...headers,
                    ...(options.headers || {})
                }
            }
        );


    let data = null;


    try {

        data =
            await response.json();

    } catch {

        data = null;

    }


    if (!response.ok) {

        throw new Error(
            data?.error ||
            data?.message ||
            `Request failed with HTTP ${response.status}`
        );

    }


    if (
        data &&
        data.success === false
    ) {

        throw new Error(
            data.error ||
            "API request failed."
        );

    }


    return data;

}


/* =========================================================
   GALLERY STATE
========================================================= */

function resetGalleryState() {

    [
        loadingEl,
        errorEl,
        emptyEl
    ].forEach(
        element => {

            if (!element) return;

            element.hidden = true;

            element.style.display =
                "none";

        }
    );


    [
        foldersSection,
        filesSection
    ].forEach(
        element => {

            if (!element) return;

            element.hidden = true;

            element.style.display =
                "none";

        }
    );

}


/* =========================================================
   SHOW LOADING
========================================================= */

function showLoading() {

    resetGalleryState();


    if (!loadingEl) return;


    loadingEl.hidden = false;

    loadingEl.style.display =
        "flex";

}


/* =========================================================
   HIDE LOADING
========================================================= */

function hideLoading() {

    if (!loadingEl) return;


    loadingEl.hidden = true;

    loadingEl.style.display =
        "none";

}


/* =========================================================
   SHOW ERROR
========================================================= */

function showError(
    message
) {

    hideLoading();


    if (emptyEl) {

        emptyEl.hidden = true;

        emptyEl.style.display =
            "none";

    }


    if (foldersSection) {

        foldersSection.hidden = true;

        foldersSection.style.display =
            "none";

    }


    if (filesSection) {

        filesSection.hidden = true;

        filesSection.style.display =
            "none";

    }


    if (errorMessageEl) {

        errorMessageEl.textContent =
            message ||
            "Unable to load media.";

    }


    if (errorEl) {

        errorEl.hidden = false;

        errorEl.style.display =
            "flex";

    }

}


/* =========================================================
   HIDE ERROR
========================================================= */

function hideError() {

    if (!errorEl) return;


    errorEl.hidden = true;

    errorEl.style.display =
        "none";

}


/* =========================================================
   SHOW EMPTY
========================================================= */

function showEmpty() {

    hideLoading();

    hideError();


    if (foldersSection) {

        foldersSection.hidden = true;

        foldersSection.style.display =
            "none";

    }


    if (filesSection) {

        filesSection.hidden = true;

        filesSection.style.display =
            "none";

    }


    if (emptyEl) {

        emptyEl.hidden = false;

        emptyEl.style.display =
            "flex";

    }

}


/* =========================================================
   HIDE EMPTY
========================================================= */

function hideEmpty() {

    if (!emptyEl) return;


    emptyEl.hidden = true;

    emptyEl.style.display =
        "none";

}


/* =========================================================
   LOAD CURRENT FOLDER
========================================================= */

async function loadCurrentFolder() {

    showLoading();


    try {

        if (!currentUser) {

            throw new Error(
                "Authentication required."
            );

        }


        const encodedPrefix =
            encodeURIComponent(
                currentPrefix
            );


        const url =
            `${WORKER_URL}/api/objects?prefix=${encodedPrefix}`;


        console.log(
            "[Gallery] Loading:",
            currentPrefix || "/"
        );


        const data =
            await apiRequest(
                url,
                {
                    method: "GET"
                }
            );


        console.log(
            "[Gallery] Response:",
            data
        );


        /*
            Worker response:

            {
                success: true,
                prefix: "...",
                objects: [],
                folders: [],
                count: 0
            }
        */

        currentObjects =
            Array.isArray(
                data?.objects
            )
                ? data.objects
                : [];


        currentFolders =
            Array.isArray(
                data?.folders
            )
                ? data.folders
                : [];


        /*
            Render successful response.
        */

        renderBreadcrumb();

        renderFolders();

        renderFiles();

        updateStats();


        /*
            IMPORTANT:

            renderFiles() no longer calls showEmpty().

            This function is the ONLY place that decides
            whether the whole gallery is empty.
        */

        const visibleFiles =
            getFilteredFiles();


        const hasFolders =
            currentFolders.length > 0;


        const hasFiles =
            visibleFiles.length > 0;


        hideLoading();

        hideError();

        hideEmpty();


        if (
            !hasFolders &&
            !hasFiles
        ) {

            showEmpty();

            return;

        }


        /*
            SUCCESS
        */

        if (
            hasFolders &&
            foldersSection
        ) {

            foldersSection.hidden =
                false;

            foldersSection.style.display =
                "";

        }


        if (
            hasFiles &&
            filesSection
        ) {

            filesSection.hidden =
                false;

            filesSection.style.display =
                "";

        }


        console.log(
            `[Gallery] ${currentFolders.length} folders, ${visibleFiles.length} files`
        );

    } catch (error) {

        console.error(
            "Unable to load gallery:",
            error
        );


        showError(
            error?.message ||
            "Unable to load media."
        );

    }

}


/* =========================================================
   BREADCRUMB
========================================================= */

function renderBreadcrumb() {

    if (!breadcrumbEl) return;


    breadcrumbEl.innerHTML = "";


    const rootButton =
        document.createElement(
            "button"
        );


    rootButton.type =
        "button";


    rootButton.className =
        "breadcrumb-item";


    if (!currentPrefix) {

        rootButton.classList.add(
            "active"
        );

    }


    rootButton.innerHTML = `
        <i class="fa-solid fa-house"></i>
        All Media
    `;


    rootButton.addEventListener(
        "click",
        () => {

            navigateTo("");

        }
    );


    breadcrumbEl.appendChild(
        rootButton
    );


    if (!currentPrefix) {

        return;

    }


    const cleanPrefix =
        currentPrefix
            .replace(
                /\/+$/,
                ""
            );


    const parts =
        cleanPrefix
            .split("/")
            .filter(Boolean);


    let accumulated = "";


    parts.forEach(
        (
            part,
            index
        ) => {

            accumulated +=
                `${part}/`;


            const separator =
                document.createElement(
                    "span"
                );


            separator.className =
                "breadcrumb-separator";


            separator.innerHTML = `
                <i class="fa-solid fa-chevron-right"></i>
            `;


            breadcrumbEl.appendChild(
                separator
            );


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "breadcrumb-item";


            if (
                index ===
                parts.length - 1
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.textContent =
                part;


            const target =
                accumulated;


            button.addEventListener(
                "click",
                () => {

                    navigateTo(
                        target
                    );

                }
            );


            breadcrumbEl.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   NAVIGATE
========================================================= */

function navigateTo(
    prefix
) {

    currentPrefix =
        normalizePrefix(
            prefix
        );


    searchTerm = "";


    if (searchEl) {

        searchEl.value =
            "";

    }


    loadCurrentFolder();

}


/* =========================================================
   NORMALIZE PREFIX
========================================================= */

function normalizePrefix(
    prefix
) {

    if (!prefix) {

        return "";

    }


    let value =
        String(prefix)
            .replace(
                /^\/+/,
                ""
            );


    if (
        !value.endsWith("/")
    ) {

        value += "/";

    }


    return value;

}


/* =========================================================
   FOLDER NAME
========================================================= */

function getFolderName(
    prefix
) {

    if (!prefix) {

        return "";

    }


    const clean =
        String(prefix)
            .replace(
                /\/+$/,
                ""
            );


    const parts =
        clean.split("/");


    return (
        parts[
        parts.length - 1
        ] || ""
    );

}


/* =========================================================
   RENDER FOLDERS
========================================================= */

function renderFolders() {

    if (
        !folderGrid ||
        !foldersSection
    ) {

        return;

    }


    folderGrid.innerHTML =
        "";


    if (folderCountEl) {

        folderCountEl.textContent =
            currentFolders.length;

    }


    if (
        currentFolders.length === 0
    ) {

        foldersSection.hidden =
            true;

        foldersSection.style.display =
            "none";

        return;

    }


    foldersSection.hidden =
        false;

    foldersSection.style.display =
        "";


    currentFolders.forEach(
        folder => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "folder-card";


            card.tabIndex =
                0;


            const name =
                folder.name ||
                getFolderName(
                    folder.prefix
                );


            const prefix =
                normalizePrefix(
                    folder.prefix
                );


            card.innerHTML = `

                <div class="folder-card-icon">
                    <i class="fa-solid fa-folder"></i>
                </div>

                <div class="folder-card-info">

                    <span class="folder-card-name">
                        ${escapeHtml(name)}
                    </span>

                    <span class="folder-card-path">
                        ${escapeHtml(prefix)}
                    </span>

                </div>

                <div class="folder-card-arrow">
                    <i class="fa-solid fa-chevron-right"></i>
                </div>

            `;


            const openFolder =
                () => {

                    navigateTo(
                        prefix
                    );

                };


            card.addEventListener(
                "click",
                openFolder
            );


            card.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter" ||
                        event.key ===
                        " "
                    ) {

                        event.preventDefault();

                        openFolder();

                    }

                }
            );


            folderGrid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   FILTER FILES
========================================================= */

function getFilteredFiles() {

    let files =
        [...currentObjects];


    files =
        files.filter(
            object => {

                const name =
                    getObjectName(
                        object
                    )
                        .toLowerCase();


                const matchesSearch =
                    !searchTerm ||
                    name.includes(
                        searchTerm
                    );


                const matchesType =
                    fileTypeFilter ===
                    "all" ||
                    getFileType(
                        object
                    ) ===
                    fileTypeFilter;


                return (
                    matchesSearch &&
                    matchesType
                );

            }
        );


    sortObjects(
        files
    );


    return files;

}


/* =========================================================
   RENDER FILES
========================================================= */

function renderFiles() {

    if (
        !mediaGrid ||
        !filesSection
    ) {

        return;

    }


    mediaGrid.innerHTML =
        "";


    const files =
        getFilteredFiles();


    if (fileResultCountEl) {

        fileResultCountEl.textContent =
            `${files.length} ${files.length === 1
                ? "file"
                : "files"
            }`;

    }


    /*
        IMPORTANT:

        DO NOT call showEmpty() here.

        The main loader owns the empty state.

        This prevents:

            24 images
            +
            No media found

        appearing together.
    */

    if (
        files.length === 0
    ) {

        filesSection.hidden =
            true;

        filesSection.style.display =
            "none";

        return;

    }


    filesSection.hidden =
        false;

    filesSection.style.display =
        "";


    files.forEach(
        object => {

            mediaGrid.appendChild(
                createMediaCard(
                    object
                )
            );

        }
    );


    applyView();

}


/* =========================================================
   SORT
========================================================= */

function sortObjects(
    files
) {

    files.sort(
        (
            a,
            b
        ) => {

            if (
                sortMode ===
                "newest"
            ) {

                return (
                    getModifiedTime(b) -
                    getModifiedTime(a)
                );

            }


            if (
                sortMode ===
                "oldest"
            ) {

                return (
                    getModifiedTime(a) -
                    getModifiedTime(b)
                );

            }


            if (
                sortMode ===
                "largest"
            ) {

                return (
                    getObjectSize(b) -
                    getObjectSize(a)
                );

            }


            if (
                sortMode ===
                "smallest"
            ) {

                return (
                    getObjectSize(a) -
                    getObjectSize(b)
                );

            }


            return getObjectName(a)
                .localeCompare(
                    getObjectName(b),
                    undefined,
                    {
                        numeric: true,
                        sensitivity:
                            "base"
                    }
                );

        }
    );

}


/* =========================================================
   MEDIA CARD
========================================================= */

function createMediaCard(
    object
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "media-card";


    const name =
        getObjectName(
            object
        );


    const size =
        getObjectSize(
            object
        );


    const type =
        getFileType(
            object
        );


    const url =
        getObjectUrl(
            object
        );


    const preview =
        document.createElement(
            "div"
        );


    preview.className =
        "media-preview";


    if (
        type === "image" &&
        url
    ) {

        const img =
            document.createElement(
                "img"
            );


        img.src =
            url;


        img.alt =
            name;


        img.loading =
            "lazy";


        img.onerror =
            () => {

                img.remove();

                preview.classList.add(
                    "no-preview"
                );


                const fallback =
                    document.createElement(
                        "div"
                    );


                fallback.className =
                    "media-type-icon";


                fallback.innerHTML =
                    `
                        <i class="fa-solid fa-image"></i>
                    `;


                preview.prepend(
                    fallback
                );

            };


        preview.appendChild(
            img
        );

    } else {

        preview.classList.add(
            "no-preview"
        );


        preview.innerHTML =
            `
                <div class="media-type-icon">
                    <i class="${getFileIcon(type)}"></i>
                </div>
            `;

    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "media-overlay";


    const previewBtn =
        document.createElement(
            "button"
        );


    previewBtn.type =
        "button";


    previewBtn.className =
        "media-overlay-btn";


    previewBtn.title =
        "Preview";


    previewBtn.innerHTML =
        `
            <i class="fa-solid fa-eye"></i>
        `;


    previewBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            openPreview(
                object
            );

        }
    );


    const deleteBtn =
        document.createElement(
            "button"
        );


    deleteBtn.type =
        "button";


    deleteBtn.className =
        "media-overlay-btn delete";


    deleteBtn.title =
        "Delete";


    deleteBtn.innerHTML =
        `
            <i class="fa-solid fa-trash"></i>
        `;


    deleteBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            openDeleteModal(
                object
            );

        }
    );


    overlay.appendChild(
        previewBtn
    );


    overlay.appendChild(
        deleteBtn
    );


    preview.appendChild(
        overlay
    );


    preview.addEventListener(
        "click",
        () => {

            openPreview(
                object
            );

        }
    );


    const info =
        document.createElement(
            "div"
        );


    info.className =
        "media-info";


    info.innerHTML =
        `
            <span
                class="media-name"
                title="${escapeHtml(name)}"
            >
                ${escapeHtml(name)}
            </span>

            <div class="media-meta">

                <span>
                    ${formatBytes(size)}
                </span>

                <span>
                    ${formatDate(
            getModifiedTime(
                object
            )
        )}
                </span>

            </div>
        `;


    card.appendChild(
        preview
    );


    card.appendChild(
        info
    );


    return card;

}


/* =========================================================
   OBJECT NAME
========================================================= */

function getObjectName(
    object
) {

    return (
        object?.name ||
        object?.key ||
        object?.path ||
        "Unnamed file"
    )
        .split("/")
        .pop();

}


/* =========================================================
   OBJECT KEY
========================================================= */

function getObjectKey(
    object
) {

    return (
        object?.key ||
        object?.name ||
        object?.path ||
        ""
    );

}


/* =========================================================
   OBJECT URL
========================================================= */

function getObjectUrl(
    object
) {

    if (
        object?.url
    ) {

        return object.url;

    }


    if (
        object?.publicUrl
    ) {

        return object.publicUrl;

    }


    if (
        object?.publicURL
    ) {

        return object.publicURL;

    }


    const key =
        getObjectKey(
            object
        );


    if (!key) {

        return "";

    }


    return (
        `${PUBLIC_R2_BASE_URL}/` +
        key
            .split("/")
            .map(
                encodeURIComponent
            )
            .join("/")
    );

}


/* =========================================================
   FILE TYPE
========================================================= */

function getFileType(
    object
) {

    const contentType =
        (
            object?.contentType ||
            object?.httpMetadata?.contentType ||
            ""
        )
            .toLowerCase();


    if (
        contentType.startsWith(
            "image/"
        )
    ) {

        return "image";

    }


    if (
        contentType.startsWith(
            "video/"
        )
    ) {

        return "video";

    }


    if (
        contentType.startsWith(
            "audio/"
        )
    ) {

        return "audio";

    }


    const name =
        getObjectName(
            object
        )
            .toLowerCase();


    if (
        /\.(jpg|jpeg|png|gif|webp|svg|bmp|avif|heic|heif)$/i
            .test(name)
    ) {

        return "image";

    }


    if (
        /\.(mp4|webm|mov|avi|mkv|m4v)$/i
            .test(name)
    ) {

        return "video";

    }


    if (
        /\.(mp3|wav|ogg|m4a|aac|flac)$/i
            .test(name)
    ) {

        return "audio";

    }


    if (
        /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv)$/i
            .test(name)
    ) {

        return "document";

    }


    return "other";

}


/* =========================================================
   FILE ICON
========================================================= */

function getFileIcon(
    type
) {

    switch (type) {

        case "image":
            return "fa-regular fa-image";

        case "video":
            return "fa-solid fa-film";

        case "audio":
            return "fa-solid fa-music";

        case "document":
            return "fa-regular fa-file-lines";

        default:
            return "fa-regular fa-file";

    }

}


/* =========================================================
   OBJECT SIZE
========================================================= */

function getObjectSize(
    object
) {

    return Number(
        object?.size ||
        object?.contentLength ||
        0
    );

}


/* =========================================================
   MODIFIED TIME
========================================================= */

function getModifiedTime(
    object
) {

    const value =
        object?.uploaded ||
        object?.modified ||
        object?.lastModified ||
        object?.updatedAt;


    if (!value) {

        return 0;

    }


    const time =
        new Date(
            value
        ).getTime();


    return Number.isNaN(
        time
    )
        ? 0
        : time;

}


/* =========================================================
   FORMAT BYTES
========================================================= */

function formatBytes(
    bytes
) {

    bytes =
        Number(bytes) || 0;


    if (
        bytes === 0
    ) {

        return "0 B";

    }


    const units = [
        "B",
        "KB",
        "MB",
        "GB",
        "TB"
    ];


    const index =
        Math.min(
            Math.floor(
                Math.log(bytes) /
                Math.log(1024)
            ),
            units.length - 1
        );


    return (
        `${(
            bytes /
            Math.pow(
                1024,
                index
            )
        ).toFixed(
            index === 0
                ? 0
                : 1
        )} ${units[index]}`
    );

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
    timestamp
) {

    if (!timestamp) {

        return "-";

    }


    const date =
        new Date(
            timestamp
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "-";

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   UPDATE STATS
========================================================= */

function updateStats() {

    const totalFiles =
        currentObjects.length;


    const totalFolders =
        currentFolders.length;


    const totalImages =
        currentObjects.filter(
            object =>
                getFileType(
                    object
                ) === "image"
        ).length;


    const totalStorage =
        currentObjects.reduce(
            (
                total,
                object
            ) => {

                return (
                    total +
                    getObjectSize(
                        object
                    )
                );

            },
            0
        );


    if (totalFilesEl) {

        totalFilesEl.textContent =
            totalFiles;

    }


    if (totalFoldersEl) {

        totalFoldersEl.textContent =
            totalFolders;

    }


    if (totalImagesEl) {

        totalImagesEl.textContent =
            totalImages;

    }


    if (totalStorageEl) {

        totalStorageEl.textContent =
            formatBytes(
                totalStorage
            );

    }

}


/* =========================================================
   SEARCH
========================================================= */

searchEl?.addEventListener(
    "input",
    event => {

        searchTerm =
            event.target.value
                .trim()
                .toLowerCase();


        renderFiles();

    }
);


/* =========================================================
   FILE TYPE FILTER
========================================================= */

fileTypeEl?.addEventListener(
    "change",
    event => {

        fileTypeFilter =
            event.target.value;


        renderFiles();

    }
);


/* =========================================================
   SORT
========================================================= */

sortEl?.addEventListener(
    "change",
    event => {

        sortMode =
            event.target.value;


        renderFiles();

    }
);


/* =========================================================
   GRID VIEW
========================================================= */

gridViewBtn?.addEventListener(
    "click",
    () => {

        currentView =
            "grid";


        applyView();

    }
);


/* =========================================================
   LIST VIEW
========================================================= */

listViewBtn?.addEventListener(
    "click",
    () => {

        currentView =
            "list";


        applyView();

    }
);


/* =========================================================
   APPLY VIEW
========================================================= */

function applyView() {

    if (!mediaGrid) return;


    if (
        currentView === "list"
    ) {

        mediaGrid.classList.add(
            "list-view"
        );


        listViewBtn?.classList.add(
            "active"
        );


        gridViewBtn?.classList.remove(
            "active"
        );

    } else {

        mediaGrid.classList.remove(
            "list-view"
        );


        gridViewBtn?.classList.add(
            "active"
        );


        listViewBtn?.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   REFRESH
========================================================= */

refreshBtn?.addEventListener(
    "click",
    async () => {

        await loadCurrentFolder();

    }
);


/* =========================================================
   RETRY
========================================================= */

retryBtn?.addEventListener(
    "click",
    async () => {

        await loadCurrentFolder();

    }
);


/* =========================================================
   UPLOAD MODAL
========================================================= */

uploadBtn?.addEventListener(
    "click",
    () => {

        updateUploadFolderLabel();


        openModal(
            uploadModal
        );

    }
);


/* =========================================================
   UPLOAD FOLDER LABEL
========================================================= */

function updateUploadFolderLabel() {

    if (!uploadFolderLabel) return;


    uploadFolderLabel.textContent =
        currentPrefix ||
        "All Media";

}


/* =========================================================
   FILE INPUT
========================================================= */

fileInput?.addEventListener(
    "change",
    event => {

        addSelectedFiles(
            event.target.files
        );


        fileInput.value =
            "";

    }
);


/* =========================================================
   DRAG OVER
========================================================= */

uploadDropzone?.addEventListener(
    "dragover",
    event => {

        event.preventDefault();


        uploadDropzone.classList.add(
            "dragging"
        );

    }
);


/* =========================================================
   DRAG LEAVE
========================================================= */

uploadDropzone?.addEventListener(
    "dragleave",
    () => {

        uploadDropzone.classList.remove(
            "dragging"
        );

    }
);


/* =========================================================
   DROP
========================================================= */

uploadDropzone?.addEventListener(
    "drop",
    event => {

        event.preventDefault();


        uploadDropzone.classList.remove(
            "dragging"
        );


        addSelectedFiles(
            event.dataTransfer.files
        );

    }
);


/* =========================================================
   ADD SELECTED FILES
========================================================= */

function addSelectedFiles(
    files
) {

    const incoming =
        Array.from(
            files || []
        );


    incoming.forEach(
        file => {

            if (
                file.size >
                25 * 1024 * 1024
            ) {

                showToast(
                    `${file.name} exceeds the 25 MB limit.`,
                    "error"
                );


                return;

            }


            const duplicate =
                selectedFiles.some(
                    existing =>
                        existing.name ===
                        file.name &&
                        existing.size ===
                        file.size &&
                        existing.lastModified ===
                        file.lastModified
                );


            if (!duplicate) {

                selectedFiles.push(
                    file
                );

            }

        }
    );


    renderSelectedFiles();

}


/* =========================================================
   RENDER SELECTED FILES
========================================================= */

function renderSelectedFiles() {

    if (!selectedFilesEl) return;


    selectedFilesEl.innerHTML =
        "";


    selectedFiles.forEach(
        (
            file,
            index
        ) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "selected-file";


            item.innerHTML =
                `
                    <div class="selected-file-icon">
                        <i class="${getFileIconFromName(file.name)}"></i>
                    </div>

                    <div class="selected-file-info">

                        <span
                            class="selected-file-name"
                            title="${escapeHtml(file.name)}"
                        >
                            ${escapeHtml(file.name)}
                        </span>

                        <span class="selected-file-size">
                            ${formatBytes(file.size)}
                        </span>

                    </div>

                    <button
                        type="button"
                        class="selected-file-remove"
                        title="Remove"
                    >
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                `;


            item
                .querySelector(
                    ".selected-file-remove"
                )
                ?.addEventListener(
                    "click",
                    () => {

                        selectedFiles.splice(
                            index,
                            1
                        );


                        renderSelectedFiles();

                    }
                );


            selectedFilesEl.appendChild(
                item
            );

        }
    );


    if (startUploadBtn) {

        startUploadBtn.disabled =
            selectedFiles.length === 0;

    }

}


/* =========================================================
   FILE ICON FROM NAME
========================================================= */

function getFileIconFromName(
    name
) {

    return getFileIcon(
        getFileType(
            {
                name
            }
        )
    );

}


/* =========================================================
   START UPLOAD
========================================================= */

startUploadBtn?.addEventListener(
    "click",
    async () => {

        if (
            selectedFiles.length === 0
        ) {

            return;

        }


        startUploadBtn.disabled =
            true;


        const originalText =
            startUploadBtn.innerHTML;


        startUploadBtn.innerHTML =
            `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Uploading...
            `;


        try {

            for (
                const file of selectedFiles
            ) {

                await uploadFile(
                    file
                );

            }


            selectedFiles = [];


            renderSelectedFiles();


            closeModal(
                uploadModal
            );


            showToast(
                "Files uploaded successfully.",
                "success"
            );


            await loadCurrentFolder();


        } catch (error) {

            console.error(
                "Upload failed:",
                error
            );


            showToast(
                error.message ||
                "Upload failed.",
                "error"
            );

        } finally {

            startUploadBtn.disabled =
                selectedFiles.length === 0;


            startUploadBtn.innerHTML =
                originalText;

        }

    }
);


/* =========================================================
   UPLOAD FILE
========================================================= */

async function uploadFile(
    file
) {

    if (!currentUser) {

        throw new Error(
            "Authentication required."
        );

    }


    const token =
        await currentUser.getIdToken();


    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    formData.append(
        "prefix",
        currentPrefix
    );


    formData.append(
        "filename",
        file.name
    );


    const response =
        await fetch(
            `${WORKER_URL}/api/upload`,
            {
                method: "POST",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    formData
            }
        );


    let data = null;


    try {

        data =
            await response.json();

    } catch {

        data = null;

    }


    if (!response.ok) {

        throw new Error(
            data?.error ||
            `Upload failed: HTTP ${response.status}`
        );

    }


    if (
        data?.success === false
    ) {

        throw new Error(
            data.error ||
            "Upload failed."
        );

    }


    return data;

}


/* =========================================================
   CREATE FOLDER MODAL
========================================================= */

createFolderBtn?.addEventListener(
    "click",
    () => {

        if (folderNameInput) {

            folderNameInput.value =
                "";

        }


        if (folderParentPrefix) {

            folderParentPrefix.textContent =
                currentPrefix ||
                "/";

        }


        openModal(
            folderModal
        );


        setTimeout(
            () => {

                folderNameInput?.focus();

            },
            100
        );

    }
);


/* =========================================================
   CREATE FOLDER
========================================================= */

confirmFolderBtn?.addEventListener(
    "click",
    async () => {

        const name =
            folderNameInput?.value
                .trim();


        if (!name) {

            showToast(
                "Enter a folder name.",
                "error"
            );


            folderNameInput?.focus();


            return;

        }


        if (
            !/^[a-zA-Z0-9 _-]+$/.test(
                name
            )
        ) {

            showToast(
                "Use only letters, numbers, spaces, hyphens or underscores.",
                "error"
            );


            return;

        }


        confirmFolderBtn.disabled =
            true;


        const originalText =
            confirmFolderBtn.innerHTML;


        confirmFolderBtn.innerHTML =
            `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Creating...
            `;


        try {

            await createFolder(
                name
            );


            closeModal(
                folderModal
            );


            showToast(
                "Folder created successfully.",
                "success"
            );


            await loadCurrentFolder();


        } catch (error) {

            console.error(
                "Folder creation failed:",
                error
            );


            showToast(
                error.message ||
                "Unable to create folder.",
                "error"
            );

        } finally {

            confirmFolderBtn.disabled =
                false;


            confirmFolderBtn.innerHTML =
                originalText;

        }

    }
);


/* =========================================================
   CREATE FOLDER API
========================================================= */

async function createFolder(
    name
) {

    return apiRequest(
        `${WORKER_URL}/api/folders`,
        {
            method: "POST",

            body:
                JSON.stringify(
                    {
                        name,
                        prefix:
                            currentPrefix
                    }
                )
        }
    );

}


/* =========================================================
   PREVIEW
========================================================= */

function openPreview(
    object
) {

    selectedPreviewObject =
        object;


    const name =
        getObjectName(
            object
        );


    const url =
        getObjectUrl(
            object
        );


    const type =
        getFileType(
            object
        );


    const size =
        getObjectSize(
            object
        );


    if (previewName) {

        previewName.textContent =
            name;

    }


    if (previewDetails) {

        previewDetails.textContent =
            `${formatBytes(size)} • ${type}`;

    }


    if (openUrlBtn) {

        openUrlBtn.href =
            url || "#";

        openUrlBtn.target =
            "_blank";

        openUrlBtn.rel =
            "noopener noreferrer";

    }


    if (previewContent) {

        previewContent.innerHTML =
            "";

    }


    if (
        type === "image" &&
        url &&
        previewContent
    ) {

        const img =
            document.createElement(
                "img"
            );


        img.src =
            url;


        img.alt =
            name;


        previewContent.appendChild(
            img
        );


    } else if (
        type === "video" &&
        url &&
        previewContent
    ) {

        const video =
            document.createElement(
                "video"
            );


        video.src =
            url;


        video.controls =
            true;


        video.preload =
            "metadata";


        previewContent.appendChild(
            video
        );


    } else if (previewContent) {

        const icon =
            document.createElement(
                "div"
            );


        icon.className =
            "preview-file-icon";


        icon.innerHTML =
            `
                <i class="${getFileIcon(type)}"></i>
            `;


        previewContent.appendChild(
            icon
        );

    }


    openModal(
        previewModal
    );

}


/* =========================================================
   COPY URL
========================================================= */

copyUrlBtn?.addEventListener(
    "click",
    async () => {

        if (
            !selectedPreviewObject
        ) {

            return;

        }


        const url =
            getObjectUrl(
                selectedPreviewObject
            );


        if (!url) {

            showToast(
                "No public URL available.",
                "error"
            );


            return;

        }


        try {

            await navigator.clipboard.writeText(
                url
            );


            showToast(
                "URL copied.",
                "success"
            );

        } catch {

            showToast(
                "Unable to copy URL.",
                "error"
            );

        }

    }
);


/* =========================================================
   PREVIEW DELETE
========================================================= */

previewDeleteBtn?.addEventListener(
    "click",
    () => {

        if (
            !selectedPreviewObject
        ) {

            return;

        }


        closeModal(
            previewModal
        );


        openDeleteModal(
            selectedPreviewObject
        );

    }
);


/* =========================================================
   DELETE MODAL
========================================================= */

function openDeleteModal(
    object
) {

    selectedDeleteObject =
        object;


    if (deleteFileName) {

        deleteFileName.textContent =
            getObjectName(
                object
            );

    }


    openModal(
        deleteModal
    );

}


/* =========================================================
   CONFIRM DELETE
========================================================= */

confirmDeleteBtn?.addEventListener(
    "click",
    async () => {

        if (
            !selectedDeleteObject
        ) {

            return;

        }


        confirmDeleteBtn.disabled =
            true;


        const originalText =
            confirmDeleteBtn.innerHTML;


        confirmDeleteBtn.innerHTML =
            `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Deleting...
            `;


        try {

            await deleteObject(
                selectedDeleteObject
            );


            closeModal(
                deleteModal
            );


            selectedDeleteObject =
                null;


            showToast(
                "File deleted successfully.",
                "success"
            );


            await loadCurrentFolder();


        } catch (error) {

            console.error(
                "Delete failed:",
                error
            );


            showToast(
                error.message ||
                "Unable to delete file.",
                "error"
            );

        } finally {

            confirmDeleteBtn.disabled =
                false;


            confirmDeleteBtn.innerHTML =
                originalText;

        }

    }
);


/* =========================================================
   DELETE OBJECT API
========================================================= */

async function deleteObject(
    object
) {

    const key =
        getObjectKey(
            object
        );


    if (!key) {

        throw new Error(
            "File key is missing."
        );

    }


    const encodedKey =
        encodeURIComponent(
            key
        );


    return apiRequest(
        `${WORKER_URL}/api/objects?key=${encodedKey}`,
        {
            method: "DELETE"
        }
    );

}


/* =========================================================
   MODAL OPEN
========================================================= */

function openModal(
    modal
) {

    if (!modal) {

        return;

    }


    modal.hidden =
        false;


    document.body.classList.add(
        "gallery-modal-open"
    );

}


/* =========================================================
   MODAL CLOSE
========================================================= */

function closeModal(
    modal
) {

    if (!modal) {

        return;

    }


    modal.hidden =
        true;


    const openModals =
        document.querySelectorAll(
            ".gallery-modal:not([hidden])"
        );


    if (
        openModals.length === 0
    ) {

        document.body.classList.remove(
            "gallery-modal-open"
        );

    }

}


/* =========================================================
   CLOSE MODALS
========================================================= */

document.addEventListener(
    "click",
    event => {

        const closeButton =
            event.target.closest(
                "[data-close-modal]"
            );


        if (!closeButton) {

            return;

        }


        const modal =
            closeButton.closest(
                ".gallery-modal"
            );


        closeModal(
            modal
        );

    }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        document
            .querySelectorAll(
                ".gallery-modal:not([hidden])"
            )
            .forEach(
                modal => {

                    closeModal(
                        modal
                    );

                }
            );

    }
);


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message,
    type = "success"
) {

    if (
        !toastEl ||
        !toastMessageEl
    ) {

        return;

    }


    clearTimeout(
        toastTimer
    );


    toastMessageEl.textContent =
        message;


    if (toastIconEl) {

        if (
            type === "error"
        ) {

            toastIconEl.className =
                "fa-solid fa-circle-exclamation";

            toastIconEl.style.color =
                "#dc2626";

        } else {

            toastIconEl.className =
                "fa-solid fa-circle-check";

            toastIconEl.style.color =
                "#16a34a";

        }

    }


    toastEl.hidden =
        false;


    toastTimer =
        setTimeout(
            () => {

                toastEl.hidden =
                    true;

            },
            3500
        );

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

const mobileMenuBtn =
    document.getElementById(
        "mobileMenuBtn"
    );

const adminSidebar =
    document.getElementById(
        "adminSidebar"
    );

const sidebarOverlay =
    document.getElementById(
        "sidebarOverlay"
    );


mobileMenuBtn?.addEventListener(
    "click",
    () => {

        adminSidebar?.classList.add(
            "open"
        );


        sidebarOverlay?.classList.add(
            "show"
        );

    }
);


sidebarOverlay?.addEventListener(
    "click",
    () => {

        adminSidebar?.classList.remove(
            "open"
        );


        sidebarOverlay?.classList.remove(
            "show"
        );

    }
);


/* =========================================================
   MODAL BODY STYLE
========================================================= */

const modalStyle =
    document.createElement(
        "style"
    );


modalStyle.textContent =
    `
        body.gallery-modal-open {
            overflow: hidden;
        }
    `;


document.head.appendChild(
    modalStyle
);


/* =========================================================
   INITIAL VIEW
========================================================= */

applyView();


/* =========================================================
   DEBUG
========================================================= */

console.log(
    "Sun Shine Club Gallery initialized."
);

console.log(
    "Worker:",
    WORKER_URL
);

console.log(
    "R2:",
    PUBLIC_R2_BASE_URL
);

console.log(
    "Current prefix:",
    currentPrefix
);