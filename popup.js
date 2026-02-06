document.getElementById('start').addEventListener('click', async () => {
  const seconds = parseInt(document.getElementById('seconds').value);
  const isMuted = document.getElementById('mute').checked;
  const audio = document.getElementById('audioAlarma');
  const status = document.getElementById('status');
  
  if (isNaN(seconds) || seconds <= 0) {
    status.innerText = "Error: Tiempo inválido";
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // 1. Inyectar el script de recarga en la página web
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (s) => {
      setTimeout(() => {
        location.reload();
      }, s * 1000);
    },
    args: [seconds]
  });

  status.innerText = `Recargando en ${seconds}s...`;
  
  // 2. Lógica de la alarma
  if (!isMuted) {
    setTimeout(() => {
      audio.play();
      status.innerText = "¡Recargado!";
      // Mantenemos el popup abierto un momento para que suene
      setTimeout(() => { window.close(); }, 2000);
    }, seconds * 1000);
  } else {
    // Si está silenciado, cerramos rápido
    setTimeout(() => { window.close(); }, 500);
  }
});