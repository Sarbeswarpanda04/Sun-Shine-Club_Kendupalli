const fs = require("fs");
const path = require("path");

/* =========================================================
   CONFIGURATION
========================================================= */

const DOMAIN = "https://sunshineclubkendupalli.in";

const JSON_FILE = path.join(__dirname, "members.json");

const OUTPUT_DIR = path.join(
    __dirname,
    "pages",
    "members"
);

const CLUB_LOGO =
    `${DOMAIN}/assets/logo/sun-shine-club-logo.png`;


/* =========================================================
   READ MEMBER DATA
========================================================= */

if (!fs.existsSync(JSON_FILE)) {

    console.error(
        "\nERROR: members.json was not found.\n"
    );

    process.exit(1);
}


let members;

try {

    members = JSON.parse(
        fs.readFileSync(
            JSON_FILE,
            "utf8"
        )
    );

} catch (error) {

    console.error(
        "\nERROR: Invalid JSON file.\n"
    );

    console.error(error.message);

    process.exit(1);
}


/* =========================================================
   CREATE OUTPUT DIRECTORY
========================================================= */

if (!fs.existsSync(OUTPUT_DIR)) {

    fs.mkdirSync(
        OUTPUT_DIR,
        {
            recursive: true
        }
    );

}


/* =========================================================
   SLUG GENERATOR
========================================================= */

function createSlug(name) {

    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    if (value === undefined || value === null) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date = new Date(
        `${dateString}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================================================
   PHONE FORMAT
========================================================= */

function formatPhone(phone) {

    if (!phone) {
        return "";
    }

    const value = String(phone);

    if (
        value.length === 10 &&
        /^\d+$/.test(value)
    ) {

        return `+91 ${value.slice(0, 5)} ${value.slice(5)}`;

    }

    return value;

}


/* =========================================================
   GENERATE MEMBER HTML
========================================================= */

function generateMemberHTML(member) {

    const name =
        escapeHTML(member.name);

    const odiaName =
        escapeHTML(member.odia_name);

    const id =
        escapeHTML(member.id);

    const designation =
        escapeHTML(
            member.designation || "Member"
        );

    const phone =
        escapeHTML(member.phone);

    const phoneDisplay =
        escapeHTML(
            formatPhone(member.phone)
        );

    const address =
        escapeHTML(member.address);

    const joinDate =
        escapeHTML(member.joinDate);

    const formattedJoinDate =
        escapeHTML(
            formatDate(member.joinDate)
        );

    const photo =
        escapeHTML(member.photo);

    const slug =
        createSlug(member.name);

    const profileURL =
        `${DOMAIN}/pages/members/${slug}.html`;

    const description =
        `${member.name} is a ${member.designation || "member"} of Sun Shine Club, Kendupalli. View the member profile, joining date, address, contact information and club details.`;

    return `<!DOCTYPE html>
<html lang="en">

<head>

    <!-- =====================================================
         BASIC META
    ====================================================== -->

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <meta
        name="theme-color"
        content="#9381ff"
    >


    <!-- =====================================================
         SEO
    ====================================================== -->

    <title>
        ${name} | Sun Shine Club Kendupalli
    </title>

    <meta
        name="description"
        content="${escapeHTML(description)}"
    >

    <meta
        name="robots"
        content="index, follow"
    >

    <link
        rel="canonical"
        href="${profileURL}"
    >


    <!-- =====================================================
         FAVICON / CLUB LOGO
    ====================================================== -->

    <link
        rel="icon"
        type="image/png"
        href="${CLUB_LOGO}"
    >

    <link
        rel="apple-touch-icon"
        href="${CLUB_LOGO}"
    >


    <!-- =====================================================
         OPEN GRAPH
    ====================================================== -->

    <meta
        property="og:type"
        content="profile"
    >

    <meta
        property="og:site_name"
        content="Sun Shine Club Kendupalli"
    >

    <meta
        property="og:title"
        content="${name} | Sun Shine Club Kendupalli"
    >

    <meta
        property="og:description"
        content="${escapeHTML(description)}"
    >

    <meta
        property="og:url"
        content="${profileURL}"
    >

    <meta
        property="og:image"
        content="${photo}"
    >

    <meta
        property="og:image:alt"
        content="${name} - Sun Shine Club Kendupalli member"
    >

    <meta
        property="og:image:width"
        content="500"
    >

    <meta
        property="og:image:height"
        content="500"
    >


    <!-- =====================================================
         TWITTER / X
    ====================================================== -->

    <meta
        name="twitter:card"
        content="summary_large_image"
    >

    <meta
        name="twitter:title"
        content="${name} | Sun Shine Club Kendupalli"
    >

    <meta
        name="twitter:description"
        content="${escapeHTML(description)}"
    >

    <meta
        name="twitter:image"
        content="${photo}"
    >

    <meta
        name="twitter:image:alt"
        content="${name} - Sun Shine Club Kendupalli member"
    >


    <!-- =====================================================
         GOOGLE FONTS
    ====================================================== -->

    <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
    >

    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin
    >

    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
    >


    <!-- =====================================================
         FONT AWESOME
    ====================================================== -->

    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    >


    <!-- =====================================================
         COMMON MEMBER CSS
    ====================================================== -->

    <link
        rel="stylesheet"
        href="../../css/member-profile.css"
    >


    <!-- =====================================================
         ORGANIZATION SCHEMA
    ====================================================== -->

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Sun Shine Club",
        "alternateName": "Sun Shine Club Kendupalli",
        "url": "${DOMAIN}/",
        "logo": {
            "@type": "ImageObject",
            "url": "${CLUB_LOGO}"
        }
    }
    </script>


    <!-- =====================================================
         PERSON SCHEMA
    ====================================================== -->

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Person",

        "name": "${name}",

        "alternateName": "${odiaName}",

        "identifier": "${id}",

        "image": {
            "@type": "ImageObject",
            "url": "${photo}"
        },

        "jobTitle": "${designation}",

        "memberOf": {
            "@type": "Organization",
            "name": "Sun Shine Club",
            "url": "${DOMAIN}/",
            "logo": {
                "@type": "ImageObject",
                "url": "${CLUB_LOGO}"
            }
        },

        "url": "${profileURL}"
    }
    </script>

