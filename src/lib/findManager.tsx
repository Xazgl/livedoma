import axios from "axios";

export async function foundManager(id:string) {
    if (id !== '0' && id!== undefined && id!==null && id!=='2109' ) {
      const params = new URLSearchParams();
      params.append("apikey", "9a75fc323d968db797ec0ab848572aad");
      params.append("params[id][0]", id);
      
      try {
        const response = await axios.post('http://jivemdoma.intrumnet.com:81/sharedapi/worker/filter',
          params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
  
        return response.data.data[id].surname? response.data.data[id].surname : response.data.data[id].name
  
      } catch (error) {
        console.error(`Ошибка при выполнении запроса у ${id}:`, error);
        throw error;
      }
    }else {
      return "Нету";
    }
}
  