/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Library ini memakai API Node, jangan di-bundle oleh Next
  serverExternalPackages: ["exceljs", "jspdf", "jspdf-autotable"],
};
export default nextConfig;
