// =====================================
// Sun Shine Club
// Member Verification
// Firebase Firestore
// =====================================

import {
    db
} from "../../admin/js/firebase-config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// =====================================
// ELEMENTS
// =====================================

const searchSection =
    document.getElementById("searchSection");

const resultSection =
    document.getElementById("resultSection");

const memberInput =
    document.getElementById("memberId");

const verifyBtn =
    document.getElementById("verifyBtn");


// =====================================
// CONSTANTS
// =====================================

const MEMBERS_COLLECTION = "members";

const LOGO_URL =
    "https://pub-0ea4b0b9de9b4d6db5c369669418e7ef.r2.dev/logo/sun-shine-club-logo.png";


// =====================================
// AUTO VERIFY FROM URL
// =====================================

const params =
    new URLSearchParams(window.location.search);

const urlMemberId =
    params.get("id");

if (urlMemberId) {

    const memberId =
        urlMemberId
            .trim()
            .toUpperCase();

    if (searchSection) {
        searchSection.style.display = "none";
    }

    if (resultSection) {
        resultSection.style.display = "block";
    }

    loadMember(memberId);
}


// =====================================
// VERIFY BUTTON
// =====================================

if (verifyBtn) {

    verifyBtn.addEventListener(
        "click",
        verifyMember
    );

}


// =====================================
// PRESS ENTER
// =====================================

if (memberInput) {

    memberInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                verifyMember();

            }

        }
    );

}


// =====================================
// VERIFY MEMBER
// =====================================

function verifyMember() {

    const id =
        memberInput
            ? memberInput.value
                .trim()
                .toUpperCase()
            : "";

    if (!id) {

        alert(
            "Please enter your Member ID."
        );

        memberInput?.focus();

        return;
    }


    if (searchSection) {
        searchSection.style.display = "none";
    }

    if (resultSection) {
        resultSection.style.display = "block";
    }


    loadMember(id);
}


// =====================================
// LOAD MEMBER FROM FIREBASE
// =====================================

async function loadMember(id) {

    // Show loading state
    if (resultSection) {

        resultSection.innerHTML = `

            <div class="loading">

                <i class="fa-solid fa-spinner fa-spin"></i>

                <h2>
                    Verifying Member...
                </h2>

            </div>

        `;

    }


    try {

        // -------------------------------------
        // Normalize Member ID
        // -------------------------------------

        const memberId =
            String(id)
                .trim()
                .toUpperCase();


        if (!memberId) {

            showError(
                "Invalid Member ID."
            );

            return;
        }


        // -------------------------------------
        // DIRECT FIRESTORE DOCUMENT READ
        // -------------------------------------
        //
        // Firestore structure:
        //
        // members
        //   └── SSC018
        //       ├── id
        //       ├── name
        //       ├── designation
        //       ├── phone
        //       ├── blood
        //       ├── joinDate
        //       ├── valid
        //       ├── status
        //       └── photo
        //
        // -------------------------------------

        const memberRef =
            doc(
                db,
                MEMBERS_COLLECTION,
                memberId
            );


        const memberSnapshot =
            await getDoc(memberRef);


        // -------------------------------------
        // MEMBER NOT FOUND
        // -------------------------------------

        if (!memberSnapshot.exists()) {

            showError(
                "Member ID not found."
            );

            return;
        }


        // -------------------------------------
        // FIRESTORE DATA
        // -------------------------------------

        const memberData =
            memberSnapshot.data();


        const member = {

            ...memberData,

            documentId:
                memberSnapshot.id,

            id:
                memberData.id ||
                memberSnapshot.id

        };


        // -------------------------------------
        // SHOW MEMBER
        // -------------------------------------

        showMember(member);

    }

    catch (error) {

        console.error(
            "Firebase member verification error:",
            error
        );


        // -------------------------------------
        // PERMISSION ERROR
        // -------------------------------------

        if (
            error.code ===
            "permission-denied"
        ) {

            showError(
                "Member verification is currently unavailable."
            );

            return;
        }


        // -------------------------------------
        // OTHER FIREBASE ERRORS
        // -------------------------------------

        showError(
            "Unable to connect to the member database."
        );

    }

}


// =====================================
// CHECK EXPIRY
// =====================================

function isExpired(validDate) {

    if (!validDate) {
        return false;
    }


    // -------------------------------------
    // Firestore Timestamp
    // -------------------------------------

    if (
        typeof validDate === "object" &&
        typeof validDate.toDate === "function"
    ) {

        return (
            validDate.toDate() <
            new Date()
        );

    }


    // -------------------------------------
    // Date
    // -------------------------------------

    if (
        validDate instanceof Date
    ) {

        return (
            validDate <
            new Date()
        );

    }


    // -------------------------------------
    // String / Number
    // -------------------------------------

    const date =
        new Date(validDate);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return false;

    }


    return (
        date <
        new Date()
    );

}


// =====================================
// FORMAT DATE
// =====================================

