// /* =========================================================
//    SUN SHINE CLUB
//    MEMBER ID CARD SYSTEM
// ========================================================= */

// const container = document.getElementById("cardsContainer");

// const WEBSITE = window.location.origin;

// /*
//  * Download resolution.
//  *
//  * 120 CSS pixels × 10 = 1200 output pixels.
//  */
// const CAPTURE_SCALE = 10;





// /* =========================================================
//    FIREBASE
// ========================================================= */

// import {
//     db
// } from "./firebase-config.js";

// import {
//     collection,
//     getDocs
// } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// const cardsLoading =
//     document.getElementById("cardsLoading");

// function hideCardsLoading() {

//     const loading =
//         document.getElementById("cardsLoading");

//     if (!loading) {
//         return;
//     }

//     loading.hidden = true;

//     loading.style.display = "none";

//     loading.setAttribute(
//         "aria-hidden",
//         "true"
//     );
// }

// /* =========================================================
//    LOAD MEMBERS FROM FIREBASE
// ========================================================= */

// async function loadMembersFromFirebase() {

//     /* Show loading */
//     if (cardsLoading) {
//         cardsLoading.hidden = false;
//     }

//     try {

//         const membersRef =
//             collection(
//                 db,
//                 "members"
//             );

//         const snapshot =
//             await getDocs(
//                 membersRef
//             );

//         const members = [];

//         snapshot.forEach(
//             (doc) => {

//                 members.push({
//                     ...doc.data(),
//                     documentId: doc.id
//                 });

//             }
//         );

//         return members;

//     }

//     catch (error) {

//         console.error(
//             "Failed to load members from Firebase:",
//             error
//         );

//         throw error;

//     }

// }


// /* =========================================================
//    START ID CARD GENERATOR
// ========================================================= */

// loadMembersFromFirebase()
//     .then(
//         (members) => {

//             generateCards(
//                 members
//             );

//             /* Hide Firebase loading */
//             if (cardsLoading) {
//                 cardsLoading.hidden = true;
//             }

//         }
//     )
//     .catch(
//         (error) => {

//             console.error(
//                 "Failed to load members:",
//                 error
//             );

//             /* Hide loading on error */
//             if (cardsLoading) {
//                 cardsLoading.hidden = true;
//             }

//             if (container) {

//                 container.innerHTML = `

//                     <div style="
//                         text-align:center;
//                         padding:40px;
//                         color:#d00000;
//                     ">

//                         <h2>
//                             Failed to load members
//                         </h2>

//                         <p>
//                             Please check Firebase
//                             and try again later.
//                         </p>

//                     </div>

//                 `;

//             }

//         }
//     );



// /* =========================================================
//    GENERATE MEMBER CARDS
// ========================================================= */

// function generateCards(members) {

//     if (!container) {

//         console.error(
//             "cardsContainer was not found."
//         );

//         return;
//     }


//     container.innerHTML = "";


//     members.forEach((member) => {

//         const wrapper =
//             document.createElement("div");

//         wrapper.className =
//             "card-wrapper";


//         wrapper.innerHTML = `

//             <!-- =========================================
//                  ID CARD
//             ========================================== -->

//             <div
//                 class="id-card"
//                 id="card-${member.id}"
//             >


//                 <!-- =====================================
//                      HEADER
//                 ====================================== -->

//                 <div class="card-header">

//                     <img
//                         src="assets/logo.png"
//                         class="club-logo"
//                         alt="Sun Shine Club Logo"
//                         crossorigin="anonymous"
//                     >

//                     <div>

//                         <h2>
//                             Sun Shine Club | ସନ୍‌ସାଇନ୍ କ୍ଲବ୍
//                         </h2>

//                         <small>
//                             Kendupalli, Barabati, Bhapur, Nayagarh - 752077
//                         </small>

//                         <div class="webandmail">
//                             🌐 www.sunshineclubkendupalli.in
//                         </div>

//                     </div>

//                 </div>


//                 <!-- =====================================
//                      MEMBER PHOTO
//                 ====================================== -->

//                 <div class="member-photo-wrapper">

//                     <img
//                         src="${member.photo}"
//                         class="member-photo"
//                         alt="${member.name}"
//                         crossorigin="anonymous"
//                     >

//                 </div>


//                 <!-- =====================================
//                      MEMBER NAME
//                 ====================================== -->

//                 <h3>
//                     ${member.name}
//                 </h3>

//                 <h3>
//                     ${member.odia_name}
//                 </h3>


//                 <!-- =====================================
//                      BREAK IMAGE
//                 ====================================== -->

//                 <img
//                     class="break-image"
//                     src="assets/break.png"
//                     alt=""
//                     crossorigin="anonymous"
//                 >


//                 <!-- =====================================
//                      MEMBER INFORMATION
//                 ====================================== -->

//                 <div class="member-info">


//                     <div class="member-details">


//                         <p>

                            

//                             <strong>
//                                 ID :
//                             </strong>

//                             <span>
//                                 ${member.id}
//                             </span>

//                         </p>


//                         <p>

                            

//                             <strong>
//                                 Designation :
//                             </strong>

//                             <span>
//                                 ${member.designation}
//                             </span>

//                         </p>


