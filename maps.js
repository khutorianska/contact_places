var center = {
    x: 48.846480,
    y: 19.91960
};
var map;
var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var mapsParams = {};

var infowindow = new google.maps.InfoWindow({
    content: ""
});

function setParams() {
    w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (w >= 980) {
        mapsParams.minZoom = 7;
        mapsParams.maxZoom = 16;
        mapsParams.corelation = {
            x: 0,
            y: -0.0015
        };
        mapsParams.info = false;
    } else if (w > 420 && w <= 979) {
        mapsParams.minZoom = 6;
        mapsParams.maxZoom = 14;
        mapsParams.corelation = {
            x: 0,
            y: -0.0015
        };
        mapsParams.info = false;
    } else {
        mapsParams.minZoom = 6;
        mapsParams.maxZoom = 14;
        mapsParams.corelation = {
            x: 0,
            y: -0.0015
        };
        mapsParams.info = false;
    }
};
$(function () {
    setParams();
    $(window).resize(function () {
        setParams();
    });
});

var markerSize = {
    x: 48,
    y: 66
};
var timeLap = 150;
var locations = [
    ['Bánovce nad Bebravou', 48.7203421, 18.2552896, 0, 'A. Kmeťa, 500/18'],
    ['Banská Bystrica', 48.7366135, 19.154425, 1, 'ČSA 18', "ZUNO+BANK+AG+-+Banská+Bystrica"],
    ['Banská Bystrica', 48.7327218, 19.1373062, 2, ' Janka Kráľa 4/A'],
    ['Bratislava', 48.1521748, 17.1578667, 3, 'Nevädzova 6'],
    ['Brezno', 48.8066679, 19.641639, 4, 'ČSA 7', "ZUNO+BANK+AG+-+Brezno"],
    ['Humenné', 48.9307432, 21.9131522, 5, 'Námestie slobody 1735', "ZUNO+BANK+AG+-+Humenné"],
    ['Liptovský Mikuláš', 49.0849911, 19.61361, 6, 'M.Pišúta 1'],
    ['Levice', 48.2176461, 18.6065959, 7, 'Československej armády 29'],
    ['Malacky', 48.4369575, 17.020468, 8, 'Zámocká 65/1'],
    ['Martin', 49.0620985, 18.9142563, 9, 'Bernolákova 681'],
    ['Michalovce ', 48.7577095, 21.9172566, 10, 'Gorkého 7'],
    ['Nitra', 48.31087, 18.0859032, 11, '', " ZUNO+BANK+AG+-+Nitra"],
    ['Partizánske', 48.6269432, 18.3753026, 12, 'Hrnčíriková 227', "ZUNO+BANK+AG+-+Partizánske"],
    ['Piešťany', 48.590822, 17.835137, 13, '', "ZUNO+BANK+AG+-+Peišťany"],
    ['Prievidza', 48.771244, 18.620752, 14, '2704-/3G,Gustáva Švéniho 1', "ZUNO+BANK+AG+-+Prievidza"],
    ['Prešov', 49.0005803, 21.2357803, 15, 'Levočská 11', "ZUNO+BANK+AG+-+Prešov"],
    ['Považská Bystrica', 49.11570, 18.44490, 16, 'Centrum 8, M PARK- nákupné centrum'],
    ['Púchov', 49.1222801, 18.3263705, 17, 'Moravská ulica 680']
];

var cities = {
    'banskabystrica': {
        lat: 48.7346135,
        lng: 19.1473062
    }
};

var markers = [];

var selected;

var url = document.location.pathname;

google.maps.Marker.prototype.setLabel = function (label) {
    if (this.label) {
        this.label.text = label;
    } else {
        this.label = new MarkerLabel({
            map: this.map,
            marker: this,
            text: label
        });
        this.label.bindTo('position', this, 'position');
    }
};

var MarkerLabel = function (options) {
    this.setValues(options);
    this.span = document.createElement('span');
    this.span.className = 'map-marker-label';
};

