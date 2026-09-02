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


/* =========================================================
   WEBSITE
========================================================= */

const WEBSITE =
    "https://sunshineclubkendupalli.in";


/* =========================================================
   AUTO VERIFY FROM URL
========================================================= */

const params =
    new URLSearchParams(
        window.location.search
    );

const urlId =
    params.get("id")
        ?.trim()
        .toUpperCase();


if (urlId) {

    if (searchSection) {
        searchSection.style.display = "none";
    }

    if (resultSection) {
        resultSection.style.display = "block";
    }

    loadCertificate(urlId);
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

            if (event.key === "Enter") {
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
     * Certificate ID format:
     *
     * SSC-CERT-2026-001
     *
     * Prefix = SSC-CERT
     * Year   = 2026
     * Number = 001
     */

    const certificateIdPattern =
        /^SSC-CERT-\d{4}-\d{3}$/;


    if (!certificateIdPattern.test(id)) {

        alert(
            "Invalid Certificate ID.\n\n" +
            "Use the format: SSC-CERT-YYYY-NNN"
        );

        certificateInput.focus();

        return;
    }


    if (searchSection) {
        searchSection.style.display = "none";
    }

    if (resultSection) {
        resultSection.style.display = "block";
    }


    loadCertificate(id);
}


/* =========================================================
   LOAD CERTIFICATE FROM FIRESTORE
========================================================= */

async function loadCertificate(id) {

    if (!resultSection) {
        return;
    }


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
         * Certificate document ID is the same as
         * the certificateId.
         *
         * Example:
         *
         * certificates/
         * SSC-CERT-2026-001
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


        /* =================================================
           CERTIFICATE NOT FOUND
        ================================================= */

        if (!certificateSnapshot.exists()) {

            showError(
                "Certificate ID not found in the official certificate database."
            );

            return;
        }


        /* =================================================
           GET FIRESTORE DATA
        ================================================= */

        const certificate = {

            id:
                certificateSnapshot.id,

            ...certificateSnapshot.data()

        };


        console.log(
            "Verified certificate:",
            certificate
        );


        /* =================================================
           CHECK CERTIFICATE ID
        ================================================= */

        if (
            certificate.certificateId &&
            certificate.certificateId !== id
        ) {

            showError(
                "Certificate information does not match the requested Certificate ID."
            );

            return;
        }


        /* =================================================
           SHOW CERTIFICATE
        ================================================= */

        showCertificate(
            certificate
        );


    } catch (error) {

        console.error(
            "Certificate verification error:",
            error
        );


        /* =================================================
           FIRESTORE PERMISSION ERROR
        ================================================= */

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
        certificate.status === "Issued";


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
       Stored in Cloudflare R2
    ===================================================== */

    const certificateImage =
        certificate.certificateImage ||
        "";


    /* =====================================================
       EVENT IMAGE
       URL ONLY — NOT UPLOADED
    ===================================================== */

    const eventImage =
        certificate.eventImage ||
        "";


    /* =====================================================
       VERIFICATION URL
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
                        src="${escapeHTML(certificateImage)}"
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
                        src="${escapeHTML(eventImage)}"
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

            <div class="status-badge ${statusClass}">

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

            button.disabled = true;

            button.innerHTML =
                `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Downloading...
                `;

        }


        /*
         * Fetch image from Cloudflare R2.
         *
         * R2 CORS must allow GET from
         * sunshineclubkendupalli.in.
         */

        const response =
            await fetch(
                imageUrl,
                {
                    method: "GET",
                    mode: "cors",
                    credentials: "omit"
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
         * Create temporary local URL.
         */

        const blobUrl =
            URL.createObjectURL(
                blob
            );


        /*
         * Create temporary download link.
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
         * Remove temporary link.
         */

        link.remove();


        /*
         * Release object URL.
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
                ${escapeHTML(message)}
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
     * Remove ?id=...
     * without reloading.
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