//                         <p>

                            

//                             <strong>
//                                 Phone :
//                             </strong>

//                             <span>
//                                 ${member.phone}
//                             </span>

//                         </p>

//                         <p>
//     <strong>
//         Blood Group:
//     </strong>

//     <span>  <i class="fa-solid fa-droplet" style="color: rgb(255, 0, 0);"></i>
//         ${member.blood || "N/A"}
//     </span>
// </p>


//                     </div>


//                     <!-- =================================
//                          QR CODE
//                     ================================== -->

//                     <div class="qr-border">

//                         <div
//                             id="qr-${member.id}"
//                             class="qr-box"
//                         ></div>

//                     </div>


//                 </div>


//                 <hr>


//                 <!-- =====================================
//                      MEMBER DETAILS
//                 ====================================== -->

//                 <div class="member-details2">


//                     <p>

                        

//                         <strong>
//                             Address :
//                         </strong>

//                         <span>
//                             ${member.address}
//                         </span>

//                     </p>


//                     <p>

                        

//                         <strong>
//                             Join Date :
//                         </strong>

//                         <span>
//                             ${member.joinDate}
//                         </span>

//                     </p>


//                     <p>

                        
//                         <strong>
//                             Valid :
//                         </strong>

//                         <span>
//                             ${member.valid}
//                         </span>

//                     </p>


//                 </div>


//             </div>


//             <!-- =========================================
//                  DOWNLOAD BUTTON
//             ========================================== -->

//             <button
//                 class="download-btn"
//                 data-id="${member.id}"
//                 type="button"
//             >

//                 <i class="fa-solid fa-download"></i>

//                 Download ID Card

//             </button>

//         `;


//         container.appendChild(wrapper);


//         /* =============================================
//            QR CODE
//         ============================================= */

//         const qrContainer =
//             document.getElementById(
//                 `qr-${member.id}`
//             );


//         if (
//             qrContainer &&
//             typeof QRCode !== "undefined"
//         ) {

//             new QRCode(
//                 qrContainer,
//                 {

//                     text:
//                         `${WEBSITE}/club-id-card/verify.html?id=${member.id}`,

//                     width: 300,

//                     height: 300,

//                     correctLevel:
//                         QRCode.CorrectLevel.H

//                 }
//             );

//         }

//     });


//     attachDownloadButtons();


//     /* =========================================
//    CARDS ARE NOW LOADED
// ========================================= */

//     hideCardsLoading();

// }


// /* =========================================================
//    WAIT FOR IMAGES
// ========================================================= */

// function waitForImages(element) {

//     const images =
//         Array.from(
//             element.querySelectorAll("img")
//         );


//     return Promise.all(

//         images.map((image) => {

//             return new Promise((resolve) => {


//                 /*
//                  * Already loaded.
//                  */

//                 if (
//                     image.complete &&
//                     image.naturalWidth > 0
//                 ) {

//                     resolve();

//                     return;

//                 }


//                 /*
//                  * Successful loading.
//                  */

//                 image.addEventListener(
//                     "load",
//                     resolve,
//                     {
//                         once: true
//                     }
//                 );


//                 /*
//                  * Failed image.
//                  */

//                 image.addEventListener(
//                     "error",
//                     () => {

//                         console.warn(
//                             "Image failed:",
//                             image.src
//                         );

//                         resolve();

//                     },
//                     {
//                         once: true
//                     }
//                 );

//             });

//         })

//     );

// }


// /* =========================================================
//    WAIT FOR FONTS
// ========================================================= */

// async function waitForFonts() {

//     if (
//         document.fonts &&
//         document.fonts.ready
//     ) {

//         try {

//             await document.fonts.ready;

//         }

//         catch (error) {

//             console.warn(
//                 "Font loading warning:",
//                 error
//             );

//         }

//     }

// }


// /* =========================================================
//    WAIT FOR RENDER
// ========================================================= */

// function waitForRender() {

//     return new Promise((resolve) => {

//         requestAnimationFrame(() => {

//             requestAnimationFrame(() => {

//                 setTimeout(
//                     resolve,
//                     200
//                 );

//             });

//         });

//     });

// }


// /* =========================================================
//    PREPARE PHOTO FOR HTML2CANVAS
// ========================================================= */

// function preparePhotoForCapture(
//     originalCard,
//     clonedCard
// ) {

//     /*
//      * Original photo wrapper.
//      */

//     const originalWrapper =
//         originalCard.querySelector(
//             ".member-photo-wrapper"
//         );


//     /*
//      * Cloned photo wrapper.
//      */

//     const clonedWrapper =
//         clonedCard.querySelector(
//             ".member-photo-wrapper"
//         );


//     /*
//      * Original image.
//      */

//     const originalImage =
//         originalCard.querySelector(
//             ".member-photo"
//         );


//     /*
//      * Cloned image.
//      */

//     const clonedImage =
//         clonedCard.querySelector(
//             ".member-photo"
//         );


//     if (
//         !originalWrapper ||
//         !clonedWrapper ||
//         !originalImage ||
//         !clonedImage
//     ) {

//         return;

//     }


//     /* ================================================
//        GET ORIGINAL DISPLAYED PHOTO BOX
//     ================================================= */

