import { motion } from "motion/react";
import { WHATSAPP_LINK } from "@/lib/contact-info";

/** Floating WhatsApp chat button, sits above the AI chat launcher. */
export function WhatsAppFab() {
  return (
    <motion.a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Shelco on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 220, damping: 16 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-24 right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white" aria-hidden="true">
        <path d="M16.04 3.2c-7.06 0-12.8 5.73-12.8 12.79 0 2.25.59 4.45 1.72 6.39L3.2 28.8l6.six 0" />
        <path d="M16.05 3.2C8.98 3.2 3.25 8.93 3.25 16c0 2.26.6 4.46 1.73 6.4L3.2 28.8l6.55-1.72a12.8 12.8 0 0 0 6.3 1.64h.01c7.06 0 12.79-5.73 12.8-12.8 0-3.42-1.33-6.63-3.75-9.05a12.7 12.7 0 0 0-9.06-3.67Zm7.5 18.3c-.32.9-1.86 1.72-2.59 1.83-.66.1-1.5.14-2.42-.15a22 22 0 0 1-2.19-.81c-3.85-1.66-6.37-5.54-6.56-5.8-.19-.26-1.57-2.09-1.57-3.99 0-1.9 1-2.83 1.35-3.22.35-.39.77-.49 1.03-.49h.74c.24 0 .56-.09.87.66.32.77 1.1 2.67 1.2 2.86.1.19.16.42.03.68-.13.26-.19.42-.39.65-.19.23-.4.51-.58.69-.19.19-.39.4-.17.78.23.39 1 1.66 2.15 2.68 1.48 1.32 2.73 1.73 3.12 1.92.39.2.61.17.84-.1.23-.26.97-1.13 1.23-1.52.26-.39.51-.32.87-.19.35.13 2.25 1.06 2.64 1.25.39.2.64.29.74.45.1.16.1.93-.22 1.83Z" />
      </svg>
    </motion.a>
  );
}
