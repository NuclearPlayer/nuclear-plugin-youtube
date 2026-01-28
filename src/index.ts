import type {
  NuclearPlugin,
  NuclearPluginAPI,
  StreamingProvider,
} from '@nuclearplayer/plugin-sdk';

const PROVIDER_ID = 'youtube';

const createProvider = (api: NuclearPluginAPI): StreamingProvider => ({
  id: PROVIDER_ID,
  kind: 'streaming',
  name: 'YouTube',

  searchForTrack: async (artist, title) => {
    const query = `${artist} ${title}`;
    const results = await api.Ytdlp.search(query);

    return results.map((result) => ({
      id: result.id,
      title: result.title,
      durationMs: result.duration ? result.duration * 1000 : undefined,
      thumbnail: result.thumbnail ?? undefined,
      failed: false,
      source: { provider: PROVIDER_ID, id: result.id },
    }));
  },

  getStreamUrl: async (candidateId) => {
    const info = await api.Ytdlp.getStream(candidateId);

    return {
      url: info.stream_url,
      protocol: 'https',
      durationMs: info.duration ? info.duration * 1000 : undefined,
      source: { provider: PROVIDER_ID, id: candidateId },
    };
  },
});

const plugin: NuclearPlugin = {
  onEnable(api: NuclearPluginAPI) {
    api.Providers.register(createProvider(api));
  },

  onDisable(api: NuclearPluginAPI) {
    api.Providers.unregister(PROVIDER_ID);
  },
};

export default plugin;