</head>


<body>


    <!-- =====================================================
         COMMON NAVBAR
    ====================================================== -->

    <header class="site-header">

        <!--
            YOUR EXISTING COMMON NAVBAR
        -->

    </header>


    <!-- =====================================================
         MAIN
    ====================================================== -->

    <main>


        <!-- =================================================
             MEMBER HERO
        ================================================== -->

        <section class="member-hero">

            <div class="member-container">


                <!-- BREADCRUMB -->

                <nav
                    class="breadcrumb"
                    aria-label="Breadcrumb"
                >

                    <a href="../members.html">

                        <i
                            class="fa-solid fa-users"
                            aria-hidden="true"
                        ></i>

                        Members

                    </a>

                    <span aria-hidden="true">
                        /
                    </span>

                    <span aria-current="page">

                        ${name}

                    </span>

                </nav>



                <!-- =================================================
                     MEMBER PROFILE
                ================================================== -->

                <article
                    class="member-profile"
                    itemscope
                    itemtype="https://schema.org/Person"
                >


                    <!-- MEMBER PHOTO -->

                    <div class="member-photo-wrapper">

                        <img
                            src="${photo}"
                            alt="${name} - Sun Shine Club Kendupalli member"
                            class="member-photo"
                            width="500"
                            height="500"
                            loading="eager"
                            fetchpriority="high"
                            decoding="async"
                            itemprop="image"
                        >

                    </div>



                    <!-- MEMBER INFORMATION -->

                    <div class="member-info">


                        <span class="member-badge">

                            ACTIVE MEMBER

                        </span>


                        <h1 itemprop="name">

                            ${name}

                        </h1>


                        <p
                            class="member-odia"
                            lang="or"
                        >

                            ${odiaName}

                        </p>


                        <p
                            class="member-designation"
                            itemprop="jobTitle"
                        >

                            ${designation}

                        </p>



                        <!-- MEMBER DETAILS -->

                        <div class="member-details">


                            <!-- MEMBER ID -->

                            <div class="member-detail-item">

                                <span>

                                    <i
                                        class="fa-solid fa-id-card"
                                        aria-hidden="true"
                                    ></i>

                                    Member ID

                                </span>

                                <strong>

                                    ${id}

                                </strong>

                            </div>



                            <!-- JOIN DATE -->

                            <div class="member-detail-item">

                                <span>

                                    <i
                                        class="fa-solid fa-calendar-days"
                                        aria-hidden="true"
                                    ></i>

                                    Joining Date

                                </span>

                                <strong>

                                    <time datetime="${joinDate}">
                                        ${formattedJoinDate}
                                    </time>

                                </strong>

                            </div>



                            <!-- ADDRESS -->

                            <div class="member-detail-item">

                                <span>

                                    <i
                                        class="fa-solid fa-location-dot"
                                        aria-hidden="true"
                                    ></i>

                                    Address

                                </span>

                                <strong>

                                    ${address}

                                </strong>

                            </div>



                            <!-- PHONE -->

                            <div class="member-detail-item">

                                <span>

                                    <i
                                        class="fa-solid fa-phone"
                                        aria-hidden="true"
                                    ></i>

                                    Phone

                                </span>

                                <strong>

                                    <a
                                        href="tel:+91${phone}"
                                        aria-label="Call ${name}"
                                    >

                                        ${phoneDisplay}

                                    </a>

                                </strong>

                            </div>


                        </div>



                        <!-- ACTION BUTTONS -->

                        <div class="member-actions">


                            <a
                                href="../members.html"
                                class="back-btn"
                            >

                                <i
                                    class="fa-solid fa-arrow-left"
                                    aria-hidden="true"
                                ></i>

                                <span>
                                    All Members
                                </span>

                            </a>



                            <button
                                type="button"
                                class="share-btn"
                                id="shareMember"
                                aria-label="Share ${name} profile"
                            >

                                <i
                                    class="fa-solid fa-share-nodes"
                                    aria-hidden="true"
                                ></i>

                                <span>
                                    Share Profile
                                </span>

                            </button>


                        </div>


                    </div>

                </article>

            </div>

        </section>



        <!-- =====================================================
             ABOUT MEMBER
        ====================================================== -->

        <section class="member-content-section">

            <div class="member-container">

                <article class="about-member">


                    <span class="section-label">

                        MEMBER PROFILE

                    </span>


                    <h2>

                        About ${name}

                    </h2>


                    <p>

                        ${name} is a
                        <strong>${designation}</strong>
                        of
                        <strong>Sun Shine Club, Kendupalli</strong>.
                        ${odiaName ? `The member is also known as <span lang="or">${odiaName}</span>.` : ""}
                        ${name} joined Sun Shine Club on
                        <strong>${formattedJoinDate}</strong>.
                        Since joining the club, ${name} has been associated
                        with the community activities and initiatives
                        of Sun Shine Club, Kendupalli.
                        As a member of Sun Shine Club, ${name}
                        is part of the club's social, cultural and
                        community activities.

                    </p>


                </article>

            </div>

        </section>


    </main>



    <!-- =====================================================
         SHARE TOAST
    ====================================================== -->

    <div
        class="share-toast"
        id="shareToast"
        role="status"
        aria-live="polite"
    ></div>



    <!-- =====================================================
         COMMON JAVASCRIPT
    ====================================================== -->

    <script
        src="../../js/member-profile.js"
        defer
    ></script>


