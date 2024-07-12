<?php

    $url='http://jivemdoma.intrumnet.com:81/sharedapi/worker/filter';  

    $params=array(  
        'id' => "$id_main",  
    );  
        
    $post = array(  
        'apikey' =>"fb0a25413fcb38ce0ee0686b600f3c64",  
        'params'=>$params  
    );  

            
    $ch = curl_init();  
    curl_setopt($ch, CURLOPT_URL, $url);  
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);  
    curl_setopt($ch, CURLOPT_POST, 1);  
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));  
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);  
    $response = curl_exec($ch);
    $res = json_decode($response, true);
    curl_close($ch);  

    $id_otdela = $res['data'][$id_main]["division_id"];

    $koef = $res['data']["$id_main"]["fields"]["3390"]["value"];

	$coop = $coop * 0.3;
    
    $povish = (($kom_pr - $sum_pr - $nalog_prod) + ($kom_pok - $sum_pok - $nalog_pok + $zav - $zalip)) * $koef;
    
	$otdel = $INTRUM_CONSTANT['spisok_ug'];
	$otdel = explode(",",$otdel);

	if($coop == null || $coop == ""){
        $coop = 0;
    }
	if($zalip == null || $zalip == ""){
        $zalip = 0;
    }
	if($zav == null || $zav == ""){
        $zav = 0;
    }
	if($kom_pok == null || $kom_pok == ""){
        $kom_pok = 0;
    }
    if($kom_pr == null || $kom_pr == ""){
        $kom_pr = 0;
    }
    if($sum_pok == null || $sum_pok == ""){
        $sum_pok = 0;
    }
    if($sum_pr == null || $sum_pr == ""){
        $sum_pr = 0;
    }
    if($nalog_pok == null || $nalog_pok == ""){
        $nalog_pok = 0;
    }
    if($nalog_prod == null || $nalog_prod == ""){
        $nalog_prod = 0;
    }


    $full_name = $surname . " ". $name;

	$komis = (($kom_pr - $sum_pr - $nalog_prod)  + ($kom_pok - $sum_pok - $nalog_pok + $zav - $zalip)) + $coop;

    $priemka_15 = (($kom_pr - $sum_pr - $nalog_prod) * 0.15);
    $priemka_12 = (($kom_pr - $sum_pr - $nalog_prod) * 0.12);  // Скорее всего нужно добавить   $priemka_12 = (($kom_pr - $sum_pr - $nalog_prod) * 0.11); Хотя тут и не видно прямой зависимости в этом месте от Наследство = ДА 


    $res_20 = ((($kom_pr - $sum_pr - $nalog_prod) * 0.2)  + (($kom_pok - $sum_pok - $nalog_pok + $zav - $zalip) * 0.3)) + $coop;
    $res_20_prinyal_prodal = ((($kom_pr - $sum_pr - $nalog_prod) + ($kom_pok - $sum_pok - $nalog_pok + $zav - $zalip)) * 0.3) + $coop;
    $res_20_net_priemki = ((($kom_pr - $sum_pr - $nalog_prod) + ($kom_pok - $sum_pok - $nalog_pok + $zav - $zalip)) * 0.3) + $coop;


    $res_28 = (($kom_pr - $sum_pr - $nalog_prod) * 0.28) + (($kom_pok - $sum_pok - $nalog_pok + $zav - $zalip) * 0.38) + $coop;
     /* Старый код 
       $res_25 = (($kom_pr - $sum_pr - $nalog_prod) * 0.25) + (($kom_pok - $sum_pok - $nalog_pok + $zav - $zalip) * 0.35) + $coop;
       $res_23 = (($kom_pr - $sum_pr - $nalog_prod) * 0.23) + (($kom_pok - $sum_pok - $nalog_pok + $zav - $zalip) * 0.35) + $coop;
     */

    // Новый код 28.02.24
    $res_25 = (($kom_pr - $sum_pr - $nalog_prod) * 0.25) + (($kom_pok - $sum_pok - $nalog_pok + $zav - $zalip) * 0.34) + $coop;
    $res_23 = (($kom_pr - $sum_pr - $nalog_prod) * 0.23) + (($kom_pok - $sum_pok - $nalog_pok + $zav - $zalip) * 0.34) + $coop;

    
    ///// принял и продал 
    $res_28_pr = (((($kom_pr - $sum_pr - $nalog_prod) + ($kom_pok - $sum_pok - $nalog_pok)) + $zav - $zalip) * 0.39) + $coop; // 04 наверное 28 +12 , а должно быть наверное 28+11 = 0.39 ?
    $res_25_pr = (((($kom_pr - $sum_pr - $nalog_prod) + ($kom_pok - $sum_pok - $nalog_pok)) + $zav - $zalip) * 0.36) + $coop; //25+11 = 0.36
    $res_23_pr = (((($kom_pr - $sum_pr - $nalog_prod) + ($kom_pok - $sum_pok - $nalog_pok)) + $zav - $zalip) * 0.34) + $coop; // 0.34
    // Новый код   Скорее всего нужна заменить 35 на 34, т.к. 35 это 0.35 = 12 % за приемку из за наследства и 23% заявка с колл-центр. А будет 11 и соответственно 0.34 
	$res_28_pr_15 = (((($kom_pr - $sum_pr - $nalog_prod) + ($kom_pok - $sum_pok - $nalog_pok)) + $zav - $zalip) * 0.43) + $coop;
    $res_25_pr_15 = (((($kom_pr - $sum_pr - $nalog_prod) + ($kom_pok - $sum_pok - $nalog_pok)) + $zav - $zalip) * 0.4) + $coop;
    $res_23_pr_15 = (((($kom_pr - $sum_pr - $nalog_prod) + ($kom_pok - $sum_pok - $nalog_pok)) + $zav - $zalip) * 0.38) + $coop;

    
    /// нет приемщика 
	$res_robot_40 = ((($kom_pr - $sum_pr - $nalog_prod)  + ($kom_pok - $sum_pok - $nalog_pok + $zav - $zalip)) * 0.40) + $coop; //добавил новое на 40% 28.02.24
	$res_robot_43 = ((($kom_pr - $sum_pr - $nalog_prod)  + ($kom_pok - $sum_pok - $nalog_pok + $zav - $zalip)) * 0.43) + $coop;
    $res_robot_38 = ((($kom_pr - $sum_pr - $nalog_prod)  + ($kom_pok - $sum_pok - $nalog_pok + $zav - $zalip)) * 0.38) + $coop;
    $res_robot_35 = ((($kom_pr - $sum_pr - $nalog_prod)  + ($kom_pok - $sum_pok - $nalog_pok + $zav - $zalip)) * 0.35) + $coop; //04.05.24 исправил 0.35 на 0.34//13.06.24 Юра почему ты тут поставил 0.34??(вернул 0.35 Артем)



