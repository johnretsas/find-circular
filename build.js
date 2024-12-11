import { build } from "esbuild";

build({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  outfile: "./dist/index.js",
  resolveExtensions: [".ts", ".tsx", ".js", ".json"], // Automatically resolve extensions
}).catch(() => process.exit(1));
