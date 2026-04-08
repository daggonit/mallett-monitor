export const metadata = {
  title: "Mallett Made - Radiant Monitor",
  description: "Live energy monitoring for radiant barrier installations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
