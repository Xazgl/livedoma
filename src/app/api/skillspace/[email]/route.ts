import { NextRequest, NextResponse } from "next/server";

export  async function GET(req: NextRequest, { params }: { params: { email: string } }) {
  if (req.method == "GET") {
    try{
        console.log(req.url);
        const email = params.email; 
      // Делаем что-то с полученным email
       console.log('Получен email:', email);
       return NextResponse.json({ email})

    } catch (error) {
      console.error(error);
      return new Response("'Запрос не может быть выполнен'", { status: 500 });
    }

  } else {
    return NextResponse.json("Only POST requests allowed", { status: 405 });
  }

}
