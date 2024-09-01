export default {
backend_url:process.env.BACKEND_URL as string || "http://localhost:8000" ,
api_endpoint:process.env.API_ENDPOINT as string || "graphql",

}