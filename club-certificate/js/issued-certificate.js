import { db } from "../../admin/js/firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


let allCertificates = [];


// ============================================
// LOAD ISSUED CERTIFICATES
// ============================================

async function loadIssuedCertificates() {

    const container = document.getElementById("issuedCertificates");
    const status = document.getElementById("issuedStatus");

    if (!container) {
        console.error("issuedCertificates element not found.");
        return;
    }

    container.innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <h3>Loading Certificates...</h3>
            <p>Please wait.</p>
        </div>
    `;

    try {

        const snapshot = await getDocs(
            collection(db, "certificates")
        );

        allCertificates = [];

        snapshot.forEach((docSnapshot) => {

            const data = docSnapshot.data();

            // Only show certificates that are Issued.
            // If status does not exist, also allow the certificate
            // because older issued records may not have status.
            if (
                data.status &&
                String(data.status).trim().toLowerCase() !== "issued"
            ) {
                return;
            }

            allCertificates.push({
                firestoreId: docSnapshot.id,
                ...data
            });

        });


        // ========================================
        // SORT
        // Newest issue date first
        // ========================================

        allCertificates.sort((a, b) => {

            const dateA = String(a.issueDate || "");
            const dateB = String(b.issueDate || "");

            return dateB.localeCompare(dateA);

        });


        renderIssuedCertificates(allCertificates);


        if (status) {

            status.textContent =
                `${allCertificates.length} certificate${allCertificates.length === 1 ? "" : "s"} issued`;

        }

    } catch (error) {

        console.error(
            "Unable to load issued certificates:",
            error
        );

        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-circle-exclamation"></i>
                <h3>Unable to Load Certificates</h3>
                <p>Please try again later.</p>
            </div>
        `;

        if (status) {
            status.textContent = "";
        }

    }

}


// ============================================
// RENDER CERTIFICATES
// ============================================

function renderIssuedCertificates(certificates) {

    const container =
        document.getElementById("issuedCertificates");

    if (!container) return;


    if (!certificates.length) {

        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-certificate"></i>
                <h3>No Certificates Available</h3>
                <p>No issued certificates are currently available.</p>
            </div>
        `;

        return;
    }


    container.innerHTML = certificates.map((certificate) => {

        const certificateId =
            certificate.certificateId ||
            certificate.id ||
            "";


        const name =
            certificate.name ||
            "Unknown Recipient";


        const event =
            certificate.event ||
            "Certificate";


        const position =
            certificate.position ||
            certificate.category ||
            "";


        const issueDate =
            certificate.issueDate ||
            "";


        const certificateImage =
            certificate.certificateImage ||
            "";


        const eventImage =
            certificate.eventImage ||
            "";


        return `

            <div
                class="issued-certificate-card"
                data-certificate-id="${escapeHtml(certificateId)}"
            >

                <!-- CERTIFICATE IMAGE -->

                <div class="certificate-image-wrapper">

                    ${
                        certificateImage
                        ?
                        `
                            <img
                                src="${escapeHtml(certificateImage)}"
                                alt="Certificate - ${escapeHtml(name)}"
                                loading="lazy"
                            >
                        `
                        :
                        `
                            <div class="certificate-image-placeholder">
                                <i class="fa-solid fa-certificate"></i>
                            </div>
                        `
                    }

                </div>


                <!-- CERTIFICATE DETAILS -->

                <div class="certificate-card-content">

                    <h3>
                        ${escapeHtml(name)}
                    </h3>


                    <p>
                        ${escapeHtml(event)}
                    </p>


                    ${
                        position
                        ?
                        `
                            <div class="certificate-detail">
                                <strong>Position:</strong>
                                ${escapeHtml(position)}
                            </div>
                        `
                        :
                        ""
                    }


                    ${
                        issueDate
                        ?
                        `
                            <div class="certificate-detail">
                                <strong>Issued:</strong>
                                ${escapeHtml(formatDate(issueDate))}
                            </div>
                        `
                        :
                        ""
                    }


                    <span class="certificate-id">
                        ${escapeHtml(certificateId)}
                    </span>


                    ${
                        eventImage
                        ?
                        `
                            <div class="certificate-event-image">

                                <img
                                    src="${escapeHtml(eventImage)}"
                                    alt="Event photo"
                                    loading="lazy"
                                >

                            </div>
                        `
                        :
                        ""
                    }


                    <a
                        href="verify.html?id=${encodeURIComponent(certificateId)}"
                        class="verify-btn"
                    >
                        <i class="fa-solid fa-shield-check"></i>
                        Verify Certificate
                    </a>

                </div>

            </div>

        `;

    }).join("");

}


// ============================================
// SEARCH
// ============================================

function searchCertificates() {

    const searchInput =
        document.getElementById("issuedSearch");

    if (!searchInput) return;


    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    if (!searchTerm) {

        renderIssuedCertificates(allCertificates);

        updateStatus(allCertificates.length);

        return;
    }


    const filtered =
        allCertificates.filter((certificate) => {

            const certificateId =
                String(
                    certificate.certificateId ||
                    certificate.id ||
                    ""
                ).toLowerCase();


            const name =
                String(
                    certificate.name ||
                    ""
                ).toLowerCase();


            const event =
                String(
                    certificate.event ||
                    ""
                ).toLowerCase();


            const position =
                String(
                    certificate.position ||
                    ""
                ).toLowerCase();


            const category =
                String(
                    certificate.category ||
                    ""
                ).toLowerCase();


            const certificateType =
                String(
                    certificate.certificateType ||
                    ""
                ).toLowerCase();


            return (
                certificateId.includes(searchTerm) ||
                name.includes(searchTerm) ||
                event.includes(searchTerm) ||
                position.includes(searchTerm) ||
                category.includes(searchTerm) ||
                certificateType.includes(searchTerm)
            );

        });


    renderIssuedCertificates(filtered);

    updateStatus(
        filtered.length,
        true
    );

}


// ============================================
// STATUS TEXT
// ============================================

function updateStatus(count, searching = false) {

    const status =
        document.getElementById("issuedStatus");

    if (!status) return;


    if (searching) {

        status.textContent =
            `${count} matching certificate${count === 1 ? "" : "s"}`;

    } else {

        status.textContent =
            `${count} certificate${count === 1 ? "" : "s"} issued`;

    }

}


// ============================================
// FORMAT DATE
// ============================================

function formatDate(dateValue) {

    if (!dateValue) return "";

    const date =
        new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return dateValue;
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


// ============================================
// ESCAPE HTML
// ============================================

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================
// SEARCH EVENT
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const searchInput =
            document.getElementById("issuedSearch");


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchCertificates
            );

        }


        loadIssuedCertificates();

    }
);