import {
    db
} from "./firebase-config.js";

import {
    collection,
    doc,
    getDoc,
    writeBatch
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================================================
   ELEMENTS
========================================================= */

const membersFile =
    document.getElementById(
        "membersFile"
    );

const importButton =
    document.getElementById(
        "importButton"
    );

const cancelButton =
    document.getElementById(
        "cancelButton"
    );

const preview =
    document.getElementById(
        "preview"
    );

const memberCount =
    document.getElementById(
        "memberCount"
    );

const validCount =
    document.getElementById(
        "validCount"
    );

const duplicateCount =
    document.getElementById(
        "duplicateCount"
    );

const invalidCount =
    document.getElementById(
        "invalidCount"
    );

const memberPreview =
    document.getElementById(
        "memberPreview"
    );

const progressSection =
    document.getElementById(
        "progressSection"
    );

const progressBar =
    document.getElementById(
        "progressBar"
    );

const progressText =
    document.getElementById(
        "progressText"
    );

const result =
    document.getElementById(
        "result"
    );

const importStatus =
    document.getElementById(
        "importStatus"
    );


/* =========================================================
   DATA
========================================================= */

let members = [];

let validMembers = [];

let duplicateMembers = [];

let invalidMembers = [];

let importing = false;


/* =========================================================
   FILE SELECTED
========================================================= */

membersFile?.addEventListener(
    "change",
    handleFile
);


/* =========================================================
   HANDLE FILE
========================================================= */

async function handleFile(
    event
) {

    clearMessages();

    resetPreview();


    const file =
        event.target.files?.[0];


    if (!file) {

        return;

    }


    if (
        !file.name
            .toLowerCase()
            .endsWith(".json")
    ) {

        showStatus(
            "Please select a JSON file.",
            "error"
        );

        return;

    }


    try {

        const text =
            await file.text();


        const parsed =
            JSON.parse(text);


        if (
            !Array.isArray(parsed)
        ) {

            throw new Error(
                "The JSON file must contain an array."
            );

        }


        members =
            parsed;


        validateMembers();


        renderPreview();


    } catch (error) {

        console.error(
            "JSON import error:",
            error
        );


        showStatus(
            error.message ||
            "Unable to read the JSON file.",
            "error"
        );

    }

}


/* =========================================================
   VALIDATE MEMBERS
========================================================= */

function validateMembers() {

    validMembers = [];

    duplicateMembers = [];

    invalidMembers = [];


    const ids =
        new Set();


    members.forEach(
        (member, index) => {

            const error =
                validateMember(
                    member,
                    index,
                    ids
                );


            if (error) {

                invalidMembers.push({

                    member,
                    index,
                    error

                });

                return;

            }


            if (
                ids.has(
                    member.id
                )
            ) {

                duplicateMembers.push(
                    member
                );

                return;

            }


            ids.add(
                member.id
            );


            validMembers.push(
                member
            );

        }
    );


    /*
     * Sort exactly by member ID.
     */

    validMembers.sort(
        compareIds
    );

}


/* =========================================================
   VALIDATE ONE MEMBER
========================================================= */

function validateMember(
    member,
    index,
    ids
) {

    if (
        !member ||
        typeof member !== "object"
    ) {

        return `Record ${index + 1} is not an object.`;

    }


    /*
     * Required ID
     */

    if (
        typeof member.id !== "string" ||
        !member.id.trim()
    ) {

        return "Missing member ID.";

    }


    /*
     * Required name
     */

    if (
        typeof member.name !== "string" ||
        !member.name.trim()
    ) {

        return "Missing member name.";

    }


    /*
     * Prevent accidental duplicate IDs
     */

    if (
        ids.has(
            member.id
        )
    ) {

        return "Duplicate member ID.";

    }


    /*
     * Photo can be empty,
     * but if supplied it should be a URL.
     */

    if (
        member.photo &&
        typeof member.photo !== "string"
    ) {

        return "Invalid photo field.";

    }


    return null;

}


/* =========================================================
   SORT
========================================================= */

function compareIds(
    a,
    b
) {

    const numberA =
        extractNumber(
            a.id
        );

    const numberB =
        extractNumber(
            b.id
        );


    if (
        numberA !== null &&
        numberB !== null
    ) {

        return numberA - numberB;

    }


    return a.id.localeCompare(
        b.id,
        undefined,
        {
            numeric: true
        }
    );

}


/* =========================================================
   EXTRACT NUMBER
========================================================= */

function extractNumber(
    id
) {

    const match =
        String(id)
            .match(
                /(\d+)$/
            );


    return match
        ? Number(match[1])
        : null;

}


/* =========================================================
   PREVIEW
========================================================= */

function renderPreview() {

    preview.hidden =
        false;


    memberCount.textContent =
        `${members.length} member${
            members.length === 1
                ? ""
                : "s"
        }`;


    validCount.textContent =
        validMembers.length;


    duplicateCount.textContent =
        duplicateMembers.length;


    invalidCount.textContent =
        invalidMembers.length;


    memberPreview.innerHTML =
        "";


    validMembers.forEach(
        member => {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "preview-member";


            const id =
                document.createElement(
                    "span"
                );

            id.className =
                "preview-member-id";

            id.textContent =
                member.id;


            const name =
                document.createElement(
                    "span"
                );

            name.className =
                "preview-member-name";

            name.textContent =
                member.name;


            const status =
                document.createElement(
                    "span"
                );

            status.className =
                "preview-member-status";

            status.textContent =
                "Ready";


            row.appendChild(
                id
            );

            row.appendChild(
                name
            );

            row.appendChild(
                status
            );


            memberPreview.appendChild(
                row
            );

        }
    );


    /*
     * Import is allowed only if every
     * record is valid and there are
     * no duplicate IDs.
     */

    importButton.disabled =
        validMembers.length === 0 ||
        invalidMembers.length > 0 ||
        duplicateMembers.length > 0;


    if (
        invalidMembers.length > 0
    ) {

        showStatus(
            `${invalidMembers.length} invalid record(s). Fix the JSON before importing.`,
            "error"
        );

    } else if (
        duplicateMembers.length > 0
    ) {

        showStatus(
            `${duplicateMembers.length} duplicate member ID(s) found.`,
            "error"
        );

    } else {

        showStatus(
            `${validMembers.length} members are ready to import.`,
            "success"
        );

    }

}


/* =========================================================
   IMPORT
========================================================= */

importButton?.addEventListener(
    "click",
    importMembers
);


async function importMembers() {

    if (importing) {

        return;

    }


    if (
        !validMembers.length
    ) {

        return;

    }


    const confirmed =
        window.confirm(
            `Import ${validMembers.length} members into Firestore?\n\nExisting documents with the same IDs will be overwritten.`
        );


    if (!confirmed) {

        return;

    }


    importing =
        true;


    importButton.disabled =
        true;

    membersFile.disabled =
        true;

    cancelButton.disabled =
        true;


    progressSection.hidden =
        false;


    result.hidden =
        true;


    let imported =
        0;

    let failed =
        0;


    try {

        /*
         * Firestore batches can contain
         * up to 500 writes.
         *
         * Your 42 members fit in one batch.
         */

        const batch =
            writeBatch(
                db
            );


        validMembers.forEach(
            member => {

                /*
                 * IMPORTANT:
                 *
                 * The existing member ID
                 * becomes the Firestore
                 * document ID.
                 *
                 * SSC001 → members/SSC001
                 */

                const memberReference =
                    doc(
                        db,
                        "members",
                        member.id
                    );


                /*
                 * Preserve EXACT JSON
                 * structure.
                 */

                batch.set(
                    memberReference,
                    {

                        id:
                            member.id,

                        name:
                            member.name,

                        odia_name:
                            member.odia_name || "",

                        photo:
                            member.photo || "",

                        club:
                            member.club ||
                            "Sun Shine Club",

                        designation:
                            member.designation ||
                            "Member",

                        status:
                            member.status ||
                            "Active",

                        phone:
                            member.phone ||
                            "",

                        address:
                            member.address ||
                            "",

                        joinDate:
                            member.joinDate ||
                            "",

                        valid:
                            member.valid ||
                            ""

                    }
                );

            }
        );


        /*
         * One atomic Firestore write.
         */

        await batch.commit();


        imported =
            validMembers.length;


        updateProgress(
            imported,
            validMembers.length
        );


        showResult(
            `
                <h3>Import completed successfully</h3>

                <p>
                    ${imported} member${
                        imported === 1
                            ? ""
                            : "s"
                    } imported into Firestore.
                </p>

                <p>
                    Documents were created using
                    the existing member IDs
                    (SSC001–SSC042).
                </p>
            `,
            "success"
        );


    } catch (error) {

        console.error(
            "Firestore import error:",
            error
        );


        failed =
            validMembers.length -
            imported;


        showResult(
            `
                <h3>Import failed</h3>

                <p>
                    ${imported} members imported
                    before the error.
                </p>

                <p>
                    ${failed} members were not imported.
                </p>

                <p>
                    ${escapeHtml(
                        getFirestoreErrorMessage(
                            error
                        )
                    )}
                </p>
            `,
            "error"
        );

    } finally {

        importing =
            false;

        membersFile.disabled =
            false;

        cancelButton.disabled =
            false;

        importButton.disabled =
            true;

    }

}


/* =========================================================
   PROGRESS
========================================================= */

function updateProgress(
    current,
    total
) {

    const percentage =
        total > 0
            ? (
                current /
                total
            ) * 100
            : 0;


    progressBar.style.width =
        `${percentage}%`;


    progressText.textContent =
        `${current} / ${total}`;

}


/* =========================================================
   CANCEL
========================================================= */

cancelButton?.addEventListener(
    "click",
    () => {

        if (importing) {

            return;

        }


        window.history.back();

    }
);


/* =========================================================
   STATUS
========================================================= */

function showStatus(
    message,
    type
) {

    importStatus.textContent =
        message;

    importStatus.className =
        `import-status ${type}`;

    importStatus.hidden =
        false;

}


function clearMessages() {

    importStatus.hidden =
        true;

    importStatus.textContent =
        "";

    result.hidden =
        true;

    result.innerHTML =
        "";

}


function showResult(
    html,
    type
) {

    result.innerHTML =
        html;

    result.className =
        `result ${type}`;

    result.hidden =
        false;

}


/* =========================================================
   RESET PREVIEW
========================================================= */

function resetPreview() {

    members = [];

    validMembers = [];

    duplicateMembers = [];

    invalidMembers = [];


    preview.hidden =
        true;


    memberPreview.innerHTML =
        "";


    memberCount.textContent =
        "0 members";


    validCount.textContent =
        "0";


    duplicateCount.textContent =
        "0";


    invalidCount.textContent =
        "0";


    importButton.disabled =
        true;


    progressSection.hidden =
        true;


    progressBar.style.width =
        "0%";


    progressText.textContent =
        "0 / 0";

}


/* =========================================================
   FIRESTORE ERROR
========================================================= */

function getFirestoreErrorMessage(
    error
) {

    if (!error) {

        return "Unknown Firestore error.";

    }


    switch (
        error.code
    ) {

        case "permission-denied":

            return (
                "Permission denied. Check your Firestore " +
                "security rules and admin authorization."
            );


        case "unauthenticated":

            return (
                "Your admin session has expired. " +
                "Please sign in again."
            );


        case "unavailable":

            return (
                "Firestore is temporarily unavailable. " +
                "Please try again."
            );


        case "failed-precondition":

            return (
                "Firestore is not configured correctly."
            );


        default:

            return (
                error.message ||
                "Unable to import members."
            );

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
    value
) {

    return String(value)

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
   STARTUP
========================================================= */

console.log(
    "Member import system loaded"
);