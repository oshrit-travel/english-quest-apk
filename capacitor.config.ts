import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.osher.englishquest',
  appName: 'English Quest',
  webDir: 'dist',
  backgroundColor: '#17323d',
  server: { androidScheme: 'https' }, // stable origin → localStorage/IndexedDB progress persists between app updates
  android: { allowMixedContent: false },
};
export default config;
