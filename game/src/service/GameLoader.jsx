import React from "react";
import api from "../config/api";

export const gameLoader = async ({ request }) => {
  const url = new URL(request.url);

  const search = url.searchParams.get("search") || "";
  const params = {};

  if (search) params.search = search;

  const res = await api.get("/games", { params });

  return res;
};

export const gameDetails = async ({ params }) => {
  const res = await api.get(`/games/${params.id}`);

  return res;
};
