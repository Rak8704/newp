"use client";
import { useEffect } from "react";
import { useFetchGamesListMutation } from "@/lib/features/gamesApiSlice";
import { useGames } from "@/lib/store.zustond";

export default function GamesLoader(){
  const [fetchGamesList,{data,isLoading,error}]=useFetchGamesListMutation();
  const {setLoading,setGames}=useGames(s=>s);
  useEffect(()=>{fetchGamesList({game_type:"all"})},[fetchGamesList]);
  useEffect(()=>{if(data){setGames(data.gamesList as any);setLoading(false)}else if(error){setGames({} as any);setLoading(false)}},[data,error,setGames,setLoading]);
  return null;
}
