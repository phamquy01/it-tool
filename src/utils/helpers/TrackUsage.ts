export const trackUsage = async (type: string) => {
  try {
    await fetch(
      `https://lumipic.hieunk-demo.io.vn/api/it-tool/analytic?utm_source=zalo&utm_medium=zalo&utm_campaign=zalo`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      }
    );
  } catch (error) {
    console.error('Failed to track usage:', error);
  }
};
