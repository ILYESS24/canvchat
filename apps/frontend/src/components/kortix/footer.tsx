export function KortixFooter() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Stats */}
          <div className="md:col-span-2">
            <div className="text-3xl font-bold mb-4">Kortix</div>
            <div className="flex items-center gap-4 mb-8">
              <div className="text-2xl">20.0k</div>
              <div className="text-gray-400">|</div>
              <div className="text-gray-400">EN</div>
            </div>
          </div>

          {/* Kortix Links */}
          <div>
            <h4 className="font-semibold mb-4">Kortix</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="/support" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="/docs" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="https://discord.com" className="text-gray-400 hover:text-white transition-colors">Discord</a></li>
              <li><a href="https://github.com" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>

        {/* Legal Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/license" className="text-gray-400 hover:text-white transition-colors">License</a></li>
              </ul>
            </div>

            <div className="md:col-span-2 text-right">
              <p className="text-gray-400">© 2026 Kortix. All rights reserved.</p>
              <p className="text-gray-400 mt-2">Built with across America, Europe & Asia</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
