// /* =========================================================
//    MEMBERS MANAGEMENT
//    Sun Shine Club Kendupalli
// ========================================================= */

// import {
//     auth,
//     db
// } from "./firebase-config.js";

// import {
//     onAuthStateChanged
// } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

// import {
//     collection,
//     doc,
//     getDocs,
//     setDoc,
//     updateDoc,
//     deleteDoc
// } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// /* =========================================================
//    ADMIN PROFILE
// ========================================================= */

// const sidebarName =
//     document.getElementById(
//         "sidebarName"
//     );

// const sidebarEmail =
//     document.getElementById(
//         "sidebarEmail"
//     );

// const sidebarAvatar =
//     document.getElementById(
//         "sidebarAvatar"
//     );

// const topbarName =
//     document.getElementById(
//         "topbarName"
//     );

// const topbarAvatar =
//     document.getElementById(
//         "topbarAvatar"
//     );

// /* =========================================================
//    ELEMENTS
// ========================================================= */

// const membersList =
//     document.getElementById("membersList");

// const membersLoading =
//     document.getElementById("membersLoading");

// const membersEmpty =
//     document.getElementById("membersEmpty");

// const memberSearch =
//     document.getElementById("memberSearch");

// const statusFilter =
//     document.getElementById("statusFilter");


// /* Statistics */

// const totalMembers =
//     document.getElementById("totalMembers");

// const activeMembers =
//     document.getElementById("activeMembers");

// const inactiveMembers =
//     document.getElementById("inactiveMembers");


// /* Modal */

// const memberModal =
//     document.getElementById("memberModal");

// const memberModalOverlay =
//     document.getElementById("memberModalOverlay");

// const closeMemberModal =
//     document.getElementById("closeMemberModal");

// const cancelMember =
//     document.getElementById("cancelMember");

// const addMemberButton =
//     document.getElementById("addMemberButton");


// /* Form */

// const memberForm =
//     document.getElementById("memberForm");

// const memberModalTitle =
//     document.getElementById("memberModalTitle");

// const memberDocumentId =
//     document.getElementById("memberDocumentId");

// const memberId =
//     document.getElementById("memberId");

// const memberName =
//     document.getElementById("memberName");

// const memberOdiaName =
//     document.getElementById("memberOdiaName");

// const memberPhoto =
//     document.getElementById("memberPhoto");

// const memberDesignation =
//     document.getElementById("memberDesignation");

// const memberPhone =
//     document.getElementById("memberPhone");

// const memberAddress =
//     document.getElementById("memberAddress");

// const memberJoinDate =
//     document.getElementById("memberJoinDate");

// const memberValid =
//     document.getElementById("memberValid");

// const memberStatus =
//     document.getElementById("memberStatus");

// const memberFormError =
//     document.getElementById("memberFormError");

// const saveMember =
//     document.getElementById("saveMember");


// /* =========================================================
//    DATA
// ========================================================= */

// let allMembers = [];

// let editingMemberId = null;


// /* =========================================================
//    LOAD ADMIN PROFILE
// ========================================================= */

// onAuthStateChanged(
//     auth,
//     user => {

//         if (!user) {

//             console.log(
//                 "No authenticated administrator."
//             );

//             return;

//         }


//         console.log(
//             "Administrator:",
//             user.displayName,
//             user.email
//         );


//         setAdminProfile(
//             user
//         );

//     }
// );


// /* =========================================================
//    SET ADMIN PROFILE
// ========================================================= */

// function setAdminProfile(
//     user
// ) {

//     const name =
//         user.displayName ||
//         "Administrator";


//     const email =
//         user.email ||
//         "";


//     const photo =
//         user.photoURL ||
//         "";


//     /* Sidebar */

//     if (sidebarName) {

//         sidebarName.textContent =
//             name;

//     }


//     if (sidebarEmail) {

//         sidebarEmail.textContent =
//             email;

//     }


//     /* Topbar */

//     if (topbarName) {

//         topbarName.textContent =
//             name;

//     }


//     /* Avatar */

//     setAvatar(
//         sidebarAvatar,
//         name,
//         photo
//     );


//     setAvatar(
//         topbarAvatar,
//         name,
//         photo
//     );

// }


// /* =========================================================
//    AVATAR
// ========================================================= */

// function setAvatar(
//     element,
//     name,
//     photo
// ) {

//     if (!element) {

//         return;

//     }


//     element.innerHTML =
//         "";


//     if (photo) {

//         const image =
//             document.createElement(
//                 "img"
//             );


//         image.src =
//             photo;


//         image.alt =
//             name;


//         image.referrerPolicy =
//             "no-referrer";


//         image.onerror =
//             () => {

//                 image.remove();

//                 element.textContent =
//                     getInitial(
//                         name
//                     );

//             };


//         element.appendChild(
//             image
//         );


//     } else {

//         element.textContent =
//             getInitial(
//                 name
//             );

//     }

// }


// /* =========================================================
//    INITIAL
// ========================================================= */

// function getInitial(
//     name
// ) {

//     return (
//         String(name)
//             .trim()
//             .charAt(0)
//             .toUpperCase() ||
//         "A"
//     );

// }



// /* =========================================================
//    FIREBASE AUTH STATE
// ========================================================= */

// onAuthStateChanged(
//     auth,
//     user => {

//         if (!user) {

//             console.log(
//                 "Members: no authenticated user"
//             );

//             return;

//         }


//         console.log(
//             "Members: authenticated user:",
//             user.email
//         );


//         /*
//          * admin-auth.js is responsible for
//          * checking whether this user is an
//          * authorized administrator.
//          *
//          * Once Firebase has authenticated
//          * the user, load the Firestore members.
//          */

//         loadMembers();

//     }
// );









// /* =========================================================
//    LOAD MEMBERS
// ========================================================= */

// async function loadMembers() {

//     showLoading(true);
//     showEmpty(false);

//     try {

//         console.log("Loading members from Firestore...");

//         const membersRef = collection(
//             db,
//             "members"
//         );

//         const snapshot = await getDocs(
//             membersRef
//         );

//         console.log(
//             "Firestore member documents:",
//             snapshot.size
//         );

//         allMembers = [];

//         snapshot.forEach(
//             documentSnapshot => {

//                 const data =
//                     documentSnapshot.data();

//                 allMembers.push({
//                     documentId:
//                         documentSnapshot.id,

//                     ...data
//                 });

//             }
//         );


//         /* Sort SSC001 → SSC042 */

//         allMembers.sort(
//             compareMemberIds
//         );


//         /* Update numbers */

//         updateStatistics();


//         /* Render cards */

//         renderMembers();


//         /*
//          * IMPORTANT:
//          * Hide spinner after rendering.
//          */

//         showLoading(false);


//         console.log(
//             "Members rendered:",
//             allMembers.length
//         );


