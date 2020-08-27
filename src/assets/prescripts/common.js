
let event_objects = document.querySelectorAll('ul.event>li');
let rival_objects = document.querySelectorAll('.event_rivals');
let position = 0;

const classes = {
    'small_top': ["small", "small_top"],
    'middle_top': ["middle", "middle_top"],
    'active': ["active"],
    'middle_bottom': ["middle", "middle_bottom"],
    'small_bottom': ["middle", "small_bottom"],
    'none': ["none"]
}
// const classes = ['small  small_bottom', 'middle middle_bottom', 'active', 'middle middle_top', 'small small_top']
document.addEventListener('DOMContentLoaded', () => {
    for (let event of event_objects) {
        event.addEventListener('click', function () {
            change_positions(this.getAttribute('data-pos'))
            change_classes()
        });
    };

});

window.addEventListener('wheel', e => {
    if(position - e.deltaY < 0){
        change_positions(-1);
        change_classes()
    }
    else{
        change_positions(1);
        change_classes()
    }
});

let change_positions = function (selected) {
    if (parseInt(selected, 10) == 0)
        return;

    event_objects.forEach(obj => {
        obj.setAttribute('data-pos', (parseInt(obj.getAttribute('data-pos'), 10) - parseInt(selected, 10)))
    });

    rival_objects.forEach(obj => {
        obj.setAttribute('data-rival-pos', (parseInt(obj.getAttribute('data-rival-pos'), 10) - parseInt(selected, 10)))
    })
};

let change_classes = function () {
    event_objects.forEach(obj => {
        let num = parseInt(obj.getAttribute('data-pos'), 10);
        switch (num) {
            case 0:
                obj.className = '';
                obj.classList.toggle('active');
                break;
            case 1:
                obj.className = '';
                obj.classList.toggleMany(classes['middle_top']);
                break;
            case 2:
                obj.className = '';
                obj.classList.toggleMany(classes['small_top']);
                break;
            case -1:
                obj.className = '';
                obj.classList.toggleMany(classes['middle_bottom']);
                break;
            case -2:
                obj.className = '';
                obj.classList.toggleMany(classes['small_bottom']);
                break;
            default:
                obj.className = '';
                obj.classList.toggle('none');
                break;
        }
    });
    rival_objects.forEach(obj => {
        let num = parseInt(obj.getAttribute('data-rival-pos'), 10);
        switch (num) {
            case 0:
                obj.classList.add('show');
                break;
            case 1:
                obj.classList.remove('show');
                break;
            case 2:
                obj.classList.remove('show');
                break;
            case -1:
                obj.classList.remove('show');
                break;
            case -2:
                obj.classList.remove('show');
                break;
            default:
                obj.classList.remove('show');
                break;
        }
    });
};

DOMTokenList.prototype.toggleMany = function (classes) {
    for (var i = 0, length = classes.length; i < length; i++) {
        this.toggle(classes[i]);
    }
}

DOMTokenList.prototype.removeMany = function (classes) {
    for (var i = 0, length = classes.length; i < length; i++) {
        this.remove(classes[i]);
    }
}