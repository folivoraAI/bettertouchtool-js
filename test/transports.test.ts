import { describe, expect, it } from "vitest";
import { HttpTransport, InProcessTransport, UnixSocketTransport, normalizeParams } from "../src/index.js";

describe("normalizeParams", () => {
  it("stringifies objects, keeps scalars, drops nullish", () => {
    expect(normalizeParams({ a: 1, b: true, c: "x", d: { e: 1 }, f: undefined, g: null, h: [1, 2] })).toEqual({
      a: "1",
      b: "true",
      c: "x",
      d: '{"e":1}',
      h: "[1,2]",
    });
  });
});

describe("HttpTransport", () => {
  it("builds urls with shared secret and encoded json", () => {
    const t = new HttpTransport({ port: 1234, sharedSecret: "s3cret", fetch: (async () => new Response("")) as any });
    const url = t.buildUrl("trigger_action", { json: { BTTPredefinedActionType: 254 }, wait_for_reply: false });
    expect(url).toBe(
      "http://127.0.0.1:1234/trigger_action/?json=%7B%22BTTPredefinedActionType%22%3A254%7D&wait_for_reply=false&shared_secret=s3cret",
    );
  });

  it("performs GET and returns text; maps 403 to a helpful error", async () => {
    const seen: string[] = [];
    const fetchImpl = (async (url: string) => {
      seen.push(url);
      return new Response("hello", { status: 200 });
    }) as any;
    const t = new HttpTransport({ url: "http://localhost:9/", fetch: fetchImpl });
    expect(await t.call("trigger_named", { trigger_name: "a b" })).toBe("hello");
    expect(seen[0]).toBe("http://localhost:9/trigger_named/?trigger_name=a+b");
    const t403 = new HttpTransport({ url: "http://x", fetch: (async () => new Response("", { status: 403 })) as any });
    await expect(t403.call("x")).rejects.toThrow(/shared secret/);
  });
});

describe("UnixSocketTransport", () => {
  it("builds request lines", () => {
    const t = new UnixSocketTransport({ sharedSecret: "k" });
    expect(t.buildRequestLine("get_string_variable", { variable_name: "x y" })).toBe(
      "/get_string_variable/?variable_name=x+y&shared_secret=k\n",
    );
  });
});

describe("InProcessTransport", () => {
  it("uses global callBTT when present", async () => {
    const g = globalThis as any;
    g.callBTT = async (cmd: string, p: any) => `${cmd}:${JSON.stringify(p)}`;
    try {
      expect(InProcessTransport.isAvailable()).toBe(true);
      const t = new InProcessTransport();
      expect(await t.call("trigger_named", { trigger_name: "n" })).toBe('trigger_named:{"trigger_name":"n"}');
    } finally {
      delete g.callBTT;
    }
    expect(InProcessTransport.isAvailable()).toBe(false);
  });
});
