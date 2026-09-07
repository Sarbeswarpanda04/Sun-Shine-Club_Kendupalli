import { db } from "../../admin/js/firebase-config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================================================
   ELEMENTS
========================================================= */

const certificateInput =
    document.getElementById("certificateId");

const verifyBtn =
    document.getElementById("verifyBtn");

const searchSection =
    document.getElementById("searchSection");

const resultSection =
    document.getElementById("resultSection");

const floatingShareBtn =
    document.getElementById("floatingShareBtn");

const shareTooltip =
    document.getElementById("shareTooltip");


/* =========================================================
   WEBSITE
========================================================= */

const WEBSITE =
    "https://sunshineclubkendupalli.in";


/* =========================================================
   SHARE TOOLTIP TIMER
========================================================= */

let shareTooltipTimer = null;


/* =========================================================
   HIDE SHARE BUTTON INITIALLY
========================================================= */

hideShareButton();


/* =========================================================
   FLOATING SHARE BUTTON
========================================================= */

if (floatingShareBtn) {

    floatingShareBtn.addEventListener(
        "click",
        handleShare
    );

}


/* =========================================================
   HANDLE SHARE
========================================================= */

async function handleShare() {

    if (!floatingShareBtn) {
        return;
    }


    const verificationUrl =
        floatingShareBtn.dataset.url ||
        window.location.href;


    const certificateName =
        floatingShareBtn.dataset.name ||
        "Certificate";


    const certificateId =
        floatingShareBtn.dataset.certificateId ||
        "";


    const certificateImage =
        floatingShareBtn.dataset.image ||
        "";


    const shareText =
        `Certificate of ${certificateName}\n` +
        `Certificate ID: ${certificateId}\n` +
        `Verified by Sun Shine Club`;


    /*
    =====================================================
    1. TRY TO SHARE THE ACTUAL CERTIFICATE IMAGE

    If the browser supports Web Share file sharing,
    the certificate image itself is attached.

    The verification URL is included in the text.
    =====================================================
    */

    if (
        certificateImage &&
        navigator.share &&
        navigator.canShare
    ) {

        try {

            const response =
                await fetch(
                    certificateImage,
                    {
                        method: "GET",
                        mode: "cors",
                        credentials: "omit"
                    }
                );


            if (response.ok) {

                const blob =
                    await response.blob();


                const mimeType =
                    blob.type ||
                    "image/png";


                const extension =
                    getImageExtension(
                        mimeType,
                        certificateImage
                    );


                const certificateFile =
                    new File(
                        [blob],
                        `${certificateId || "certificate"}.${extension}`,
                        {
                            type: mimeType
                        }
                    );


                const fileShareData = {

                    title:
                        `Verified Certificate | ${certificateName}`,

                    text:
                        `${shareText}\n\n${verificationUrl}`,

                    files:
                        [
                            certificateFile
                        ]

                };


                if (
                    navigator.canShare(
                        fileShareData
                    )
                ) {

                    await navigator.share(
                        fileShareData
                    );

                    return;

                }

            }

        } catch (error) {

            /*
             * Closing the native share dialog
             * is not an error.
             */

            if (
                error &&
                error.name === "AbortError"
            ) {

                return;

            }


            console.warn(
                "Certificate image sharing unavailable:",
                error
            );

        }

    }


    /*
    =====================================================
    2. NORMAL WEB SHARE

    The Cloudflare Worker handles the verification URL
    and injects the certificate's R2 image as:

        og:image

    This allows supported social platforms to create
    a certificate-image preview.
    =====================================================
    */

    if (
        navigator.share &&
        typeof navigator.share === "function"
    ) {

        try {

            await navigator.share({

                title:
                    `Verified Certificate | ${certificateName}`,

                text:
                    shareText,

                url:
                    verificationUrl

            });


            return;

        } catch (error) {

            if (
                error &&
                error.name === "AbortError"
            ) {

                return;

            }


            console.error(
                "Native share error:",
                error
            );

        }

    }


    /*
    =====================================================
    3. CLIPBOARD FALLBACK
    =====================================================
    */

    try {

        if (
            navigator.clipboard &&
            typeof navigator.clipboard.writeText ===
                "function"
        ) {

            await navigator.clipboard.writeText(
                verificationUrl
            );


            showShareTooltip(
                "Verification link copied!"
            );


            return;

        }

    } catch (error) {

        console.error(
            "Clipboard error:",
            error
        );

    }


    /*
    =====================================================
    4. LAST RESORT
    =====================================================
    */

    window.prompt(
        "Copy this verification link:",
        verificationUrl
    );

}


