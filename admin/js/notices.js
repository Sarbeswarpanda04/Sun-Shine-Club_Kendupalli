/* =========================================================
   NOTICES MANAGEMENT
   Sun Shine Club Kendupalli
   Complete notices.js
========================================================= */

import {
    auth,
    db
} from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    collection,
    doc,
    getDocs,
    setDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================================================
   DOM HELPER
========================================================= */

const $ = (id) => {
    return document.getElementById(id);
};


/* =========================================================
   ADMIN ELEMENTS
========================================================= */

const sidebarName =
    $("sidebarName");

const sidebarEmail =
    $("sidebarEmail");

const sidebarAvatar =
    $("sidebarAvatar");

const topbarName =
    $("topbarName");

const topbarAvatar =
    $("topbarAvatar");


/* =========================================================
   NOTICE ELEMENTS
========================================================= */

const noticesList =
    $("noticesList");

const noticesLoading =
    $("noticesLoading");

const noticesEmpty =
    $("noticesEmpty");


/* =========================================================
   SEARCH / FILTER
========================================================= */

const noticeSearch =
    $("noticeSearch");

const noticeStatusFilter =
    $("noticeStatusFilter");

const noticeLanguageFilter =
    $("noticeLanguageFilter");


/* =========================================================
   STATISTICS
========================================================= */

const totalNotices =
    $("totalNotices");

const activeNotices =
    $("activeNotices");

const importantNotices =
    $("importantNotices");

const expiredNotices =
    $("expiredNotices");


/* =========================================================
   ADD NOTICE
========================================================= */

const addNoticeButton =
    $("addNoticeButton");

const emptyAddNotice =
    $("emptyAddNotice");


/* =========================================================
   NOTICE MODAL
========================================================= */

const noticeModal =
    $("noticeModal");

const noticeModalOverlay =
    $("noticeModalOverlay");

const closeNoticeModalButton =
    $("closeNoticeModal");

const cancelNotice =
    $("cancelNotice");


/* =========================================================
   FORM
========================================================= */

const noticeForm =
    $("noticeForm");

const noticeModalTitle =
    $("noticeModalTitle");

const noticeDocumentId =
    $("noticeDocumentId");

const noticeTitleEn =
    $("noticeTitleEn");

const noticeDescriptionEn =
    $("noticeDescriptionEn");

const noticeContentEn =
    $("noticeContentEn");

const noticeTitleOr =
    $("noticeTitleOr");

const noticeDescriptionOr =
    $("noticeDescriptionOr");

const noticeContentOr =
    $("noticeContentOr");

const noticePublishedAt =
    $("noticePublishedAt");

const noticeExpiresAt =
    $("noticeExpiresAt");

const noticeLanguage =
    $("noticeLanguage");

const noticeImage =
    $("noticeImage");

const noticePinned =
    $("noticePinned");

const noticeImportant =
    $("noticeImportant");

const noticeLink =
    $("noticeLink");

const noticeFormError =
    $("noticeFormError");

const saveNotice =
    $("saveNotice");


/* =========================================================
   DELETE MODAL
========================================================= */

const deleteModal =
    $("deleteModal");

const deleteModalOverlay =
    $("deleteModalOverlay");

const deleteNoticeTitle =
    $("deleteNoticeTitle");

const deleteNoticeId =
    $("deleteNoticeId");

const cancelDelete =
    $("cancelDelete");

const confirmDelete =
    $("confirmDelete");


/* =========================================================
   STATE
========================================================= */

let allNotices = [];

let editingNoticeId = null;

let noticeToDelete = null;


/* =========================================================
   AUTHENTICATION
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            console.log(
                "Notices: no authenticated user."
            );

            return;
        }


        console.log(
            "Notices: authenticated user:",
            user.email
        );


        setAdminProfile(user);

        await loadNotices();

    }
);


/* =========================================================
   ADMIN PROFILE
========================================================= */

