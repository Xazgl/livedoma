import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        console.log(req.url);

        const id = params.id;

        if (id && id.length) {
            const publicDir = path.join(__dirname.split(".next")[0], "public/images/objects", id);
            fs.readdir(publicDir, (error, files) => {
                if (error) {
                    return NextResponse.json(
                        "'Не получилось найти подходящий объект'",
                        { status: 404 }
                    );
                }
                // Возвращаем первый файл из списка
                const firstFile = files[0];
                if (firstFile) {
                    const filePath = path.join(publicDir, firstFile);
                    fs.readFile(filePath, (error, data) => {
                        if (error) {
                            return   NextResponse.json(
                                "'Не удалось прочитать файл'",
                                { status: 500 }
                            );
                        }
                        return NextResponse.json({ data },  { status: 200});
                    });
                } else {
                    return NextResponse.json(
                        "'Папка пуста'",
                        { status: 404 }
                    );
                }
            });
        } else {
            return NextResponse.json(
                "'Не получилось найти подходящий объект'",
                { status: 404 }
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            "'Не получилось найти подходящий объект'",
            { status: 500 }
        );
    }
}











// import { NextRequest, NextResponse } from "next/server";
// import fs from "fs"

// export  async function GET(req: NextRequest, { params }: { params: { id: string} }) {
//     try {
//         console.log(req.url);
        
//         const id = params.id; 

//         if (id  && id.length) {
// 			const publicDir = __dirname.split(".next")[0] + "public/images/objects/"+ id + '/'
		
// 			fs.readFile(publicDir + fileUrl, (error, data) => {
// 				if(error) {
// 					return new Response(
//                         "'Не получилось найти подходящий объект'",
//                         { status: 404}
//                     )
// 				}
//                 return NextResponse.json({ data }, {status: 404})
// 			})
// 		} else {
//             return new Response(
//                 "'Не получилось найти подходящий объект'",
//                 { status: 404}
//             )
// 		}
        
//         return NextResponse.json({ message: 'Error' }, {status: 404})
//     } catch (error) {
//         console.error(error);
//         return new Response(
//             "'Не получилось найти подходящий объект'",
//             { status: 500 }
//         )
//     }
// }