/* =========================================================
   GET IMAGE EXTENSION
========================================================= */

function getImageExtension(
    mimeType,
    imageUrl
) {

    const type =
        (mimeType || "")
            .toLowerCase();


    if (
        type.includes("jpeg") ||
        type.includes("jpg")
    ) {

        return "jpg";

    }


    if (
        type.includes("webp")
    ) {

        return "webp";

    }


    if (
        type.includes("gif")
    ) {

        return "gif";

    }


    if (
        type.includes("avif")
    ) {

        return "avif";

    }


    const cleanUrl =
        String(
            imageUrl || ""
        )
            .split("?")[0]
            .split("#")[0];


    const extension =
        cleanUrl
            .split(".")
            .pop()
            ?.toLowerCase();


    if (
        extension &&
        /^[a-z0-9]{2,5}$/.test(
            extension
        )
    ) {

        return extension;

    }


    return "png";

}


/* =========================================================
   SHOW SHARE TOOLTIP
========================================================= */

function showShareTooltip(
    message = "Link copied!"
) {

    if (!shareTooltip) {
        return;
    }


    shareTooltip.textContent =
        message;


    shareTooltip.classList.add(
        "show"
    );


    clearTimeout(
        shareTooltipTimer
    );


    shareTooltipTimer =
        setTimeout(
            () => {

                shareTooltip.classList.remove(
                    "show"
                );

            },
            1800
        );

}


/* =========================================================
   SHOW SHARE BUTTON
========================================================= */

function showShareButton(
    verificationUrl,
    certificate
) {

    if (!floatingShareBtn) {
        return;
    }


    /*
    * Verification URL.
    *
    * This is also the URL processed by the
    * Cloudflare Worker.
    */

    floatingShareBtn.dataset.url =
        verificationUrl ||
        window.location.href;


    /*
    * Certificate name.
    */

    floatingShareBtn.dataset.name =
        certificate?.name ||
        "Certificate";


    /*
    * Certificate ID.
    */

    floatingShareBtn.dataset.certificateId =
        certificate?.certificateId ||
        "";


    /*
    * Actual certificate image URL.
    *
    * This is the Cloudflare R2 URL stored in
    * Firestore.
    */

    floatingShareBtn.dataset.image =
        certificate?.certificateImage ||
        "";


    /*
    * Show button.
    */

    floatingShareBtn.style.display =
        "flex";

}


/* =========================================================
   HIDE SHARE BUTTON
========================================================= */

function hideShareButton() {

    if (floatingShareBtn) {

        floatingShareBtn.style.display =
            "none";


        floatingShareBtn.removeAttribute(
            "data-url"
        );


        floatingShareBtn.removeAttribute(
            "data-name"
        );


        floatingShareBtn.removeAttribute(
            "data-certificate-id"
        );


        floatingShareBtn.removeAttribute(
            "data-image"
        );

    }


    if (shareTooltip) {

        shareTooltip.classList.remove(
            "show"
        );

    }


    clearTimeout(
        shareTooltipTimer
    );

}


/* =========================================================
   AUTO VERIFY FROM URL
========================================================= */

const params =
    new URLSearchParams(
        window.location.search
    );


const urlId =
    params
        .get("id")
        ?.trim()
        .toUpperCase();


