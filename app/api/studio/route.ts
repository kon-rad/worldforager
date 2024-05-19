import axios from "axios"
import { NextRequest, NextResponse } from "next/server"
import { getStudiosByUserId } from "@/lib/database/generated"

export const POST = async (req: NextRequest): Promise<Response> => {
  try {
    console.log("inside /api/images/user")

    const { userId } = await req.json()
    const resp = await getStudiosByUserId(userId)

    console.log("response: ", resp)

    return new Response(JSON.stringify(resp))
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
