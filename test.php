<?php
return (
    ($source == "База собственников" || $source == "Недозвоны" || $source == "Отказники" || $source == "Снято с продажи") && ($otv == 1697)
    &&
    (($id_metrs == null) or ($source_metrs !== "База собственников" || $source_metrs !== "Недозвоны" || $source_metrs !== "Отказники" || $source_metrs !== "Снято с продажи") && ($otv !== 2271))
);
?>