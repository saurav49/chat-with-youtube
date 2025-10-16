import axios from "axios";

async function resolveQuery(query: string) {
  try {
    const r = await axios.post(`http://localhost:3000/api/v1/query`, {
      query: query,
    });
    return r;
  } catch (e) {
    console.error(`Error:`, e);
  }
}
function handleTimestampClick(seconds: number, videoUrl: string) {
  const url = `${videoUrl}&t=${seconds}`;
  window.open(url, "_blank");
}

export { resolveQuery, handleTimestampClick };
