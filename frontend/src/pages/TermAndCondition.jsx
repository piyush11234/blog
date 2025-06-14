import React from 'react'

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center mt-20">Terms and Conditions</h1>

      <p className="mb-4">
        Welcome to our blog platform. By accessing or using our website, you agree to be bound by these Terms and Conditions. Please read them carefully.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
      <p className="mb-4">
        By using this website, you agree to comply with and be legally bound by these terms. If you do not agree to these terms, you must not use this website.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. User Content</h2>
      <p className="mb-4">
        Users are responsible for any content they publish on the platform. By posting content, you grant us the right to display and distribute it. You must not post illegal, offensive, or copyrighted material without permission.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Account Responsibility</h2>
      <p className="mb-4">
        You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Termination</h2>
      <p className="mb-4">
        We reserve the right to suspend or terminate your access if you violate any of these terms or engage in unlawful or inappropriate behavior.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Limitation of Liability</h2>
      <p className="mb-4">
        We shall not be liable for any damages arising from your use of the website or content posted by users.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Changes to Terms</h2>
      <p className="mb-4">
        We may update these Terms and Conditions from time to time. Continued use of the website constitutes acceptance of those changes.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Contact Us</h2>
      <p className="mb-4">
        If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:support@yourblog.com" className="text-blue-500 underline">support@yourblog.com</a>.
      </p>

      <p className="text-sm text-center mt-10 text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} YourBlog. All rights reserved.</p>
    </div>
  )
}

export default TermsAndConditions