//     } catch (error) {

//         console.error(
//             "Unable to load members:",
//             error
//         );

//         showLoading(false);

//         showMembersError(
//             getFirestoreErrorMessage(
//                 error
//             )
//         );

//     }

// }


// /* =========================================================
//    SORT MEMBER IDs
// ========================================================= */

// function compareMemberIds(
//     a,
//     b
// ) {

//     const idA =
//         String(
//             a.id || a.documentId || ""
//         );

//     const idB =
//         String(
//             b.id || b.documentId || ""
//         );


//     /*
//      * Extract numeric part.
//      *
//      * SSC001 → 1
//      * SSC042 → 42
//      */

//     const numberA =
//         extractMemberNumber(
//             idA
//         );

//     const numberB =
//         extractMemberNumber(
//             idB
//         );


//     if (
//         numberA !== null &&
//         numberB !== null
//     ) {

//         return numberA - numberB;

//     }


//     return idA.localeCompare(
//         idB,
//         undefined,
//         {
//             numeric: true,
//             sensitivity: "base"
//         }
//     );

// }


// /* =========================================================
//    EXTRACT MEMBER NUMBER
// ========================================================= */

// function extractMemberNumber(
//     id
// ) {

//     const match =
//         String(id).match(
//             /(\d+)$/
//         );


//     if (!match) {

//         return null;

//     }


//     return Number(
//         match[1]
//     );

// }


// /* =========================================================
//    RENDER MEMBERS
// ========================================================= */

// function renderMembers() {

//     const searchText =
//         (
//             memberSearch?.value ||
//             ""
//         )
//             .trim()
//             .toLowerCase();


//     const selectedStatus =
//         statusFilter?.value ||
//         "all";


//     const filteredMembers =
//         allMembers.filter(
//             member => {

//                 /*
//                  * Use the EXACT field names
//                  * from members.json.
//                  */

//                 const searchableText = [

//                     member.id,

//                     member.name,

//                     member.odia_name,

//                     member.club,

//                     member.designation,

//                     member.phone,

//                     member.address,

//                     member.joinDate,

//                     member.valid,

//                     member.status

//                 ]
//                     .filter(Boolean)
//                     .join(" ")
//                     .toLowerCase();


//                 const matchesSearch =
//                     !searchText ||
//                     searchableText.includes(
//                         searchText
//                     );


//                 const matchesStatus =
//                     selectedStatus === "all" ||
//                     member.status ===
//                     selectedStatus;


//                 return (
//                     matchesSearch &&
//                     matchesStatus
//                 );

//             }
//         );


//     membersList.innerHTML = "";


//     if (
//         filteredMembers.length === 0
//     ) {

//         showEmpty(true);

//         return;

//     }


//     showEmpty(false);


//     filteredMembers.forEach(
//         member => {

//             membersList.appendChild(
//                 createMemberCard(
//                     member
//                 )
//             );

//         }
//     );

// }


// /* =========================================================
//    CREATE MEMBER CARD
// ========================================================= */

// function createMemberCard(
//     member
// ) {

//     const card =
//         document.createElement(
//             "article"
//         );

//     card.className =
//         "member-admin-card";


//     /* =====================================================
//        TOP
//     ===================================================== */

//     const top =
//         document.createElement(
//             "div"
//         );

//     top.className =
//         "member-admin-top";


//     /* =====================================================
//        PHOTO
//     ===================================================== */

//     const image =
//         document.createElement(
//             "img"
//         );

//     image.className =
//         "member-admin-photo";


//     image.alt =
//         `${member.name || "Member"} - Sun Shine Club Kendupalli`;


//     if (
//         member.photo &&
//         typeof member.photo === "string"
//     ) {

//         image.src =
//             member.photo;

//     } else {

//         image.src =
//             createPlaceholderImage(
//                 member.name
//             );

//     }


//     image.onerror =
//         () => {

//             image.onerror =
//                 null;

//             image.src =
//                 createPlaceholderImage(
//                     member.name
//                 );

//         };


//     /* =====================================================
//        INFORMATION
//     ===================================================== */

//     const information =
//         document.createElement(
//             "div"
//         );

//     information.className =
//         "member-admin-info";


//     const name =
//         document.createElement(
//             "h3"
//         );

//     name.textContent =
//         member.name ||
//         "Unnamed Member";


//     const designation =
//         document.createElement(
//             "p"
//         );

//     designation.textContent =
//         member.designation ||
//         "Member";


//     const id =
//         document.createElement(
//             "span"
//         );

//     id.className =
//         "member-id";

//     id.textContent =
//         member.id ||
//         member.documentId ||
//         "No ID";


//     information.appendChild(
//         name
//     );

//     information.appendChild(
//         designation
//     );

//     information.appendChild(
//         id
//     );


//     top.appendChild(
//         image
//     );

//     top.appendChild(
//         information
//     );


//     /* =====================================================
//        STATUS
//     ===================================================== */

//     const status =
//         document.createElement(
//             "span"
//         );


//     const currentStatus =
//         member.status === "Inactive"
//             ? "Inactive"
//             : "Active";


//     status.className =
//         `member-status ${currentStatus.toLowerCase()
//         }`;


//     status.textContent =
//         currentStatus;


//     /* =====================================================
//        ACTIONS
//     ===================================================== */

//     const actions =
//         document.createElement(
//             "div"
//         );

//     actions.className =
//         "member-card-actions";


//     const editButton =
//         document.createElement(
//             "button"
//         );

//     editButton.type =
//         "button";

//     editButton.className =
//         "edit-member-button";

//     editButton.textContent =
//         "Edit";


//     editButton.addEventListener(
//         "click",
//         () => {

//             openEditMember(
//                 member
//             );

//         }
//     );


//     const deleteButton =
//         document.createElement(
//             "button"
//         );

//     deleteButton.type =
//         "button";

//     deleteButton.className =
//         "delete-member-button";

//     deleteButton.textContent =
//         "Delete";


//     deleteButton.addEventListener(
//         "click",
//         () => {

//             deleteMember(
//                 member
//             );

//         }
//     );


//     actions.appendChild(
//         editButton
//     );

//     actions.appendChild(
//         deleteButton
//     );




//     /* =========================================================
//    DELETE MODAL
// ========================================================= */

//     const deleteModal =
//         document.getElementById(
//             "deleteModal"
//         );

//     const deleteModalOverlay =
//         document.getElementById(
//             "deleteModalOverlay"
//         );

//     const deleteMemberName =
//         document.getElementById(
//             "deleteMemberName"
//         );

//     const deleteMemberId =
//         document.getElementById(
//             "deleteMemberId"
//         );

//     const cancelDelete =
//         document.getElementById(
//             "cancelDelete"
//         );

//     const confirmDelete =
//         document.getElementById(
//             "confirmDelete"
//         );


