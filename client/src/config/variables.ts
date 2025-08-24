const variables = {
  backend_url: process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000",
  api_endpoint: process.env.NEXT_PUBLIC_API_ENDPOINT ?? "graphql",
};

export default variables;