function setAdminProfile(user) {

    const name =
        user.displayName ||
        "Administrator";

    const email =
        user.email ||
        "";

    const photo =
        user.photoURL ||
        "";


    if (sidebarName) {

        sidebarName.textContent =
            name;

    }


    if (sidebarEmail) {

        sidebarEmail.textContent =
            email;

    }


    if (topbarName) {

        topbarName.textContent =
            name;

    }


    setAvatar(
        sidebarAvatar,
        name,
        photo
    );


    setAvatar(
        topbarAvatar,
        name,
        photo
    );

}


/* =========================================================
   AVATAR
========================================================= */

function setAvatar(
    element,
    name,
    photo
) {

    if (!element) {

        return;

    }


    element.innerHTML = "";


    if (photo) {

        const image =
            document.createElement(
                "img"
            );


        image.src =
            photo;

        image.alt =
            name;

        image.referrerPolicy =
            "no-referrer";


        image.onerror =
            () => {

                image.remove();

                element.textContent =
                    getInitial(name);

            };


        element.appendChild(
            image
        );


        return;

    }


    element.textContent =
        getInitial(name);

}


function getInitial(name) {

    return (
        String(name || "")
            .trim()
            .charAt(0)
            .toUpperCase()
        || "A"
    );

}


/* =========================================================
   LOAD NOTICES
========================================================= */

async function loadNotices() {

    showLoading(true);

    showEmpty(false);

    clearError();


    try {

        console.log(
            "Loading notices from Firestore..."
        );


        const noticesReference =
            collection(
                db,
                "notices"
            );


        const snapshot =
            await getDocs(
                noticesReference
            );


        console.log(
            "Firestore notices:",
            snapshot.size
        );


        allNotices =
            snapshot.docs.map(
                (documentSnapshot) => {

                    return {

                        documentId:
                            documentSnapshot.id,

                        ...documentSnapshot.data()

                    };

                }
            );


        allNotices.sort(
            compareNotices
        );


        updateStatistics();

        renderNotices();


        console.log(
            "Notices rendered:",
            allNotices.length
        );


    } catch (error) {

        console.error(
            "Unable to load notices:",
            error
        );


        allNotices = [];

        updateStatistics();

        showNoticesError(
            getFirestoreErrorMessage(
                error
            )
        );

    } finally {

        showLoading(false);

    }

}


/* =========================================================
   SORT
========================================================= */

function compareNotices(
    a,
    b
) {

    const pinnedA =
        a.pinned === true
            ? 1
            : 0;

    const pinnedB =
        b.pinned === true
            ? 1
            : 0;


    if (pinnedA !== pinnedB) {

        return pinnedB - pinnedA;

    }


    const importantA =
        a.important === true
            ? 1
            : 0;

    const importantB =
        b.important === true
            ? 1
            : 0;


    if (
        importantA !== importantB
    ) {

        return importantB - importantA;

    }


    return (
        getDateValue(
            b.publishedAt
        ) -
        getDateValue(
            a.publishedAt
        )
    );

}


/* =========================================================
   RENDER NOTICES
========================================================= */

