function createIncDec(fieldId, plusId, minusId, priceId, limit) {
    var quanField = document.getElementById(fieldId);
    var priceField = document.getElementById(priceId);
    var price = priceField.innerText.replace('₪', '');
    $('#'+plusId).on('click', function() {
        var val = Number(quanField.value);
        if (limit&&val<99) {
            quanField.value = val+1;
        }
        if (!limit) {
            quanField.value = val+1;
        }
        priceField.innerText = calculatePrice(quanField.value, price)+'₪';
    });
    $('#'+minusId).on('click', function() {
        var val = Number(quanField.value);
        if (val>1) {
            quanField.value = val-=1;
        }
        priceField.innerText = calculatePrice(quanField.value, price)+'₪';
    });
    String.prototype.replaceAt = function(index, replacement) {
        return this.substr(0, index) + replacement + this.substr(index + replacement.length);
    }
    $(quanField).on("change input keydown keyup paste", function(){
        var val = Number(quanField.value);
        if (limit&&val>99) {
            quanField.value = 99;
        } else if (val<1) {
            quanField.value = 1;
        }
        if (!quanField.value.match('/^\d+$/')) {
            val = Number(quanField.value.replaceAll(/[^0-9]+/g, ''));
            quanField.value = val;
        }
        priceField.innerText = calculatePrice(quanField.value, price)+'₪';
    });
}
function calculatePrice(quan, price){
    return Math.round(Number(price)*Number(quan));
}

