import { Upload, FileText, Share2, MessageSquare } from "lucide-react";

const features = [
  {
    icon: Upload,
    color: "#00D4FF",
    bg: "rgba(0, 212, 255, 0.08)",
    border: "rgba(0, 212, 255, 0.15)",
    title: "Банкны хуулга оруулах",
    subtitle: "AI шинжилгээ",
    desc: "Excel болон PDF хуулгаа оруулахад AI тань орлого, зарлагыг автоматаар ангилж, санхүүгийн дүр зургийг гаргана.",
    mock: (
      <div className="mt-5 rounded-xl p-4" style={{ background: "rgba(0,0,0,0.3)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(0,212,255,0.15)" }}
          >
            <Upload className="w-3.5 h-3.5" style={{ color: "#00D4FF" }} />
          </div>
          <div>
            <div className="text-xs font-semibold" style={{ color: "#E8F4FF" }}>
              Голомт_Банк_2024.xlsx
            </div>
            <div className="text-xs" style={{ color: "#6B8BAE" }}>
              245 гүйлгээ илрүүлсэн
            </div>
          </div>
        </div>
        {[
          { l: "Борлуулалт", v: "₮8.4M", c: "#00D4FF" },
          { l: "Зардал", v: "₮5.1M", c: "#F5A623" },
        ].map(({ l, v, c }) => (
          <div key={l} className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span className="text-xs" style={{ color: "#6B8BAE" }}>{l}</span>
            <span className="text-xs font-semibold" style={{ color: c }}>{v}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: FileText,
    color: "#F5A623",
    bg: "rgba(245, 166, 35, 0.08)",
    border: "rgba(245, 166, 35, 0.15)",
    title: "Автомат татварын тайлан",
    subtitle: "НӨАТ · ААН · НД",
    desc: "Татварын алба руу илгээхэд бэлэн НӨАТ, ААН, НД тайлануудыг хоёр товшилтоор автоматаар үүсгэ.",
    mock: (
      <div className="mt-5 space-y-2">
        {[
          { label: "НӨАТ тайлан", status: "Бэлэн", color: "#28C840" },
          { label: "ААН тайлан", status: "Бэлэн", color: "#28C840" },
          { label: "НД тайлан", status: "Боловсруулж байна…", color: "#F5A623" },
        ].map(({ label, status, color }) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-lg px-4 py-3"
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.04)" }}
          >
            <span className="text-xs font-semibold" style={{ color: "#E8F4FF" }}>
              {label}
            </span>
            <span
              className="text-xs font-medium"
              style={{ color, fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {status}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Share2,
    color: "#A78BFA",
    bg: "rgba(167, 139, 250, 0.08)",
    border: "rgba(167, 139, 250, 0.15)",
    title: "Facebook автомат нийтлэл",
    subtitle: "Маркетинг автоматжуулалт",
    desc: "Сарын санхүүгийн үр дүнгээс AI постын агуулга үүсгэж, таны Facebook хуудас руу автоматаар нийтэлнэ.",
    mock: (
      <div
        className="mt-5 rounded-xl p-4"
        style={{
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(167, 139, 250, 0.1)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "#1877F2", color: "#fff" }}
          >
            f
          </div>
          <div className="text-xs font-semibold" style={{ color: "#E8F4FF" }}>
            Таны бизнесийн хуудас
          </div>
          <div
            className="ml-auto text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(40,200,64,0.15)", color: "#28C840" }}
          >
            Нийтлэгдлээ
          </div>
        </div>
        <div className="text-xs leading-relaxed" style={{ color: "#6B8BAE" }}>
          "2024 оны 12-р сард бидний борлуулалт 24% өслөө! 🎉 Та бидний үйлчилгээний талаар..."
        </div>
        <div className="flex gap-4 mt-3 text-xs" style={{ color: "#6B8BAE" }}>
          <span>👍 142 like</span>
          <span>💬 28 comment</span>
          <span>↗ 19 share</span>
        </div>
      </div>
    ),
  },
  {
    icon: MessageSquare,
    color: "#34D399",
    bg: "rgba(52, 211, 153, 0.08)",
    border: "rgba(52, 211, 153, 0.15)",
    title: "AI санхүүгийн зөвлөгөө",
    subtitle: "Монгол хэлээр",
    desc: "Таны өгөгдлийг үндэслэн AI зардал хэмнэх, орлого нэмэгдүүлэх, татвар бууруулах тактикийг монгол хэлээр тайлбарлана.",
    mock: (
      <div className="mt-5 space-y-2">
        <div
          className="rounded-xl px-4 py-3 text-xs leading-relaxed"
          style={{
            background: "rgba(52,211,153,0.08)",
            border: "1px solid rgba(52,211,153,0.15)",
            color: "#34D399",
          }}
        >
          🤖 &nbsp;"Таны зардлын 23% нь бэлэн мөнгөний гүйлгээ юм. Онлайн төлбөртэй шилжүүлбэл НӨАТ-ын буцаан олголтод хамрагдана."
        </div>
        <div
          className="rounded-xl px-4 py-3 text-xs leading-relaxed"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "#6B8BAE",
          }}
        >
          💬 &nbsp;"Мөн ААН-ийн зардлаа нэмэгдүүлэх боломж байна…"
        </div>
      </div>
    ),
  },
];

export default function Modul() {
  return (
    <section
      className="py-24"
      style={{ background: "linear-gradient(180deg, #050B15 0%, #081426 100%)" }}
    >
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="max-w-2xl mb-16">
          <p
            className="text-xs font-semibold tracking-[0.15em] uppercase mb-4"
            style={{ color: "#00D4FF", fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Боломжуудыг нь нээ
          </p>
          <h2
            className="text-4xl lg:text-5xl font-black leading-tight mb-4"
            style={{ color: "#E8F4FF", fontFamily: "Syne, sans-serif", letterSpacing: "-0.02em" }}
          >
            Нэг платформ,
            <br />
            бүх санхүүгийн хэрэгтэй
          </h2>
          <p
            className="text-base"
            style={{ color: "#6B8BAE", fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Монгол жижиг бизнесүүдийн санхүүгийн бүх ажлыг автоматжуулсан AI систем.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, color, bg, border, title, subtitle, desc, mock }) => (
            <div
              key={title}
              className="rounded-2xl p-7 transition-all duration-300"
              style={{
                background: "#0D1829",
                border: `1px solid ${border}`,
                boxShadow: `0 0 40px ${bg}`,
              }}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background: bg, border: `1px solid ${border}` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>

              {/* Text */}
              <div
                className="text-xs font-semibold tracking-wide uppercase mb-1"
                style={{ color, fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {subtitle}
              </div>
              <h3
                className="text-xl font-bold mb-3"
                style={{ color: "#E8F4FF", fontFamily: "Syne, sans-serif" }}
              >
                {title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#6B8BAE", fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {desc}
              </p>

              {/* Mock UI */}
              {mock}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