function renderNotices() {

    if (!noticesList) {

        console.error(
            "noticesList element not found."
        );

        return;

    }


    const searchText =
        String(
            noticeSearch?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const selectedStatus =
        noticeStatusFilter?.value ||
        "all";


    const selectedLanguage =
        noticeLanguageFilter?.value ||
        "all";


    const filteredNotices =
        allNotices.filter(
            (notice) => {

                const searchable = [

                    getNoticeTitle(
                        notice,
                        "en"
                    ),

                    getNoticeTitle(
                        notice,
                        "or"
                    ),

                    getNoticeDescription(
                        notice,
                        "en"
                    ),

                    getNoticeDescription(
                        notice,
                        "or"
                    ),

                    notice.id,

                    notice.documentId,

                    notice.link

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                if (
                    searchText &&
                    !searchable.includes(
                        searchText
                    )
                ) {

                    return false;

                }


                const expired =
                    isNoticeExpired(
                        notice
                    );


                if (
                    selectedStatus ===
                    "active"
                ) {

                    if (expired) {

                        return false;

                    }

                }


                if (
                    selectedStatus ===
                    "expired"
                ) {

                    if (!expired) {

                        return false;

                    }

                }


                if (
                    selectedStatus ===
                    "pinned"
                ) {

                    if (
                        notice.pinned !==
                        true
                    ) {

                        return false;

                    }

                }


                if (
                    selectedStatus ===
                    "important"
                ) {

                    if (
                        notice.important !==
                        true
                    ) {

                        return false;

                    }

                }


                if (
                    selectedLanguage !==
                    "all"
                ) {

                    if (
                        String(
                            notice.language ||
                            "en"
                        ) !==
                        selectedLanguage
                    ) {

                        return false;

                    }

                }


                return true;

            }
        );


    noticesList.innerHTML =
        "";


    if (
        filteredNotices.length ===
        0
    ) {

        noticesList.hidden =
            true;

        showEmpty(true);

        return;

    }


    noticesList.hidden =
        false;

    showEmpty(false);


    filteredNotices.forEach(
        (notice) => {

            noticesList.appendChild(
                createNoticeCard(
                    notice
                )
            );

        }
    );

}



/* =========================================================
   CREATE NOTICE CARD
========================================================= */

function createNoticeCard(notice) {

    const card =
        document.createElement("article");

    card.className =
        "notice-card";


    /* =====================================================
       IMAGE
    ===================================================== */

    const imageWrapper =
        document.createElement("div");

    imageWrapper.className =
        "notice-card-image";


    const imageUrl =
        notice.image ||
        notice.imageUrl ||
        "";


    if (imageUrl) {

        const image =
            document.createElement("img");

        image.src =
            imageUrl;

        image.alt =
            getNoticeTitle(notice);

        image.loading =
            "lazy";

        image.onerror =
            () => {

                image.remove();

                imageWrapper.classList.add(
                    "no-image"
                );

                imageWrapper.appendChild(
                    createImagePlaceholder()
                );
            };


        imageWrapper.appendChild(
            image
        );

    } else {

        imageWrapper.classList.add(
            "no-image"
        );

        imageWrapper.appendChild(
            createImagePlaceholder()
        );
    }


    /* =====================================================
       BADGES
    ===================================================== */

    const badges =
        document.createElement("div");

    badges.className =
        "notice-badges";


    if (notice.pinned === true) {

        badges.appendChild(
            createBadge(
                "Pinned",
                "fa-thumbtack",
                "pinned"
            )
        );
    }


    if (notice.important === true) {

        badges.appendChild(
            createBadge(
                "Important",
                "fa-star",
                "important"
            )
        );
    }


    if (isNoticeExpired(notice)) {

        badges.appendChild(
            createBadge(
                "Expired",
                "fa-clock",
                "expired"
            )
        );

    } else {

        badges.appendChild(
            createBadge(
                "Active",
                "fa-circle-check",
                "active"
            )
        );
    }


    imageWrapper.appendChild(
        badges
    );


    /* =====================================================
       BODY
    ===================================================== */

    const body =
        document.createElement("div");

    body.className =
        "notice-card-body";


    /* =====================================================
       TOP
    ===================================================== */

    const top =
        document.createElement("div");

    top.className =
        "notice-card-top";


    /* Title */

    const title =
        document.createElement("h3");

    title.className =
        "notice-card-title";

    title.textContent =
        getNoticeTitle(notice);


    /* Language */

    const language =
        document.createElement("span");

    language.className =
        "notice-language";

    language.textContent =
        getLanguageLabel(
            notice.language
        );


    top.appendChild(
        title
    );

    top.appendChild(
        language
    );


    /* =====================================================
       DESCRIPTION
    ===================================================== */

    const description =
        document.createElement("p");

    description.className =
        "notice-card-description";

    description.textContent =
        getNoticeDescription(notice);


    /* =====================================================
       META
    ===================================================== */

    const meta =
        document.createElement("div");

    meta.className =
        "notice-card-meta";


    /* Published date */

    const published =
        document.createElement("span");

    published.innerHTML =
        `
            <i class="fa-regular fa-calendar"></i>
            ${formatDate(
                notice.publishedAt
            )}
        `;

    meta.appendChild(
        published
    );


    /* Expiry date */

    if (notice.expiresAt) {

        const expiry =
            document.createElement("span");

        expiry.innerHTML =
            `
                <i class="fa-regular fa-clock"></i>
                Expires ${formatDate(
                    notice.expiresAt
                )}
            `;

        meta.appendChild(
            expiry
        );
    }


    /* =====================================================
       ACTIONS
    ===================================================== */

    const actions =
        document.createElement("div");

    actions.className =
        "notice-card-actions";


    /* Edit */

    const editButton =
        document.createElement("button");

    editButton.type =
        "button";

    editButton.className =
        "notice-action-button edit-notice-button";

    editButton.innerHTML =
        `
            <i class="fa-solid fa-pen"></i>
            <span>Edit</span>
        `;


    editButton.addEventListener(
        "click",
        () => {

            openEditNotice(
                notice
            );

        }
    );


    /* Delete */

    const deleteButton =
        document.createElement("button");

    deleteButton.type =
        "button";

    deleteButton.className =
        "notice-action-button delete-notice-button";

    deleteButton.innerHTML =
        `
            <i class="fa-solid fa-trash"></i>
            <span>Delete</span>
        `;


    deleteButton.addEventListener(
        "click",
        () => {

            openDeleteModal(
                notice
            );

        }
    );


    actions.appendChild(
        editButton
    );

    actions.appendChild(
        deleteButton
    );


    /* =====================================================
       BODY STRUCTURE
    ===================================================== */

    body.appendChild(
        top
    );

    body.appendChild(
        description
    );

    body.appendChild(
        meta
    );

    body.appendChild(
        actions
    );


    /* =====================================================
       CARD STRUCTURE
    ===================================================== */

    card.appendChild(
        imageWrapper
    );

    card.appendChild(
        body
    );


    return card;
}


/* =========================================================
   CREATE BADGE
========================================================= */

function createBadge(
    text,
    icon,
    className
) {

    const badge =
        document.createElement("span");

    badge.className =
        `notice-badge ${className}`;

    badge.innerHTML =
        `
            <i class="fa-solid ${icon}"></i>
            <span>${text}</span>
        `;

    return badge;
}


/* =========================================================
   IMAGE PLACEHOLDER
========================================================= */

function createImagePlaceholder() {

    const placeholder =
        document.createElement("div");

    placeholder.className =
        "notice-image-placeholder";

    placeholder.innerHTML =
        `
            <i class="fa-regular fa-image"></i>
        `;

    return placeholder;
}


/* =========================================================
   TITLE
========================================================= */

function getNoticeTitle(
    notice,
    language = "en"
) {

    return (

        notice.title?.[language] ||

        (
            language === "en"
                ? notice.titleEn
                : notice.titleOr
        ) ||

        notice.title?.en ||

        notice.titleEn ||

        notice.title?.or ||

        notice.titleOr ||

        "Untitled Notice"

    );

}


/* =========================================================
   DESCRIPTION
========================================================= */

function getNoticeDescription(
    notice,
    language = "en"
) {

    return (

        notice.description?.[language] ||

        (
            language === "en"
                ? notice.descriptionEn
                : notice.descriptionOr
        ) ||

        notice.description?.en ||

        notice.descriptionEn ||

        notice.description?.or ||

        notice.descriptionOr ||

        "No description available."

    );

}


/* =========================================================
   LANGUAGE
========================================================= */

function getLanguageLabel(
    language
) {

    if (
        language === "or"
    ) {

        return "Odia";

    }


    return "English";

}


/* =========================================================
   STATISTICS
========================================================= */

function updateStatistics() {

    const total =
        allNotices.length;


    const expired =
        allNotices.filter(
            (notice) =>
                isNoticeExpired(
                    notice
                )
        ).length;


    const active =
        total -
        expired;


    const important =
        allNotices.filter(
            (notice) =>
                notice.important ===
                true
        ).length;


    if (totalNotices) {

        totalNotices.textContent =
            total;

    }


    if (activeNotices) {

        activeNotices.textContent =
            active;

    }


    if (importantNotices) {

        importantNotices.textContent =
            important;

    }


    if (expiredNotices) {

        expiredNotices.textContent =
            expired;

    }

}


/* =========================================================
   ADD NOTICE
========================================================= */

function openAddNotice() {

    editingNoticeId =
        null;


    noticeForm?.reset();


    if (noticeDocumentId) {

        noticeDocumentId.value =
            "";

    }


    if (noticeLanguage) {

        noticeLanguage.value =
            "en";

    }


    if (noticeModalTitle) {

        noticeModalTitle.textContent =
            "Add Notice";

    }


    clearFormError();

    setSaveLoading(false);

    showNoticeModal();

}


/* =========================================================
   EDIT NOTICE
========================================================= */

function openEditNotice(
    notice
) {

    editingNoticeId =
        notice.documentId ||
        null;


    if (noticeDocumentId) {

        noticeDocumentId.value =
            notice.documentId ||
            "";

    }


    if (noticeTitleEn) {

        noticeTitleEn.value =
            getNoticeTitle(
                notice,
                "en"
            );

    }


    if (noticeDescriptionEn) {

        noticeDescriptionEn.value =
            getNoticeDescription(
                notice,
                "en"
            );

    }


    if (noticeContentEn) {

        noticeContentEn.value =
            notice.content?.en ||
            notice.contentEn ||
            "";

    }


    if (noticeTitleOr) {

        noticeTitleOr.value =
            notice.title?.or ||
            notice.titleOr ||
            "";

    }


    if (noticeDescriptionOr) {

        noticeDescriptionOr.value =
            notice.description?.or ||
            notice.descriptionOr ||
            "";

    }


    if (noticeContentOr) {

        noticeContentOr.value =
            notice.content?.or ||
            notice.contentOr ||
            "";

    }


    if (noticePublishedAt) {

        noticePublishedAt.value =
            toDateInput(
                notice.publishedAt
            );

    }


    if (noticeExpiresAt) {

        noticeExpiresAt.value =
            toDateInput(
                notice.expiresAt
            );

    }


    if (noticeLanguage) {

        noticeLanguage.value =
            notice.language ||
            "en";

    }


    if (noticeImage) {

        noticeImage.value =
            notice.image ||
            notice.imageUrl ||
            "";

    }


    if (noticePinned) {

        noticePinned.checked =
            notice.pinned ===
            true;

    }


    if (noticeImportant) {

        noticeImportant.checked =
            notice.important ===
            true;

    }


    if (noticeLink) {

        noticeLink.value =
            notice.link ||
            "";

    }


    if (noticeModalTitle) {

        noticeModalTitle.textContent =
            "Edit Notice";

    }


    clearFormError();

    setSaveLoading(false);

    showNoticeModal();

}


/* =========================================================
   SAVE NOTICE
========================================================= */

noticeForm?.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        clearFormError();


        const data =
            getNoticeFormData();


        const validationError =
            validateNotice(
                data
            );


        if (validationError) {

            showFormError(
                validationError
            );

            return;

        }


        setSaveLoading(true);


        try {

            const documentId =
                editingNoticeId ||
                createNoticeId(
                    data.title.en
                );


            const noticeReference =
                doc(
                    db,
                    "notices",
                    documentId
                );


            const noticeData = {

                id:
                    documentId,


                title: {

                    en:
                        data.title.en,

                    or:
                        data.title.or

                },


                description: {

                    en:
                        data.description.en,

                    or:
                        data.description.or

                },


                content: {

                    en:
                        data.content.en,

                    or:
                        data.content.or

                },


                publishedAt:
                    data.publishedAt,


                expiresAt:
                    data.expiresAt,


                language:
                    data.language,


                image:
                    data.image,


                pinned:
                    data.pinned,


                important:
                    data.important,


                link:
                    data.link,


                updatedAt:
                    new Date().toISOString()

            };


            if (!editingNoticeId) {

                noticeData.createdAt =
                    new Date().toISOString();

            }


            await setDoc(
                noticeReference,
                noticeData,
                {
                    merge: true
                }
            );


            console.log(
                editingNoticeId
                    ? "Notice updated:"
                    : "Notice created:",
                documentId
            );


            closeNoticeModal();

            await loadNotices();


        } catch (error) {

            console.error(
                "Unable to save notice:",
                error
            );


            showFormError(
                getFirestoreErrorMessage(
                    error
                )
            );


        } finally {

            setSaveLoading(false);

        }

    }
);