//     /*
//      * Currently selected member
//      * waiting for confirmation.
//      */

//     let memberToDelete = null;



//     /* =====================================================
//        CARD
//     ===================================================== */

//     card.appendChild(
//         top
//     );

//     card.appendChild(
//         status
//     );

//     card.appendChild(
//         actions
//     );


//     return card;

// }


// /* =========================================================
//    STATISTICS
// ========================================================= */

// function updateStatistics() {

//     const total =
//         allMembers.length;


//     const active =
//         allMembers.filter(
//             member =>
//                 member.status !== "Inactive"
//         ).length;


//     const inactive =
//         allMembers.filter(
//             member =>
//                 member.status === "Inactive"
//         ).length;


//     if (totalMembers) {

//         totalMembers.textContent =
//             total;

//     }


//     if (activeMembers) {

//         activeMembers.textContent =
//             active;

//     }


//     if (inactiveMembers) {

//         inactiveMembers.textContent =
//             inactive;

//     }

// }


// /* =========================================================
//    OPEN ADD MEMBER
// ========================================================= */

// function openAddMember() {

//     editingMemberId =
//         null;


//     if (memberForm) {

//         memberForm.reset();

//     }


//     if (memberDocumentId) {

//         memberDocumentId.value =
//             "";

//     }


//     if (memberStatus) {

//         memberStatus.value =
//             "Active";

//     }


//     if (memberDesignation) {

//         memberDesignation.value =
//             "Member";

//     }


//     if (memberModalTitle) {

//         memberModalTitle.textContent =
//             "Add Member";

//     }


//     if (saveMember) {

//         saveMember.textContent =
//             "Save Member";

//     }


//     clearFormError();

//     showModal();

// }


// /* =========================================================
//    OPEN EDIT MEMBER
// ========================================================= */

// function openEditMember(
//     member
// ) {

//     /*
//      * Existing Firestore document ID.
//      */

//     editingMemberId =
//         member.documentId;


//     if (memberDocumentId) {

//         memberDocumentId.value =
//             member.documentId ||
//             "";

//     }


//     /*
//      * EXACT JSON FIELD:
//      * id
//      */

//     if (memberId) {

//         memberId.value =
//             member.id ||
//             member.documentId ||
//             "";

//     }


//     /*
//      * EXACT JSON FIELD:
//      * name
//      */

//     if (memberName) {

//         memberName.value =
//             member.name ||
//             "";

//     }


//     /*
//      * EXACT JSON FIELD:
//      * odia_name
//      */

//     if (memberOdiaName) {

//         memberOdiaName.value =
//             member.odia_name ||
//             "";

//     }


//     /*
//      * EXACT JSON FIELD:
//      * photo
//      */

//     if (memberPhoto) {

//         memberPhoto.value =
//             member.photo ||
//             "";

//     }


//     /*
//      * EXACT JSON FIELD:
//      * designation
//      */

//     if (memberDesignation) {

//         memberDesignation.value =
//             member.designation ||
//             "Member";

//     }


//     /*
//      * EXACT JSON FIELD:
//      * phone
//      */

//     if (memberPhone) {

//         memberPhone.value =
//             member.phone ||
//             "";

//     }


//     /*
//      * EXACT JSON FIELD:
//      * address
//      */

//     if (memberAddress) {

//         memberAddress.value =
//             member.address ||
//             "";

//     }


//     /*
//      * EXACT JSON FIELD:
//      * joinDate
//      */

//     if (memberJoinDate) {

//         memberJoinDate.value =
//             member.joinDate ||
//             "";

//     }


//     /*
//      * EXACT JSON FIELD:
//      * valid
//      */

//     if (memberValid) {

//         memberValid.value =
//             member.valid ||
//             "";

//     }


//     /*
//      * EXACT JSON FIELD:
//      * status
//      */

//     if (memberStatus) {

//         memberStatus.value =
//             member.status === "Inactive"
//                 ? "Inactive"
//                 : "Active";

//     }


//     if (memberModalTitle) {

//         memberModalTitle.textContent =
//             "Edit Member";

//     }


//     if (saveMember) {

//         saveMember.textContent =
//             "Update Member";

//     }


//     clearFormError();

//     showModal();

// }


// /* =========================================================
//    GET FORM DATA
// ========================================================= */

// function getFormData() {

//     return {

//         /*
//          * EXACT JSON STRUCTURE
//          */

//         id:
//             memberId?.value
//                 .trim() || "",

//         name:
//             memberName?.value
//                 .trim() || "",

//         odia_name:
//             memberOdiaName?.value
//                 .trim() || "",

//         photo:
//             memberPhoto?.value
//                 .trim() || "",

//         /*
//          * The current HTML does not have a
//          * club input, so preserve the existing
//          * club value during editing.
//          */

//         club:
//             getExistingClubValue(),

//         designation:
//             memberDesignation?.value
//                 .trim() || "Member",

//         status:
//             memberStatus?.value ||
//             "Active",

//         phone:
//             memberPhone?.value
//                 .trim() || "",

//         address:
//             memberAddress?.value
//                 .trim() || "",

//         joinDate:
//             memberJoinDate?.value ||
//             "",

//         valid:
//             memberValid?.value ||
//             ""

//     };

// }


// /* =========================================================
//    EXISTING CLUB VALUE
// ========================================================= */

// function getExistingClubValue() {

//     /*
//      * While editing, preserve the existing
//      * club field.
//      */

//     if (editingMemberId) {

//         const existingMember =
//             allMembers.find(
//                 member =>
//                     member.documentId ===
//                     editingMemberId
//             );


//         if (existingMember) {

//             return (
//                 existingMember.club ||
//                 "Sun Shine Club"
//             );

//         }

//     }


//     /*
//      * New members use the same club name
//      * as the existing JSON.
//      */

//     return "Sun Shine Club";

// }


// /* =========================================================
//    SAVE MEMBER
// ========================================================= */

// memberForm?.addEventListener(
//     "submit",
//     async event => {

//         event.preventDefault();


//         clearFormError();


//         const data =
//             getFormData();


//         const validationError =
//             validateMemberData(
//                 data
//             );


//         if (validationError) {

//             showFormError(
//                 validationError
//             );

//             return;

//         }


//         setSaveLoading(true);


//         try {

//             /*
//              * Existing members:
//              *
//              * members/SSC001
//              *
//              * New members:
//              *
//              * members/SSC043
//              */

//             const documentId =
//                 editingMemberId ||
//                 data.id;


//             const memberReference =
//                 doc(
//                     db,
//                     "members",
//                     documentId
//                 );


//             /*
//              * IMPORTANT:
//              *
//              * These are the SAME field names
//              * as the original members JSON.
//              */

//             const memberData = {

//                 id:
//                     data.id,

//                 name:
//                     data.name,