//     const wrapperRect =
//         originalWrapper.getBoundingClientRect();


//     const boxWidth =
//         wrapperRect.width;


//     const boxHeight =
//         wrapperRect.height;


//     /* ================================================
//        GET ORIGINAL SOURCE IMAGE SIZE
//     ================================================= */

//     const sourceWidth =
//         originalImage.naturalWidth;


//     const sourceHeight =
//         originalImage.naturalHeight;


//     /*
//      * If the image dimensions are unavailable,
//      * leave the browser's normal CSS rendering.
//      */

//     if (
//         !sourceWidth ||
//         !sourceHeight
//     ) {

//         return;

//     }


//     /* ================================================
//        UNIFORM COVER SCALE
//     ================================================= */

//     /*
//      * ONE scale factor is used for both
//      * width and height.
//      *
//      * Therefore the image can NEVER
//      * be stretched.
//      */

//     const uniformScale =
//         Math.max(
//             boxWidth / sourceWidth,
//             boxHeight / sourceHeight
//         );


//     /* ================================================
//        PROPORTIONAL IMAGE SIZE
//     ================================================= */

//     const scaledWidth =
//         sourceWidth *
//         uniformScale;


//     const scaledHeight =
//         sourceHeight *
//         uniformScale;


//     /* ================================================
//        CENTER IMAGE
//     ================================================= */

//     const left =
//         (boxWidth - scaledWidth) / 2;


//     const top =
//         (boxHeight - scaledHeight) / 2;


//     /* ================================================
//        CLONED WRAPPER
//     ================================================= */

//     clonedWrapper.style.width =
//         `${boxWidth}px`;

//     clonedWrapper.style.height =
//         `${boxHeight}px`;

//     clonedWrapper.style.position =
//         "relative";

//     clonedWrapper.style.overflow =
//         "hidden";

//     clonedWrapper.style.borderRadius =
//         "50%";

//     clonedWrapper.style.flex =
//         `0 0 ${boxWidth}px`;


//     /* ================================================
//        CLONED IMAGE
//     ================================================= */

//     clonedImage.style.position =
//         "absolute";

//     /*
//      * IMPORTANT:
//      *
//      * Width and height are calculated
//      * using the SAME scale factor.
//      */

//     clonedImage.style.width =
//         `${scaledWidth}px`;

//     clonedImage.style.height =
//         `${scaledHeight}px`;


//     clonedImage.style.left =
//         `${left}px`;

//     clonedImage.style.top =
//         `${top}px`;


//     clonedImage.style.margin =
//         "0";

//     clonedImage.style.padding =
//         "0";


//     /*
//      * Remove restrictions that could
//      * interfere with the calculated size.
//      */

//     clonedImage.style.maxWidth =
//         "none";

//     clonedImage.style.maxHeight =
//         "none";


//     /*
//      * The image has already been
//      * proportionally scaled.
//      *
//      * "fill" here does NOT mean
//      * stretching the original photo.
//      *
//      * The image width/height above were
//      * calculated using ONE uniform scale.
//      */

//     clonedImage.style.objectFit =
//         "fill";


//     clonedImage.style.objectPosition =
//         "center";


//     clonedImage.style.border =
//         "none";

//     clonedImage.style.borderRadius =
//         "0";

//     clonedImage.style.display =
//         "block";

//     clonedImage.style.flex =
//         "none";

//     clonedImage.style.transform =
//         "none";

// }


// /* =========================================================
//    CAPTURE ID CARD
// ========================================================= */

// async function captureCard(card) {

//     /*
//      * Wait for images.
//      */

//     await waitForImages(card);


//     /*
//      * Wait for fonts.
//      */

//     await waitForFonts();


//     /*
//      * Wait for layout/render.
//      */

//     await waitForRender();


//     /*
//      * Make sure profile image itself
//      * is completely loaded.
//      */

//     const profileImage =
//         card.querySelector(
//             ".member-photo"
//         );


//     if (
//         profileImage &&
//         !profileImage.complete
//     ) {

//         await new Promise((resolve) => {

//             profileImage.addEventListener(
//                 "load",
//                 resolve,
//                 {
//                     once: true
//                 }
//             );

//             profileImage.addEventListener(
//                 "error",
//                 resolve,
//                 {
//                     once: true
//                 }
//             );

//         });

//     }


//     /* ================================================
//        HTML2CANVAS
//     ================================================= */

//     const canvas =
//         await html2canvas(
//             card,
//             {

//                 /*
//                  * High resolution.
//                  */

//                 scale:
//                     CAPTURE_SCALE,


//                 /*
//                  * Allow R2 images.
//                  */

//                 useCORS:
//                     true,


//                 /*
//                  * Prevent tainted canvas.
//                  */

//                 allowTaint:
//                     false,


//                 /*
//                  * White background.
//                  */

//                 backgroundColor:
//                     "#ffffff",


//                 /*
//                  * Remote image timeout.
//                  */

//                 imageTimeout:
//                     30000,


//                 /*
//                  * Disable logging.
//                  */

//                 logging:
//                     false,


//                 /*
//                  * Standard renderer.
//                  */

//                 foreignObjectRendering:
//                     false,


