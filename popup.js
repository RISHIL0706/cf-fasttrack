const input = document.getElementById("problemInput");
const openBtn = document.getElementById("openBtn");
const results = document.getElementById("results");


// --------------------------------------------------
// Open a Codeforces problem directly
// --------------------------------------------------

function openProblem(contestId, index) {

    const url =
        `https://codeforces.com/problemset/problem/${contestId}/${index}`;

    chrome.tabs.create({
        url: url
    });
}


// --------------------------------------------------
// Check whether input is a problem code
// --------------------------------------------------

function parseProblemCode(value) {

    // Remove spaces
    value = value.trim().toUpperCase();

    // Convert:
    // 1008/A -> 1008A
    // 1008-A -> 1008A

    value = value.replace(/[\/\-]/g, "");

    const match = value.match(/^(\d+)([A-Z]+)$/);

    if (!match) {
        return null;
    }

    return {
        contestId: match[1],
        index: match[2]
    };
}


// --------------------------------------------------
// Button
// --------------------------------------------------

openBtn.addEventListener("click", async () => {

    const value = input.value.trim();

    if (!value) {
        results.innerHTML =
            `<div class="message">Enter a problem code or name.</div>`;
        return;
    }


    // ----------------------------------------------
    // CASE 1: User entered something like 1008A
    // ----------------------------------------------

    const problemCode = parseProblemCode(value);

    if (problemCode) {

        openProblem(
            problemCode.contestId,
            problemCode.index
        );

        return;
    }


    // ----------------------------------------------
    // CASE 2: User entered a problem name
    // ----------------------------------------------

    await searchProblem(value);

});


// --------------------------------------------------
// Search Codeforces API
// --------------------------------------------------

async function searchProblem(query) {

    results.innerHTML =
        `<div class="message">Searching Codeforces...</div>`;

    try {

        const response =
            await fetch("https://codeforces.com/api/problemset.problems");

        const data = await response.json();

        if (data.status !== "OK") {
            throw new Error("Codeforces API error");
        }

        const problems = data.result.problems;

        const searchText = query.toLowerCase();

        const matches = problems.filter(problem =>
            problem.name.toLowerCase().includes(searchText)
        );

        displayResults(matches.slice(0, 10));

    } catch (error) {

        console.error(error);

        results.innerHTML =
            `<div class="message">
                Unable to fetch Codeforces problems.
            </div>`;
    }
}


// --------------------------------------------------
// Display search results
// --------------------------------------------------

function displayResults(matches) {

    results.innerHTML = "";

    if (matches.length === 0) {

        results.innerHTML =
            `<div class="message">
                No matching problems found.
            </div>`;

        return;
    }


    matches.forEach(problem => {

        const div = document.createElement("div");

        div.className = "result";

        div.innerHTML = `
            <div class="result-name">
                ${problem.name}
            </div>

            <div class="result-code">
                ${problem.contestId}${problem.index}
            </div>
        `;


        div.addEventListener("click", () => {

            openProblem(
                problem.contestId,
                problem.index
            );

        });

        results.appendChild(div);

    });
}