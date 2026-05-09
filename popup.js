document.getElementById("openBtn").addEventListener("click", () => {

    let input = document
        .getElementById("problemInput")
        .value
        .trim()
        .toUpperCase();

    if (!input) {
        alert("Please enter a problem code");
        return;
    }

    // Remove separators like / or -
    input = input.replace(/[/\-]/g, "");

    // Extract contest number
    const contestNo = input.match(/\d+/);

    // Extract problem letter(s)
    const letter = input.match(/[A-Z]+/);

    if (!contestNo || !letter) {
        alert("Invalid format.\nExamples:\n1008A\n1008/A\n1008-A");
        return;
    }

    const url =
        `https://codeforces.com/problemset/problem/${contestNo[0]}/${letter[0]}`;

    chrome.tabs.create({
        url: url
    });

});