if (urlId) {

    hideShareButton();


    if (searchSection) {

        searchSection.style.display =
            "none";

    }


    if (resultSection) {

        resultSection.style.display =
            "block";

    }


    loadCertificate(
        urlId
    );

}


/* =========================================================
   VERIFY BUTTON
========================================================= */

if (verifyBtn) {

    verifyBtn.addEventListener(
        "click",
        verifyCertificate
    );

}


/* =========================================================
   ENTER KEY
========================================================= */

if (certificateInput) {

    certificateInput.addEventListener(
        "keypress",
        (event) => {

            if (
                event.key ===
                "Enter"
            ) {

                verifyCertificate();

            }

        }
    );

}


/* =========================================================
   VERIFY CERTIFICATE
========================================================= */

function verifyCertificate() {

    if (!certificateInput) {
        return;
    }


    const id =
        certificateInput.value
            .trim()
            .toUpperCase();


    if (!id) {

        alert(
            "Please enter the Certificate ID."
        );


        certificateInput.focus();


        return;

    }


    /*
    =====================================================
    CERTIFICATE ID FORMAT

    SSC-CERT-2026-001
    =====================================================
    */

    const certificateIdPattern =
        /^SSC-CERT-\d{4}-\d{3}$/;


    if (
        !certificateIdPattern.test(
            id
        )
    ) {

        alert(
            "Invalid Certificate ID.\n\n" +
            "Use the format: SSC-CERT-YYYY-NNN"
        );


        certificateInput.focus();


        return;

    }


    /*
    * Hide old share information while
    * loading another certificate.
    */

    hideShareButton();


    if (searchSection) {

        searchSection.style.display =
            "none";

    }


    if (resultSection) {

        resultSection.style.display =
            "block";

    }


    loadCertificate(
        id
    );

}


/* =========================================================
   LOAD CERTIFICATE FROM FIRESTORE
========================================================= */

async function loadCertificate(
    id
) {

    if (!resultSection) {
        return;
    }


    /*
    * Loading screen.
    */

    resultSection.innerHTML = `

        <div class="loading">

            <div class="loader">

                <i class="fa-solid fa-spinner fa-spin"></i>

            </div>

            <h2>
                Verifying Certificate...
            </h2>

            <p>
                Please wait while we verify this certificate.
            </p>

        </div>

    `;


    try {

        /*
        =====================================================
        FIRESTORE DOCUMENT

        Collection:
            certificates

        Document:
            SSC-CERT-2026-001
        =====================================================
        */

        const certificateRef =
            doc(
                db,
                "certificates",
                id
            );


        const certificateSnapshot =
            await getDoc(
                certificateRef
            );


        /*
        =====================================================
        CERTIFICATE NOT FOUND
        =====================================================
        */

        if (
            !certificateSnapshot.exists()
        ) {

            showError(
                "Certificate ID not found in the official certificate database."
            );


            return;

        }


        /*
        =====================================================
        GET CERTIFICATE DATA
        =====================================================
        */

        const certificate = {

            id:
                certificateSnapshot.id,

            ...certificateSnapshot.data()

        };


        console.log(
            "Verified certificate:",
            certificate
        );


        /*
        =====================================================
        CHECK CERTIFICATE ID
        =====================================================
        */

        if (
            certificate.certificateId &&
            certificate.certificateId !== id
        ) {

            showError(
                "Certificate information does not match the requested Certificate ID."
            );


            return;

        }


        /*
        =====================================================
        SHOW CERTIFICATE
        =====================================================
        */

        showCertificate(
            certificate
        );


    } catch (error) {

        console.error(
            "Certificate verification error:",
            error
        );


        /*
        =====================================================
        FIRESTORE PERMISSION ERROR
        =====================================================
        */

        if (
            error.code ===
            "permission-denied"
        ) {

            showError(
                "Certificate verification is currently unavailable because the verification database is not publicly accessible."
            );


            return;

        }


        showError(
            "Unable to connect to the certificate verification database."
        );

    }

}


