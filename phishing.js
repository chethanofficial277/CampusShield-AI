function analyzeURL(url) {
  let score = 0;
  let reasons = [];

  if (url.length > 75) {
    score += 20;
    reasons.push("URL is unusually long.");
  }

  if (url.includes("@")) {
    score += 25;
    reasons.push("URL contains '@' symbol.");
  }

  if (!url.startsWith("https")) {
    score += 20;
    reasons.push("Website is not using HTTPS.");
  }

  const keywords = ["login","verify","update","secure","bank","otp"];

  keywords.forEach(word => {
    if (url.toLowerCase().includes(word)) {
      score += 10;
      reasons.push("Suspicious keyword detected: " + word);
    }
  });

  score = Math.min(score, 100);

  let level = "Low Risk";
  if (score > 60) level = "High Risk";
  else if (score > 30) level = "Medium Risk";

  return { score, level, reasons };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const result = analyzeURL(request.url);
  sendResponse(result);
});