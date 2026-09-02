/* =========================================================
   SUN SHINE CLUB
   CERTIFICATE MANAGEMENT
   ---------------------------------------------------------
   Firebase Firestore
   Cloudflare R2 via sunshineclub-media-api
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
    getDocs,
    getDoc,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================================================
   CONFIGURATION
========================================================= */

const WORKER_URL =
    "https://sunshineclub-media-api.still-mouse-2d92.workers.dev";

const VERIFY_URL =
    "https://sunshineclubkendupalli.in/club-certificate/verify.html";

const R2_CERTIFICATE_FOLDER =
    "certificate";

const CERTIFICATE_COLLECTION =
    "certificates";

const CURRENT_YEAR =
    new Date().getFullYear();

const MAX_CERTIFICATE_NUMBER =
    9999;


/* =========================================================
   CERTIFICATE TEMPLATES
========================================================= */

const templates = {

    first: {
        name: "First Prize",
        subtitle: "Certificate of Excellence",
        image:
            "../club-certificate/certificate/template/first.png"
    },

    second: {
        name: "Second Prize",
        subtitle: "Certificate of Achievement",
        image:
            "../club-certificate/certificate/template/second.png"
    },

    third: {
        name: "Third Prize",
        subtitle: "Certificate of Merit",
        image:
            "../club-certificate/certificate/template/third.png"
    },

    participant: {
        name: "Participation",
        subtitle: "Certificate of Participation",
        image:
            "../club-certificate/certificate/template/participant.png"
    }

};


/* =========================================================
   STATE
========================================================= */

let currentUser = null;

let selectedTemplate =
    "first";

let allCertificates =
    [];

let toastTimer =
    null;

let generationInProgress =
    false;

let editingCertificate = null;

/* =========================================================
   ELEMENT HELPER
========================================================= */

const $ = (id) =>
    document.getElementById(id);


/* =========================================================
   DOM ELEMENTS
========================================================= */

const elements = {

    /* Admin */

    sidebar:
        $("adminSidebar"),

    overlay:
        $("sidebarOverlay"),

    menu:
        $("mobileMenuBtn"),

    sidebarName:
        $("sidebarName"),

    sidebarEmail:
        $("sidebarEmail"),

    sidebarAvatar:
        $("sidebarAvatar"),

    topbarName:
        $("topbarName"),

    topbarAvatar:
        $("topbarAvatar"),

    sidebarLogout:
        $("sidebarLogout"),


    /* Issued certificates */

    issued:
        $("issuedCertificates"),

    issuedLoading:
        $("issuedLoading"),

    issuedError:
        $("issuedError"),

    issuedEmpty:
        $("issuedEmpty"),

    issuedWrap:
        document.querySelector(
            ".issued-scroll-wrap"
        ),

    search:
        $("certificateSearch"),

    refresh:
        $("refreshCertificates"),

    scrollLeft:
        $("issuedScrollLeft"),

    scrollRight:
        $("issuedScrollRight"),


    /* Generator */

    modal:
        $("certificateModal"),

    closeModal:
        $("closeGenerator"),

    openGenerate:
        $("openGenerateBtn"),

    cancelGenerate:
        $("cancelGenerate"),

    changeTemplate:
        $("changeTemplateBtn"),


    /* Template picker */

    picker:
        $("templatePicker"),

    closePicker:
        $("closeTemplatePicker"),


    /* Generator fields */

    templateName:
        $("selectedTemplateName"),

    templateYear:
        $("certificateYear"),

    name:
        $("certificateName"),

    event:
        $("certificateEvent"),

    eventImage:
        $("certificateEventImage"),

    date:
        $("certificateDate"),

    number:
        $("certificateNumber"),

    generate:
        $("generateCertificateBtn"),

    /* Messages */

    duplicate:
        $("duplicateMessage"),

    status:
        $("generationStatus"),


    /* Preview */

    background:
        $("certificateBackground"),

    previewName:
        $("previewName"),

    previewEvent:
        $("previewEvent"),

    previewDate:
        $("previewDate"),

    previewId:
        $("previewId"),

    qr:
        $("qrCode"),

    qrId:
        $("qrId"),

    certificatePreview:
        $("certificatePreview"),


    /* Toast */

    toast:
        $("toast")

};


/* =========================================================
   INITIAL CHECK
========================================================= */

console.log(
    "Certificate Management loaded."
);


/* =========================================================
   TEXT ESCAPE
========================================================= */

