AOS.init();
// var count = Number($('.cart-right').attr('data-itemsCount'));
// var currentItems = [];
// for (var i=1; i<=count; i++) {
//     currentItems[i] = true;
//     createIncDec('quan'+i, 'quanAdd'+i, 'quanMin'+i, 'price'+i, true);
//     initDelBtn("item"+i, "del"+i);
//     applyCostChange('quanMin'+i);
//     applyCostChange('quanAdd'+i);
//     applyCostChange('quan'+i);
// }
// window.onload = calculateTotal;

// function applyCostChange(recId) {
//     $('#'+recId).on('click keyup past change', function() {
//         calculateTotal();
//     });
// }

// function initDelBtn(itemId, delId) {
//     $("#"+delId).click(function() {
//         $("#"+itemId).fadeOut( "slow", function() {
//             currentItems[itemId.charAt(4)] = false;
//             calculateTotal();
//         });
//     }); 
// }

// $('.fas fa-minus').on('click', function() {
//     window.location.href = "/shop/reduce/"+$('this').attr('data-link');
// });

// function calculateTotal() {
//     var total = 0;
//     var priceId = "price";
//     var empty = true;
//     for (var i=1; i<=count; i++) {
//         if (currentItems[i]){
//             var tempP = $('#'+priceId+i).text().replace('₪', '');
//             total+=Number(tempP);
//             empty = false;
//         }
//     }
//     $('#prodCost').text(Math.round(total)+"₪");
//     var totalPlusShipping = total+Math.round(Number($('#shippingCost').text().replace('₪', '')));
//     $('#totalCost').text(""+totalPlusShipping+'₪');
//     if (empty) {
//         $('#cartEmpty').css('display', 'flex');
//         $('#contBtn').attr('disabled', true);
//     }
// }