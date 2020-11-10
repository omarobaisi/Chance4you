function addDropDown(btnId, menuId, iconId) {
    var btn = document.getElementById(btnId);
    var menu = document.getElementById(menuId);
    menu.classList.add('op-0');

    btn.addEventListener("click", function() {
        if (!menu.classList.contains('d-none')) {
            setTimeout(function() {
                menu.classList.toggle("d-none");
            }, 300);
        } else {
            menu.classList.toggle("d-none");
        }
        setTimeout(function() {
            menu.classList.toggle('op-0');
        }, 1);
    });

    document.addEventListener("click", function(e) {
        if (e.target.id!=btnId && e.target.id!=iconId) {
            if (!menu.classList.contains("d-none")) {
                menu.classList.add('op-0');
                setTimeout(function() {
                    menu.classList.add("d-none");
                }, 300);
            }
        }
    });
}