MarkerLabel.prototype = jQuery.extend(new google.maps.OverlayView(), {
    onAdd: function () {
        this.getPanes().overlayImage.appendChild(this.span);
        var self = this;
        this.listeners = [
            google.maps.event.addListener(this, 'position_changed', function () {
                self.draw();
            })
        ];
    },
    draw: function () {
        var text = String(this.get('text'));
        var position = this.getProjection().fromLatLngToDivPixel(this.get('position'));
        this.span.innerHTML = text;
        this.span.style.left = (position.x - (markerSize.x / 2)) - (text.length * 3) + 20 + 'px';
        this.span.style.top = (position.y - markerSize.y + 55) + 'px';
    }
});

function initialize() {
    var mapOptions = {
        zoom: mapsParams.minZoom + 1,
        zoomControl: true,
        streetViewControl: true,
        rotateControl: true,
        scaleControl: true,
        panControl: true,
        scrollwheel: false,
        mapTypeControl: false,

        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        streetViewControlOptions: {
            style: google.maps.MapTypeControlStyle.DEFAULT,
            position: google.maps.ControlPosition.LEFT_CENTER
        },

        center: new google.maps.LatLng(center.x, center.y)
    };

    if (isMobile()) {
        mapOptions.streetViewControl = false;
        mapOptions.zoomControl = false;
        $('.custom_controls.zoomin').show();
        $('.custom_controls.zoomout').show();

    } else {
        $('.custom_controls').hide();
    }

    map = new google.maps.Map(
        document.getElementById('map-canvas'),
        mapOptions
    );
    map.getStreetView().setOptions({
        addressControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_CENTER
        }
    });
    var stylez = [{
        featureType: "all",
        elementType: "geometry",
        stylers: [{
            saturation: -100
        }]
    }, {
        featureType: "administrative.country",
        elementType: "geometry",
        stylers: [{
            color: "#276db3"
        }]
    }, {
        featureType: "administrative.locality",
        elementType: "labels.text",
        stylers: [{
            "visibility": "on"
        }]
    }, {
        featureType: "road.arterial",
        elementType: "labels.icon",
        stylers: [{
            "visibility": "on"
        }, {
            "saturation": -90
        }]
    }, {
        featureType: "poi.attraction",
        elementType: "labels.text.fill",
        stylers: [{
            "visibility": "off"
        }]
    }, {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{
            "visibility": "off"
        }]
    }, {
        featureType: "road.highway",
        elementType: "labels.icon",
        stylers: [{
            "saturation": -76
        }]
    }, {
        featureType: "poi",
        elementType: "labels.text.stroke",
        stylers: [{
            "visibility": "off"
        }]
    }];

    var mapType = new google.maps.StyledMapType(stylez, {
        name: "Grayscale"
    });
    map.mapTypes.set('tehgrayz', mapType);
    map.setMapTypeId('tehgrayz');

    google.maps.event.addListener(map, 'zoom_changed', function () {
        if (markers[selected] !== undefined) {
            var zoomLevel = map.getZoom();
            if (zoomLevel < 13) {
                if (infowindow !== undefined) {
                    infowindow.close();
                }
            } else {
                markers[selected].setLabel(locations[selected][4]);
            }
        }

    });
    for (var i = 0; i < locations.length; i++) {
        createMarker(map, i);
    }

    if (isMobile()) {
        $(function () {
            $(document).on('click', '.custom_controls', function (e) {
                if ($(e.target).hasClass('zoomin')) {
                    map.setZoom(map.getZoom() + 1);
                }
                if ($(e.target).hasClass('zoomout')) {
                    map.setZoom(Math.max(0, map.getZoom() - 1));
                }

            })
        });
    }

}

