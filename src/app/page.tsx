import "server-only"
import { Header } from "./component/header/Header"
import { ParentFilterBlock } from "./component/main-block-filter/ParentFilterBlock";
import { ObjectIntrum } from "@prisma/client";

async function getObjects() {
  try {
      const res = await fetch(`http://${process.env.HOST}/api/objects/`);
      if (res.ok) {
          return res.json();
      } else {
          throw new Error(`Ошибка загрузки данных: ${res.status} ${res.statusText}`);
      }
  } catch (error) {
    
      console.error(error);
      return [];
  }
}




export default async function Home() {

  const objects: ObjectIntrum[] = await getObjects();
  objects
  console.log(objects)



  return (
    <>
      <Header />
      { objects && objects.length > 0 &&
        <ParentFilterBlock objects={objects} />
      }
    </>
  )
}