/* =========================================================
   FORM DATA
========================================================= */

function getNoticeFormData() {

    return {

        title: {

            en:
                noticeTitleEn?.value.trim() ||
                "",

            or:
                noticeTitleOr?.value.trim() ||
                ""

        },


        description: {

            en:
                noticeDescriptionEn?.value.trim() ||
                "",

            or:
                noticeDescriptionOr?.value.trim() ||
                ""

        },


        content: {

            en:
                noticeContentEn?.value.trim() ||
                "",

            or:
                noticeContentOr?.value.trim() ||
                ""

        },


        publishedAt:
            noticePublishedAt?.value ||
            "",


        expiresAt:
            noticeExpiresAt?.value ||
            "",


        language:
            noticeLanguage?.value ||
            "en",


        image:
            noticeImage?.value.trim() ||
            "",


        pinned:
            noticePinned?.checked ===
            true,


        important:
            noticeImportant?.checked ===
            true,


        link:
            noticeLink?.value.trim() ||
            ""

    };

}


/* =========================================================
   VALIDATION
========================================================= */

function validateNotice(
    data
) {

    if (!data.title.en) {

        return (
            "Please enter the English notice title."
        );

    }


    if (!data.publishedAt) {

        return (
            "Please select the published date."
        );

    }


    if (
        data.expiresAt &&
        data.expiresAt <
            data.publishedAt
    ) {

        return (
            "Expiry date cannot be earlier " +
            "than the published date."
        );

    }


    if (
        data.image &&
        !isValidUrl(
            data.image
        )
    ) {

        return (
            "Please enter a valid image URL."
        );

    }


    if (
        data.link &&
        !isValidUrl(
            data.link
        )
    ) {

        return (
            "Please enter a valid related page URL."
        );

    }


    return null;

}


