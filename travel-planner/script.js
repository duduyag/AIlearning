document.getElementById('travel-form').addEventListener('submit', function (event) {
  event.preventDefault();
  const name = this.elements.name.value.trim();
  const destination = this.elements.destination.value.trim();
  const note = document.getElementById('form-note');
  note.textContent = name ? `תודה ${name}! קיבלתי את הכיוון${destination ? ` ל${destination}` : ''} — נדבר בקרוב.` : 'מלאו את השם כדי שאוכל לחזור אליכם.';
  if (name) this.reset();
});
