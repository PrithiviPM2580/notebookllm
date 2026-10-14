export const generateImage = async (prompt: string) => {
  const apiUrl = process.env.IMAGE_API_URL;
  const bearerToken = process.env.IMAGE_BEARER_TOKEN;

  if (!apiUrl) {
    throw new Error("IMAGE_API_URL is not defined in the environment variables.");
  }
  if (!bearerToken) {
    throw new Error(
      "IMAGE_BEARER_TOKEN is not defined in the environment variables.",
    );
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Failed to generate image (${response.status}): ${details || response.statusText}`,
    );
  }

  return Buffer.from(await response.arrayBuffer());
};
