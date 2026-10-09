if (document.currentScript) {
  (async function () {
    await tutorStorage.hydrate();
    for (const source of document.querySelectorAll('script[type="text/tutor"][src]')) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = source.getAttribute('src');
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }
  })().catch(() => {
    document.getElementById('platformStatus').textContent = 'A classroom file could not load. Please refresh the page to try again.';
  });
}
