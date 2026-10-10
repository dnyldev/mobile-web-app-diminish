/**
 * The frontend's view of its Vite environment variables.
 *
 * Declared here, with the cable, rather than in `src/vite-env.d.ts`: adding or
 * removing `src/api/` is then a single, self-contained move. `vite/client`
 * already declares `ImportMetaEnv` globally, so this MERGES with it.
 */
interface ImportMetaEnv {
  /**
   * Base URL of the diminish backend, e.g. `http://localhost:3000`.
   *
   * Absent or empty ⇒ the app runs on its bundled demo catalogue. That is the
   * unplugged state, and it is the default.
   */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
