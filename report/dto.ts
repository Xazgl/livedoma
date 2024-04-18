interface Field {
    id: string;
    datatype: string;
    value: string;
  }
  
  interface Sale {
    id: string;
    customers_id: string;
    employee_id: string;
    date_create: string;
    comment: string;
    sale_name: string;
    sale_type_id: string;
    sale_stage_id: string;
    publish: string;
    sale_activity_type: string;
    sale_activity_date: string;
    sale_creator_id: string;
    additional_employee_id: string[];
    fields: { [key: string]: Field };
  }
  
  interface Data {
    list: Sale[];
  }
  
  export interface ApiResponse {
    status: string;
    data: Data;
  }
  