/* =========================================================
   DELETE MODAL
========================================================= */

function openDeleteModal(
    notice
) {

    noticeToDelete =
        notice;


    if (deleteNoticeTitle) {

        deleteNoticeTitle.textContent =
            getNoticeTitle(
                notice
            );

    }


    if (deleteNoticeId) {

        deleteNoticeId.textContent =
            notice.documentId ||
            "Unknown ID";

    }


    if (deleteModal) {

        deleteModal.hidden =
            false;

    }


    document.body.classList.add(
        "delete-modal-open"
    );


    setTimeout(
        () => {

            confirmDelete?.focus();

        },
        50
    );

}


/* =========================================================
   CONFIRM DELETE
========================================================= */

confirmDelete?.addEventListener(
    "click",
    async () => {

        if (
            !noticeToDelete ||
            !noticeToDelete.documentId
        ) {

            return;

        }


        const documentId =
            noticeToDelete.documentId;


        confirmDelete.disabled =
            true;


        confirmDelete.innerHTML = `

            <i class="fa-solid fa-spinner fa-spin"></i>

            <span>Deleting...</span>

        `;


        try {

            await deleteDoc(
                doc(
                    db,
                    "notices",
                    documentId
                )
            );


            allNotices =
                allNotices.filter(
                    (notice) =>
                        notice.documentId !==
                        documentId
                );


            updateStatistics();

            renderNotices();

            closeDeleteModal();


            console.log(
                "Notice deleted:",
                documentId
            );


        } catch (error) {

            console.error(
                "Unable to delete notice:",
                error
            );


            alert(
                getFirestoreErrorMessage(
                    error
                )
            );


        } finally {

            confirmDelete.disabled =
                false;


            confirmDelete.innerHTML = `

                <i class="fa-solid fa-trash"></i>

                <span>Delete Notice</span>

            `;

        }

    }
);


