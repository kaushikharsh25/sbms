export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Smart Bus Management System</h3>
            <p className="text-gray-300 text-sm">
              Modernizing college transportation with real-time tracking, smart routing, and seamless user experience.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Email: support@sbms.edu</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: College Campus, City, State</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Student Portal</p>
              <p>Driver Portal</p>
              <p>Admin Portal</p>
              <p>Help & Support</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Smart Bus Management System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
