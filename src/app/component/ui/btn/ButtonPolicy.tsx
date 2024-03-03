'use-client'

type Props = {
  props: string;
  color: string | undefined
}


export function Btn({ props , color}: Props) {


  return <button>{props}
    <style jsx>{` 
      .newsType {
         display: flex;
         align-items: center;
         justify-content: center;
         border-radius: 20px;
         padding: 4px 8px;
         background-color: #FF6B00;
         color: white;
         font-size: 10px;
         text-align: center;
      }
    `}</style>
  </button>
}