/* =========================================================
   CLOSE DELETE MODAL
========================================================= */

function closeDeleteModal() {

    if (!deleteModal) {

        return;

    }


    deleteModal.hidden =
        true;


    document.body.classList.remove(
        "delete-modal-open"
    );


    noticeToDelete =
        null;

}


cancelDelete?.addEventListener(
    "click",
    closeDeleteModal
);


deleteModalOverlay?.addEventListener(
    "click",
    closeDeleteModal
);


/* =========================================================
   NOTICE MODAL
========================================================= */

function showNoticeModal() {

    if (!noticeModal) {

        return;

    }


    noticeModal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    setTimeout(
        () => {

            noticeTitleEn?.focus();

        },
        50
    );

}


function closeNoticeModal() {

    if (!noticeModal) {

        return;

    }


    noticeModal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    editingNoticeId =
        null;


    clearFormError();

}


closeNoticeModalButton?.addEventListener(
    "click",
    closeNoticeModal
);


cancelNotice?.addEventListener(
    "click",
    closeNoticeModal
);


noticeModalOverlay?.addEventListener(
    "click",
    closeNoticeModal
);


addNoticeButton?.addEventListener(
    "click",
    openAddNotice
);


emptyAddNotice?.addEventListener(
    "click",
    openAddNotice
);


