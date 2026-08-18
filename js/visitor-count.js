document.addEventListener("DOMContentLoaded", async () => {

    const visitorCount = document.getElementById("visitorCount");

    if (!visitorCount) return;

    // Don't count local development/testing visits
    const isLocal =
        location.hostname === "localhost" ||
        location.hostname === "127.0.0.1" ||
        location.hostname === "::1";

    if (isLocal) {
        visitorCount.textContent = "DEV";
        console.log("Visitor counter disabled on local development.");
        return;
    }

    try {

        const counter = new Counter({
            workspace: "ssclub-visitor"
        });

        const result = await counter.up(
            "ssclub-website-visitors"
        );

        const count = result.data?.up_count ?? 0;

        visitorCount.textContent =
            Number(count).toLocaleString();

    } catch (error) {

        console.error("Visitor counter error:", error);

        visitorCount.textContent = "—";

    }

});