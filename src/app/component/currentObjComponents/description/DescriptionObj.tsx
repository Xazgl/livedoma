import { ObjectIntrum } from "@prisma/client"
import size from "/public/svg/size.svg"
import plan from "/public/svg/plan.svg"
import floor from "/public/svg/floor.svg"
import PropertyInfo from "./PropertyInfo";

type Props = {
    object: ObjectIntrum
}

export function DescriptionObj({ object }: Props) {

    return <section className="flex flex-col w-full h-[auto] p-5">
        <div className="flex flex-col sm:flex-row gap-[60px] justify-center">
            <PropertyInfo icon={plan} label="Общая площадь" value={`${object.square ? Math.round(parseInt(object.square)) : ''} м²`} />
            <PropertyInfo icon={size} label="Высота потолков" value={object.ceilingHeight ? parseInt(object.ceilingHeight) : ''} />
            <PropertyInfo icon={floor} label="Этаж" value={`${object.floor ? Math.round(parseInt(object.floor)) : ''} из ${object.floors ? Math.round(parseInt(object.floors)) : ''}`} />
        </div>


        <div className="flex flex-col mt-[50px] w-full h-auto text-sm text-[#737a8e]">
            <span dangerouslySetInnerHTML={{ __html: object.description ? object.description : '' }}></span>
        </div>

    </section>
}