import {NextResponse} from "next/server";
export async function GET(){return NextResponse.json({success:true,message:"GameXA sync is disabled. Player IDs are local only.",users:[]});}
export async function POST(){return NextResponse.json({success:true,message:"GameXA sync is disabled. No changes made.",results:[]});}