/* =========================================================
   SEARCH
========================================================= */

noticeSearch?.addEventListener(
    "input",
    renderNotices
);


/* =========================================================
   FILTERS
========================================================= */

noticeStatusFilter?.addEventListener(
    "change",
    renderNotices
);


noticeLanguageFilter?.addEventListener(
    "change",
    renderNotices
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        if (
            deleteModal &&
            !deleteModal.hidden
        ) {

            closeDeleteModal();

            return;

        }


        if (
            noticeModal &&
            !noticeModal.hidden
        ) {

            closeNoticeModal();

        }

    }
);


/* =========================================================
   LOADING
========================================================= */

function showLoading(
    loading
) {

    if (!noticesLoading) {

        return;

    }


    noticesLoading.hidden =
        !loading;

}


/* =========================================================
   EMPTY
========================================================= */

function showEmpty(
    show
) {

    if (!noticesEmpty) {

        return;

    }


    noticesEmpty.hidden =
        !show;

}


/* =========================================================
   ERROR
========================================================= */

function clearError() {

    if (!noticesList) {

        return;

    }


    const oldError =
        noticesList.querySelector(
            ".notices-error"
        );


    if (oldError) {

        oldError.remove();

    }

}


function showNoticesError(
    message
) {

    if (!noticesList) {

        return;

    }


    noticesList.innerHTML =
        "";


    noticesList.hidden =
        false;


    showEmpty(false);


    const error =
        document.createElement(
            "div"
        );


    error.className =
        "notices-error";


    error.innerHTML = `

        <div class="notices-error-icon">

            <i class="fa-solid fa-triangle-exclamation"></i>

        </div>


        <h3>
            Unable to load notices
        </h3>


        <p>
            ${escapeHtml(message)}
        </p>


        <button
            type="button"
            class="retry-notices-button"
        >

            <i class="fa-solid fa-rotate-right"></i>

            <span>Try Again</span>

        </button>

    `;


    const retry =
        error.querySelector(
            ".retry-notices-button"
        );


    retry?.addEventListener(
        "click",
        loadNotices
    );


    noticesList.appendChild(
        error
    );

}


/* =========================================================
   FORM ERROR
========================================================= */

function showFormError(
    message
) {

    if (!noticeFormError) {

        return;

    }


    noticeFormError.textContent =
        message;


    noticeFormError.hidden =
        false;

}


function clearFormError() {

    if (!noticeFormError) {

        return;

    }


    noticeFormError.textContent =
        "";


    noticeFormError.hidden =
        true;

}


/* =========================================================
   SAVE LOADING
========================================================= */