function formatDate(value) {

    if (!value) {
        return "-";
    }


    // -------------------------------------
    // Firestore Timestamp
    // -------------------------------------

    if (
        typeof value === "object" &&
        typeof value.toDate === "function"
    ) {

        return formatDate(
            value.toDate()
        );

    }


    // -------------------------------------
    // Date Object
    // -------------------------------------

    if (
        value instanceof Date
    ) {

        return formatDate(
            value.toISOString()
        );

    }


    // -------------------------------------
    // Firestore Timestamp-like object
    // -------------------------------------

    if (
        typeof value === "object" &&
        typeof value.seconds === "number"
    ) {

        const date =
            new Date(
                value.seconds * 1000
            );

        return formatDate(date);

    }


    const date =
        new Date(value);


    if (
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


// =====================================
// SAFE HTML
// =====================================

function escapeHTML(value) {

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


// =====================================
// SHOW MEMBER
// =====================================

function showMember(member) {

    const expired =
        isExpired(
            member.valid
        );


    const statusText =
        expired
            ? "Expired"
            : "Verified";


    const statusColor =
        expired
            ? "#e74c3c"
            : "#2ecc71";


    const statusIcon =
        expired
            ? "❌"
            : "✔";


    const memberStatus =
        member.status ||
        (
            expired
                ? "Expired"
                : "Active"
        );


    const photo =
        member.photo ||
        LOGO_URL;


    const memberName =
        member.name ||
        "Member";


    const memberId =
        member.id ||
        member.documentId ||
        "-";


    if (!resultSection) {
        return;
    }


    resultSection.innerHTML = `

        <div class="verified">

            <img
                src="${LOGO_URL}"
                class="club-logo"
                alt="Sun Shine Club"
            >


            <h1>
                Sun Shine Club
            </h1>


            <h2
                style="color:${statusColor};"
            >
                ${statusIcon}
                ${statusText} Member
            </h2>


            <img
                src="${escapeHTML(photo)}"
                class="profile-photo"
                alt="${escapeHTML(memberName)}"
                onerror="this.onerror=null;this.src='${LOGO_URL}';"
            >


            <table class="member-table">

                <tr>

                    <th>
                        Name
                    </th>

                    <td>
                        ${escapeHTML(
                            memberName
                        )}
                    </td>

                </tr>


                <tr>

                    <th>
                        Member ID
                    </th>

                    <td>
                        ${escapeHTML(
                            memberId
                        )}
                    </td>

                </tr>


                <tr>

                    <th>
                        Designation
                    </th>

                    <td>
                        ${escapeHTML(
                            member.designation ||
                            "-"
                        )}
                    </td>

                </tr>


                <tr>

                    <th>
                        Phone
                    </th>

                    <td>
                        ${escapeHTML(
                            member.phone ||
                            "-"
                        )}
                    </td>

                </tr>


                <tr>

                    <th>
                        Blood Group
                    </th>

                    <td>
                        ${escapeHTML(
                            member.blood ||
                            "-"
                        )}
                    </td>

                </tr>


                <tr>

                    <th>
                        Join Date
                    </th>

                    <td>
                        ${escapeHTML(
                            formatDate(
                                member.joinDate
                            )
                        )}
                    </td>

                </tr>


                <tr>

                    <th>
                        Valid Until
                    </th>

                    <td>
                        ${escapeHTML(
                            formatDate(
                                member.valid
                            )
                        )}
                    </td>

                </tr>


                <tr>

                    <th>
                        Status
                    </th>

                    <td
                        style="
                            color:${statusColor};
                            font-weight:bold;
                        "
                    >
                        ${escapeHTML(
                            memberStatus
                        )}
                    </td>

                </tr>

            </table>


            <button
                type="button"
                class="search-again-btn"
                id="searchAgainBtn"
            >
                Verify Another Member
            </button>

        </div>

    `;


    // -------------------------------------
    // Search Again
    // -------------------------------------

    const searchAgainBtn =
        document.getElementById(
            "searchAgainBtn"
        );


    searchAgainBtn?.addEventListener(
        "click",
        goBack
    );

}


// =====================================
// INVALID MEMBER
// =====================================

function showError(message) {

    if (!resultSection) {
        return;
    }


    resultSection.innerHTML = `

        <div class="invalid">

            <img
                src="${LOGO_URL}"
                class="club-logo"
                alt="Sun Shine Club"
            >


            <h1>
                Sun Shine Club
            </h1>


            <h2
                style="color:#e74c3c;"
            >
                ❌ Invalid Member
            </h2>


            <p>
                ${escapeHTML(message)}
            </p>


            <p>
                This ID Card is not registered.
            </p>


            <button
                type="button"
                class="search-again-btn"
                id="errorSearchAgainBtn"
            >
                Try Again
            </button>

        </div>

    `;


    // -------------------------------------
    // Try Again
    // -------------------------------------

    const errorSearchAgainBtn =
        document.getElementById(
            "errorSearchAgainBtn"
        );


    errorSearchAgainBtn?.addEventListener(
        "click",
        goBack
    );

}


// =====================================
// BACK TO SEARCH
// =====================================

function goBack() {

    if (resultSection) {

        resultSection.style.display =
            "none";

    }


    if (searchSection) {

        searchSection.style.display =
            "block";

    }


    if (memberInput) {

        memberInput.value =
            "";

        memberInput.focus();

    }

}


// =====================================
// GLOBAL BACK FUNCTION
// =====================================

window.goBack =
    goBack;