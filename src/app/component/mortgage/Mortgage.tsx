"use client";

export function Mortgage({}) {
  return (
    <section className="flex flex-col w-full h-full">
      <h1 className="text-[60px] mt-[20px] text-[#cde0f4]">ИПОТЕКА</h1>

      <div className="flex w-[100%] h-[500px] gap-[10px]">

        <div className="flex flex-col w-[30%] h-[full] bg-[#54529fd9] text-[white] items-center justify-center p-[30px]">
          <h3 className=" flex w-full  items-center justify-center text-[30px]">
            ИПОТЕКА НА ВЫГОДНЫХ УСЛОВИЯХ
          </h3>
        </div>

        <div className="flex flex-col w-[30%] h-[500px] gap-[20px]">
          <div className="flex flex-col justify-center w-[100%] h-[250px] bg-[#55529f89] text-[white] p-[10px] ">
            <h3 className="flex w-full  text-[30px]">IT - ипотека </h3>
            <p>
              Оформить льготную ипотеку смогут сотрудники организаций из сферы
              информационных технологий
            </p>
            <span className="flex w-[full] h-[full] justify-end items-end text-[white] text-[40px] ">
              5%
            </span>
          </div>

          <div className="flex flex-col w-[100%] h-[250px] justify-center bg-[#55529f89] text-[white] p-[10px]">
            <h3 className="flex w-full  text-[30px]">Господдержка</h3>
            <p>
              Банк выдает займ на приобретение недвижимости под сниженный
              процент, а разницу между рыночной и льготной ставками банку
              выплачивает государство
            </p>
            <span className="flex w-[full] h-[full] justify-end items-end text-[white] text-[40px] "> 8%</span>
          </div>
        </div>

        <div className="flex flex-col w-[40%] h-[500px] bg-[#54529fd9] ">
        </div>
        
      </div>
    </section>
  );
}
