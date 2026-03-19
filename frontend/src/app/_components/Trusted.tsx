const banks = ["Хаан банк", "Голомт банк", "Хас банк", "ТДБ банк", "Капитал банк", "Ариг банк"];

export default function TrustedBy() {
  return (
    <section
      style={{
        background: "#0D1829",
        borderTop: "1px solid rgba(0,212,255,0.06)",
        borderBottom: "1px solid rgba(0,212,255,0.06)",
      }}
    >
      <div className="container mx-auto px-6 py-12">
        <p
          className="text-center text-xs font-semibold tracking-[0.15em] uppercase mb-8"
          style={{ color: "#6B8BAE", fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          Монголын тэргүүлэх банкуудтай холбогддог
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {banks.map((bank) => (
            <div
              key={bank}
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: "rgba(0,212,255,0.05)",
                border: "1px solid rgba(0,212,255,0.1)",
                color: "#6B8BAE",
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}
            >
              {bank}
            </div>
          ))}
        </div>

        {/* Trust stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-12" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          {[
            { n: "500+", l: "Идэвхтэй бизнес" },
            { n: "10,000+", l: "Тайлан үүсгэгдсэн" },
            { n: "₮2.4 тэр.", l: "Боловсруулсан гүйлгээ" },
            { n: "99.9%", l: "Тайлангийн нарийвчлал" },
          ].map(({ n, l }) => (
            <div key={l} className="text-center">
              <div
                className="text-3xl font-black mb-1"
                style={{ color: "#00D4FF", fontFamily: "Syne, sans-serif" }}
              >
                {n}
              </div>
              <div
                className="text-sm"
                style={{ color: "#6B8BAE", fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
