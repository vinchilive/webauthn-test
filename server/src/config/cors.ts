export default {
  origin: [process.env.CORS_ORIGIN || 'https://localhost:3000'],
  issuer: process.env.CORS_ISSUER || 'https://localhost:4000',
}
