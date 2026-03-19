import Link from "next/link";

const Footer = () => {
  return (
    <footer
      style={{
        background: "#050B15",
        borderTop: "1px solid rgba(0,212,255,0.06)",
      }}
    >
      <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
            style={{
              background: "linear-gradient(135deg, #00D4FF, #0090CC)",
              color: "#050B15",
              fontFamily: "Syne, sans-serif",
            }}
          >
            ✦
          </div>
          <span
            className="font-bold text-lg"
            style={{ color: "#E8F4FF", fontFamily: "Syne, sans-serif", letterSpacing: "-0.02em" }}
          >
            FlowAI
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 text-sm" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          {[
            { label: "Нууцлалын бодлого", href: "#" },
            { label: "Үйлчилгээний нөхцөл", href: "#" },
            { label: "Күүки бодлого", href: "#" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="transition-colors"
              style={{ color: "#6B8BAE" }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p
          className="text-sm text-center"
          style={{ color: "#3A5068", fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          © {new Date().getFullYear()} FlowAI. Бүх эрх хамгаалагдсан.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
