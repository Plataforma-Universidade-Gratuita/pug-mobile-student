import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

function parseEnvFile(filePath) {
	const content = readFileSync(filePath, "utf8");
	const entries = {};

	for (const rawLine of content.split(/\r?\n/u)) {
		const line = rawLine.trim();
		if (!line || line.startsWith("#")) continue;

		const separatorIndex = line.indexOf("=");
		if (separatorIndex <= 0) continue;

		const key = line.slice(0, separatorIndex).trim();
		const value = line.slice(separatorIndex + 1).trim();
		entries[key] = value;
	}

	return entries;
}

const envPath = resolve(process.cwd(), "mock-api-tunnel.env");
const MAX_ATTEMPTS = 30;
const WAIT_MS = 1000;

function isReady(apiUrl) {
	return (
		Boolean(apiUrl) &&
		!apiUrl.includes("localhost") &&
		!apiUrl.includes("127.0.0.1")
	);
}

let apiUrl = "";

for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
	const envEntries = parseEnvFile(envPath);
	apiUrl = envEntries.EXPO_PUBLIC_API_URL ?? "";

	if (isReady(apiUrl)) {
		console.log(`[pug-mobile-student] using mock tunnel API: ${apiUrl}`);
		process.exit(0);
	}

	if (attempt === 0) {
		console.log(
			"[pug-mobile-student] waiting for pug-mocks to publish the tunnel URL...",
		);
	}

	await delay(WAIT_MS);
}

console.error(
	[
		"[pug-mobile-student] mock tunnel env is not ready.",
		`[pug-mobile-student] current EXPO_PUBLIC_API_URL=${apiUrl || "<empty>"}`,
		"[pug-mobile-student] start or check the mock tunnel first:",
		'cd "..\\pug-mocks" && npm run mock:dev:tunnel',
	].join("\n"),
);
process.exit(1);