function safe(value) {

    return String(value ?? "")
        .replace(
            /[&<>'"]/g,
            character => {

                const map = {

                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;"

                };

                return map[character];

            }
        );

}


/* =========================================================
   INITIAL LETTER
========================================================= */

function getInitial(name) {

    return (
        String(name || "Administrator")
            .trim()
            .charAt(0)
            .toUpperCase()
        || "A"
    );

}


/* =========================================================
   ADMIN AVATAR
========================================================= */

function setAvatar(element, user) {

    if (!element) {
        return;
    }

    element.innerHTML = "";

    const photo =
        user?.photoURL || "";

    const name =
        user?.displayName ||
        "Administrator";


    if (photo) {

        const image =
            document.createElement("img");

        image.src =
            photo;

        image.alt =
            name;

        image.referrerPolicy =
            "no-referrer";

        image.onerror =
            () => {

                element.innerHTML = "";

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


/* =========================================================
   ADMIN PROFILE
========================================================= */

function setAdminProfile(user) {

    if (!user) {
        return;
    }

    const name =
        user.displayName ||
        "Administrator";

    const email =
        user.email ||
        "";


    if (elements.sidebarName) {

        elements.sidebarName.textContent =
            name;

    }


    if (elements.sidebarEmail) {

        elements.sidebarEmail.textContent =
            email;

    }


    if (elements.topbarName) {

        elements.topbarName.textContent =
            name;

    }


    setAvatar(
        elements.sidebarAvatar,
        user
    );

    setAvatar(
        elements.topbarAvatar,
        user
    );

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function openSidebar() {

    elements.sidebar?.classList.add(
        "open"
    );

    elements.overlay?.classList.add(
        "show"
    );

    document.body.classList.add(
        "menu-open"
    );

}


function closeSidebar() {

    elements.sidebar?.classList.remove(
        "open"
    );

    elements.overlay?.classList.remove(
        "show"
    );

    document.body.classList.remove(
        "menu-open"
    );

}


elements.menu?.addEventListener(
    "click",
    event => {

        event.preventDefault();

        if (
            elements.sidebar?.classList.contains(
                "open"
            )
        ) {

            closeSidebar();

        } else {

            openSidebar();

        }

    }
);


elements.overlay?.addEventListener(
    "click",
    closeSidebar
);


document
    .querySelectorAll(".admin-nav-link")
    .forEach(
        link => {

            link.addEventListener(
                "click",
                closeSidebar
            );

        }
    );


/* =========================================================
   LOGOUT
========================================================= */

elements.sidebarLogout?.addEventListener(
    "click",
    async () => {

        try {

            await auth.signOut();

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

            showToast(
                "Unable to sign out.",
                "error"
            );

        }

    }
);


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message,
    type = ""
) {

    if (!elements.toast) {
        return;
    }

    clearTimeout(
        toastTimer
    );

    elements.toast.textContent =
        message;

    elements.toast.className =
        `toast show ${type}`.trim();


    toastTimer =
        setTimeout(
            () => {

                elements.toast.classList.remove(
                    "show"
                );

            },
            3500
        );

}


/* =========================================================
   SECTION STATE
========================================================= */

function setSectionState(
    type,
    message = ""
) {

    const loading =
        elements.issuedLoading;

    const error =
        elements.issuedError;

    const empty =
        elements.issuedEmpty;

    const wrapper =
        elements.issuedWrap;


    if (loading) {

        loading.hidden =
            type !== "loading";

        loading.style.display =
            type === "loading"
                ? ""
                : "none";

    }


    if (error) {

        error.hidden =
            type !== "error";

        error.style.display =
            type === "error"
                ? ""
                : "none";

        if (type === "error") {

            error.textContent =
                message;

        }

    }


    if (empty) {

        empty.hidden =
            type !== "empty";

        empty.style.display =
            type === "empty"
                ? ""
                : "none";

    }


    if (wrapper) {

        wrapper.style.display =
            type === "ready"
                ? "block"
                : "none";

    }

}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(value) {

    if (!value) {

        return "Not available";

    }


    let date = null;


    try {

        if (
            typeof value?.toDate ===
            "function"
        ) {

            date =
                value.toDate();

        } else if (
            typeof value ===
            "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(
                value
            )
        ) {

            const [
                yearValue,
                monthValue,
                dayValue
            ] =
                value
                    .split("-")
                    .map(Number);


            date =
                new Date(
                    yearValue,
                    monthValue - 1,
                    dayValue
                );

        } else {

            date =
                new Date(value);

        }

    } catch {

        return String(value);

    }


    if (
        !date ||
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);

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
   NUMBER NORMALIZATION
========================================================= */

function normalizeNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    let text = String(value).trim();

    // If the complete certificate ID was supplied,
    // extract only the final certificate number.
    const certificateMatch = text.match(
        /(?:SSC-CERT-\d{4}-)?(\d{1,4})$/i
    );

    if (!certificateMatch) {
        return null;
    }

    const number = Number(
        certificateMatch[1]
    );

    if (
        !Number.isInteger(number) ||
        number < 1 ||
        number > MAX_CERTIFICATE_NUMBER
    ) {
        return null;
    }

    return number;
}


/* =========================================================
   CERTIFICATE NUMBER FORMAT
========================================================= */

function formatCertificateNumber(
    number
) {

    return String(number)
        .padStart(3, "0");

}


/* =========================================================
   BUILD CERTIFICATE ID
========================================================= */

function buildCertificateId(
    number
) {

    return (
        `SSC-CERT-${CURRENT_YEAR}-${formatCertificateNumber(number)}`
    );

}


/* =========================================================
   DEFAULT DATE
========================================================= */

function setDefaultDate() {

    if (!elements.date) {
        return;
    }

    const now = new Date();

    const value =
        `${now.getFullYear()}-${String(
            now.getMonth() + 1
        ).padStart(2, "0")}-${String(
            now.getDate()
        ).padStart(2, "0")}`;

    elements.date.value = value;
}


/* =========================================================
   PREVIEW DATE
========================================================= */

function formatPreviewDate(
    value
) {

    if (!value) {

        return "DATE";

    }


    const parts =
        String(value).split("-");


    if (parts.length !== 3) {

        return "DATE";

    }


    const yearValue =
        Number(parts[0]);

    const monthValue =
        Number(parts[1]);

    const dayValue =
        Number(parts[2]);


    const date =
        new Date(
            yearValue,
            monthValue - 1,
            dayValue
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "DATE";

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================================================
   UPDATE PREVIEW
========================================================= */

function updatePreview() {

    if (!elements.name) {
        return;
    }


    const name =
        elements.name.value.trim();

    const event =
        elements.event.value.trim();

    const rawNumber =
    elements.number?.value || "";

const number =
    normalizeNumber(rawNumber);

console.log("Certificate number input:", rawNumber);
console.log("Normalized certificate number:", number);


    const certificateId =
        number
            ? buildCertificateId(number)
            : "CERTIFICATE ID";


    if (elements.previewName) {

        elements.previewName.textContent =
            name ||
            "RECIPIENT NAME";

    }


    if (elements.previewEvent) {

        elements.previewEvent.textContent =
            event ||
            "EVENT NAME";

    }


    if (elements.previewDate) {

        elements.previewDate.textContent =
            formatPreviewDate(
                elements.date.value
            );

    }


    if (elements.previewId) {

        elements.previewId.textContent =
            certificateId;

    }


    if (elements.qrId) {

        elements.qrId.textContent =
            certificateId;

    }


    generateQRCode(
        number
            ? certificateId
            : ""
    );

}


/* =========================================================
   GENERATE QR CODE
========================================================= */

function generateQRCode(
    certificateId
) {

    if (!elements.qr) {
        return;
    }


    elements.qr.innerHTML =
        "";


    if (
        !certificateId ||
        typeof QRCode ===
        "undefined"
    ) {

        return;

    }


    const url =
        `${VERIFY_URL}?id=${encodeURIComponent(
            certificateId
        )}`;


    new QRCode(
        elements.qr,
        {
            text: url,
            width: 500,
            height: 500,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel:
                QRCode.CorrectLevel.H
        }
    );

}


/* =========================================================
   SELECT TEMPLATE
========================================================= */

function selectTemplate(
    type
) {

    if (!templates[type]) {

        type =
            "first";

    }


    selectedTemplate =
        type;


    const template =
        templates[type];


    if (elements.templateName) {

        elements.templateName.textContent =
            template.name;

    }


    if (elements.background) {

        elements.background.src =
            template.image;

        elements.background.alt =
            `${template.name} certificate template`;

    }


    updatePreview();

}


/* =========================================================
   CLEAR GENERATION STATE
========================================================= */

function clearGenerationState() {

    if (elements.duplicate) {

        elements.duplicate.hidden =
            true;

        elements.duplicate.style.display =
            "none";

        elements.duplicate.textContent =
            "";

        elements.duplicate.className =
            "field-message";

    }


    if (elements.status) {

        elements.status.hidden =
            true;

        elements.status.style.display =
            "none";

        elements.status.textContent =
            "";

        elements.status.className =
            "generation-status";

    }


    generationInProgress =
        false;


    if (elements.generate) {

        elements.generate.disabled =
            false;

    }

}


/* =========================================================
   OPEN GENERATOR
========================================================= */

function openGenerator(
    type = "first"
) {
    editingCertificate =
        null;

    selectTemplate(
        type
    );

    setDefaultDate();

    clearGenerationState();


    if (elements.number) {

        elements.number.value =
            "";

    }


    if (elements.name) {

        elements.name.value =
            "";

    }


    if (elements.event) {

        elements.event.value =
            "";

    }

    if (elements.generate) {

        elements.generate.innerHTML =
            `<i class="fa-solid fa-certificate"></i>
             Issue Certificate`;
    }

    updatePreview();


    if (elements.modal) {

        elements.modal.hidden =
            false;

        elements.modal.style.display =
            "flex";

    }


    document.body.classList.add(
        "modal-open"
    );


    setTimeout(
        () => {

            elements.name?.focus();

        },
        100
    );

}


/* =========================================================
   CLOSE GENERATOR
========================================================= */

function closeGenerator() {

    if (generationInProgress) {
        return;
    }

    if (elements.modal) {
        elements.modal.hidden = true;
        elements.modal.style.display = "none";
    }

    if (elements.picker) {
        elements.picker.hidden = true;
        elements.picker.style.display = "none";
    }

    document.body.classList.remove(
        "modal-open"
    );

    /*
       Clear edit mode after closing.
    */

    editingCertificate = null;
}


/* =========================================================
   SHOW GENERATION STATUS
========================================================= */

function showGenerationStatus(
    message,
    type = ""
) {

    if (!elements.status) {
        return;
    }


    elements.status.hidden =
        false;

    elements.status.style.display =
        "";


    elements.status.textContent =
        message;


    elements.status.className =
        `generation-status ${type}`.trim();

}


/* =========================================================
   SHOW DUPLICATE MESSAGE
========================================================= */

function showDuplicateMessage(
    message,
    success = false
) {

    if (!elements.duplicate) {
        return;
    }


    elements.duplicate.hidden =
        false;

    elements.duplicate.style.display =
        "";


    elements.duplicate.className =
        success
            ? "field-message success"
            : "field-message";


    elements.duplicate.textContent =
        message;

}


/* =========================================================
   CHECK CERTIFICATE EXISTENCE
   ---------------------------------------------------------
   New certificate:
   - Existing ID = duplicate

   Edit certificate:
   - Same current ID = allowed
   - Different existing ID = duplicate
========================================================= */

async function certificateExists(
    certificateId,
    ignoreCurrentCertificate = false
) {

    if (!certificateId) {
        return false;
    }


    /*
     * EDIT MODE
     *
     * If the ID belongs to the certificate
     * currently being edited, it is NOT a duplicate.
     */

    if (
        ignoreCurrentCertificate &&
        editingCertificate
    ) {

        const editingId =
            editingCertificate.certificateId ||
            editingCertificate.id ||
            "";

        if (
            String(editingId).trim().toUpperCase() ===
            String(certificateId).trim().toUpperCase()
        ) {

            return false;
        }
    }


    const certificateRef =
        doc(
            db,
            CERTIFICATE_COLLECTION,
            certificateId
        );


    const snapshot =
        await getDoc(
            certificateRef
        );


    return snapshot.exists();
}


/* =========================================================
   CHECK SELECTED NUMBER
   ---------------------------------------------------------
   New certificate:
   - Existing number = duplicate

   Edit certificate:
   - Current certificate number = allowed
   - Another existing number = duplicate
========================================================= */

async function checkSelectedNumber() {

    const number =
        normalizeNumber(
            elements.number?.value
        );

    if (!number) {

        if (elements.duplicate) {

            elements.duplicate.hidden = true;

            elements.duplicate.style.display =
                "none";
        }

        return false;
    }


    /*
       IMPORTANT:
       Do NOT modify elements.number.value here.

       If user entered 001,
       it must remain 001 in the input.
    */


    const certificateId =
        buildCertificateId(
            number
        );


    try {

        /* -------------------------------------------------
           EDIT MODE
           -------------------------------------------------
           If the certificate being edited already has
           this same certificate ID, it is NOT a duplicate.
        ------------------------------------------------- */

        if (editingCertificate) {

            const editingId =
                editingCertificate.certificateId ||
                editingCertificate.id ||
                "";


            const normalizedEditingId =
                String(editingId)
                    .trim()
                    .toUpperCase();


            if (
                normalizedEditingId ===
                certificateId.toUpperCase()
            ) {

                showDuplicateMessage(
                    `${certificateId} is the current certificate.`,
                    true
                );

                return false;
            }
        }


        /* -------------------------------------------------
           CHECK FIRESTORE
        ------------------------------------------------- */

        const exists =
            await certificateExists(
                certificateId
            );


        if (exists) {

            showDuplicateMessage(
                `${certificateId} has already been issued. Please choose another certificate number.`,
                false
            );

            return true;
        }


        /* -------------------------------------------------
           AVAILABLE
        ------------------------------------------------- */

        showDuplicateMessage(
            `${certificateId} is available.`,
            true
        );

        return false;


    } catch (error) {

        console.error(
            "Duplicate check error:",
            error
        );


        showDuplicateMessage(
            "Unable to check this certificate number. Please try again.",
            false
        );


        return true;
    }
}


/* =========================================================
   WAIT FOR IMAGES
========================================================= */

async function waitForImages(
    container
) {

    if (!container) {

        return;

    }


    const images =
        [
            ...container.querySelectorAll(
                "img"
            )
        ];


    await Promise.all(

        images.map(
            image => {

                return new Promise(
                    resolve => {

                        if (
                            image.complete &&
                            image.naturalWidth > 0
                        ) {

                            resolve();

                            return;

                        }


                        const finish =
                            () => {

                                image.removeEventListener(
                                    "load",
                                    finish
                                );

                                image.removeEventListener(
                                    "error",
                                    finish
                                );

                                resolve();

                            };


                        image.addEventListener(
                            "load",
                            finish,
                            {
                                once: true
                            }
                        );


                        image.addEventListener(
                            "error",
                            finish,
                            {
                                once: true
                            }
                        );


                        setTimeout(
                            resolve,
                            30000
                        );

                    }
                );

            }
        )

    );

}


/* =========================================================
   RENDER CERTIFICATE TO CANVAS
========================================================= */

async function renderCertificatePNG() {

    if (
        !elements.certificatePreview
    ) {

        throw new Error(
            "Certificate preview element was not found."
        );

    }


    await waitForImages(
        elements.certificatePreview
    );


    if (
        document.fonts &&
        document.fonts.ready
    ) {

        await document.fonts.ready;

    }


    await new Promise(
        resolve => {

            requestAnimationFrame(
                () => {

                    requestAnimationFrame(
                        resolve
                    );

                }
            );

        }
    );


    if (
        typeof html2canvas ===
        "undefined"
    ) {

        throw new Error(
            "html2canvas is not loaded."
        );

    }


    /*
       scale 4 gives a much better source image.

       The certificate itself can therefore be
       displayed smaller while retaining quality.
    */

    const canvas =
        await html2canvas(
            elements.certificatePreview,
            {

                scale: 4,

                useCORS: true,

                allowTaint: false,

                backgroundColor:
                    "#ffffff",

                imageTimeout:
                    30000,

                logging:
                    false,

                removeContainer:
                    true,

                foreignObjectRendering:
                    false

            }
        );


    return canvas;

}


/* =========================================================
   CANVAS → PNG BLOB
========================================================= */

function canvasToPNGBlob(
    canvas
) {

    return new Promise(
        (resolve, reject) => {

            canvas.toBlob(
                blob => {

                    if (!blob) {

                        reject(
                            new Error(
                                "Unable to create PNG image."
                            )
                        );

                        return;

                    }


                    resolve(
                        blob
                    );

                },
                "image/png",
                1
            );

        }
    );

}


/* =========================================================
   GET FIREBASE ID TOKEN
========================================================= */

async function getAuthToken() {

    if (!currentUser) {

        throw new Error(
            "Your admin session has expired. Please sign in again."
        );

    }


    return await currentUser.getIdToken(
        true
    );

}


/* =========================================================
   UPLOAD PNG TO CLOUDFLARE R2
========================================================= */

async function uploadToR2(
    blob,
    certificateId
) {

    if (!blob) {

        throw new Error(
            "Certificate image is empty."
        );

    }


    const token =
        await getAuthToken();


    const filename =
        `${certificateId}.png`;


    const key =
        `${R2_CERTIFICATE_FOLDER}/${CURRENT_YEAR}/${filename}`;


    const uploadUrl =
        `${WORKER_URL}/api/upload` +
        `?key=${encodeURIComponent(key)}` +
        `&filename=${encodeURIComponent(filename)}`;


    let response;


    try {

        response =
            await fetch(
                uploadUrl,
                {

                    method: "PUT",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "image/png"

                    },

                    body: blob

                }
            );

    } catch (error) {

        console.error(
            "R2 network error:",
            error
        );


        throw new Error(
            "Unable to connect to the Cloudflare media server. Check your internet connection or Worker CORS settings."
        );

    }


    let data =
        {};


    try {

        data =
            await response.json();

    } catch {

        data =
            {};

    }


    if (!response.ok) {

        throw new Error(
            data.error ||
            `Cloudflare upload failed (${response.status}).`
        );

    }


    if (!data.success) {

        throw new Error(
            data.error ||
            "Cloudflare R2 upload was unsuccessful."
        );

    }


    /*
       Worker response currently returns:

       object.publicUrl
    */

    const publicUrl =
        data?.object?.publicUrl ||
        data?.publicUrl ||
        data?.url ||
        "";


    if (!publicUrl) {

        throw new Error(
            "Certificate uploaded to R2, but the Worker did not return a public URL."
        );

    }


    return {

        key,

        publicUrl

    };

}


/* =========================================================
   DELETE R2 OBJECT IF FIREBASE SAVE FAILS
   ---------------------------------------------------------
   This is optional cleanup.

   We do NOT depend on this for certificate issuance.
========================================================= */

async function deleteFromR2(
    key
) {

    if (!key) {

        return false;

    }


    try {

        const token =
            await getAuthToken();


        const url =
            `${WORKER_URL}/api/delete?key=${encodeURIComponent(
                key
            )}`;


        const response =
            await fetch(
                url,
                {

                    method: "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"

                    }

                }
            );


        if (!response.ok) {

            console.warn(
                "R2 cleanup failed:",
                response.status
            );

            return false;

        }


        return true;

    } catch (error) {

        console.warn(
            "R2 cleanup error:",
            error
        );

        return false;

    }

}


/* =========================================================
   BUILD CERTIFICATE DATA
========================================================= */

function buildCertificateData(
    certificateId,
    certificateNumber,
    issueDate,
    name,
    event,
    eventImage,
    uploaded
) {

    const template =
        templates[selectedTemplate];


    const verificationUrl =
        `${VERIFY_URL}?id=${encodeURIComponent(
            certificateId
        )}`;


    return {

        certificateId,

        certificateNumber,

        year:
            CURRENT_YEAR,

        name,

        event,

        eventImage,

        position:
            template.name,

        category:
            template.name,

        certificateType:
            template.subtitle,

        issueDate,

        template:
            selectedTemplate,

        certificateImage:
            uploaded.publicUrl,

        r2Key:
            uploaded.key,

        verificationUrl,

        status:
            "Issued",

        issuedBy:
            currentUser.uid,

        issuedByEmail:
            currentUser.email || "",

        createdAt:
            editingCertificate
                ? (
                    editingCertificate.createdAt ||
                    serverTimestamp()
                )
                : serverTimestamp(),

        updatedAt:
            serverTimestamp()

    };
}

/* =========================================================
   ISSUE CERTIFICATE
========================================================= */

async function issueCertificate() {

    if (
        generationInProgress
    ) {

        return;

    }


    if (!currentUser) {

        showToast(
            "You are not authenticated.",
            "error"
        );

        return;

    }


    const name =
        elements.name?.value.trim() ||
        "";

    const event =
        elements.event?.value.trim() ||
        "";

    const eventImage =
        elements.eventImage?.value.trim() ||
        "";

    const issueDate =
        elements.date?.value ||
        "";

    const number =
        normalizeNumber(
            elements.number?.value
        );


    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (!name) {

        showToast(
            "Enter the recipient name.",
            "error"
        );

        elements.name?.focus();

        return;

    }


    if (!event) {

        showToast(
            "Enter the event or competition name.",
            "error"
        );

        elements.event?.focus();

        return;

    }

    if (!eventImage) {

        showToast(
            "Enter the event photo URL.",
            "error"
        );

        elements.eventImage?.focus();

        return;
    }


    /* Validate URL */

    try {

        new URL(eventImage);

    } catch {

        showToast(
            "Enter a valid event photo URL.",
            "error"
        );

        elements.eventImage?.focus();

        return;
    }

    if (!issueDate) {

        showToast(
            "Select the issue date.",
            "error"
        );

        elements.date?.focus();

        return;

    }


   if (!number) {
    showToast(
        "Choose a certificate number from 1 to 9999.",
        "error"
    );

    elements.number?.focus();

    return;
}


    const certificateNumber =
        number;


    const certificateId =
        buildCertificateId(
            certificateNumber
        );


    if (elements.number) {

        elements.number.value =
            formatCertificateNumber(
                certificateNumber
            );

    }


    updatePreview();


    generationInProgress =
        true;


    if (elements.generate) {

        elements.generate.disabled =
            true;

    }


    if (elements.duplicate) {

        elements.duplicate.hidden =
            true;

        elements.duplicate.style.display =
            "none";

    }


    let uploadedObject =
        null;


    try {

        /* =================================================
   STEP 1 — DUPLICATE CHECK
================================================= */

showGenerationStatus(
    `Checking ${certificateId}...`
);


const exists =
    await certificateExists(
        certificateId,
        Boolean(editingCertificate)
    );


if (exists) {

    showDuplicateMessage(
        `${certificateId} has already been issued. Please choose another certificate number.`,
        false
    );


    showGenerationStatus(
        "Certificate number is already in use.",
        "error"
    );


    return;
}


        /* =================================================
           STEP 2 — GENERATE IMAGE
        ================================================= */

        showGenerationStatus(
            "Generating high-resolution certificate image..."
        );


        const canvas =
            await renderCertificatePNG();


        const blob =
            await canvasToPNGBlob(
                canvas
            );


        console.log(
            "Certificate PNG:",
            {
                width:
                    canvas.width,

                height:
                    canvas.height,

                size:
                    blob.size
            }
        );


        /* =================================================
           STEP 3 — UPLOAD TO R2
        ================================================= */

        showGenerationStatus(
            "Uploading certificate image to Cloudflare R2..."
        );


        uploadedObject =
            await uploadToR2(
                blob,
                certificateId
            );


        /* =================================================
   STEP 4 — FINAL DUPLICATE CHECK
   -------------------------------------------------
   In EDIT mode, the existing certificate is expected.
================================================= */

showGenerationStatus(
    "Performing final certificate ID check..."
);


const finalCheck =
    await getDoc(
        doc(
            db,
            CERTIFICATE_COLLECTION,
            certificateId
        )
    );


const isEditingSameCertificate =
    editingCertificate &&
    (
        editingCertificate.certificateId ||
        editingCertificate.id
    ) === certificateId;


if (
    finalCheck.exists() &&
    !isEditingSameCertificate
) {

    /*
     * Another certificate has claimed this ID.
     */

    await deleteFromR2(
        uploadedObject.key
    );


    throw new Error(
        `${certificateId} was just issued by another admin. The generated image was removed. Please choose another number.`
    );
}


        /* =================================================
           STEP 5 — FIREBASE RECORD
        ================================================= */

        showGenerationStatus(
            "Saving certificate record to Firebase..."
        );


        const certificateData =
    buildCertificateData(
        certificateId,
        certificateNumber,
        issueDate,
        name,
        event,
        eventImage,
        uploadedObject
    );

        const certificateRef =
    doc(
        db,
        CERTIFICATE_COLLECTION,
        certificateId
    );


if (editingCertificate) {

    /*
     * UPDATE EXISTING CERTIFICATE
     */

    await updateDoc(
        certificateRef,
        certificateData
    );

} else {

    /*
     * CREATE NEW CERTIFICATE
     */

    await setDoc(
        certificateRef,
        certificateData
    );

}


        /* =================================================
           SUCCESS
        ================================================= */

        showGenerationStatus(
            "Certificate issued successfully.",
            "success"
        );


        showToast(
            `${certificateId} issued successfully.`,
            "success"
        );


        /*
           Reload the issued certificate list.
        */

        await loadIssuedCertificates();


        /*
           Keep the success message visible briefly
           before closing the generator.
        */

        setTimeout(
            () => {

                if (
                    !generationInProgress
                ) {

                    return;

                }


                generationInProgress =
                    false;


                closeGenerator();

            },
            1000
        );


    } catch (error) {

        console.error(
            "Certificate generation error:",
            error
        );


        showGenerationStatus(
            error?.message ||
            "Unable to issue certificate.",
            "error"
        );


        showToast(
            error?.message ||
            "Unable to issue certificate.",
            "error"
        );


    } finally {

        /*
           Don't re-enable during the short success
           closing animation.
        */

        if (
            elements.generate &&
            elements.status?.classList.contains(
                "success"
            ) === false
        ) {

            elements.generate.disabled =
                false;

        }


        /*
           If an error occurred, allow another attempt.
        */

        if (
            elements.status?.classList.contains(
                "error"
            )
        ) {

            generationInProgress =
                false;

        }

    }

}


/* =========================================================
   LOAD ISSUED CERTIFICATES
========================================================= */

async function loadIssuedCertificates() {

    setSectionState(
        "loading"
    );


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    CERTIFICATE_COLLECTION
                )
            );


        allCertificates =
            snapshot.docs.map(
                certificateDocument => {

                    return {

                        id:
                            certificateDocument.id,

                        ...certificateDocument.data()

                    };

                }
            );


        /*
           Sort newest certificate number first.
        */

        allCertificates.sort(
            (a, b) => {

                const numberA =
                    Number(
                        a.certificateNumber ||
                        String(
                            a.certificateId ||
                            ""
                        ).match(
                            /(\d+)$/
                        )?.[1] ||
                        0
                    );


                const numberB =
                    Number(
                        b.certificateNumber ||
                        String(
                            b.certificateId ||
                            ""
                        ).match(
                            /(\d+)$/
                        )?.[1] ||
                        0
                    );


                return (
                    numberB -
                    numberA
                );

            }
        );


        if (
            !allCertificates.length
        ) {

            setSectionState(
                "empty"
            );

            return;

        }


        setSectionState(
            "ready"
        );


        renderIssuedCertificates(
            allCertificates
        );


    } catch (error) {

        console.error(
            "Load certificates error:",
            error
        );


        setSectionState(
            "error",
            error?.message ||
            "Unable to load certificates from Firebase."
        );

    }

}


