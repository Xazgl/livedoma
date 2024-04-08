import Link from "next/link";
import Image from "next/image";
import { NavEl, logoArr } from "./navEl";
// import bg from "/public/images/big_img.jpg";

export function Header({}) {
  const style = `flex relative  text-white text-base 
    after:absolute after:width-[0%] after:h-[1.7px] after:bg-[#F15281] after:left-[50%] after:bottom-[-1px;] 
    after:hover:w-[100%]  after:hover:left-[0]  after:ease-in-out   after:duration-300   after:delay-0 
   `;

  return (
    <header
      className="hidden md:flex w-[100%] h-[60px] md:h-[80px] items-center  md:rounded-b-3xl px-[70px] py-[20px] bg-[#54529F] "
      // style={{ background: `url(${bg.src})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
    >
      <div className="flex flex-row md:justify-between md:[gap-4] w-[100%]   items-center  h-[80px] ">
        <div className="flex  gap-4  w-[50%] h-[30px] md:h-[60px] items-center ">
          {logoArr.map((el, index) => (
            <>
              <Image
                key={el.key}
                src={el.img}
                width={el.w}
                height={el.h}
                sizes="100vh"
                alt={el.img}
                className="flex"
              />
              {index !== logoArr.length - 1 && (
                <div className="flex w-[2px] h-[34px]  border-l-[2px] border-solid border-white border-opacity-20" />
              )}
            </>
          ))}
        </div>

        <nav className="flex h-[80px]   w-[50%]  items-center justify-start  ">
          <ul className="hidden lg:flex   sm:gap-6  md:gap-10  items-center  h-[20px] ">
            {NavEl.map((item, index) => (
              <Link key={index} href="/">
                <li key={index} className={style}>
                  {item.title}
                </li>
              </Link>
            ))}
          </ul>
          <div className="flex w-full   justify-end ">
            <a href="tel:+78442520505" className="flex w-[auto]">
              <button className="bg-[#F15281] rounded-lg h-[28px] px-[11px] py-[3px] text-white  text-[14px]">
                8 (8442) 52-05-05
              </button>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
