const renderSizeStep = require('./steps/SizeStep');

function mount() {
  const container = document.querySelector('.cleverlux-quote');
  if (!container) return;

  const step = renderSizeStep({
    onNext(slug) {
      console.log('selected size', slug);
    },
  });
  container.appendChild(step);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
}
