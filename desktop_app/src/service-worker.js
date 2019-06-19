self.addEventListener('install', function (event) {
  console.log('Worker installed successfully', event);
});

self.addEventListener('activate', function (event) {
  console.log('Worker activated successfully', event);
});