//                 /* =====================================
//                    CLONE MODIFICATION
//                 ====================================== */

//                 onclone:
//                     function (clonedDocument) {


//                         const clonedCard =
//                             clonedDocument.querySelector(
//                                 `#${card.id}`
//                             );


//                         if (!clonedCard) {

//                             return;

//                         }


//                         /*
//                          * Only prepare the profile photo.
//                          *
//                          * Everything else remains
//                          * exactly as it appears.
//                          */

//                         preparePhotoForCapture(
//                             card,
//                             clonedCard
//                         );

//                     }

//             }
//         );


//     return canvas;

// }


// /* =========================================================
//    DOWNLOAD PNG
// ========================================================= */

// function downloadCanvas(
//     canvas,
//     filename
// ) {

//     /*
//      * PNG is lossless.
//      */

//     const dataURL =
//         canvas.toDataURL(
//             "image/png"
//         );


//     const link =
//         document.createElement("a");


//     link.download =
//         filename;


//     link.href =
//         dataURL;


//     link.style.display =
//         "none";


//     document.body.appendChild(
//         link
//     );


//     link.click();


//     document.body.removeChild(
//         link
//     );

// }


// /* =========================================================
//    DOWNLOAD ONE CARD
// ========================================================= */

// function attachDownloadButtons() {

//     const buttons =
//         document.querySelectorAll(
//             ".download-btn"
//         );


//     buttons.forEach((button) => {


//         button.addEventListener(
//             "click",
//             async function () {


//                 const card =
//                     button
//                         .parentElement
//                         .querySelector(
//                             ".id-card"
//                         );


//                 if (!card) {

//                     console.error(
//                         "ID card not found."
//                     );

//                     return;

//                 }


//                 const originalText =
//                     button.innerHTML;


//                 button.disabled =
//                     true;


//                 button.innerHTML = `

//                     <i
//                         class="fa-solid fa-spinner fa-spin"
//                     ></i>

//                     Preparing ID Card...

//                 `;


//                 try {


//                     const canvas =
//                         await captureCard(
//                             card
//                         );


//                     downloadCanvas(
//                         canvas,
//                         `${button.dataset.id}.png`
//                     );


//                 }

//                 catch (error) {

//                     console.error(
//                         "Download failed:",
//                         error
//                     );


//                     alert(
//                         "Unable to download the ID card. Please check the profile image CORS settings."
//                     );

//                 }


//                 finally {

//                     button.disabled =
//                         false;

//                     button.innerHTML =
//                         originalText;

//                 }

//             }
//         );

//     });

// }


// /* =========================================================
//    DOWNLOAD ALL BUTTON
// ========================================================= */

// const downloadAllButton =
//     document.getElementById(
//         "downloadAll"
//     );


// if (downloadAllButton) {

//     downloadAllButton.addEventListener(
//         "click",
//         downloadAll
//     );

// }


// /* =========================================================
//    DOWNLOAD ALL CARDS
// ========================================================= */

// async function downloadAll() {

//     const wrappers =
//         document.querySelectorAll(
//             ".card-wrapper"
//         );


//     if (!wrappers.length) {

//         alert(
//             "No ID cards available."
//         );

//         return;

//     }


//     const button =
//         document.getElementById(
//             "downloadAll"
//         );


//     const originalText =
//         button
//             ? button.innerHTML
//             : "";


//     if (button) {

//         button.disabled =
//             true;


//         button.innerHTML = `

//             <i
//                 class="fa-solid fa-spinner fa-spin"
//             ></i>

//             Preparing Cards...

//         `;

//     }


//     try {


//         for (
//             const wrapper of wrappers
//         ) {


//             const card =
//                 wrapper.querySelector(
//                     ".id-card"
//                 );


//             if (!card) {

//                 continue;

//             }


//             const downloadButton =
//                 wrapper.querySelector(
//                     ".download-btn"
//                 );


//             const id =
//                 downloadButton
//                     ? downloadButton.dataset.id
//                     : "member";


//             /*
//              * Capture card.
//              */

//             const canvas =
//                 await captureCard(
//                     card
//                 );


//             /*
//              * Download.
//              */

//             downloadCanvas(
//                 canvas,
//                 `${id}.png`
//             );


//             /*
//              * Small delay between files.
//              */

//             await new Promise(
//                 (resolve) => {

//                     setTimeout(
//                         resolve,
//                         700
//                     );

//                 }
//             );

//         }

//     }

//     catch (error) {

//         console.error(
//             "Download all failed:",
//             error
//         );


//         alert(
//             "Some ID cards could not be downloaded."
//         );

//     }


//     finally {

//         if (button) {

//             button.disabled =
//                 false;

//             button.innerHTML =
//                 originalText;

//         }

//     }

// }



// /* =========================================================
//    MOBILE SIDEBAR / HAMBURGER MENU
// ========================================================= */

// const adminSidebar =
//     document.getElementById("adminSidebar");

// const sidebarOverlay =
//     document.getElementById("sidebarOverlay");

// const mobileMenuButton =
//     document.getElementById("mobileMenuButton");


// function openMobileSidebar() {

//     if (adminSidebar) {
//         adminSidebar.classList.add("open");
//     }