//                 odia_name:
//                     data.odia_name,

//                 photo:
//                     data.photo,

//                 club:
//                     data.club,

//                 designation:
//                     data.designation,

//                 status:
//                     data.status,

//                 phone:
//                     data.phone,

//                 address:
//                     data.address,

//                 joinDate:
//                     data.joinDate,

//                 valid:
//                     data.valid

//             };


//             if (editingMemberId) {

//                 /*
//                  * UPDATE existing document.
//                  *
//                  * This preserves the existing
//                  * document ID.
//                  */

//                 await updateDoc(
//                     memberReference,
//                     memberData
//                 );


//                 console.log(
//                     "Member updated:",
//                     documentId
//                 );


//             } else {

//                 /*
//                  * CREATE new member.
//                  */

//                 await setDoc(
//                     memberReference,
//                     memberData
//                 );


//                 console.log(
//                     "Member created:",
//                     documentId
//                 );

//             }


//             closeModal();


//             await loadMembers();


//         } catch (error) {

//             console.error(
//                 "Unable to save member:",
//                 error
//             );


//             showFormError(
//                 getFirestoreErrorMessage(
//                     error
//                 )
//             );


//         } finally {

//             setSaveLoading(false);

//         }

//     }
// );


// /* =========================================================
//    VALIDATE MEMBER
// ========================================================= */

// function validateMemberData(
//     data
// ) {

//     if (!data.id) {

//         return "Please enter a Member ID.";

//     }


//     /*
//      * Example:
//      * SSC001
//      * SSC042
//      */

//     if (
//         !/^[A-Za-z0-9_-]+$/.test(
//             data.id
//         )
//     ) {

//         return (
//             "Member ID may contain only " +
//             "letters, numbers, hyphens and underscores."
//         );

//     }


//     if (!data.name) {

//         return "Please enter the member name.";

//     }


//     if (
//         data.photo &&
//         !isValidUrl(data.photo)
//     ) {

//         return "Please enter a valid photo URL.";

//     }


//     return null;

// }


// /* =========================================================
//    DELETE MEMBER
// ========================================================= */

// async function deleteMember(
//     member
// ) {

//     const memberIdValue =
//         member.id ||
//         member.documentId;


//     const memberNameValue =
//         member.name ||
//         "this member";


//     const confirmed =
//         /* =========================================================
//    OPEN DELETE MODAL
// ========================================================= */

// function deleteMember(
//     member
// ) {

//     memberToDelete =
//         member;


//     const name =
//         member.name ||
//         "this member";


//     const id =
//         member.id ||
//         member.documentId ||
//         "Unknown ID";


//     if (deleteMemberName) {

//         deleteMemberName.textContent =
//             name;

//     }


//     if (deleteMemberId) {

//         deleteMemberId.textContent =
//             id;

//     }


//     if (deleteModal) {

//         deleteModal.hidden =
//             false;

//     }


//     document.body.classList.add(
//         "delete-modal-open"
//     );


//     /*
//      * Focus the dangerous action
//      * only after the modal appears.
//      */

//     setTimeout(
//         () => {

//             confirmDelete?.focus();

//         },
//         50
//     );

// }


// /* =========================================================
//    CONFIRM DELETE
// ========================================================= */

// confirmDelete?.addEventListener(
//     "click",
//     async () => {

//         if (!memberToDelete) {

//             return;

//         }


//         const member =
//             memberToDelete;


//         const documentId =
//             member.documentId ||
//             member.id;


//         if (!documentId) {

//             alert(
//                 "Unable to determine the member ID."
//             );

//             return;

//         }


//         confirmDelete.disabled =
//             true;


//         confirmDelete.innerHTML =
//             `
//                 <i class="fa-solid fa-spinner fa-spin"></i>
//                 Deleting...
//             `;


//         try {

//             console.log(
//                 "Deleting member:",
//                 documentId
//             );


//             const memberReference =
//                 doc(
//                     db,
//                     "members",
//                     documentId
//                 );


//             await deleteDoc(
//                 memberReference
//             );


//             console.log(
//                 "Member deleted successfully:",
//                 documentId
//             );


//             /*
//              * Remove from local array immediately.
//              */

//             allMembers =
//                 allMembers.filter(
//                     item =>
//                         item.documentId !==
//                         documentId
//                 );


//             /*
//              * Update UI immediately.
//              */

//             updateStatistics();

//             renderMembers();


//             closeDeleteModal();


//         } catch (error) {

//             console.error(
//                 "Unable to delete member:",
//                 error
//             );


//             alert(
//                 getFirestoreErrorMessage(
//                     error
//                 )
//             );


//         } finally {

//             confirmDelete.disabled =
//                 false;


//             confirmDelete.innerHTML =
//                 `
//                     <i class="fa-solid fa-trash"></i>
//                     Delete Member
//                 `;

//         }

//     }
// );


// /* =========================================================
//    CLOSE DELETE MODAL
// ========================================================= */

// function closeDeleteModal() {

//     if (!deleteModal) {

//         return;

//     }


//     deleteModal.hidden =
//         true;


//     document.body.classList.remove(
//         "delete-modal-open"
//     );


//     memberToDelete =
//         null;

// }

// /* =========================================================
//    DELETE MODAL EVENTS
// ========================================================= */

// cancelDelete?.addEventListener(
//     "click",
//     closeDeleteModal
// );


// deleteModalOverlay?.addEventListener(
//     "click",
//     closeDeleteModal
// );



// /* =========================================================
//    DELETE MODAL ESCAPE
// ========================================================= */

// document.addEventListener(
//     "keydown",
//     event => {

//         if (
//             event.key === "Escape" &&
//             deleteModal &&
//             !deleteModal.hidden
//         ) {

//             closeDeleteModal();

//         }

//     }
// );
//     if (!confirmed) {

//         return;

//     }


//     try {

//         const memberReference =
//             doc(
//                 db,
//                 "members",
//                 member.documentId
//             );


//         await deleteDoc(
//             memberReference
//         );


//         console.log(
//             "Member deleted:",
//             member.documentId
//         );


//         await loadMembers();


//     } catch (error) {

//         console.error(
//             "Unable to delete member:",
//             error
//         );


//         alert(
//             getFirestoreErrorMessage(
//                 error
//             )
//         );

//     }

// }


// /* =========================================================
//    SEARCH
// ========================================================= */

// memberSearch?.addEventListener(
//     "input",
//     renderMembers
// );


// /* =========================================================
//    STATUS FILTER
// ========================================================= */

// statusFilter?.addEventListener(
//     "change",
//     renderMembers
// );


// /* =========================================================
//    ADD BUTTON
// ========================================================= */

// addMemberButton?.addEventListener(
//     "click",
//     openAddMember
// );


// /* =========================================================
//    CLOSE MODAL
// ========================================================= */

