
let event_objects = document.querySelectorAll('ul.event>li');
let rival_objects = document.querySelectorAll('.event_rivals');
let position = 0;
const COUNT_OF_ELEMENTS = event_objects.length - 1;
let curr_position = 0; // parseInt((COUNT_OF_ELEMENTS / 2), 10);

const classes = {
    'small_top': ["small", "small_top"],
    'middle_top': ["middle", "middle_top"],
    'active': ["active"],
    'middle_bottom': ["middle", "middle_bottom"],
    'small_bottom': ["small", "small_bottom"],
    'none': ["none"]
}
// const classes = ['small  small_bottom', 'middle middle_bottom', 'active', 'middle middle_top', 'small small_top']
document.addEventListener('DOMContentLoaded', () => {
    for (let event of event_objects) {
        event.addEventListener('click', function (e) {
            change_positions(this.getAttribute('data-pos'), true, e.currentTarget)
            change_classes()
        });
    };

});

window.addEventListener('wheel', e => {
    if (position - e.deltaY < 0 && curr_position > -(COUNT_OF_ELEMENTS / 2) ) {
        curr_position--;
        change_positions(-1);
        change_classes()
    }
    else if  (position - e.deltaY > 0 && curr_position < (COUNT_OF_ELEMENTS / 2) ) {
        curr_position++;
        change_positions(1);
        change_classes()
    }
});

let change_positions = function (selected, isIterable = false, currentTarget = null) {
    if (parseInt(selected, 10) == 0)
        return;

    if (isIterable) {
        curr_position = parseInt(currentTarget.getAttribute('data-current-pos'), 10);
    }

    event_objects.forEach(obj => {
        obj.setAttribute('data-pos', (parseInt(obj.getAttribute('data-pos'), 10) - parseInt(selected, 10)))
    });

    rival_objects.forEach(obj => {
        obj.setAttribute('data-rival-pos', (parseInt(obj.getAttribute('data-rival-pos'), 10) - parseInt(selected, 10)))
    })
};

let is_last = function () {
    event_objects.forEach(obj => {
        if (Math.abs(parseInt(obj.getAttribute('data-pos'), 10)) == event_objects.length - 1) {
            // alert('last')
            return true;
        }
    });
    return false;
};

let change_classes = function () {
    event_objects.forEach(obj => {
        let num = parseInt(obj.getAttribute('data-pos'), 10);
        switch (num) {
            case 0:
                obj.className = '';
                obj.classList.toggle('active');
                return;
            case 1:
                obj.className = '';
                obj.classList.toggleMany(classes['middle_top']);
                return;
            case 2:
                obj.className = '';
                obj.classList.toggleMany(classes['small_top']);
                return;
            case -1:
                obj.className = '';
                obj.classList.toggleMany(classes['middle_bottom']);
                return;
            case -2:
                obj.className = '';
                obj.classList.toggleMany(classes['small_bottom']);
                return;
            default:
                // obj.className = '';
                obj.classList.add('none');
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