document.getElementById("checkBtn").addEventListener("click", async () => {
  const text = document.getElementById("userInput").value;

  if (!text.trim()) {
    document.getElementById("result").innerText = "⚠️ Please type something!";
    return;
  }

  try {
    const res = await fetch("/api/sentiment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    if (data.error) {
      document.getElementById("result").innerText = `❌ Error: ${data.error}`;
    } else {
      const emoji =
        data.mood === "Positive"
          ? "😊"
          : data.mood === "Negative"
          ? "😡"
          : "😐";
      document.getElementById(
        "result"
      ).innerText = `${emoji} Mood: ${data.mood} (${data.score}/10)`;
    }
  } catch (err) {
    document.getElementById("result").innerText = "⚠️ Server error.";
    console.error(err);
  }
});