/* =========================================================
   SHOW CERTIFICATE
========================================================= */

function showCertificate(
    certificate
) {

    if (!resultSection) {
        return;
    }


    /* =====================================================
       STATUS
    ===================================================== */

    const isValid =
        certificate.status ===
        "Issued";


    const statusClass =
        isValid
            ? "status-valid"
            : "status-invalid";


    const statusText =
        isValid
            ? "Verified Certificate"
            : "Certificate Status Check";


    /* =====================================================
       CERTIFICATE IMAGE
       STORED IN CLOUDFLARE R2
    ===================================================== */

    const certificateImage =
        certificate.certificateImage ||
        "";


    /* =====================================================
       EVENT IMAGE
       URL ONLY
    ===================================================== */

    const eventImage =
        certificate.eventImage ||
        "";


    /* =====================================================
       VERIFICATION URL

       IMPORTANT:
       The Cloudflare Worker receives this URL.

       Example:

       /club-certificate/verify.html?id=SSC-CERT-2026-001

       Worker reads the ID, gets certificateImage
       from Firestore, and injects:

       og:image = certificateImage
    ===================================================== */

    const verificationUrl =
        certificate.verificationUrl ||
        `${WEBSITE}/club-certificate/verify.html?id=${encodeURIComponent(
            certificate.certificateId || ""
        )}`;


    /* =====================================================
       CERTIFICATE IMAGE HTML
    ===================================================== */

    const certificateImageHTML =
        certificateImage

            ? `

                <div class="certificate-image-card">

                    <div class="section-label">
                        Original Certificate
                    </div>

                    <img
                        src="${escapeHTML(
                            certificateImage
                        )}"
                        alt="Certificate of ${escapeHTML(
                            certificate.name || ""
                        )}"
                        class="certificate-main-image"
                        loading="lazy"
                    />

                </div>

            `

            : `

                <div class="certificate-image-card">

                    <div class="section-label">
                        Certificate
                    </div>

                    <div class="no-image">
                        Certificate image unavailable
                    </div>

                </div>

            `;


    /* =====================================================
       EVENT IMAGE HTML
    ===================================================== */

    const eventImageHTML =
        eventImage

            ? `

                <div class="certificate-image-card">

                    <div class="section-label">
                        Event Capture
                    </div>

                    <img
                        src="${escapeHTML(
                            eventImage
                        )}"
                        alt="${escapeHTML(
                            certificate.event ||
                            "Event"
                        )} event capture"
                        class="certificate-event-image"
                        loading="lazy"
                    />

                </div>

            `

            : `

                <div class="certificate-image-card">

                    <div class="section-label">
                        Event Capture
                    </div>

                    <div class="no-image">
                        Event photo unavailable
                    </div>

                </div>

            `;


    /* =====================================================
       INFORMATION
    ===================================================== */

    const position =
        certificate.position ||
        certificate.category ||
        "—";


    const category =
        certificate.category ||
        "—";


    const certificateType =
        certificate.certificateType ||
        "Certificate";


    const issueDate =
        certificate.issueDate ||
        "—";


    const status =
        certificate.status ||
        "Unknown";


    /* =====================================================
       RENDER RESULT
    ===================================================== */

    resultSection.innerHTML = `

        <div class="valid-result">

            <!-- CLUB BRANDING -->

            <div class="club-logo-wrap">

                <img
                    src="../assets/logo/sun-shine-club-logo.png"
                    class="club-logo"
                    alt="Sun Shine Club"
                />

            </div>


            <h1>
                Sun Shine Club
            </h1>


            <h2 class="${statusClass}">
                ${statusText}
            </h2>


            <!-- CERTIFICATE IMAGES -->

            <div class="certificate-visuals">

                ${certificateImageHTML}

                ${eventImageHTML}

            </div>


            <!-- CERTIFICATE INFORMATION -->

            <div class="result-grid">

                <div class="result-row">

                    <strong>
                        Certificate ID
                    </strong>

                    <span>
                        ${escapeHTML(
                            certificate.certificateId ||
                            "—"
                        )}
                    </span>

                </div>


                <div class="result-row">

                    <strong>
                        Name
                    </strong>

                    <span>
                        ${escapeHTML(
                            certificate.name ||
                            "—"
                        )}
                    </span>

                </div>


                <div class="result-row">

                    <strong>
                        Event
                    </strong>

                    <span>
                        ${escapeHTML(
                            certificate.event ||
                            "—"
                        )}
                    </span>

                </div>


                <div class="result-row">

                    <strong>
                        Position
                    </strong>

                    <span>
                        ${escapeHTML(
                            position
                        )}
                    </span>

                </div>


                <div class="result-row">

                    <strong>
                        Category
                    </strong>

                    <span>
                        ${escapeHTML(
                            category
                        )}
                    </span>

                </div>


                <div class="result-row">

                    <strong>
                        Issue Date
                    </strong>

                    <span>
                        ${escapeHTML(
                            issueDate
                        )}
                    </span>

                </div>


                <div class="result-row">

                    <strong>
                        Certificate Type
                    </strong>

                    <span>
                        ${escapeHTML(
                            certificateType
                        )}
                    </span>

                </div>


                ${
                    certificate.secretary

                        ? `

                            <div class="result-row">

                                <strong>
                                    Secretary
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        certificate.secretary
                                    )}
                                </span>

                            </div>

                        `

                        : ""
                }


                <div class="result-row">

                    <strong>
                        Status
                    </strong>

                    <span>
                        ${escapeHTML(
                            status
                        )}
                    </span>

                </div>

            </div>


            <!-- STATUS -->

            <div
                class="status-badge ${statusClass}"
            >

                ${
                    isValid
                        ? "✔ Verified"
                        : "⚠ Review Needed"
                }

            </div>


            <!-- DOWNLOAD -->

            ${
                certificateImage

                    ? `

                        <div class="certificate-actions">

                            <button
                                type="button"
                                class="download-certificate-btn"
                                id="downloadCertificateBtn"
                            >

                                <i class="fa-solid fa-download"></i>

                                Download Certificate

                            </button>

                        </div>

                    `

                    : ""
            }


            <!-- QR -->

            <div class="qr-section">

                <div class="section-label">
                    Scan QR to Verify
                </div>


                <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                        verificationUrl
                    )}"
                    alt="QR code for ${escapeHTML(
                        certificate.certificateId ||
                        ""
                    )}"
                    class="qr-code-image"
                />

            </div>


            <!-- VERIFY ANOTHER -->

            <div style="margin-top:20px;">

                <button
                    class="search-again-btn"
                    type="button"
                    id="verifyAnotherBtn"
                >
                    Verify Another Certificate
                </button>

            </div>

        </div>

    `;


    /* =====================================================
       CONFIGURE FLOATING SHARE BUTTON

       The button itself is in the main HTML,
       outside .verify-card.

       We only attach the current certificate data here.
    ===================================================== */

    showShareButton(
        verificationUrl,
        certificate
    );


    /* =====================================================
       DOWNLOAD BUTTON
    ===================================================== */

    const downloadCertificateBtn =
        document.getElementById(
            "downloadCertificateBtn"
        );


    if (downloadCertificateBtn) {

        downloadCertificateBtn.addEventListener(
            "click",
            () => {

                downloadCertificate(
                    certificate.certificateImage,
                    certificate.certificateId
                );

            }
        );

    }


    /* =====================================================
       VERIFY ANOTHER BUTTON
    ===================================================== */

    const verifyAnotherBtn =
        document.getElementById(
            "verifyAnotherBtn"
        );


    if (verifyAnotherBtn) {

        verifyAnotherBtn.addEventListener(
            "click",
            goBack
        );

    }

}


