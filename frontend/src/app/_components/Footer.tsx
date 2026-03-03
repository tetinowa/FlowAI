import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            ✦
          </div>
          <span className="font-semibold text-lg">Flow Ai</span>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
          <Link href="#" className="hover:text-indigo-600 transition">
            Нууцлалын бодлого
          </Link>
          <Link href="#" className="hover:text-indigo-600 transition">
            Үйлчилгээний нөхцөл
          </Link>
          <Link href="#" className="hover:text-indigo-600 transition">
            Күүки бодлого
          </Link>
        </div>
        <p className="text-sm text-gray-500 text-center md:text-right">
          © {new Date().getFullYear()} SaaS AI Inc. Бүх эрх хуулиар хамгаалагдсан.
        </p>

      </div>
    </footer>
  );
};

export default Footer;