// closeMemberModal?.addEventListener(
//     "click",
//     closeModal
// );


// cancelMember?.addEventListener(
//     "click",
//     closeModal
// );


// memberModalOverlay?.addEventListener(
//     "click",
//     closeModal
// );


// /* =========================================================
//    ESCAPE KEY
// ========================================================= */

// document.addEventListener(
//     "keydown",
//     event => {

//         if (
//             event.key === "Escape" &&
//             memberModal &&
//             !memberModal.hidden
//         ) {

//             closeModal();

//         }

//     }
// );


// /* =========================================================
//    MODAL
// ========================================================= */

// function showModal() {

//     if (!memberModal) {

//         return;

//     }


//     memberModal.hidden =
//         false;


//     document.body.classList.add(
//         "modal-open"
//     );


//     setTimeout(
//         () => {

//             memberName?.focus();

//         },
//         50
//     );

// }


// function closeModal() {

//     if (!memberModal) {

//         return;

//     }


//     memberModal.hidden =
//         true;


//     document.body.classList.remove(
//         "modal-open"
//     );


//     clearFormError();

// }


// /* =========================================================
//    FORM ERROR
// ========================================================= */

// function showFormError(
//     message
// ) {

//     if (!memberFormError) {

//         return;

//     }


//     memberFormError.textContent =
//         message;


//     memberFormError.hidden =
//         false;

// }


// function clearFormError() {

//     if (!memberFormError) {

//         return;

//     }


//     memberFormError.textContent =
//         "";


//     memberFormError.hidden =
//         true;

// }


// /* =========================================================
//    SAVE LOADING
// ========================================================= */

// function setSaveLoading(
//     loading
// ) {

//     if (!saveMember) {

//         return;

//     }


//     saveMember.disabled =
//         loading;


//     saveMember.textContent =
//         loading
//             ? "Saving..."
//             : (
//                 editingMemberId
//                     ? "Update Member"
//                     : "Save Member"
//             );

// }


// /* =========================================================
//    PAGE LOADING
// ========================================================= */

// function showLoading(loading) {

//     if (!membersLoading) {
//         return;
//     }

//     membersLoading.hidden = !loading;

// }


// /* =========================================================
//    EMPTY STATE
// ========================================================= */

// function showEmpty(
//     show
// ) {

//     if (!membersEmpty) {

//         return;

//     }


//     membersEmpty.hidden =
//         !show;

// }


// /* =========================================================
//    FIRESTORE ERROR
// ========================================================= */

// function showMembersError(
//     message
// ) {

//     if (!membersList) {

//         return;

//     }


//     membersList.innerHTML =
//         "";


//     const error =
//         document.createElement(
//             "div"
//         );

//     error.className =
//         "members-empty";


//     const title =
//         document.createElement(
//             "h3"
//         );

//     title.textContent =
//         "Unable to load members";


//     const text =
//         document.createElement(
//             "p"
//         );

//     text.textContent =
//         message;


//     error.appendChild(
//         title
//     );

//     error.appendChild(
//         text
//     );


//     membersList.appendChild(
//         error
//     );

// }


// /* =========================================================
//    FIRESTORE ERROR MESSAGE
// ========================================================= */

// function getFirestoreErrorMessage(
//     error
// ) {

//     if (!error) {

//         return "An unknown error occurred.";

//     }


//     switch (error.code) {

//         case "permission-denied":

//             return (
//                 "Permission denied. " +
//                 "Check your Firestore security rules " +
//                 "and administrator authorization."
//             );


//         case "failed-precondition":

//             return (
//                 "Firestore configuration is incomplete."
//             );


//         case "unavailable":

//             return (
//                 "Firestore is temporarily unavailable. " +
//                 "Please try again."
//             );


//         case "not-found":

//             return (
//                 "The requested member was not found."
//             );


//         case "unauthenticated":

//             return (
//                 "Your administrator session has expired. " +
//                 "Please sign in again."
//             );


//         default:

//             return (
//                 error.message ||
//                 "Something went wrong. Please try again."
//             );

//     }

// }


// /* =========================================================
//    URL VALIDATION
// ========================================================= */

// function isValidUrl(
//     value
// ) {

//     try {

//         const url =
//             new URL(value);


//         return (
//             url.protocol === "http:" ||
//             url.protocol === "https:"
//         );


//     } catch {

//         return false;

//     }

// }


// /* =========================================================
//    PLACEHOLDER IMAGE
// ========================================================= */

// function createPlaceholderImage(
//     name = "Member"
// ) {

//     const letter =
//         String(name)
//             .trim()
//             .charAt(0)
//             .toUpperCase() ||
//         "M";


//     const svg = `
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="200"
//             height="200"
//             viewBox="0 0 200 200"
//         >

//             <rect
//                 width="200"
//                 height="200"
//                 fill="#eeeeee"
//             />

//             <text
//                 x="100"
//                 y="115"
//                 text-anchor="middle"
//                 font-family="Arial, sans-serif"
//                 font-size="80"
//                 font-weight="700"
//                 fill="#777777"
//             >
//                 ${escapeSvg(letter)}
//             </text>

//         </svg>
//     `;


//     return (
//         "data:image/svg+xml;charset=UTF-8," +
//         encodeURIComponent(svg)
//     );

// }


// /* =========================================================
//    SVG ESCAPE
// ========================================================= */

// function escapeSvg(
//     value
// ) {

//     return String(value)

//         .replace(
//             /&/g,
//             "&amp;"
//         )

//         .replace(
//             /</g,
//             "&lt;"
//         )

//         .replace(
//             />/g,
//             "&gt;"
//         )

//         .replace(
//             /"/g,
//             "&quot;"
//         )

//         .replace(
//             /'/g,
//             "&apos;"
//         );

// }


// /* =========================================================
//    SYSTEM MESSAGE
// ========================================================= */

// console.log(
//     "Members management system loaded"
// );




/* =========================================================
   MEMBERS MANAGEMENT
   Sun Shine Club Kendupalli
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
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================================================
   DOM ELEMENTS
========================================================= */

/* Admin profile */

const sidebarName =
    document.getElementById("sidebarName");

const sidebarEmail =
    document.getElementById("sidebarEmail");

const sidebarAvatar =
    document.getElementById("sidebarAvatar");

const topbarName =
    document.getElementById("topbarName");

const topbarAvatar =
    document.getElementById("topbarAvatar");


/* Members */

const membersList =
    document.getElementById("membersList");

const membersLoading =
    document.getElementById("membersLoading");

const membersEmpty =
    document.getElementById("membersEmpty");

const memberSearch =
    document.getElementById("memberSearch");

const statusFilter =
    document.getElementById("statusFilter");


/* Statistics */

const totalMembers =
    document.getElementById("totalMembers");