//if($id_otdela == 28 || $id_otdela == 30 || $id_otdela == 29 || $id_otdela == 33 || $id_otdela == 58 || $id_otdela == 42 || $id_otdela == 32 || $id_otdela == 39 || $id_otdela == 61 || $id_otdela == 48 || $id_otdela == 56 || $id_otdela == 68 || $id_otdela == 71 || $id_otdela == 73 || $id_otdela == 66 || $id_otdela == 76 || $id_otdela == 84)
    if(in_array($id_otdela, $otdel)) {
        if($full_name == $priem) {
            return $res1 = $res_20_prinyal_prodal + $povish;
        }
        else if ($priem == "Робот Аналитик") {
            return $res2 = $res_20_net_priemki + $povish;
        }
        else {
            return $res3 = $res_20 + $povish;
        }
    }
    else {
        if($pokaz == "ОП" && $full_name != $priem && $priem != 'Робот Аналитик'){
            return $res4 = $res_28 + $povish;
        }
    
        if($pokaz == "См. комментарий" && $full_name != $priem && $priem != 'Робот Аналитик'){
            return $res5 = $res_25 + $povish;
        }
    
        if($format == "контакт" && $pokaz != "См. комментарий" && $pokaz != "ОП" && $full_name != $priem && $priem != 'Робот Аналитик'){
            return $res6 = $res_25 + $povish;
        }
    
        if( $pokaz != "См. комментарий" && $pokaz != "ОП" && $full_name != $priem && $priem != 'Робот Аналитик' && ($format == "звонок" || $format == "подбор" )){
            return $res7 = $res_23 + $povish;
        }
    
        /////
    
        if( $pokaz == "ОП" && $full_name == $priem){
            if($nasled != '1' && ($peredal_object == "" || $peredal_object == null)) {
                
                return $res8 = $res_28_pr_15 + $povish;
            }
            else {
                
                return $res9 = $res_28_pr + $povish;
            }
        }
    
        if( $pokaz == "См. комментарий" && $full_name == $priem){
            if($nasled != '1' && ($peredal_object == "" || $peredal_object == null)) {
                 return $res10 = $res_25_pr_15 + $povish;
            }
            else {
                 return $res11 = $res_25_pr + $povish;
            }
        }
    
        if( $format == "контакт" && $pokaz != "См. комментарий" && $pokaz != "ОП" && $full_name == $priem){
            if($nasled != '1' && ($peredal_object == "" || $peredal_object == null)) {
                 return $res12 = $res_25_pr_15 + $povish;
            }
            else {
                 return $res13 = $res_25_pr + $povish;
            }
        }
    
        if( $pokaz != "См. комментарий" && $pokaz != "ОП" && $full_name == $priem && ($format == "звонок" || $format == "подбор" )){
            if($nasled != '1' && ($peredal_object == "" || $peredal_object == null)) {
                 return $res14 = $res_23_pr_15 + $povish;
            }
            else {
                return $res15 = $res_23_pr + $povish;
            }
        }

    
    //// НЕТ приемщика 

		if($pokaz == "ОП" && $priem == "Робот Аналитик" && $komis >= 80000 && $obj_vnesh == 1 && $kanal_prod == 'рекомендация'){
    		return $res19 = $res_robot_43 + $povish;
		}


// Новый код по сценарию Ефремова 28.02.24 

//1)Если  комиссия  от 80 000  ($komis) и $price >= 2 000 000 то 40 или 43%. 40 если  Канал продаж = подбор, 43% если Канал продаж = рекомендация
if ($pokaz == "ОП" && $priem == "Робот Аналитик" && $price >= 2000000 && $price < 3000000   && $obj_vnesh == 1 &&  $komis >= 80000 &&  $house_type == "квартира" || $house_type == "Дома; дачи") {
    if($kanal_prod == 'рекомендация') {
            return  $res_robot_43 + $povish;
    } else {
        return  $res_robot_40 + $povish;
    }
}

//2)Если  комиссия  от 90 000  ($komis) и $price >=  3 000 000 то 40 или 43%. 40 если  Канал продаж = подбор, еслми Канал продаж  = рекомендация то 43%, иначе 40%.
if ($pokaz == "ОП" && $priem == "Робот Аналитик" && $price >= 3000000 && $price < 4000000 &&  $obj_vnesh == 1 &&  $komis >= 90000 &&  $house_type == "квартира" || $house_type == "Дома; дачи") {
    if($kanal_prod == 'рекомендация') {
            return  $res_robot_43 + $povish;
    } else {
        return  $res_robot_40 + $povish;
    }
}

//3)Если  комиссия  от 100 000  ($komis) и $price >=  4 000 000 то 40 или 43%. 40 если  Канал продаж = подбор, если Канал продаж  = рекомендация  то 43%, иначе 40%.
if ($pokaz == "ОП" && $priem == "Робот Аналитик" && $price >= 4000000 && $price < 5000000 &&  $obj_vnesh == 1 &&  $komis >= 100000 &&  $house_type == "квартира" || $house_type == "Дома; дачи") {
    if($kanal_prod == 'рекомендация') {
            return  $res_robot_43 + $povish;
    } else {
        return  $res_robot_40 + $povish;
    }
}
//4)Если  комиссия  от 110 000  ($komis) и $price >=  5 000 000 то 40 или 43%. 40 если  Канал продаж = подбор, если Канал продаж  = рекомендация  то 43%, иначе 40%.
if ($pokaz == "ОП" && $priem == "Робот Аналитик" && $price >= 5000000 &&  $obj_vnesh == 1 &&  $komis >= 110000 &&  $house_type == "квартира" || $house_type == "Дома; дачи") {
    if($kanal_prod == 'рекомендация') {
            return  $res_robot_43 + $povish;
    } else {
        return  $res_robot_40 + $povish;
    }
}

//5)Если  комиссия  от 2.5% от цены price и $price >=  5 000 000 то 40 или 43%. 40 если  Канал продаж = подбор, если Канал продаж  = рекомендация  то 43%, иначе 40%.
if ($pokaz == "ОП" && $priem == "Робот Аналитик" && $price >= 5000000 &&  $obj_vnesh == 1 && $komis >= ($price * 0.025) &&  $house_type == "квартира" || $house_type == "Дома; дачи") {
    if($kanal_prod == 'рекомендация') {
            return  $res_robot_43 + $povish;
    } else {
        return  $res_robot_40 + $povish;
    }
}
//6)Если  комиссия ниже 80 000  (это  $komis) от цены price и $price >=  2 000 000 то  35 или 38%. 35 если  Канал продаж = подбор, если Канал продаж  = рекомендация  то 38%, иначе 35%.
if ($pokaz == "ОП" && $priem == "Робот Аналитик" && $price >= 2000000 && $price < 3000000 &&  $obj_vnesh == 1 && $komis <= 80000 &&  $house_type == "квартира" || $house_type == "Дома; дачи") {
    if($kanal_prod == 'рекомендация') {
        return $res_robot_38 + $povish;
    } else {
        return   $res_robot_35 + $povish;
    }
}

//7)Если  комиссия ниже 90 000  (это  $komis) от цены price и $price >=  3 000 000 то  35 или 38%. 35 если  Канал продаж = подбор, если Канал продаж  = рекомендация  то 38%, иначе 35%.
if ($pokaz == "ОП" && $priem == "Робот Аналитик" && $price >= 3000000 && $price < 4000000 &&  $obj_vnesh == 1 && $komis <= 90000 &&  $house_type == "квартира" || $house_type == "Дома; дачи") {
    if($kanal_prod == 'рекомендация') {
        return $res_robot_38 + $povish;
    } else {
        return   $res_robot_35 + $povish;
    }
}

//8)Если  комиссия ниже 100 000  (это  $komis) от цены price и $price >=  3 000 000 то  35 или 38%. 35 если  Канал продаж = подбор, если Канал продаж  = рекомендация  то 38%, иначе 35%.
if ($pokaz == "ОП" && $priem == "Робот Аналитик" && $price >= 3000000 && $price < 4000000 &&  $obj_vnesh == 1 && $komis <= 100000 &&  $house_type == "квартира" || $house_type == "Дома; дачи") {
    if($kanal_prod == 'рекомендация') {
        return $res_robot_38 + $povish;
    } else {
        return   $res_robot_35 + $povish;
    }
}

//9)Если  комиссия ниже 110 000  (это  $komis) от цены price и $price >=  4 000 000 то  35 или 38%. 35 если  Канал продаж = подбор, если Канал продаж  = рекомендация  то 38%, иначе 35%.
if ($pokaz == "ОП" && $priem == "Робот Аналитик" && $price >= 4000000 && $price < 5000000 &&  $obj_vnesh == 1 && $komis <= 110000 &&  $house_type == "квартира" || $house_type == "Дома; дачи") {
    if($kanal_prod == 'рекомендация') {
        return $res_robot_38 + $povish;
    } else {
        return   $res_robot_35 + $povish;
    }
}

//10)Если  комиссия ниже 2.5% от price  (это  $komis) от цены price и $price >=  5 000 000 то  35 или 38%. 35 если  Канал продаж = подбор, если Канал продаж  = рекомендация  то 38%, иначе 35%.
if ($pokaz == "ОП" && $priem == "Робот Аналитик" && $price >= 5000000  &&  $obj_vnesh == 1 && $komis < ($price * 0.025)&&  $house_type == "квартира" || $house_type == "Дома; дачи") {
    if($kanal_prod == 'рекомендация') {
        return $res_robot_38 + $povish;
    } else {
        return   $res_robot_35 + $povish;
    }
}

//11)Если  комиссия  от 60 000  ($komis) и $price <  1 000 000 то 40 или 43%. 40 если  Канал продаж = подбор, еслии Канал продаж  = рекомендация то 43%, иначе 40%.
if ($pokaz == "ОП" && $priem == "Робот Аналитик" &&  $price < 1000000 &&  $obj_vnesh == 1 &&  $komis >= 60000 &&  $house_type == "комната") {
    if($kanal_prod == 'рекомендация') {
            return  $res_robot_43 + $povish;
    } else {
        return  $res_robot_40 + $povish;
    }
}

//12)Если  комиссия до 60000  (это  $komis)  и $price < 1 000 000 то  35 или 38%. 35 если  Канал продаж = подбор, если Канал продаж  = рекомендация  то 38%, иначе 35%.
if ($pokaz == "ОП" && $priem == "Робот Аналитик" && $price < 1000000  &&  $obj_vnesh == 1 && $komis < 60000 &&  $house_type == "комната") {
    if($kanal_prod == 'рекомендация') {
        return $res_robot_38 + $povish;
    } else {
        return   $res_robot_35 + $povish;
    }
}
//конец нового кода 
        if($pokaz == "ОП" && $priem == "Робот Аналитик"){
            return $res16 = $res_robot_38 + $povish;
        }
        if($pokaz == "См. комментарий" && $priem == "Робот Аналитик"){
            return $res17 = $res_robot_35 + $povish;
        }
        if($pokaz != "ОП" && $pokaz != "См. комментарий" && $format == "контакт" && $priem == "Робот Аналитик"){
            return $res18 = $res_robot_35 + $povish;
        }
        if($pokaz != "ОП" && $pokaz != "См. комментарий" && $format == "звонок" && $priem == "Робот Аналитик"){
            return $res19 = $res_robot_35 + $povish;
        }
    }

?>