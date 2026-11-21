import {NextResponse} from "next/server"; import {auth} from "@/auth";
export async function GET(){const s=await auth();if(!s?.user)return NextResponse.json({success:false,error:"Unauthorized"},{status:401});return NextResponse.json({success:true,user:s.user});}