//     if (sidebarOverlay) {
//         sidebarOverlay.classList.add("show");
//     }

//     document.body.classList.add("menu-open");

//     if (mobileMenuButton) {
//         mobileMenuButton.setAttribute(
//             "aria-expanded",
//             "true"
//         );
//     }
// }


// function closeMobileSidebar() {

//     if (adminSidebar) {
//         adminSidebar.classList.remove("open");
//     }

//     if (sidebarOverlay) {
//         sidebarOverlay.classList.remove("show");
//     }

//     document.body.classList.remove("menu-open");

//     if (mobileMenuButton) {
//         mobileMenuButton.setAttribute(
//             "aria-expanded",
//             "false"
//         );
//     }
// }


// if (mobileMenuButton) {

//     mobileMenuButton.addEventListener(
//         "click",
//         function (event) {

//             event.preventDefault();
//             event.stopPropagation();

//             if (
//                 adminSidebar &&
//                 adminSidebar.classList.contains("open")
//             ) {

//                 closeMobileSidebar();

//             } else {

//                 openMobileSidebar();

//             }

//         }
//     );

// }


// if (sidebarOverlay) {

//     sidebarOverlay.addEventListener(
//         "click",
//         closeMobileSidebar
//     );

// }


// /* Close sidebar after clicking a navigation link */

// document
//     .querySelectorAll(".admin-nav-link")
//     .forEach(function (link) {

//         link.addEventListener(
//             "click",
//             closeMobileSidebar
//         );

//     });


// /* Close with Escape */

// document.addEventListener(
//     "keydown",
//     function (event) {

//         if (event.key === "Escape") {
//             closeMobileSidebar();
//         }

//     }
// );





/* =========================================================
   SUN SHINE CLUB
   MEMBER ID CARD SYSTEM
========================================================= */

const container =
    document.getElementById("cardsContainer");

const WEBSITE =
    window.location.origin;

/*
 * Download resolution.
 *
 * 120 CSS pixels × 10 = 1200 output pixels.
 */
const CAPTURE_SCALE = 10;


/* =========================================================
   FIREBASE
========================================================= */

import {
    db
} from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const cardsLoading =
    document.getElementById("cardsLoading");


/* =========================================================
   HIDE LOADING
========================================================= */

function hideCardsLoading() {

    const loading =
        document.getElementById("cardsLoading");

    if (!loading) {
        return;
    }

    loading.hidden = true;

    loading.style.display = "none";

    loading.setAttribute(
        "aria-hidden",
        "true"
    );
}


/* =========================================================
   LOAD MEMBERS FROM FIREBASE
========================================================= */

async function loadMembersFromFirebase() {

    if (cardsLoading) {
        cardsLoading.hidden = false;
        cardsLoading.style.display = "flex";
        cardsLoading.removeAttribute("aria-hidden");
    }

    try {

        const membersRef =
            collection(
                db,
                "members"
            );

        const snapshot =
            await getDocs(
                membersRef
            );

        const members = [];


        snapshot.forEach((doc) => {

            members.push({

                ...doc.data(),

                documentId:
                    doc.id

            });

        });


        /* =================================================
           SORT MEMBERS NUMERICALLY BY MEMBER ID

           Correct order:

           SSC001
           SSC002
           SSC003
           ...
           SSC009
           SSC010
           SSC011

           NOT:

           SSC001
           SSC010
           SSC002
        ================================================= */

        members.sort((a, b) => {

            const idA =
                String(
                    a.id || ""
                )
                    .trim()
                    .toUpperCase();

            const idB =
                String(
                    b.id || ""
                )
                    .trim()
                    .toUpperCase();


            const matchA =
                idA.match(
                    /(\d+)$/
                );

            const matchB =
                idB.match(
                    /(\d+)$/
                );


            const numberA =
                matchA
                    ? Number(matchA[1])
                    : Number.MAX_SAFE_INTEGER;

            const numberB =
                matchB
                    ? Number(matchB[1])
                    : Number.MAX_SAFE_INTEGER;


            if (
                numberA !==
                numberB
            ) {

                return (
                    numberA -
                    numberB
                );

            }


            /*
             * Fallback for IDs with
             * the same numeric part.
             */

            return idA.localeCompare(
                idB,
                undefined,
                {
                    numeric: true,
                    sensitivity: "base"
                }
            );

        });


        console.log(
            "Members sorted:",
            members.map(
                member => member.id
            )
        );


        return members;

    }

    catch (error) {

        console.error(
            "Failed to load members from Firebase:",
            error
        );

        throw error;

    }

}


/* =========================================================
   START ID CARD GENERATOR
========================================================= */

loadMembersFromFirebase()
    .then((members) => {

        generateCards(
            members
        );

        hideCardsLoading();

    })
    .catch((error) => {

        console.error(
            "Failed to load members:",
            error
        );

        hideCardsLoading();

        if (container) {

            container.innerHTML = `

                <div style="
                    text-align:center;
                    padding:40px;
                    color:#d00000;
                ">

                    <h2>
                        Failed to load members
                    </h2>

                    <p>
                        Please check Firebase
                        and try again later.
                    </p>

                </div>

            `;

        }

    });


/* =========================================================
   GENERATE MEMBER CARDS
========================================================= */

