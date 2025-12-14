import Link from "next/link";

const footerLinks = {
  Product: ["Changelog", "Features", "Security", "Pricing"],
  Company: ["About", "Careers", "Brand", "Contact"],
  Resources: ["Blog", "Help Center", "API Docs", "System Status"],
  Legal: ["Privacy", "Terms", "Cookie Settings"],
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-12 lg:py-14">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
            >
              Minidrive
            </Link>
            <p className="mt-4 text-sm text-zinc-500">
              Your files. Precisely managed.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-medium uppercase tracking-widest text-zinc-400">
                {category}
              </h4>
              <ul className="mt-4 space-y-3">
                {links.map(link => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-zinc-600 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="relative h-36 overflow-hidden lg:h-48">
        <span className="absolute bottom-0 left-0 right-0 text-center text-[120px] font-bold leading-none tracking-tighter text-zinc-900 dark:text-zinc-100 opacity-[0.03] lg:text-[200px]">
          MINIDRIVE
        </span>
      </div>
    </footer>
  );
}
