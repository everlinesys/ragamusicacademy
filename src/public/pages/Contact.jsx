import branding from "../../config/branding.json";
import { useBranding } from "../../shared/hooks/useBranding";

export default function Contact() {
  const brand= new useBranding()
  return (
    <div className="mx-auto px-6 py-16 space-y-10 bg-white/50 text-black">

      <div>
        <h1 className="text-3xl font-bold mb-2">
          Contact {branding.companyName}
        </h1>
        <p className="text-gray-600">
          We’d love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Contact Info */}
        <div className="space-y-4 bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold">Contact Info</h2>

          <p>
            <span className="font-medium">Email:</span>{" "}
            {brand.contact.email}
          </p>

          <p>
            <span className="font-medium">Phone:</span>{" "}
            {brand.contact.phone}
          </p>

          <p>
            <span className="font-medium">Address:</span>{" "}
            {brand.contact.address}
          </p>

          <a
            href={branding.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
            style={{ color: "white" }}      >
            Chat on WhatsApp
          </a>
        </div>

        {/* Contact Form */}
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Send Message</h2>

          <input
            type="text"
            placeholder="Your Name"
            className="w-full border rounded-lg p-2"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full border rounded-lg p-2"
          />

          <textarea
            placeholder="Your Message"
            rows="4"
            className="w-full border rounded-lg p-2"
          />

          <button className="w-full py-2 bg-black text-white rounded-lg">
            Send Message
          </button>
        </div>

      </div>
    </div>
  );
}