function generateCards(members) {

    if (!container) {

        console.error(
            "cardsContainer was not found."
        );

        return;

    }


    container.innerHTML = "";


    members.forEach((member) => {

        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "card-wrapper";


        wrapper.innerHTML = `

            <div
                class="id-card"
                id="card-${member.id}"
            >

                <!-- =====================================
                     HEADER
                ====================================== -->

                <div class="card-header">

                    <img
                        src="assets/logo.png"
                        class="club-logo"
                        alt="Sun Shine Club Logo"
                        crossorigin="anonymous"
                    >

                    <div>

                        <h2>
                            Sun Shine Club | ସନ୍‌ସାଇନ୍ କ୍ଲବ୍
                        </h2>

                        <small>
                            Kendupalli, Barabati, Bhapur, Nayagarh - 752077
                        </small>

                        <div class="webandmail">
                            🌐 www.sunshineclubkendupalli.in
                        </div>

                    </div>

                </div>


                <!-- =====================================
                     MEMBER PHOTO
                ====================================== -->

                <div class="member-photo-wrapper">

                    <img
                        src="${member.photo || ""}"
                        class="member-photo"
                        alt="${member.name || ""}"
                        crossorigin="anonymous"
                    >

                </div>


                <!-- =====================================
                     MEMBER NAME
                ====================================== -->

                <h3>
                    ${member.name || ""}
                </h3>

                <h3>
                    ${member.odia_name || ""}
                </h3>


                <!-- =====================================
                     BREAK IMAGE
                ====================================== -->

                <img
                    class="break-image"
                    src="assets/break.png"
                    alt=""
                    crossorigin="anonymous"
                >


                <!-- =====================================
                     MEMBER INFORMATION
                ====================================== -->

                <div class="member-info">

                    <div class="member-details">

                        <p>

                            <strong>
                                ID :
                            </strong>

                            <span>
                                ${member.id || ""}
                            </span>

                        </p>


                        <p>

                            <strong>
                                Designation :
                            </strong>

                            <span>
                                ${member.designation || ""}
                            </span>

                        </p>


                        <p>

                            <strong>
                                Phone :
                            </strong>

                            <span>
                                ${member.phone || ""}
                            </span>

                        </p>


                        <p>

                            <strong>
                                Blood Group:
                            </strong>

                            <span>

                                <i
                                    class="fa-solid fa-droplet"
                                    style="color:rgb(255,0,0);"
                                ></i>

                                ${member.blood || "N/A"}

                            </span>

                        </p>

                    </div>


                    <!-- =================================
                         QR CODE
                    ================================== -->

                    <div class="qr-border">

                        <div
                            id="qr-${member.id}"
                            class="qr-box"
                        ></div>

                    </div>

                </div>


                <hr>


                <!-- =====================================
                     MEMBER DETAILS
                ====================================== -->

                <div class="member-details2">

                    <p>

                        <strong>
                            Address :
                        </strong>

                        <span>
                            ${member.address || ""}
                        </span>

                    </p>


                    <p>

                        <strong>
                            Join Date :
                        </strong>

                        <span>
                            ${member.joinDate || ""}
                        </span>

                    </p>


                    <p>

                        <strong>
                            Valid :
                        </strong>

                        <span>
                            ${member.valid || ""}
                        </span>

                    </p>

                </div>

            </div>


            <!-- =========================================
                 DOWNLOAD BUTTON
            ========================================== -->

            <button
                class="download-btn"
                data-id="${member.id}"
                type="button"
            >

                <i class="fa-solid fa-download"></i>

                Download ID Card

            </button>

        `;


        container.appendChild(
            wrapper
        );


        /* =================================================
           CREATE QR CODE
        ================================================= */

        const qrContainer =
            document.getElementById(
                `qr-${member.id}`
            );


        if (
            qrContainer &&
            typeof QRCode !== "undefined"
        ) {

            new QRCode(
                qrContainer,
                {

                    text:
                        `${WEBSITE}/club-id-card/verify.html?id=${encodeURIComponent(member.id)}`,

                    /*
                     * Keep QR output high resolution.
                     * CSS controls the displayed size.
                     */
                    width: 300,

                    height: 300,

                    correctLevel:
                        QRCode.CorrectLevel.H

                }
            );

        }

    });


    attachDownloadButtons();


    /*
     * Cards have now been rendered.
     */

    hideCardsLoading();

}


/* =========================================================
   WAIT FOR IMAGES
========================================================= */

function waitForImages(element) {

    const images =
        Array.from(
            element.querySelectorAll(
                "img"
            )
        );


    return Promise.all(

        images.map((image) => {

            return new Promise(
                (resolve) => {

                    /*
                     * Already loaded.
                     */

                    if (
                        image.complete &&
                        image.naturalWidth > 0
                    ) {

                        resolve();

                        return;

                    }


                    /*
                     * Successful loading.
                     */

                    image.addEventListener(
                        "load",
                        resolve,
                        {
                            once: true
                        }
                    );


                    /*
                     * Failed image.
                     */

                    image.addEventListener(
                        "error",
                        () => {

                            console.warn(
                                "Image failed:",
                                image.src
                            );

                            resolve();

                        },
                        {
                            once: true
                        }
                    );

                }
            );

        })

    );

}


