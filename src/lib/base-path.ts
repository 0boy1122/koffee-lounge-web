// The repo name this static export is deployed under on GitHub Pages.
// Override at build time with NEXT_PUBLIC_BASE_PATH since it differs per repo
// (e.g. "/koffee-lounge-web" vs "/Koffee-Lounge-").
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "/Koffee-Lounge-";
