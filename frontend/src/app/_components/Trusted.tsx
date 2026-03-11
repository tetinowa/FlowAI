import Image from "next/image";

const logos = [
  "/logos/google.png",
  "/logos/amazon.png",
  "/logos/stripe.png",
  "/logos/shopify.png",
  "/logos/slack.png",
];

export default function TrustedBy() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm font-semibold text-gray-500 tracking-widest uppercase">
          10,000 гаруй өсөн нэмэгдэж буй бизнесүүдийн итгэлийг хүлээсэн
        </p>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center">
          {logos.map((logo, index) => (
            <div key={index} className="flex justify-center">
              <Image
                src={logo}
                alt="company logo"
                width={120}
                height={40}
                className="opacity-60 hover:opacity-100 transition"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
