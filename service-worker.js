const cache_version = "v0.#{BUILD_VERSION}#";

self.addEventListener("activate", (event) => {
  // Delete all caches that is NOT `cache_version`.
  const cacheKeepSet = new Set([cache_version]);
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheKeepSet.has(cacheName)) {
            console.log(`Deleting outdated cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

const putInCache = async (request, response) => {
  const cache = await caches.open(cache_version);
  await cache.put(request, response);
};

const cacheFirst = async (request) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.open(cache_version).then((cache) =>
    cache.match(request));
  if (responseFromCache) {
    console.log(`Found response in cache: ${request.url}`);
    return responseFromCache;
  }

  // Next try to get the resource from the network
  console.log(`Try to fetch from network: ${request.url}`);
  try {
    let headers = new Headers();
    headers.set("Cache-Control", "no-cache, max-age=0");
    const responseFromNetwork = await fetch(request, {
      headers: headers,
    });
    // Response can be used only once, so we need to clone it
    // No need to wait for response being put into cache
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    console.error(`Failed to fetch: ${error}`)
    throw error;
  }
};

self.addEventListener("fetch", (event) => {
  console.log("Handling fetch event for", event.request.url);
  let origin = event.request.headers.has("origin") ?
    event.request.headers.get("origin") : event.request.referrer;

  if (origin) {
    let originDomain = (new URL(origin)).hostname;
    let requestDomain = (new URL(event.request.url)).hostname;
    // We only care files in the same origin
    if (originDomain !== requestDomain) {
      console.log(`Ignore cross-origin event: ${requestDomain} ${originDomain}`);
      return;
    }
  }

  event.respondWith(cacheFirst(event.request));
});
