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

export default function usePageMeta({ title, description, path = "/" }) {
  useEffect(() => {
    document.title = title;
    setMeta("description",description);
    setMeta("og:title",title,true);
    setMeta("og:description",description,true);
    setMeta("og:url","https://megamasti.com" + path,true);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = "https://megamasti.com" + path;
  },[title,description,path]);
}
