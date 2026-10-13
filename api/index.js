import server from "../ssr-build/server.js";

export default {
  async fetch(request) {
    return server.fetch(request);
  }
};
