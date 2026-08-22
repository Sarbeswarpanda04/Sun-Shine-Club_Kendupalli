/* =========================================================
   SUN SHINE CLUB
   MEMBER ID CARD SYSTEM
========================================================= */

const container = document.getElementById("cardsContainer");

const WEBSITE = window.location.origin;

/*
 * Download resolution.
 *
 * 120 CSS pixels × 10 = 1200 output pixels.
 */
const CAPTURE_SCALE = 10;


/* =========================================================
   LOAD MEMBERS
========================================================= */

fetch("data/members-id.json")
    .then((response) => {

        if (!response.ok) {
            throw new Error(
                `Failed to load members-id.json: ${response.status}`
            );
        }

        return response.json();
    })

    .then((members) => {

        generateCards(members);

    })

    .catch((error) => {

        console.error(
            "Failed to load members:",
            error
        );

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
                        Please try again later.
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
            document.createElement("div");

        wrapper.className =
            "card-wrapper";


        wrapper.innerHTML = `

            <!-- =========================================
                 ID CARD
            ========================================== -->

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
                            Kendupalli, Bhapur, Nayagarh,
                            Odisha - 752077
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
                        src="${member.photo}"
                        class="member-photo"
                        alt="${member.name}"
                        crossorigin="anonymous"
                    >

                </div>


                <!-- =====================================
                     MEMBER NAME
                ====================================== -->

                <h3>
                    ${member.name}
                </h3>

                <h3>
                    ${member.odia_name}
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

                            <i class="fa-solid fa-id-card"></i>

                            <strong>
                                ID :
                            </strong>

                            <span>
                                ${member.id}
                            </span>

                        </p>


                        <p>

                            <i class="fa-solid fa-user-tie"></i>

                            <strong>
                                Designation :
                            </strong>

                            <span>
                                ${member.designation}
                            </span>

                        </p>


                        <p>

                            <i class="fa-solid fa-phone"></i>

                            <strong>
                                Phone :
                            </strong>

                            <span>
                                ${member.phone}
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

                        <i class="fa-solid fa-location-dot"></i>

                        <strong>
                            Address :
                        </strong>

                        <span>
                            ${member.address}
                        </span>

                    </p>


                    <p>

                        <i class="fa-regular fa-calendar"></i>

                        <strong>
                            Join Date :
                        </strong>

                        <span>
                            ${member.joinDate}
                        </span>

                    </p>


                    <p>

                        <i class="fa-solid fa-check-to-slot"></i>

                        <strong>
                            Valid :
                        </strong>

                        <span>
                            ${member.valid}
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


        container.appendChild(wrapper);


        /* =============================================
           QR CODE
        ============================================= */

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
                        `${WEBSITE}/club-id-card/verify.html?id=${member.id}`,

                    width: 100,

                    height: 100,

                    correctLevel:
                        QRCode.CorrectLevel.H

                }
            );

        }

    });


    attachDownloadButtons();

}


/* =========================================================
   WAIT FOR IMAGES
========================================================= */

function waitForImages(element) {

    const images =
        Array.from(
            element.querySelectorAll("img")
        );


    return Promise.all(

        images.map((image) => {

            return new Promise((resolve) => {


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

            });

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

    return new Promise((resolve) => {

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                setTimeout(
                    resolve,
                    200
                );

            });

        });

    });

}


/* =========================================================
   PREPARE PHOTO FOR HTML2CANVAS
========================================================= */

function preparePhotoForCapture(
    originalCard,
    clonedCard
) {

    /*
     * Original photo wrapper.
     */

    const originalWrapper =
        originalCard.querySelector(
            ".member-photo-wrapper"
        );


    /*
     * Cloned photo wrapper.
     */

    const clonedWrapper =
        clonedCard.querySelector(
            ".member-photo-wrapper"
        );


    /*
     * Original image.
     */

    const originalImage =
        originalCard.querySelector(
            ".member-photo"
        );


    /*
     * Cloned image.
     */

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


    /* ================================================
       GET ORIGINAL DISPLAYED PHOTO BOX
    ================================================= */

    const wrapperRect =
        originalWrapper.getBoundingClientRect();


    const boxWidth =
        wrapperRect.width;


    const boxHeight =
        wrapperRect.height;


    /* ================================================
       GET ORIGINAL SOURCE IMAGE SIZE
    ================================================= */

    const sourceWidth =
        originalImage.naturalWidth;


    const sourceHeight =
        originalImage.naturalHeight;


    /*
     * If the image dimensions are unavailable,
     * leave the browser's normal CSS rendering.
     */

    if (
        !sourceWidth ||
        !sourceHeight
    ) {

        return;

    }


    /* ================================================
       UNIFORM COVER SCALE
    ================================================= */

    /*
     * ONE scale factor is used for both
     * width and height.
     *
     * Therefore the image can NEVER
     * be stretched.
     */

    const uniformScale =
        Math.max(
            boxWidth / sourceWidth,
            boxHeight / sourceHeight
        );


    /* ================================================
       PROPORTIONAL IMAGE SIZE
    ================================================= */

    const scaledWidth =
        sourceWidth *
        uniformScale;


    const scaledHeight =
        sourceHeight *
        uniformScale;


    /* ================================================
       CENTER IMAGE
    ================================================= */

    const left =
        (boxWidth - scaledWidth) / 2;


    const top =
        (boxHeight - scaledHeight) / 2;


    /* ================================================
       CLONED WRAPPER
    ================================================= */

    clonedWrapper.style.width =
        `${boxWidth}px`;

    clonedWrapper.style.height =
        `${boxHeight}px`;

    clonedWrapper.style.position =
        "relative";

    clonedWrapper.style.overflow =
        "hidden";

    clonedWrapper.style.borderRadius =
        "50%";

    clonedWrapper.style.flex =
        `0 0 ${boxWidth}px`;


    /* ================================================
       CLONED IMAGE
    ================================================= */

    clonedImage.style.position =
        "absolute";

    /*
     * IMPORTANT:
     *
     * Width and height are calculated
     * using the SAME scale factor.
     */

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


    /*
     * Remove restrictions that could
     * interfere with the calculated size.
     */

    clonedImage.style.maxWidth =
        "none";

    clonedImage.style.maxHeight =
        "none";


    /*
     * The image has already been
     * proportionally scaled.
     *
     * "fill" here does NOT mean
     * stretching the original photo.
     *
     * The image width/height above were
     * calculated using ONE uniform scale.
     */

    clonedImage.style.objectFit =
        "fill";


    clonedImage.style.objectPosition =
        "center";


    clonedImage.style.border =
        "none";

    clonedImage.style.borderRadius =
        "0";

    clonedImage.style.display =
        "block";

    clonedImage.style.flex =
        "none";

    clonedImage.style.transform =
        "none";

}


/* =========================================================
   CAPTURE ID CARD
========================================================= */

async function captureCard(card) {

    /*
     * Wait for images.
     */

    await waitForImages(card);


    /*
     * Wait for fonts.
     */

    await waitForFonts();


    /*
     * Wait for layout/render.
     */

    await waitForRender();


    /*
     * Make sure profile image itself
     * is completely loaded.
     */

    const profileImage =
        card.querySelector(
            ".member-photo"
        );


    if (
        profileImage &&
        !profileImage.complete
    ) {

        await new Promise((resolve) => {

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

        });

    }


    /* ================================================
       HTML2CANVAS
    ================================================= */

    const canvas =
        await html2canvas(
            card,
            {

                /*
                 * High resolution.
                 */

                scale:
                    CAPTURE_SCALE,


                /*
                 * Allow R2 images.
                 */

                useCORS:
                    true,


                /*
                 * Prevent tainted canvas.
                 */

                allowTaint:
                    false,


                /*
                 * White background.
                 */

                backgroundColor:
                    "#ffffff",


                /*
                 * Remote image timeout.
                 */

                imageTimeout:
                    30000,


                /*
                 * Disable logging.
                 */

                logging:
                    false,


                /*
                 * Standard renderer.
                 */

                foreignObjectRendering:
                    false,


                /* =====================================
                   CLONE MODIFICATION
                ====================================== */

                onclone:
                    function (clonedDocument) {


                        const clonedCard =
                            clonedDocument.querySelector(
                                `#${card.id}`
                            );


                        if (!clonedCard) {

                            return;

                        }


                        /*
                         * Only prepare the profile photo.
                         *
                         * Everything else remains
                         * exactly as it appears.
                         */

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

    /*
     * PNG is lossless.
     */

    const dataURL =
        canvas.toDataURL(
            "image/png"
        );


    const link =
        document.createElement("a");


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


    buttons.forEach((button) => {


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

    });

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


            /*
             * Capture card.
             */

            const canvas =
                await captureCard(
                    card
                );


            /*
             * Download.
             */

            downloadCanvas(
                canvas,
                `${id}.png`
            );


            /*
             * Small delay between files.
             */

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