function setSaveLoading(
    loading
) {

    if (!saveNotice) {

        return;

    }


    saveNotice.disabled =
        loading;


    if (loading) {

        saveNotice.innerHTML = `

            <i class="fa-solid fa-spinner fa-spin"></i>

            <span>Saving...</span>

        `;


        return;

    }


    saveNotice.innerHTML =
        editingNoticeId

            ? `

                <i class="fa-solid fa-check"></i>

                <span>
                    Update Notice
                </span>

              `

            : `

                <i class="fa-solid fa-check"></i>

                <span>
                    Save Notice
                </span>

              `;

}


/* =========================================================
   NOTICE EXPIRY
========================================================= */

function isNoticeExpired(
    notice
) {

    if (!notice.expiresAt) {

        return false;

    }


    const expiry =
        dateOnly(
            notice.expiresAt
        );


    const today =
        dateOnly(
            new Date()
        );


    if (!expiry) {

        return false;

    }


    return expiry <
        today;

}


/* =========================================================
   DATE ONLY
========================================================= */

function dateOnly(
    value
) {

    if (!value) {

        return "";

    }


    if (
        typeof value ===
            "object" &&
        typeof value.toDate ===
            "function"
    ) {

        return dateOnly(
            value.toDate()
        );

    }


    if (
        value instanceof Date
    ) {

        const year =
            value.getFullYear();


        const month =
            String(
                value.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                value.getDate()
            ).padStart(
                2,
                "0"
            );


        return (
            `${year}-${month}-${day}`
        );

    }


    const text =
        String(value);


    const match =
        text.match(
            /^(\d{4}-\d{2}-\d{2})/
        );


    if (match) {

        return match[1];

    }


    const date =
        new Date(text);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return dateOnly(
        date
    );

}


/* =========================================================
   DATE VALUE FOR SORTING
========================================================= */

function getDateValue(
    value
) {

    const date =
        dateOnly(value);


    if (!date) {

        return 0;

    }


    return Number(
        date.replaceAll(
            "-",
            ""
        )
    );

}


/* =========================================================
   DATE INPUT
========================================================= */

function toDateInput(
    value
) {

    return dateOnly(
        value
    );

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
    value
) {

    const date =
        dateOnly(
            value
        );


    if (!date) {

        return "No date";

    }


    const parts =
        date
            .split("-")
            .map(Number);


    const localDate =
        new Date(
            parts[0],
            parts[1] - 1,
            parts[2]
        );


    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    ).format(
        localDate
    );

}


/* =========================================================
   CREATE NOTICE ID
========================================================= */

function createNoticeId(
    title
) {

    const slug =
        String(
            title ||
            "notice"
        )
            .toLowerCase()
            .trim()
            .replace(
                /[^a-z0-9]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                ""
            )
            .substring(
                0,
                50
            );


    return (
        `${slug || "notice"}-${Date.now()}`
    );

}


/* =========================================================
   URL VALIDATION
========================================================= */

function isValidUrl(
    value
) {

    try {

        const url =
            new URL(
                value
            );


        return (
            url.protocol ===
                "http:" ||
            url.protocol ===
                "https:"
        );

    } catch {

        return false;

    }

}


/* =========================================================
   FIRESTORE ERROR
========================================================= */

function getFirestoreErrorMessage(
    error
) {

    if (!error) {

        return (
            "An unknown error occurred."
        );

    }


    switch (
        error.code
    ) {

        case "permission-denied":

            return (
                "Permission denied. Your account is authenticated, " +
                "but Firestore security rules are not allowing access " +
                "to the notices collection."
            );


        case "unauthenticated":

            return (
                "Your administrator session has expired. " +
                "Please sign in again."
            );


        case "unavailable":

            return (
                "Firestore is temporarily unavailable. " +
                "Please try again."
            );


        case "failed-precondition":

            return (
                "Firestore is not ready or the required configuration " +
                "is incomplete."
            );


        default:

            return (
                error.message ||
                "Something went wrong. Please try again."
            );

    }

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
   READY
========================================================= */

console.log(
    "Notices management system loaded."
);



