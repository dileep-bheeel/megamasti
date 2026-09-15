import { useEffect } from "react";

function setMeta(name,content,property=false) {
  const selector = property ? 'meta[property="' + name + '"]' : 'meta[name="' + name + '"]';
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(property ? "property" : "name",name);
    document.head.appendChild(element);
  }
  element.setAttribute("content",content);
}

export default function usePageMeta({ title, description, path = "/", robots = "index, follow", structuredData }) {
  useEffect(() => {
    const url = "https://megamasti.com" + path;
    document.title = title;
    setMeta("description",description);
    setMeta("robots",robots);
    setMeta("og:title",title,true);
    setMeta("og:description",description,true);
    setMeta("og:url",url,true);
    setMeta("og:site_name","MegaMasti",true);
    setMeta("og:image","https://megamasti.com/icon.svg",true);
    setMeta("og:image:alt","MegaMasti logo",true);
    setMeta("twitter:card","summary");
    setMeta("twitter:title",title);
    setMeta("twitter:description",description);
    setMeta("twitter:image","https://megamasti.com/icon.svg");
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
    const schema = document.getElementById("page-schema");
    if (schema) schema.textContent = structuredData ? JSON.stringify(structuredData) : "";
  },[title,description,path,robots,structuredData]);
}
