import app from "@/app";

export const getTestServer = () => {
  const server = app.listen(0); // Random port
  const port = (server.address() as any).port;
  const baseUrl = `http://localhost:${port}/api/v1`;
  
  return {
    server,
    baseUrl,
    close: () => server.close(),
  };
};
