import { assertRejects } from "@std/assert";
import { getDatabase } from "./secret.ts";
import { stub } from "@std/testing/mock";

Deno.test(function itThrowsIfEnvIsNotSet() {
  stub(
    Deno.env,
    "get",
    () => undefined,
  );

  assertRejects(
    () => getDatabase(),
    Error,
    "$HOME or $XDG_CONFIG_HOME need to be set",
  );
});