/* =========================================================
   WAIT FOR FONTS
========================================================= */

async function waitForFonts() {

    if (
        document.fonts &&
        document.fonts.ready
    ) {

        try {

            await document.fonts.ready;

        }

        catch (error) {

            console.warn(
                "Font loading warning:",
                error
            );

        }

    }

}


/* =========================================================
   WAIT FOR RENDER
========================================================= */

function waitForRender() {

    return new Promise(
        (resolve) => {

            requestAnimationFrame(() => {

                requestAnimationFrame(() => {

                    setTimeout(
                        resolve,
                        200
                    );

                });

            });

        }
    );

}


/* =========================================================
   PREPARE PHOTO FOR HTML2CANVAS
========================================================= */

function preparePhotoForCapture(
    originalCard,
    clonedCard
) {

    const originalWrapper =
        originalCard.querySelector(
            ".member-photo-wrapper"
        );

    const clonedWrapper =
        clonedCard.querySelector(
            ".member-photo-wrapper"
        );

    const originalImage =
        originalCard.querySelector(
            ".member-photo"
        );

    const clonedImage =
        clonedCard.querySelector(
            ".member-photo"
        );


    if (
        !originalWrapper ||
        !clonedWrapper ||
        !originalImage ||
        !clonedImage
    ) {
        return;
    }


    const wrapperRect =
        originalWrapper.getBoundingClientRect();


    const boxWidth =
        wrapperRect.width;

    const boxHeight =
        wrapperRect.height;


    const sourceWidth =
        originalImage.naturalWidth;

    const sourceHeight =
        originalImage.naturalHeight;


    if (
        !sourceWidth ||
        !sourceHeight
    ) {
        return;
    }


    /* =========================================
       KEEP PHOTO PROPORTION
    ========================================= */

    const uniformScale =
        Math.max(
            boxWidth / sourceWidth,
            boxHeight / sourceHeight
        );


    const scaledWidth =
        sourceWidth *
        uniformScale;


    const scaledHeight =
        sourceHeight *
        uniformScale;


    const left =
        (boxWidth - scaledWidth) / 2;


    const top =
        (boxHeight - scaledHeight) / 2;


    /* =========================================
       PHOTO WRAPPER
    ========================================= */

    clonedWrapper.style.width =
        `${boxWidth}px`;

    clonedWrapper.style.height =
        `${boxHeight}px`;

    clonedWrapper.style.position =
        "relative";

    clonedWrapper.style.overflow =
        "hidden";

    /*
     * IMPORTANT:
     * Match your actual CSS.
     */
    clonedWrapper.style.borderRadius =
        "20%";

    clonedWrapper.style.webkitBorderRadius =
        "20%";

    clonedWrapper.style.flex =
        `0 0 ${boxWidth}px`;


    /* =========================================
       PHOTO IMAGE
    ========================================= */

    clonedImage.style.position =
        "absolute";

    clonedImage.style.width =
        `${scaledWidth}px`;

    clonedImage.style.height =
        `${scaledHeight}px`;

    clonedImage.style.left =
        `${left}px`;

    clonedImage.style.top =
        `${top}px`;

    clonedImage.style.margin =
        "0";

    clonedImage.style.padding =
        "0";

    clonedImage.style.maxWidth =
        "none";

    clonedImage.style.maxHeight =
        "none";

    clonedImage.style.objectFit =
        "fill";

    clonedImage.style.objectPosition =
        "center";

    clonedImage.style.border =
        "none";

    clonedImage.style.display =
        "block";

    clonedImage.style.flex =
        "none";

    clonedImage.style.transform =
        "none";


    /*
     * IMPORTANT:
     * The image itself should NOT have
     * another radius.
     *
     * The wrapper performs the clipping.
     */
    clonedImage.style.borderRadius =
        "0";

    clonedImage.style.webkitBorderRadius =
        "0";

}


/* =========================================================
   CAPTURE ID CARD
========================================================= */

async function captureCard(card) {

    /*
     * Wait for images.
     */

    await waitForImages(
        card
    );


    /*
     * Wait for fonts.
     */

    await waitForFonts();


    /*
     * Wait for browser render.
     */

    await waitForRender();


    /*
     * Make sure profile image is loaded.
     */

    const profileImage =
        card.querySelector(
            ".member-photo"
        );


    if (
        profileImage &&
        !profileImage.complete
    ) {

        await new Promise(
            (resolve) => {

                profileImage.addEventListener(
                    "load",
                    resolve,
                    {
                        once: true
                    }
                );

                profileImage.addEventListener(
                    "error",
                    resolve,
                    {
                        once: true
                    }
                );

            }
        );

    }


    /*
     * HTML2CANVAS
     */

    const canvas =
        await html2canvas(
            card,
            {

                scale:
                    CAPTURE_SCALE,

                useCORS:
                    true,

                allowTaint:
                    false,

                backgroundColor:
                    "#ffffff",

                imageTimeout:
                    30000,

                logging:
                    false,

                foreignObjectRendering:
                    false,

                onclone:
                    function (
                        clonedDocument
                    ) {

                        const clonedCard =
                            clonedDocument.querySelector(
                                `#${card.id}`
                            );


                        if (!clonedCard) {
                            return;
                        }


                        preparePhotoForCapture(
                            card,
                            clonedCard
                        );

                    }

            }
        );


    return canvas;

}


