import { defineMiddleware } from "astro:middleware";
import { STORYBLOK_SPACE_ID } from "astro:env/server";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, redirect } = context;

  /* EXPOSE CMS ROUTE ONLY FOR THE CMS */
  if (url.pathname.startsWith("/cms")) {
    const sbSpaceId = url.searchParams.get("_storyblok_tk[space_id]");

    if(!STORYBLOK_SPACE_ID) {
      console.error("Missing STORYBLOK_SPACE_ID in .env")
      return redirect("/404");

    }

    /* block /cms endpoint from visits other than storyblok */
    if (!import.meta.env.DEV && sbSpaceId !== STORYBLOK_SPACE_ID.toString()) {
      return redirect("/404");
    }

    /* if (request["method"] === "POST") {
      // TODO: try to get the real time preview active in storyblok
      
      const requestBody = await request.json();
      if (requestBody && requestBody["is_storyblok_preview"]) {
        locals["_storyblok_preview_data"] = requestBody;
      }
    } */
  }

  return await next();
});
