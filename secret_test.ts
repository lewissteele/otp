import { assertEquals, assertRejects } from "@std/assert";
import { getDatabase } from "./secret.ts";
import { mockSession, restore, stub } from "@std/testing/mock";

Deno.test(async function usesHomeIfXDGIsNotSet() {
  const expected = "tmp/.config/otp/otp.db";
  const id = mockSession();
  const openKv = Deno.openKv;

  stub(Deno.env, "get", (key) => {
    if (key === "HOME") {
      return "tmp";
    }
  });

  stub(Deno, "openKv", (path) => {
    assertEquals(path, expected);
    return openKv(":memory:");
  });

  const db = await getDatabase();

  db.close();

  restore(id);
  await Deno.remove("tmp", { recursive: true });
});

Deno.test(function throwsIfEnvIsNotSet() {
  const envStub = stub(
    Deno.env,
    "get",
    () => undefined,
  );

  assertRejects(
    () => getDatabase(),
    Error,
    "$HOME or $XDG_CONFIG_HOME need to be set",
  );

  envStub.restore();
});
