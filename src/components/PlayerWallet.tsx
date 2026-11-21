"use client";
import {useState} from "react";
export default function PlayerWallet(){const[amount,setAmount]=useState(0);return <div><input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} placeholder="Enter amount"/><p className="text-sm mt-2">Wallet balance is managed by the local BDT wallet and GSC+ Single Wallet callbacks.</p></div>}
