const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');

const dateFilter = () =>{
    if(startDate.value!=='' && endDate.value!==''){
        const returnUrl = window.location.protocol + '//' + location.host+`/?startDate=${startDate.value}&endDate=${endDate.value}`;
        window.location.href =  returnUrl;
    }else{
        alert('Lütfen tarih seçiniz.');
    }
}
(function ($) {
    "use strict";

})(jQuery);