self.addEventListener("install", event => {
  console.log("Service Worker installed ✅");
});

self.addEventListener("fetch", event => {
  // you can cache requests here later
});
