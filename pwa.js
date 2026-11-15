(() => {
  const guidance = document.querySelector('#install-guide');
  const install = document.querySelector('#install-native');
  const status = document.querySelector('#pwa-status');
  const updateNotice = document.querySelector('#pwa-update');
  const update = document.querySelector('#pwa-update-button');
  const updateStatus = document.querySelector('#pwa-update-status');
  const standalone = matchMedia('(display-mode: standalone)');
  let installPrompt;
  let registration;
  let waiting;
  let reloadOnActivation = false;
  let updateTimer;
  let lastCheck = 0;
  let readiness = 'preparing';
  let installed = standalone.matches || navigator.standalone === true;

  function render() {
    install.hidden = installed || !installPrompt || !navigator.onLine;
    guidance.hidden = installed;
    const description = readiness === 'ready'
      ? (navigator.onLine ? 'Saved for offline reading.' : 'Offline · Showing the saved guide.')
      : readiness === 'unavailable'
        ? 'Offline saving is unavailable in this browser session.'
        : (navigator.onLine ? 'Preparing the guide for offline use…' : 'Go online once to save the guide.');
    status.textContent = (installed ? 'App mode · ' : '') + description
      + (waiting?.state === 'installed' ? ' An update is ready.' : '');
  }

  standalone.addEventListener?.('change', event => {
    installed = event.matches || navigator.standalone === true;
    render();
  });
  addEventListener('beforeinstallprompt', event => {
    if (installed) return;
    event.preventDefault();
    installPrompt = event;
    render();
  });
  addEventListener('appinstalled', () => {
    installPrompt = undefined;
    installed = true;
    render();
    status.focus({ preventScroll: true });
  });
  install.addEventListener('click', async () => {
    const prompt = installPrompt;
    if (!prompt) return;
    installPrompt = undefined;
    install.disabled = true;
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice?.outcome !== 'accepted' && !installed) guidance.open = true;
    } catch {
      if (!installed) guidance.open = true;
    } finally {
      install.disabled = false;
      render();
      if (!installed && !installPrompt) guidance.querySelector('summary').focus({ preventScroll: true });
    }
  });

  function offerUpdate(worker) {
    if (!worker || worker.state !== 'installed' || waiting === worker) return;
    waiting = worker;
    updateNotice.hidden = false;
    update.disabled = false;
    updateStatus.textContent = '';
    render();
    worker.addEventListener('statechange', () => {
      if (waiting === worker && worker.state === 'redundant') {
        waiting = undefined;
        if (!reloadOnActivation) updateNotice.hidden = true;
        render();
      }
    });
  }

  function checkForUpdate(force = false) {
    if (!registration || !navigator.onLine || (!force && Date.now() - lastCheck < 5 * 60_000)) return;
    lastCheck = Date.now();
    registration.update().catch(() => {}); // Keep the existing offline version on failures.
  }

  update.addEventListener('click', () => {
    if (update.disabled || !waiting) return;
    reloadOnActivation = true;
    update.disabled = true;
    updateStatus.textContent = 'Updating the guide…';
    updateTimer = setTimeout(() => {
      reloadOnActivation = false;
      if (waiting?.state === 'installed') {
        update.disabled = false;
        updateStatus.textContent = 'Update did not finish. Try again.';
      } else {
        updateStatus.textContent = 'Reload this page when you’re ready to use the new version.';
      }
    }, 8000);
    waiting.postMessage({ type: 'ACTIVATE_UPDATE' });
  });

  addEventListener('online', () => { render(); checkForUpdate(true); });
  addEventListener('offline', render);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkForUpdate();
  });

  async function prepareOffline() {
    if (!isSecureContext || !('serviceWorker' in navigator)) {
      readiness = 'unavailable'; render(); return;
    }
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      clearTimeout(updateTimer);
      if (reloadOnActivation) {
        reloadOnActivation = false;
        location.reload();
      } else if (navigator.serviceWorker.controller) {
        if (!updateNotice.hidden) {
          update.disabled = true;
          updateStatus.textContent = 'A new version is active. Reload when you’re ready.';
        }
        readiness = 'ready'; render();
      }
    });
    try {
      registration = await navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' });
      lastCheck = Date.now();
      const watch = worker => {
        if (!worker) return;
        const onState = () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) offerUpdate(worker);
          if (worker.state === 'redundant' && !registration.active) {
            readiness = 'unavailable'; render();
          }
        };
        worker.addEventListener('statechange', onState);
        onState();
      };
      registration.addEventListener('updatefound', () => watch(registration.installing));
      watch(registration.installing);
      if (registration.active) offerUpdate(registration.waiting);
      await navigator.serviceWorker.ready;
      readiness = 'ready'; render();
    } catch {
      readiness = 'unavailable'; render();
    }
  }

  // Static instructions remain usable without JavaScript. Avoid showing misleading
  // browser chrome guidance when launched from the home screen.
  render();
  if (document.readyState === 'complete') prepareOffline();
  else addEventListener('load', prepareOffline, { once: true });
})();
