import "server-only";
import { cache } from "react";
import { createGitHubRepo } from "./github";
import { createLocalRepo } from "./local";

// Eine Instanz je Anfrage (der gelesene Stand bleibt innerhalb einer Anfrage gleich)
export const getRepo = cache(() => (process.env.CONTENT_BACKEND === "local" ? createLocalRepo() : createGitHubRepo()));
