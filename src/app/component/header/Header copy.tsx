import Link from "next/link";
import jd from "/public/images/logo/live.png";
import metrs from "/public/images/logo/metrs.png";
import part from "/public/images/logo/partner.png";
import Image from "next/image";
import { NavEl } from "./navEl";
import bg from "/public/images/big_img.jpg";

export function Header({}) {
  const style = `flex relative  text-white text-base font-semibold
    after:absolute after:width-[0%] after:h-[1.7px] after:bg-[#F15281] after:left-[50%] after:bottom-[-1px;] 
    after:hover:w-[100%]  after:hover:left-[0]  after:ease-in-out   after:duration-300   after:delay-0 
   `;

  return (
    <header
      className="flex  w-[100%] h-[80px] items-center  lg:rounded-b-lg px-[20px] py-[20px] bg-[#54529F]"
      // style={{ background: `url(${bg.src})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
    >
      <div className="flex justify-between  w-[full]  items-center  h-full  sm:ml-[0px]  md:ml-[50px]  lg:ml-[70px]">
        <Image
          src={jd .src}
          width="0"
          height="0"
          sizes="100vh"
          alt={jd.src}
          className="flex  w-[130px]  h-[60px]"
        />

        <Image
          src={metrs.src}
          width="0"
          height="0"
          sizes="100vh"
          alt={metrs.src}
          className="flex  w-[130px]  h-[60px]"
        />

        <Image
          src={part.src}
          width="0"
          height="0"
          sizes="100vh"
          alt={part.src}
          className="flex  w-[130px]  h-[60px]"
        />

        <nav className="flex  w-full   sm:ml-[10px]  md:ml-[50px]  lg:ml-[134px]  ">
          <ul className="hidden lg:flex  sm:gap-6  md:gap-10  items-center  h-[20px] ">
            {NavEl.map((item, index) => (
              <Link key={index} href="/">
                <li key={index} className={style}>
                  {item.title}
                </li>
              </Link>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex w-full justify-end ">
        <a href="tel:+78442520505" className="flex w-[auto]">
          <button className="bg-[#F15281] rounded h-[28px] px-[11px] py-[3px] text-white  text-[16px]">
            8 (8442) 52-05-05
          </button>
        </a>
      </div>
    </header>
  );
}