</body>

</html>
`;

}


/* =========================================================
   GENERATE ALL FILES
========================================================= */

let generated = 0;

let skipped = 0;

const usedSlugs = new Set();


for (const member of members) {

    if (
        !member.name ||
        !member.id
    ) {

        console.warn(
            `Skipping invalid member entry:`,
            member
        );

        skipped++;

        continue;
    }


    let slug =
        createSlug(member.name);


    /*
       Prevent duplicate filenames.
       Example:
       biswaranjan-panda.html
       biswaranjan-panda-ssc013.html
    */

    if (usedSlugs.has(slug)) {

        slug =
            `${slug}-${String(member.id).toLowerCase()}`;

    }


    usedSlugs.add(slug);


    const filePath =
        path.join(
            OUTPUT_DIR,
            `${slug}.html`
        );


    const html =
        generateMemberHTML(member);


    fs.writeFileSync(
        filePath,
        html,
        "utf8"
    );


    console.log(
        `Created: ${slug}.html`
    );


    generated++;

}


/* =========================================================
   RESULT
========================================================= */

console.log("\n========================================");

console.log(
    `Generated: ${generated} member profile(s)`
);

console.log(
    `Skipped:   ${skipped} member(s)`
);

console.log(
    `Location:  ${OUTPUT_DIR}`
);

console.log("========================================\n");