/* =========================================================
   FIND CERTIFICATE
========================================================= */

function findCertificate(
    certificateId
) {

    return allCertificates.find(
        certificate =>

            certificate.certificateId ===
            certificateId ||

            certificate.id ===
            certificateId
    );

}


/* =========================================================
   RENDER ISSUED CERTIFICATES
========================================================= */

function renderIssuedCertificates(
    certificates
) {

    if (!elements.issued) {

        return;

    }


    const term =
        elements.search?.value
            .trim()
            .toLowerCase() ||
        "";


    const filtered =
        certificates.filter(
            certificate => {

                const searchableText = [

                    certificate.certificateId,

                    certificate.name,

                    certificate.event,

                    certificate.position,

                    certificate.category,

                    certificate.certificateType,

                    certificate.status

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                return (
                    !term ||
                    searchableText.includes(
                        term
                    )
                );

            }
        );


    elements.issued.innerHTML =
        "";


    if (!filtered.length) {

        if (elements.issuedWrap) {

            elements.issuedWrap.style.display =
                "none";

        }


        if (elements.issuedEmpty) {

            elements.issuedEmpty.hidden =
                false;

            elements.issuedEmpty.style.display =
                "";

            elements.issuedEmpty.innerHTML = `

                <i class="fa-solid fa-magnifying-glass"></i>

                <strong>
                    No matching certificates
                </strong>

                <span>
                    Try another certificate ID,
                    recipient name or event.
                </span>

            `;

        }


        return;

    }


    if (elements.issuedEmpty) {

        elements.issuedEmpty.hidden =
            true;

        elements.issuedEmpty.style.display =
            "none";

    }


    if (elements.issuedWrap) {

        elements.issuedWrap.style.display =
            "block";

    }


    filtered.forEach(
        certificate => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "issued-card";


            const image =
                certificate.certificateImage ||
                "";


            const certificateId =
                certificate.certificateId ||
                certificate.id ||
                "";


            const name =
                certificate.name ||
                "Certificate Holder";


            const eventName =
                certificate.event ||
                "Club Event";


            const position =
                certificate.position ||
                certificate.certificateType ||
                "Certificate";


            card.innerHTML = `

                <div class="issued-image-wrap">

                    ${image

                    ? `

                                <img
                                    class="issued-image"
                                    src="${safe(image)}"
                                    alt="${safe(name)} certificate"
                                    loading="lazy"
                                    crossorigin="anonymous"
                                    referrerpolicy="no-referrer"
                                >

                              `

                    : `

                                <div
                                    class="issued-image issued-image-placeholder"
                                >
                                    <i class="fa-solid fa-certificate"></i>
                                </div>

                              `
                }


                    <span class="issued-status">
                        ${safe(
                    certificate.status ||
                    "Issued"
                )}
                    </span>

                </div>


                <div class="issued-body">

                    <div class="issued-name">
                        ${safe(name)}
                    </div>


                    <div class="issued-title">
                        ${safe(position)}
                    </div>


                    <div class="issued-meta">

                        <div class="issued-meta-row">

                            <strong>
                                Event
                            </strong>

                            <span>
                                ${safe(eventName)}
                            </span>

                        </div>


                        <div class="issued-meta-row">

                            <strong>
                                Date
                            </strong>

                            <span>
                                ${safe(
                    formatDate(
                        certificate.issueDate
                    )
                )}
                            </span>

                        </div>


                        <div class="issued-meta-row">

                            <strong>
                                ID
                            </strong>

                            <span
                                class="issued-id"
                            >
                                ${safe(
                    certificateId
                )}
                            </span>

                        </div>

                    </div>


                    <div class="issued-actions">

    <button
        type="button"
        class="issued-action primary"
        data-action="view"
        data-id="${safe(certificateId)}"
    >
        <i class="fa-solid fa-eye"></i>
        View
    </button>


    <button
        type="button"
        class="issued-action"
        data-action="edit"
        data-id="${safe(certificateId)}"
    >
        <i class="fa-solid fa-pen-to-square"></i>
        Edit
    </button>


    <button
        type="button"
        class="issued-action"
        data-action="share"
        data-id="${safe(certificateId)}"
    >
        <i class="fa-solid fa-share-nodes"></i>
        Share
    </button>


    <button
        type="button"
        class="issued-action"
        data-action="download"
        data-id="${safe(certificateId)}"
    >
        <i class="fa-solid fa-download"></i>
        Download
    </button>


    <button
        type="button"
        class="issued-action danger"
        data-action="delete"
        data-id="${safe(certificateId)}"
    >
        <i class="fa-solid fa-trash"></i>
        Delete
    </button>

</div>

            `;


            elements.issued.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   EDIT CERTIFICATE
========================================================= */

function openEditGenerator(certificate) {

    if (!certificate) {
        return;
    }


    editingCertificate =
        certificate;


    const certificateId =
        certificate.certificateId ||
        certificate.id ||
        "";


    /*
       Select existing template
    */

    selectTemplate(
        certificate.template ||
        "first"
    );


    /*
       Fill existing data
    */

    if (elements.name) {

        elements.name.value =
            certificate.name ||
            "";
    }


    if (elements.event) {

        elements.event.value =
            certificate.event ||
            "";
    }


    if (elements.eventImage) {

        elements.eventImage.value =
            certificate.eventImage ||
            "";
    }


    if (elements.date) {

        elements.date.value =
            certificate.issueDate ||
            "";
    }


    if (elements.number) {

        const number =
            certificate.certificateNumber ||
            String(certificateId)
                .match(/(\d+)$/)?.[1] ||
            "";

        elements.number.value =
            formatCertificateNumber(
                Number(number)
            );

        /*
           Certificate number cannot be
           changed during edit.
        */

        elements.number.disabled =
            true;
    }


    /*
       Change button text
    */

    if (elements.generate) {

        elements.generate.innerHTML =
            `<i class="fa-solid fa-save"></i>
             Update Certificate`;
    }


    clearGenerationState();

    updatePreview();


    /*
       Open modal
    */

    if (elements.modal) {

        elements.modal.hidden =
            false;

        elements.modal.style.display =
            "flex";
    }


    document.body.classList.add(
        "modal-open"
    );


    setTimeout(
        () => {

            elements.name?.focus();

        },
        100
    );
}


/* =========================================================
   VIEW CERTIFICATE
========================================================= */

function viewCertificate(
    certificate
) {

    if (!certificate) {

        return;

    }


    const certificateId =
        certificate.certificateId ||
        certificate.id;


    if (!certificateId) {

        showToast(
            "Certificate ID is unavailable.",
            "error"
        );

        return;

    }


    const url =
        certificate.verificationUrl ||
        `${VERIFY_URL}?id=${encodeURIComponent(
            certificateId
        )}`;


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   COPY TEXT
========================================================= */

async function copyText(
    text
) {

    if (!text) {

        throw new Error(
            "Nothing to copy."
        );

    }


    /*
       Modern clipboard API.
    */

    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        await navigator.clipboard.writeText(
            text
        );

        return;

    }


    /*
       Fallback for localhost/older browsers.
    */

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;

    textarea.style.position =
        "fixed";

    textarea.style.left =
        "-9999px";

    textarea.style.top =
        "-9999px";


    document.body.appendChild(
        textarea
    );


    textarea.focus();

    textarea.select();


    const successful =
        document.execCommand(
            "copy"
        );


    textarea.remove();


    if (!successful) {

        throw new Error(
            "Unable to copy the verification link."
        );

    }

}


/* =========================================================
   SHARE CERTIFICATE
========================================================= */

async function shareCertificate(
    certificate
) {

    if (!certificate) {

        return;

    }


    const certificateId =
        certificate.certificateId ||
        certificate.id;


    if (!certificateId) {

        showToast(
            "Certificate ID is unavailable.",
            "error"
        );

        return;

    }


    const url =
        certificate.verificationUrl ||
        `${VERIFY_URL}?id=${encodeURIComponent(
            certificateId
        )}`;


    const name =
        certificate.name ||
        "Certificate holder";


    const text =
        `${name} has received a certificate from Sun Shine Club – Kendupalli.\n\nCertificate ID: ${certificateId}\n\nVerify certificate:\n${url}`;


    try {

        /*
           Mobile/native share.
        */

        if (
            typeof navigator.share ===
            "function"
        ) {

            await navigator.share(
                {

                    title:
                        `Sun Shine Club Certificate – ${certificateId}`,

                    text,

                    url

                }
            );


            return;

        }


        /*
           Desktop fallback.
        */

        await copyText(
            url
        );


        showToast(
            "Verification link copied.",
            "success"
        );


    } catch (error) {

        /*
           User pressed Cancel on native share.
        */

        if (
            error?.name ===
            "AbortError"
        ) {

            return;

        }


        console.error(
            "Share error:",
            error
        );


        /*
           Try copy fallback.
        */

        try {

            await copyText(
                url
            );


            showToast(
                "Verification link copied instead.",
                "success"
            );

        } catch {

            showToast(
                "Unable to share the certificate.",
                "error"
            );

        }

    }

}

/* =========================================================
   DELETE CERTIFICATE
========================================================= */

async function deleteCertificate(
    certificate
) {

    if (!certificate) {
        return;
    }


    const certificateId =
        certificate.certificateId ||
        certificate.id ||
        "";


    if (!certificateId) {

        showToast(
            "Certificate ID is unavailable.",
            "error"
        );

        return;
    }


    const confirmed =
        window.confirm(
            `Delete certificate ${certificateId}?\n\n` +
            `This will permanently remove the certificate record.`
        );


    if (!confirmed) {
        return;
    }


    const cardButton =
        document.querySelector(
            `[data-action="delete"][data-id="${CSS.escape(certificateId)}"]`
        );


    if (cardButton) {
        cardButton.disabled = true;
    }


    try {

        showToast(
            `Deleting ${certificateId}...`
        );


        /*
           First attempt to remove the
           certificate image from R2.
        */

        let r2Deleted = true;


        if (certificate.r2Key) {

            r2Deleted =
                await deleteFromR2(
                    certificate.r2Key
                );
        }


        /*
           Delete Firebase record.
        */

        await deleteDoc(
            doc(
                db,
                CERTIFICATE_COLLECTION,
                certificateId
            )
        );


        /*
           Remove from local array.
        */

        allCertificates =
            allCertificates.filter(
                item =>
                    (item.certificateId ||
                     item.id) !==
                    certificateId
            );


        renderIssuedCertificates(
            allCertificates
        );


        if (r2Deleted === false) {

            showToast(
                `${certificateId} deleted from Firebase, but the R2 image could not be removed.`,
                "error"
            );

        } else {

            showToast(
                `${certificateId} deleted successfully.`,
                "success"
            );
        }


    } catch (error) {

        console.error(
            "Delete certificate error:",
            error
        );


        showToast(
            error?.message ||
            "Unable to delete certificate.",
            "error"
        );


        if (cardButton) {
            cardButton.disabled = false;
        }
    }
}


/* =========================================================
   DOWNLOAD CERTIFICATE
   ---------------------------------------------------------
   IMPORTANT:
   Do NOT simply use:

       <a href="R2_URL" download>

   because the R2 URL is cross-origin.

   We fetch the file, convert it to a Blob,
   create a temporary local object URL,
   and then download that object.
========================================================= */

async function downloadCertificate(
    certificate
) {

    if (!certificate) {

        return;

    }


    const certificateId =
        certificate.certificateId ||
        certificate.id;


    const imageUrl =
        certificate.certificateImage ||
        "";


    if (!imageUrl) {

        showToast(
            "Certificate image URL is unavailable.",
            "error"
        );

        return;

    }


    const filename =
        `${certificateId || "certificate"}.png`;


    /*
       Show a temporary toast.
    */

    showToast(
        "Preparing certificate download...",
        ""
    );


    try {

        /*
           Fetch image from R2.

           This requires R2 CORS to allow GET
           from the admin website.
        */

        const response =
            await fetch(
                imageUrl,
                {
                    method: "GET",

                    mode: "cors",

                    cache: "no-cache",

                    credentials: "omit"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Certificate download failed (${response.status}).`
            );

        }


        const blob =
            await response.blob();


        if (
            !blob ||
            blob.size === 0
        ) {

            throw new Error(
                "The downloaded certificate file is empty."
            );

        }


        /*
           Create temporary local URL.
        */

        const blobUrl =
            URL.createObjectURL(
                blob
            );


        /*
           Create invisible download link.
        */

        const link =
            document.createElement(
                "a"
            );


        link.href =
            blobUrl;

        link.download =
            filename;

        link.style.display =
            "none";


        document.body.appendChild(
            link
        );


        link.click();


        /*
           Remove after browser receives
           the download request.
        */

        setTimeout(
            () => {

                link.remove();

                URL.revokeObjectURL(
                    blobUrl
                );

            },
            1500
        );


        showToast(
            `${filename} downloaded.`,
            "success"
        );


    } catch (error) {

        console.error(
            "Certificate download error:",
            error
        );


        /*
           The most common reason here is R2 CORS.
        */

        if (
            error instanceof TypeError
        ) {

            showToast(
                "Download blocked by R2 CORS. Make sure your R2 bucket allows GET requests from this website.",
                "error"
            );

            return;

        }


        showToast(
            error?.message ||
            "Unable to download the certificate.",
            "error"
        );

    }

}


/* =========================================================
   ISSUED CERTIFICATE ACTIONS
========================================================= */

document.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                "[data-action]"
            );


        if (!button) {

            return;

        }


        const certificate =
            findCertificate(
                button.dataset.id
            );


        if (!certificate) {

            showToast(
                "Certificate record not found.",
                "error"
            );

            return;

        }


        const action =
            button.dataset.action;


        if (action === "view") {

            viewCertificate(
                certificate
            );

        }

        if (action === "edit") {

    openEditGenerator(certificate);

    return;
}


if (action === "delete") {

    await deleteCertificate(certificate);

    return;
}


        if (action === "share") {

            button.disabled =
                true;

            try {

                await shareCertificate(
                    certificate
                );

            } finally {

                button.disabled =
                    false;

            }

        }


        if (action === "download") {

            button.disabled =
                true;

            try {

                await downloadCertificate(
                    certificate
                );

            } finally {

                button.disabled =
                    false;

            }

        }

    }
);


/* =========================================================
   SEARCH
========================================================= */

elements.search?.addEventListener(
    "input",
    () => {

        renderIssuedCertificates(
            allCertificates
        );

    }
);


/* =========================================================
   REFRESH
========================================================= */

elements.refresh?.addEventListener(
    "click",
    async () => {

        elements.refresh.disabled =
            true;


        try {

            await loadIssuedCertificates();

        } finally {

            elements.refresh.disabled =
                false;

        }

    }
);


/* =========================================================
   HORIZONTAL SCROLL
========================================================= */

elements.scrollLeft?.addEventListener(
    "click",
    () => {

        elements.issued?.scrollBy(
            {
                left: -360,
                behavior: "smooth"
            }
        );

    }
);


elements.scrollRight?.addEventListener(
    "click",
    () => {

        elements.issued?.scrollBy(
            {
                left: 360,
                behavior: "smooth"
            }
        );

    }
);


/* =========================================================
   TEMPLATE BUTTONS
========================================================= */

document
    .querySelectorAll(
        ".use-template-btn"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const type =
                        button.dataset.template ||
                        "first";


                    openGenerator(
                        type
                    );

                }
            );

        }
    );


/* =========================================================
   OPEN GENERATE BUTTON
========================================================= */

elements.openGenerate?.addEventListener(
    "click",
    event => {

        event.preventDefault();

        console.log("Generate Certificate clicked");

        if (!elements.picker) {

            console.error(
                "Template picker #templatePicker not found."
            );

            showToast(
                "Template picker could not be opened.",
                "error"
            );

            return;
        }

        elements.picker.hidden = false;
        elements.picker.style.display = "flex";

    }
);


/* =========================================================
   CHANGE TEMPLATE
========================================================= */

elements.changeTemplate?.addEventListener(
    "click",
    () => {

        if (elements.picker) {

            elements.picker.hidden =
                false;

            elements.picker.style.display =
                "flex";

        }

    }
);


/* =========================================================
   CLOSE TEMPLATE PICKER
========================================================= */

elements.closePicker?.addEventListener(
    "click",
    () => {

        if (elements.picker) {

            elements.picker.hidden =
                true;

            elements.picker.style.display =
                "none";

        }

    }
);


/* =========================================================
   TEMPLATE PICKER SELECTION
========================================================= */

document
    .querySelectorAll(
        ".picker-template"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const type =
                        button.dataset.template ||
                        "first";


                    if (elements.picker) {

                        elements.picker.hidden =
                            true;

                        elements.picker.style.display =
                            "none";

                    }


                    openGenerator(
                        type
                    );

                }
            );

        }
    );


/* =========================================================
   CLOSE GENERATOR
========================================================= */

elements.closeModal?.addEventListener(
    "click",
    closeGenerator
);


elements.cancelGenerate?.addEventListener(
    "click",
    closeGenerator
);


/* =========================================================
   CLICK MODAL BACKDROP
========================================================= */

elements.modal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            elements.modal
        ) {

            closeGenerator();

        }

    }
);


/* =========================================================
   CLICK TEMPLATE PICKER BACKDROP
========================================================= */

elements.picker?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            elements.picker
        ) {

            elements.picker.hidden =
                true;

            elements.picker.style.display =
                "none";

        }

    }
);


/* =========================================================
   GENERATE BUTTON
========================================================= */

elements.generate?.addEventListener(
    "click",
    issueCertificate
);


/* =========================================================
   LIVE PREVIEW INPUTS
========================================================= */

[
    elements.name,
    elements.event,
    elements.date,
    elements.number
]
    .filter(Boolean)
    .forEach(
        input => {

            input.addEventListener(
                "input",
                () => {

                    updatePreview();


                    /*
                       Do not display an old
                       duplicate result while
                       the admin is typing.
                    */

                    if (
                        elements.duplicate
                    ) {

                        elements.duplicate.hidden =
                            true;

                        elements.duplicate.style.display =
                            "none";

                    }

                }
            );

        }
    );


/* =========================================================
   NUMBER FIELD
========================================================= */

elements.number?.addEventListener(
    "blur",
    async () => {

        /*
         * Don't perform duplicate checking
         * when the number field is disabled
         * during Edit mode.
         */

        if (
            elements.number.disabled
        ) {

            return;
        }


        const duplicate =
            await checkSelectedNumber();


        if (!duplicate) {

            updatePreview();

        }

    }
);


elements.number?.addEventListener(
    "change",
    async () => {

        /*
         * Don't perform duplicate checking
         * when editing an existing certificate.
         */

        if (
            elements.number.disabled
        ) {

            return;
        }


        const duplicate =
            await checkSelectedNumber();


        if (!duplicate) {

            updatePreview();

        }

    }
);


/* =========================================================
   NUMBER FIELD - CLEAN INPUT
========================================================= */

elements.number?.addEventListener(
    "input",
    () => {

        const raw =
            elements.number.value;


        /*
           Only allow numbers.
        */

        const cleaned =
            raw.replace(
                /\D/g,
                ""
            );


        /*
           Limit to 4 digits.
        */

        elements.number.value =
            cleaned.slice(
                0,
                4
            );


        updatePreview();

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


        if (
            elements.picker &&
            !elements.picker.hidden
        ) {

            elements.picker.hidden =
                true;

            elements.picker.style.display =
                "none";

            return;

        }


        if (
            elements.modal &&
            !elements.modal.hidden
        ) {

            closeGenerator();

        }

    }
);


/* =========================================================
   AUTHENTICATION
========================================================= */

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            console.warn(
                "Certificate page: no authenticated admin."
            );


            window.location.href =
                "login.html";


            return;

        }


        currentUser =
            user;


        console.log(
            "Certificate admin authenticated:",
            user.email
        );


        setAdminProfile(
            user
        );


        if (elements.templateYear) {

            elements.templateYear.textContent =
                CURRENT_YEAR;

        }


        setDefaultDate();

        selectTemplate(
            "first"
        );


        await loadIssuedCertificates();

    }
);