const activeMembers =
    document.getElementById("activeMembers");

const inactiveMembers =
    document.getElementById("inactiveMembers");


/* Add/Edit modal */

const memberModal =
    document.getElementById("memberModal");

const memberModalOverlay =
    document.getElementById("memberModalOverlay");

const closeMemberModalButton =
    document.getElementById("closeMemberModal");

const cancelMember =
    document.getElementById("cancelMember");

const addMemberButton =
    document.getElementById("addMemberButton");


/* Form */

const memberForm =
    document.getElementById("memberForm");

const memberModalTitle =
    document.getElementById("memberModalTitle");

const memberDocumentId =
    document.getElementById("memberDocumentId");

const memberId =
    document.getElementById("memberId");

const memberName =
    document.getElementById("memberName");

const memberOdiaName =
    document.getElementById("memberOdiaName");

const memberPhoto =
    document.getElementById("memberPhoto");

const memberDesignation =
    document.getElementById("memberDesignation");

const memberPhone =
    document.getElementById("memberPhone");

const memberAddress =
    document.getElementById("memberAddress");

const memberJoinDate =
    document.getElementById("memberJoinDate");

const memberValid =
    document.getElementById("memberValid");

const memberStatus =
    document.getElementById("memberStatus");

const memberFormError =
    document.getElementById("memberFormError");

const saveMember =
    document.getElementById("saveMember");


/* Delete modal */

const deleteModal =
    document.getElementById("deleteModal");

const deleteModalOverlay =
    document.getElementById("deleteModalOverlay");

const deleteMemberName =
    document.getElementById("deleteMemberName");

const deleteMemberId =
    document.getElementById("deleteMemberId");

const cancelDelete =
    document.getElementById("cancelDelete");

const confirmDelete =
    document.getElementById("confirmDelete");


/* =========================================================
   STATE
========================================================= */

let allMembers = [];

let editingMemberId = null;

let memberToDelete = null;


/* =========================================================
   INITIALIZATION
========================================================= */

console.log(
    "Members management system loaded"
);


/* =========================================================
   FIREBASE AUTH
========================================================= */

