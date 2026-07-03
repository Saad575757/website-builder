export function generateWhatsAppUrl(
  phoneNumber: string,
  message?: string
): string {
  const cleaned = phoneNumber.replace(/[^0-9]/g, "");
  const base = `https://wa.me/${cleaned}`;
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}

export function generateWhatsAppScript(phoneNumber: string): string {
  return `
(function() {
  var btn = document.createElement('div');
  btn.innerHTML = '<a href="${generateWhatsAppUrl(phoneNumber)}" target="_blank" style="position:fixed;bottom:20px;right:20px;z-index:9999;background:#25D366;color:white;width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);cursor:pointer;transition:transform 0.2s;"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></a>';
  document.body.appendChild(btn);
})();
`.trim();
}
