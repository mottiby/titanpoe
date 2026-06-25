import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// tsconfigPaths lets tests import app code via the "@/..." alias (from tsconfig).
export default defineConfig({
  plugins: [tsconfigPaths()],
});