function createMarker(map, index) {
    var location = locations[index];
    var image = {
        url: 'https://www.zuno.sk/o-nas/kontaktne-miesto/images/marker.png',
        origin: new google.maps.Point(0, 0)
    };
    var myLatLng;
    var marker;
    myLatLng = new google.maps.LatLng(location[1], location[2]);
    marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: image,
        zIndex: location[3],
        title: location[0]
    });
    markers[index] = marker;


    google.maps.event.addListener(marker, 'click', function (e) {

        var locationName = locations[index][0];
        trackItem((e instanceof jQuery ? "Link:" : "Pin:") + locationName);

        var panorama = map.getStreetView();
        if (panorama) {
            panorama.setVisible(false);
        }
        $('.list_container').find('a.place').parent().removeClass('selected');

        if (selected == undefined || ((selected == 0 || selected))) {

            $(".list_container > div.article ").html($('#buffer').find('.location' + index).html()).show().data("hidden", false);

            if (isMobile()) {
                $('.list_container .custom_controls.direction').attr("href", $('.list_container .custom_controls.direction').data("link") + (locations[index][5] !== undefined ? locations[index][5] : locations[index][1] + "," + locations[index][2])).show();
            }

            selected = index;
            var positions = new google.maps.LatLng(parseFloat(marker.getPosition().lat() + mapsParams.corelation.y), marker.getPosition().lng() + mapsParams.corelation.x);
            map.setCenter(positions);
            smoothZoom(map, mapsParams.maxZoom, map.getZoom(), function () {
                setTimeout(function () {
                    marker.setLabel(locations[index][4]);
                }, 0);
            });
            zoomFluid = map.getZoom();


        }
    });
}

// the smooth zoom function
function smoothZoom(map, max, cnt, callback) {
    if (cnt > max) {
        z = google.maps.event.addListener(map, 'zoom_changed', function (event) {
            google.maps.event.removeListener(z);
            smoothZoom(map, max, cnt - 1, callback);
        });
        setTimeout(function () {
            map.setZoom(cnt)
        }, timeLap);
    } else if (cnt < max) {
        z = google.maps.event.addListener(map, 'zoom_changed', function (event) {
            google.maps.event.removeListener(z);
            smoothZoom(map, max, cnt + 1, callback);
        });
        setTimeout(function () {
            map.setZoom(cnt)
        }, timeLap);
    } else {
        if (callback != undefined)
            callback();
    }
}

function isMobile() {
    var a = navigator.userAgent || navigator.vendor || window.opera;
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
        return true;
    else
        return false;
}

google.maps.event.addDomListener(window, 'load', initialize);

$(function () {
    $(".list_container > div.article ").data("hidden", true);

    $(document).on('mouseover', '.select > span', function () {
        $(this).addClass('hover');
    }).on('mouseout', '.select > span', function () {
        $(this).removeClass('hover');
    }).on('click', '.select', function () {

        $(this).find('ul.list').toggleClass('open');

        if ($(this).find('ul.list').hasClass("open")) {
            if (!$(".list_container > div.article ").data("hidden"))
                $(".list_container > div.article ").hide();
        } else {
            if (!$(".list_container > div.article ").data("hidden"))
                $(".list_container > div.article ").show();
        }
    });

    $(document).on('click change', '.select > ul.list > li', function () {

        $(this).parent().find('.selected').removeClass('selected');
        $(this).addClass('selected');
        var $item = $(this).children('a');


        if ($item.data('item-index') != undefined && ($item.data('item-index') || $item.data('item-index') == 0)) {
            setTimeout(function () {
                new google.maps.event.trigger(markers[$item.data('item-index')], 'click', $item);
            }, 0);
        }
        if ($item.data('city-key')) {
            var city = cities[$item.data('city-key')];
            var positions = new google.maps.LatLng(parseFloat(city.lat), parseFloat(city.lng));
            map.setCenter(positions);
            $(".list_container > div.article ").hide();
            $(".list_container > div.article ").data("hidden", true);
            smoothZoom(map, mapsParams.maxZoom, map.getZoom());
            trackItem("CityLink" + $item.text());
        }

    });

    $(document).on("click", ".list_container > div.article  .close", function () {
        $(this).closest('.article').hide();
        $(this).closest('.article').data("hidden", true);
    })
})