/* =========================================================
   DOWNLOAD CERTIFICATE
========================================================= */

async function downloadCertificate(
    imageUrl,
    certificateId
) {

    if (!imageUrl) {

        alert(
            "Certificate image is not available."
        );


        return;

    }


    const button =
        document.getElementById(
            "downloadCertificateBtn"
        );


    const originalHTML =
        button
            ? button.innerHTML
            : "";


    try {

        if (button) {

            button.disabled =
                true;


            button.innerHTML =
                `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Downloading...
                `;

        }


        /*
        =====================================================
        FETCH IMAGE FROM CLOUDFLARE R2

        R2 CORS must allow GET from your website.
        =====================================================
        */

        const response =
            await fetch(
                imageUrl,
                {
                    method:
                        "GET",

                    mode:
                        "cors",

                    credentials:
                        "omit"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Download failed: HTTP ${response.status}`
            );

        }


        const blob =
            await response.blob();


        /*
        =====================================================
        CREATE TEMPORARY LOCAL URL
        =====================================================
        */

        const blobUrl =
            URL.createObjectURL(
                blob
            );


        /*
        =====================================================
        CREATE DOWNLOAD LINK
        =====================================================
        */

        const link =
            document.createElement(
                "a"
            );


        link.href =
            blobUrl;


        link.download =
            `${certificateId || "certificate"}.png`;


        link.style.display =
            "none";


        document.body.appendChild(
            link
        );


        link.click();


        /*
        =====================================================
        REMOVE TEMPORARY LINK
        =====================================================
        */

        link.remove();


        /*
        =====================================================
        RELEASE OBJECT URL
        =====================================================
        */

        setTimeout(
            () => {

                URL.revokeObjectURL(
                    blobUrl
                );

            },
            1000
        );


    } catch (error) {

        console.error(
            "Certificate download error:",
            error
        );


        alert(
            "Unable to download the certificate. Please check the image URL and try again."
        );


    } finally {

        if (button) {

            button.disabled =
                false;


            button.innerHTML =
                originalHTML;

        }

    }

}


/* =========================================================
   SHOW ERROR
========================================================= */

function showError(
    message
) {

    if (!resultSection) {
        return;
    }


    /*
    * Never show share button for an invalid
    * or missing certificate.
    */

    hideShareButton();


    resultSection.innerHTML = `

        <div class="invalid-result">

            <div class="club-logo-wrap">

                <img
                    src="../assets/logo/sun-shine-club-logo.png"
                    class="club-logo"
                    alt="Sun Shine Club"
                />

            </div>


            <h1>
                Sun Shine Club
            </h1>


            <h2>
                Certificate Not Found
            </h2>


            <p>
                ${escapeHTML(
                    message
                )}
            </p>


            <p>
                This certificate is not registered
                in the official issued certificate
                database.
            </p>


            <button
                class="search-again-btn"
                type="button"
                id="tryAgainBtn"
            >
                Try Again
            </button>

        </div>

    `;


    const tryAgainBtn =
        document.getElementById(
            "tryAgainBtn"
        );


    if (tryAgainBtn) {

        tryAgainBtn.addEventListener(
            "click",
            goBack
        );

    }

}


/* =========================================================
   GO BACK
========================================================= */

function goBack() {

    /*
    * Hide floating share button.
    */

    hideShareButton();


    if (resultSection) {

        resultSection.style.display =
            "none";

    }


    if (searchSection) {

        searchSection.style.display =
            "block";

    }


    if (certificateInput) {

        certificateInput.value =
            "";


        certificateInput.focus();

    }


    /*
    =====================================================
    REMOVE ?id=...
    WITHOUT RELOADING PAGE
    =====================================================
    */

    const cleanURL =
        window.location.pathname;


    window.history.replaceState(
        {},
        document.title,
        cleanURL
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    ).replace(
        /[&<>'"]/g,
        character => {

            const map = {

                "&":
                    "&amp;",

                "<":
                    "&lt;",

                ">":
                    "&gt;",

                "'":
                    "&#39;",

                '"':
                    "&quot;"

            };


            return map[
                character
            ];

        }
    );

}