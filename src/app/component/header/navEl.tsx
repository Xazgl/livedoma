import jd from "/public/images/logo/live.png";
import metrs from "/public/images/logo/metrs.png";
import part from "/public/images/logo/partner.png";

export const NavEl = [
  // {
  //   title: "Преимущества",
  //   src:'/'
  // },
  // {
  //   title: "",
  //   src:'/mortgage'
  // },
  {
    title: "",
    src:'/'
  },
];

type logo = {
  key: string;
  img: string;
  w: number;
  h: number;
};

export const logoArr: logo[] = [
  {
    key: "1",
    img: jd.src,
    w: 95,
    h: 40,
  },
  {
    key: "2",
    img: part.src,
    w: 95,
    h: 40,
  },
  {
    key: "3",
    img: metrs.src,
    w: 60,
    h: 30,
  },
];