/* =========================================================
   DOWNLOAD PNG
========================================================= */

function downloadCanvas(
    canvas,
    filename
) {

    const dataURL =
        canvas.toDataURL(
            "image/png"
        );


    const link =
        document.createElement(
            "a"
        );


    link.download =
        filename;


    link.href =
        dataURL;


    link.style.display =
        "none";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );

}


/* =========================================================
   DOWNLOAD ONE CARD
========================================================= */

function attachDownloadButtons() {

    const buttons =
        document.querySelectorAll(
            ".download-btn"
        );


    buttons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                async function () {

                    const card =
                        button
                            .parentElement
                            .querySelector(
                                ".id-card"
                            );


                    if (!card) {

                        console.error(
                            "ID card not found."
                        );

                        return;

                    }


                    const originalText =
                        button.innerHTML;


                    button.disabled =
                        true;


                    button.innerHTML = `

                        <i
                            class="fa-solid fa-spinner fa-spin"
                        ></i>

                        Preparing ID Card...

                    `;


                    try {

                        const canvas =
                            await captureCard(
                                card
                            );


                        downloadCanvas(
                            canvas,
                            `${button.dataset.id}.png`
                        );

                    }

                    catch (error) {

                        console.error(
                            "Download failed:",
                            error
                        );


                        alert(
                            "Unable to download the ID card. Please check the profile image CORS settings."
                        );

                    }

                    finally {

                        button.disabled =
                            false;

                        button.innerHTML =
                            originalText;

                    }

                }
            );

        }
    );

}


/* =========================================================
   DOWNLOAD ALL BUTTON
========================================================= */

const downloadAllButton =
    document.getElementById(
        "downloadAll"
    );


if (downloadAllButton) {

    downloadAllButton.addEventListener(
        "click",
        downloadAll
    );

}


/* =========================================================
   DOWNLOAD ALL CARDS
========================================================= */

async function downloadAll() {

    const wrappers =
        document.querySelectorAll(
            ".card-wrapper"
        );


    if (!wrappers.length) {

        alert(
            "No ID cards available."
        );

        return;

    }


    const button =
        document.getElementById(
            "downloadAll"
        );


    const originalText =
        button
            ? button.innerHTML
            : "";


    if (button) {

        button.disabled =
            true;


        button.innerHTML = `

            <i
                class="fa-solid fa-spinner fa-spin"
            ></i>

            Preparing Cards...

        `;

    }


    try {

        for (
            const wrapper of wrappers
        ) {

            const card =
                wrapper.querySelector(
                    ".id-card"
                );


            if (!card) {
                continue;
            }


            const downloadButton =
                wrapper.querySelector(
                    ".download-btn"
                );


            const id =
                downloadButton
                    ? downloadButton.dataset.id
                    : "member";


            const canvas =
                await captureCard(
                    card
                );


            downloadCanvas(
                canvas,
                `${id}.png`
            );


            await new Promise(
                (resolve) => {

                    setTimeout(
                        resolve,
                        700
                    );

                }
            );

        }

    }

    catch (error) {

        console.error(
            "Download all failed:",
            error
        );


        alert(
            "Some ID cards could not be downloaded."
        );

    }

    finally {

        if (button) {

            button.disabled =
                false;

            button.innerHTML =
                originalText;

        }

    }

}


/* =========================================================
   MOBILE SIDEBAR / HAMBURGER MENU
========================================================= */

const adminSidebar =
    document.getElementById(
        "adminSidebar"
    );


const sidebarOverlay =
    document.getElementById(
        "sidebarOverlay"
    );


const mobileMenuButton =
    document.getElementById(
        "mobileMenuButton"
    );


function openMobileSidebar() {

    if (adminSidebar) {

        adminSidebar.classList.add(
            "open"
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.classList.add(
            "show"
        );

    }


    document.body.classList.add(
        "menu-open"
    );


    if (mobileMenuButton) {

        mobileMenuButton.setAttribute(
            "aria-expanded",
            "true"
        );

    }

}


function closeMobileSidebar() {

    if (adminSidebar) {

        adminSidebar.classList.remove(
            "open"
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.classList.remove(
            "show"
        );

    }


    document.body.classList.remove(
        "menu-open"
    );


    if (mobileMenuButton) {

        mobileMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }

}


if (mobileMenuButton) {

    mobileMenuButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            if (
                adminSidebar &&
                adminSidebar.classList.contains(
                    "open"
                )
            ) {

                closeMobileSidebar();

            }

            else {

                openMobileSidebar();

            }

        }
    );

}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeMobileSidebar
    );

}


/* =========================================================
   CLOSE SIDEBAR AFTER NAVIGATION
========================================================= */

document
    .querySelectorAll(
        ".admin-nav-link"
    )
    .forEach(
        function (link) {

            link.addEventListener(
                "click",
                closeMobileSidebar
            );

        }
    );


/* =========================================================
   CLOSE SIDEBAR WITH ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeMobileSidebar();

        }

    }
);