onAuthStateChanged(
    auth,
    user => {

        if (!user) {

            console.log(
                "Members page: no authenticated user"
            );

            return;
        }


        console.log(
            "Members page authenticated:",
            user.email
        );


        setAdminProfile(user);

        loadMembers();

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


    /* Sidebar */

    if (sidebarName) {

        sidebarName.textContent =
            name;

    }


    if (sidebarEmail) {

        sidebarEmail.textContent =
            email;

    }


    /* Topbar */

    if (topbarName) {

        topbarName.textContent =
            name;

    }


    /* Avatars */

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
            document.createElement("img");

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


/* =========================================================
   INITIAL
========================================================= */

function getInitial(name) {

    return (
        String(name || "")
            .trim()
            .charAt(0)
            .toUpperCase() ||
        "A"
    );

}


/* =========================================================
   LOAD MEMBERS
========================================================= */

async function loadMembers() {

    showLoading(true);

    showEmpty(false);


    try {

        console.log(
            "Loading members from Firestore..."
        );


        const membersRef =
            collection(
                db,
                "members"
            );


        const snapshot =
            await getDocs(
                membersRef
            );


        console.log(
            "Firestore member documents:",
            snapshot.size
        );


        allMembers = [];


        snapshot.forEach(
            documentSnapshot => {

                const data =
                    documentSnapshot.data();


                allMembers.push({

                    documentId:
                        documentSnapshot.id,

                    ...data

                });

            }
        );


        allMembers.sort(
            compareMemberIds
        );


        updateStatistics();

        renderMembers();


        /*
         * Explicitly hide the spinner
         * after rendering.
         */

        showLoading(false);


        console.log(
            "Members rendered:",
            allMembers.length
        );


    } catch (error) {

        console.error(
            "Unable to load members:",
            error
        );


        showLoading(false);

        showMembersError(
            getFirestoreErrorMessage(
                error
            )
        );

    }

}


/* =========================================================
   SORT MEMBERS
========================================================= */

function compareMemberIds(
    a,
    b
) {

    const idA =
        String(
            a.id ||
            a.documentId ||
            ""
        );

    const idB =
        String(
            b.id ||
            b.documentId ||
            ""
        );


    const numberA =
        extractMemberNumber(idA);

    const numberB =
        extractMemberNumber(idB);


    if (
        numberA !== null &&
        numberB !== null
    ) {

        return numberA - numberB;

    }


    return idA.localeCompare(
        idB,
        undefined,
        {
            numeric: true,
            sensitivity: "base"
        }
    );

}


/* =========================================================
   MEMBER NUMBER
========================================================= */

function extractMemberNumber(id) {

    const match =
        String(id).match(
            /(\d+)$/
        );


    if (!match) {

        return null;

    }


    return Number(
        match[1]
    );

}


/* =========================================================
   RENDER MEMBERS
========================================================= */

function renderMembers() {

    if (!membersList) {

        return;

    }


    const searchText =
        String(
            memberSearch?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const selectedStatus =
        statusFilter?.value ||
        "all";


    const filteredMembers =
        allMembers.filter(
            member => {

                const searchableText = [

                    member.id,

                    member.name,

                    member.odia_name,

                    member.club,

                    member.designation,

                    member.phone,

                    member.address,

                    member.joinDate,

                    member.valid,

                    member.status

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    !searchText ||
                    searchableText.includes(
                        searchText
                    );


                const matchesStatus =
                    selectedStatus === "all" ||
                    member.status ===
                        selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    membersList.innerHTML = "";


    if (
        filteredMembers.length === 0
    ) {

        showEmpty(true);

        return;

    }


    showEmpty(false);


    filteredMembers.forEach(
        member => {

            membersList.appendChild(
                createMemberCard(
                    member
                )
            );

        }
    );

}


/* =========================================================
   CREATE MEMBER CARD
========================================================= */

function createMemberCard(
    member
) {

    const card =
        document.createElement(
            "article"
        );

    card.className =
        "member-admin-card";


    /* -----------------------------------------------------
       Top
    ----------------------------------------------------- */

    const top =
        document.createElement(
            "div"
        );

    top.className =
        "member-admin-top";


    /* -----------------------------------------------------
       Photo
    ----------------------------------------------------- */

    const image =
        document.createElement(
            "img"
        );

    image.className =
        "member-admin-photo";


    image.alt =
        `${member.name || "Member"} - Sun Shine Club Kendupalli`;


    image.src =
        member.photo ||
        createPlaceholderImage(
            member.name
        );


    image.onerror =
        () => {

            image.onerror =
                null;

            image.src =
                createPlaceholderImage(
                    member.name
                );

        };


    /* -----------------------------------------------------
       Information
    ----------------------------------------------------- */

    const information =
        document.createElement(
            "div"
        );

    information.className =
        "member-admin-info";


    const name =
        document.createElement(
            "h3"
        );

    name.textContent =
        member.name ||
        "Unnamed Member";


    const designation =
        document.createElement(
            "p"
        );

    designation.textContent =
        member.designation ||
        "Member";


    const id =
        document.createElement(
            "span"
        );

    id.className =
        "member-id";

    id.textContent =
        member.id ||
        member.documentId ||
        "No ID";


    information.appendChild(name);

    information.appendChild(
        designation
    );

    information.appendChild(id);


    top.appendChild(image);

    top.appendChild(
        information
    );


    /* -----------------------------------------------------
       Status
    ----------------------------------------------------- */

    const status =
        document.createElement(
            "span"
        );


    const currentStatus =
        member.status === "Inactive"
            ? "Inactive"
            : "Active";


    status.className =
        `member-status ${
            currentStatus.toLowerCase()
        }`;


    status.textContent =
        currentStatus;


    /* -----------------------------------------------------
       Actions
    ----------------------------------------------------- */

    const actions =
        document.createElement(
            "div"
        );

    actions.className =
        "member-card-actions";


    const editButton =
        document.createElement(
            "button"
        );

    editButton.type =
        "button";

    editButton.className =
        "edit-member-button";


    editButton.innerHTML =
        `
            <i class="fa-solid fa-pen"></i>
            <span>Edit</span>
        `;


    editButton.addEventListener(
        "click",
        () => {

            openEditMember(
                member
            );

        }
    );


    const deleteButton =
        document.createElement(
            "button"
        );

    deleteButton.type =
        "button";

    deleteButton.className =
        "delete-member-button";


    deleteButton.innerHTML =
        `
            <i class="fa-solid fa-trash"></i>
            <span>Delete</span>
        `;


    deleteButton.addEventListener(
        "click",
        () => {

            openDeleteModal(
                member
            );

        }
    );


    actions.appendChild(
        editButton
    );

    actions.appendChild(
        deleteButton
    );


    /* -----------------------------------------------------
       Final card
    ----------------------------------------------------- */

    card.appendChild(
        top
    );

    card.appendChild(
        status
    );

    card.appendChild(
        actions
    );


    return card;

}


/* =========================================================
   STATISTICS
========================================================= */

function updateStatistics() {

    const total =
        allMembers.length;


    const active =
        allMembers.filter(
            member =>
                member.status !==
                "Inactive"
        ).length;


    const inactive =
        allMembers.filter(
            member =>
                member.status ===
                "Inactive"
        ).length;


    if (totalMembers) {

        totalMembers.textContent =
            total;

    }


    if (activeMembers) {

        activeMembers.textContent =
            active;

    }


    if (inactiveMembers) {

        inactiveMembers.textContent =
            inactive;

    }

}


/* =========================================================
   ADD MEMBER
========================================================= */

function openAddMember() {

    editingMemberId =
        null;


    if (memberForm) {

        memberForm.reset();

    }


    if (memberDocumentId) {

        memberDocumentId.value =
            "";

    }


    if (memberStatus) {

        memberStatus.value =
            "Active";

    }


    if (memberDesignation) {

        memberDesignation.value =
            "Member";

    }


    if (memberModalTitle) {

        memberModalTitle.textContent =
            "Add Member";

    }


    if (saveMember) {

        saveMember.textContent =
            "Save Member";

    }


    clearFormError();

    showMemberModal();

}


/* =========================================================
   EDIT MEMBER
========================================================= */

function openEditMember(
    member
) {

    editingMemberId =
        member.documentId;


    if (memberDocumentId) {

        memberDocumentId.value =
            member.documentId ||
            "";

    }


    if (memberId) {

        memberId.value =
            member.id ||
            member.documentId ||
            "";

    }


    if (memberName) {

        memberName.value =
            member.name ||
            "";

    }


    if (memberOdiaName) {

        memberOdiaName.value =
            member.odia_name ||
            "";

    }


    if (memberPhoto) {

        memberPhoto.value =
            member.photo ||
            "";

    }


    if (memberDesignation) {

        memberDesignation.value =
            member.designation ||
            "Member";

    }


    if (memberPhone) {

        memberPhone.value =
            member.phone ||
            "";

    }


    if (memberAddress) {

        memberAddress.value =
            member.address ||
            "";

    }


    if (memberJoinDate) {

        memberJoinDate.value =
            member.joinDate ||
            "";

    }


    if (memberValid) {

        memberValid.value =
            member.valid ||
            "";

    }


    if (memberStatus) {

        memberStatus.value =
            member.status === "Inactive"
                ? "Inactive"
                : "Active";

    }


    if (memberModalTitle) {

        memberModalTitle.textContent =
            "Edit Member";

    }


    if (saveMember) {

        saveMember.textContent =
            "Update Member";

    }


    clearFormError();

    showMemberModal();

}


/* =========================================================
   FORM DATA
========================================================= */

function getFormData() {

    return {

        id:
            memberId?.value.trim() ||
            "",

        name:
            memberName?.value.trim() ||
            "",

        odia_name:
            memberOdiaName?.value.trim() ||
            "",

        photo:
            memberPhoto?.value.trim() ||
            "",

        club:
            getExistingClubValue(),

        designation:
            memberDesignation?.value.trim() ||
            "Member",

        status:
            memberStatus?.value ||
            "Active",

        phone:
            memberPhone?.value.trim() ||
            "",

        address:
            memberAddress?.value.trim() ||
            "",

        joinDate:
            memberJoinDate?.value ||
            "",

        valid:
            memberValid?.value ||
            ""

    };

}


/* =========================================================
   CLUB
========================================================= */

function getExistingClubValue() {

    if (editingMemberId) {

        const existingMember =
            allMembers.find(
                member =>
                    member.documentId ===
                    editingMemberId
            );


        if (existingMember) {

            return (
                existingMember.club ||
                "Sun Shine Club"
            );

        }

    }


    return "Sun Shine Club";

}


/* =========================================================
   SAVE MEMBER
========================================================= */

memberForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        clearFormError();


        const data =
            getFormData();


        const validationError =
            validateMemberData(
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
                editingMemberId ||
                data.id;


            const memberReference =
                doc(
                    db,
                    "members",
                    documentId
                );


            const memberData = {

                id:
                    data.id,

                name:
                    data.name,

                odia_name:
                    data.odia_name,

                photo:
                    data.photo,

                club:
                    data.club,

                designation:
                    data.designation,

                status:
                    data.status,

                phone:
                    data.phone,

                address:
                    data.address,

                joinDate:
                    data.joinDate,

                valid:
                    data.valid

            };


            if (editingMemberId) {

                await updateDoc(
                    memberReference,
                    memberData
                );


                console.log(
                    "Member updated:",
                    documentId
                );

            } else {

                await setDoc(
                    memberReference,
                    memberData
                );


                console.log(
                    "Member created:",
                    documentId
                );

            }


            closeMemberModal();

            await loadMembers();


        } catch (error) {

            console.error(
                "Unable to save member:",
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
   VALIDATE MEMBER
========================================================= */

function validateMemberData(
    data
) {

    if (!data.id) {

        return "Please enter a Member ID.";

    }


    if (
        !/^[A-Za-z0-9_-]+$/.test(
            data.id
        )
    ) {

        return (
            "Member ID may contain only " +
            "letters, numbers, hyphens and underscores."
        );

    }


    if (!data.name) {

        return "Please enter the member name.";

    }


    if (
        data.photo &&
        !isValidUrl(data.photo)
    ) {

        return "Please enter a valid photo URL.";

    }


    return null;

}


/* =========================================================
   DELETE MODAL
========================================================= */

function openDeleteModal(
    member
) {

    memberToDelete =
        member;


    const name =
        member.name ||
        "this member";


    const id =
        member.id ||
        member.documentId ||
        "Unknown ID";


    if (deleteMemberName) {

        deleteMemberName.textContent =
            name;

    }


    if (deleteMemberId) {

        deleteMemberId.textContent =
            id;

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

        if (!memberToDelete) {

            return;

        }


        const member =
            memberToDelete;


        const documentId =
            member.documentId ||
            member.id;


        if (!documentId) {

            return;

        }


        confirmDelete.disabled =
            true;


        confirmDelete.innerHTML =
            `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Deleting...
            `;


        try {

            console.log(
                "Deleting member:",
                documentId
            );


            const memberReference =
                doc(
                    db,
                    "members",
                    documentId
                );


            await deleteDoc(
                memberReference
            );


            /*
             * Remove immediately from
             * local state.
             */

            allMembers =
                allMembers.filter(
                    item =>
                        item.documentId !==
                        documentId
                );


            updateStatistics();

            renderMembers();


            closeDeleteModal();


            console.log(
                "Member deleted:",
                documentId
            );


        } catch (error) {

            console.error(
                "Unable to delete member:",
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


            confirmDelete.innerHTML =
                `
                    <i class="fa-solid fa-trash"></i>
                    Delete Member
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


    memberToDelete =
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
   ADD / EDIT MODAL
========================================================= */

function showMemberModal() {

    if (!memberModal) {

        return;

    }


    memberModal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    setTimeout(
        () => {

            memberName?.focus();

        },
        50
    );

}


function closeMemberModal() {

    if (!memberModal) {

        return;

    }


    memberModal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    editingMemberId =
        null;


    clearFormError();

}


closeMemberModalButton?.addEventListener(
    "click",
    closeMemberModal
);


cancelMember?.addEventListener(
    "click",
    closeMemberModal
);


memberModalOverlay?.addEventListener(
    "click",
    closeMemberModal
);


addMemberButton?.addEventListener(
    "click",
    openAddMember
);


/* =========================================================
   SEARCH
========================================================= */

memberSearch?.addEventListener(
    "input",
    renderMembers
);


/* =========================================================
   STATUS FILTER
========================================================= */

statusFilter?.addEventListener(
    "change",
    renderMembers
);


/* =========================================================
   ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
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
            memberModal &&
            !memberModal.hidden
        ) {

            closeMemberModal();

        }

    }
);


/* =========================================================
   FORM ERROR
========================================================= */

function showFormError(
    message
) {

    if (!memberFormError) {

        return;

    }


    memberFormError.textContent =
        message;


    memberFormError.hidden =
        false;

}


function clearFormError() {

    if (!memberFormError) {

        return;

    }


    memberFormError.textContent =
        "";

    memberFormError.hidden =
        true;

}


/* =========================================================
   SAVE LOADING
========================================================= */

function setSaveLoading(
    loading
) {

    if (!saveMember) {

        return;

    }


    saveMember.disabled =
        loading;


    saveMember.textContent =
        loading
            ? "Saving..."
            : (
                editingMemberId
                    ? "Update Member"
                    : "Save Member"
            );

}


/* =========================================================
   LOADING
========================================================= */

function showLoading(
    loading
) {

    if (!membersLoading) {

        return;

    }


    membersLoading.hidden =
        !loading;

}


/* =========================================================
   EMPTY
========================================================= */

function showEmpty(
    show
) {

    if (!membersEmpty) {

        return;

    }


    membersEmpty.hidden =
        !show;

}


/* =========================================================
   ERROR DISPLAY
========================================================= */

function showMembersError(
    message
) {

    if (!membersList) {

        return;

    }


    membersList.innerHTML =
        "";


    const error =
        document.createElement(
            "div"
        );

    error.className =
        "members-empty";


    const title =
        document.createElement(
            "h3"
        );

    title.textContent =
        "Unable to load members";


    const text =
        document.createElement(
            "p"
        );

    text.textContent =
        message;


    error.appendChild(title);

    error.appendChild(text);

    membersList.appendChild(error);

}


/* =========================================================
   FIRESTORE ERROR
========================================================= */

function getFirestoreErrorMessage(
    error
) {

    if (!error) {

        return "An unknown error occurred.";

    }


    switch (error.code) {

        case "permission-denied":

            return (
                "Permission denied. Check your " +
                "Firestore security rules and admin authorization."
            );


        case "failed-precondition":

            return (
                "Firestore configuration is incomplete."
            );


        case "unavailable":

            return (
                "Firestore is temporarily unavailable. " +
                "Please try again."
            );


        case "not-found":

            return (
                "The requested member was not found."
            );


        case "unauthenticated":

            return (
                "Your administrator session has expired. " +
                "Please sign in again."
            );


        default:

            return (
                error.message ||
                "Something went wrong. Please try again."
            );

    }

}


/* =========================================================
   URL VALIDATION
========================================================= */

function isValidUrl(
    value
) {

    try {

        const url =
            new URL(value);


        return (
            url.protocol === "http:" ||
            url.protocol === "https:"
        );

    } catch {

        return false;

    }

}


/* =========================================================
   PLACEHOLDER IMAGE
========================================================= */

function createPlaceholderImage(
    name = "Member"
) {

    const letter =
        getInitial(name);


    const svg = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
            viewBox="0 0 200 200"
        >

            <rect
                width="200"
                height="200"
                fill="#eeeeee"
            />

            <text
                x="100"
                y="115"
                text-anchor="middle"
                font-family="Arial, sans-serif"
                font-size="80"
                font-weight="700"
                fill="#777777"
            >
                ${escapeSvg(letter)}
            </text>

        </svg>
    `;


    return (
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg)
    );

}


/* =========================================================
   SVG ESCAPE
========================================================= */

function escapeSvg(
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
            "&apos;"
        );

}