document.addEventListener("DOMContentLoaded", function() {

  document.getElementById("analyze").addEventListener("click", function() {

    const url = document.getElementById("urlInput").value;

    if (!url) {
      alert("Please enter a URL");
      return;
    }

    chrome.runtime.sendMessage(
      { url: url },
      function(response) {

        if (!response || !response.reasons) {
          document.getElementById("result").innerHTML =
            "<p>Error: No analysis returned.</p>";
          return;
        }

        let reasonList = "";
        response.reasons.forEach(r => {
          reasonList += `<li>${r}</li>`;
        });

        // Select risk icon
        let iconPath = "";
        let advice = "";
        let adviceColor = "";

        if (response.score > 60) {
          iconPath = "icons/high.png";
          advice = "Do NOT enter credentials. Verify official domain before proceeding.";
          adviceColor = "red";
        }
        else if (response.score > 30) {
          iconPath = "icons/medium.png";
          advice = "Double-check sender and URL spelling.";
          adviceColor = "orange";
        }
        else {
          iconPath = "icons/low.png";
          advice = "No immediate red flags detected.";
          adviceColor = "green";
        }

        document.getElementById("result").innerHTML =
          `<div class="risk-header">
              <img src="${iconPath}">
              <strong>${response.level}</strong>
           </div>
           <p><strong>Risk Score:</strong> ${response.score}/100</p>
           <ul>${reasonList}</ul>
           <p style="color:${adviceColor}; font-weight:bold;">
             Advice: ${advice}
           </p>`;

        const bar = document.getElementById("bar");
        bar.style.width = response.score + "%";

        if (response.score > 60)
          bar.style.background = "red";
        else if (response.score > 30)
          bar.style.background = "orange";
        else
          bar.style.background = "green";
      }
    );

  });

});