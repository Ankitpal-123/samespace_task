export function mapApiSong(item) {
  const baseURL = "https://cms.samespace.com/assets/";
  return {
    id: item.id,
    title: item.name || "Unknown Title",
    artist: item.artist || "Unknown Artist",
    audio: item.url || "",
    cover: item.cover ? `${baseURL}${item.cover}` : "",
  };
}

export async function getAverageColorFromImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = canvas.height = 40;
      ctx.drawImage(img, 0, 0, 40, 40);
      const data = ctx.getImageData(0, 0, 40, 40).data;
      let r = 0,
        g = 0,
        b = 0,
        count = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 125) continue;
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
      resolve(
        count
          ? { r: r / count, g: g / count, b: b / count }
          : { r: 30, g: 30, b: 30 }
      );
    };
    img.onerror = () => resolve({ r: 30, g: 30, b: 30 });
  });
}

export function formatTime(t) {
  if (!t || !isFinite(t)) return "0:00";
  const s = Math.floor(t % 60);
  const m = Math.floor(t / 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
