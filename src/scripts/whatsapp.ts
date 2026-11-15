const link = document.querySelector<HTMLAnchorElement>('[data-whatsapp]');
if (link) {
  const { a, b, text } = link.dataset;
  link.href = `https://wa.me/${a}${b}?text=${encodeURIComponent(text ?? '')}`;
}
