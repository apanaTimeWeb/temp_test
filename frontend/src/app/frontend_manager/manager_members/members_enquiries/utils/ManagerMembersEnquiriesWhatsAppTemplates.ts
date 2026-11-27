export function cleanManagerEnquiriesWhatsAppPhone(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return digits.length === 10 ? `91${digits}` : digits;
}

/** 1-Click WhatsApp 1-Day Free Trial Demo Pass template */
export function getManagerEnquiriesDemoPassWhatsAppUrl(enquiry: {
  name: string;
  phone: string;
  shift?: string;
  id?: string;
}): string {
  const phone = cleanManagerEnquiriesWhatsAppPhone(enquiry.phone);
  const passId = enquiry.id ? `DEMO-${enquiry.id.slice(-4).toUpperCase()}` : `DEMO-${Date.now().toString().slice(-4)}`;
  const shiftText = enquiry.shift && enquiry.shift !== 'Not specified' ? enquiry.shift : 'Flexible Shift';

  const message = [
    `🎟️ *CENTRAL LIBRARY — 1-DAY FREE TRIAL DEMO PASS*`,
    ``,
    `Hello *${enquiry.name}*,`,
    `Thank you for reaching out to Central Library! We are pleased to offer you a complimentary *1-Day Free Study Pass*.`,
    ``,
    `📋 *Pass ID:* ${passId}`,
    `⏰ *Preferred Shift:* ${shiftText}`,
    `🏢 *Amenities:* Silent AC Hall, Ergonomic Desks, 5G High-Speed Wi-Fi, RO Water, Charging Points at every seat.`,
    ``,
    `📍 *Location & Map Pin:*`,
    `https://maps.google.com/?q=Central+Library+Study+Center`,
    ``,
    `⏰ *Timings:* 06:00 AM – 10:00 PM (Open 7 Days)`,
    ``,
    `👉 Simply show this message at our front desk upon arrival to claim your trial desk!`,
  ].join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** 1-Click WhatsApp Location & Timings Pin template */
export function getManagerEnquiriesLocationWhatsAppUrl(enquiry: { name: string; phone: string }): string {
  const phone = cleanManagerEnquiriesWhatsAppPhone(enquiry.phone);
  const message = [
    `📍 *CENTRAL LIBRARY — LOCATION & DIRECTIONS*`,
    ``,
    `Hello *${enquiry.name}*,`,
    `Here is the exact location and contact for Central Library:`,
    ``,
    `🗺️ *Google Maps Pin:* https://maps.google.com/?q=Central+Library+Study+Center`,
    `🏢 *Address:* Main Road, Near Metro Gate #2, Central Market`,
    `⏰ *Timings:* 06:00 AM – 10:00 PM`,
    `📞 *Desk Contact:* +91 98765 43210`,
    ``,
    `Looking forward to welcoming you! Feel free to visit anytime for a walk-through.`,
  ].join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** Standard quick inquiry follow-up template */
export function getManagerEnquiriesGeneralWhatsAppUrl(enquiry: { name: string; phone: string }): string {
  const phone = cleanManagerEnquiriesWhatsAppPhone(enquiry.phone);
  const message = `Hello ${enquiry.name}, thank you for inquiring at Central Library! How can we assist you with seat booking today?`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
