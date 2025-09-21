import { ensureDir } from "@std/fs";
import { join } from "@std/path";

export async function getDatabase(): Promise<Deno.Kv> {
  let path: string | null = null;

  const config = Deno.env.get("XDG_CONFIG_HOME");
  const home = Deno.env.get("HOME");

  if (config) {
    path = join(config, "otp");
  } else if (home) {
    path = join(home, ".config/otp");
  }

  if (path === null) {
    throw new Error("$HOME or $XDG_CONFIG_HOME need to be set");
  }

  await ensureDir(path);

  return await Deno.openKv(join(path, "otp.db"));
}
