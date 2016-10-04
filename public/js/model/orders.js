function OrdersCtrl($scope, $http) {

    $scope.price = function (value) {
        if(value){
            return value.toFixed(2);
        }
        return 0;
    };

    $scope.cart = {
        visible: true,
        cleared: false,
        itemsCount: function () {
            return this.items.length;
        },
        addItem: function (dishItem) {

            var item = null;
            $scope.cart.items.forEach(function (e) {
                if (e.id == dishItem.id) {
                    item = e;
                }
            });
            if (item == null) {
                $scope.cart.items.push({
                    id: dishItem.id,
                    name: dishItem.name,
                    price: dishItem.price,
                    quantity: 1,
                    url: dishItem.url,
                    number: dishItem.number
                });
            } else {
                item.quantity++;
            }
        },
        contentClass: function () {
            if ($scope.cart.itemsCount() > 0) {
                return 'active';
            }
            return 'empty';
        },
        removeItem: function (item) {
            var index = $scope.cart.items.indexOf(item);
            $scope.cart.items.splice(index, 1);
            if ($scope.cart.itemsCount() == 0) {
                $scope.cart.emptyCart();
            }
        },
        emptyCart: function () {
            $scope.cart.items = [];
            $scope.viewMode = 'main';
            $scope.cart.selfDelivery = false;
        },
        contentsClass: 'cartContentsClass',
        items: [],
        selfDelivery: false,
        totalPrice: function () {
            return $scope.price($scope.cart.total()) + " EUR.";
        },
        total: function () {
            var price = 0;
            $scope.cart.items.forEach(function (e) {
                price += e.price * e.quantity;
            });
            if ($scope.cart.selfDelivery) {
                price = price - price * 0.1;
            }
            return price;
        }
    };


    $scope.dishes = [];

    $scope.selectDish = function ($index) {

        $scope.viewMode = 'detail';
        $scope.selectedDish = $scope.dishes[$index];
        $scope.selectedIndex = $index;
    };

    $scope.canMoveNext = function () {
        if ($scope.selectedIndex >= $scope.dishes.length - 1) {
            return false;
        }
        return true;
    };

    $scope.canMovePrev = function () {
        if ($scope.selectedIndex >= 1) {
            return true;
        }
        return false;
    };

    $scope.goToNext = function () {
        if ($scope.canMoveNext()) {
            $scope.selectDish($scope.selectedIndex + 1);
        }
    };

    $scope.goToNextClass = function () {
        if (!$scope.canMoveNext()) {
            return 'disabled';
        }
        return '';
    };



    $scope.goToPrev = function () {
        if ($scope.canMovePrev()) {
            $scope.selectDish($scope.selectedIndex - 1);
        }
    };

    $scope.goToPrevClass = function () {
        if (!$scope.canMovePrev()) {
            return 'disabled';
        }
        return '';
    };

    $scope.checkout = function () {
        $scope.viewMode = 'checkout';
    };

    $scope.phone = null;
    $scope.sended = false;

    $scope.newOrder = function () {
        $scope.cart.emptyCart();
        $scope.sended = false;
    };
    $scope.sending = false;
    $scope.validateSendingData = function () {
        if (!$scope.phone) {
            return $scope.L.specifyPhoneNumber;
        }
        if (!$scope.cart.selfDelivery) {
            if (!$scope.address) {
                return $scope.L.specifyAddress;
            }
        }
        return null;
    };

    $scope.proceed = function () {
        if (!$scope.sending) {
            var message = $scope.validateSendingData();
            if (!message) {
                $scope.sending = true;
                var message = $scope.prepareMessage();
                $http.post('/dishes', { data: message })
                    .success(function (res) {
                    $scope.sended = true;
                    $scope.sending = false;
                })
                    .error(function (data, status) {
                    $scope.sending = false;
                    alert("An error has occured:" + data + "-" + status);
                });

            } else {
                alert(message);
            }
        }
    };

    $scope.prepareMessage = function () {
        var dishes = [];
        $scope.cart.items.forEach(function (e) {
            dishes.push({ number: e.number, name: e.name, quantity: e.quantity });
        });
        return { phone: $scope.phone, dishes: dishes, pikapas: $scope.cart.selfDelivery, price: $scope.cart.totalPrice(), address: $scope.address, entranceCode: $scope.entranceCode };
    };

    $scope.preloaderHidden = false;
    $http.get('/dishes/json')
        .success(function (res) {
        $scope.dishes = res;
        $scope.preloaderHidden = true;
    })
        .error(function (data, status) {

    });

    $scope.showDashboard = function(){
        $scope.viewMode = 'main';

    };
    $scope.showDashboard();
    $scope.setRuLanguage = function () {
        $scope.L = ru;
    };
    $scope.setLtLanguage = function () {
        $scope.L = lt;
    };

    $scope.isDeliveryTime = function () {
        var hour = window.localHour;
        return hour >= 11 && hour < 22;
    };

    $scope.setLtLanguage();
}


var lt = {
    sushiDelivery: 'Sušių ir gėrimų pristatymas Klaipėdoje.',
    cart: 'Prekių Krepšelis',
    thanks: 'Dėkojame už Jūsų užsakymą',
    yourCart: 'Jūsų pirkinių krepšelis',
    send: 'Atviras',
    orderInfo: 'Užsakymo informacija',
    item: 'Punktas',
    quantity: 'Kiekis',
    dishPrice: 'Kaina',
    phone: 'Telefono Nr.',
    yourPhoneNumber: 'Jūsų telefono numeris',
    selfDelivery: 'Išsinešimas',
    wantToGetDiscount: '10% nuolaida',
    total: 'JŪSŲ PIRKINYS',
    cancelOrder: 'UŽSAKYMĄ ATŠAUKTI',
    bookNow: 'SIŲSTI',
    advMain: 'Jūsų užsakymas bus apdorotas laike 30 min. Dispečeris būtinai susisieks su Jumis nurodytu telefono numeriu dėl užsakymo patvirtinimo.  Dispečeriui patvirtinus Jūsų užsakymą, pristatymo laiko trukmė gali siekti iki 45 min. Užsakymo trukmės laikas priklauso nuo restorano virtuvės apkrovimo, kelių eismo ir oro sąlygų. Pagal kai kuriuos adresatus užsakymas nepristatomas.',
    advPrice: '',
    advPhone: 'Dispečerio telefono numeriai:',
    specifyPhoneNumber: 'Prašome, nurodykite savo telefono numerį',
    specifyAddress: 'Prašome, nurodykite pristatymo adresą',
    address: 'Pristatymo adresas',
    entranceCode: 'Laiptinės durų kodas',
    addressLine: 'Jūros,5, BarIn, Klaipėda',
    orderRegistered: 'AČIŪ,JŪSŲ UŽSAKYMAS PRIIMTAS APDOROJIMUI.NETRUKUS SU JUMIS SUSISIEKS MŪSŲ DISPEČERIS.',
    minOrder: 'Minimalus užsakymas: 7 Eur. <br/> Nemokamas pristatymas Klaipėdos mieste: nuo 15 Eur; <br/> iki tos ribos pristatymo kaina yra 4 Eur. <br/> Užsakus daugiau negu 25 Eur, klientas gauna dovanu - Jasai Maki sushi; <br/> daugiau negu 45 Eur - Eko Fila sushi.',
    timeDelivery: 'Užsakymų priėmimo darbo laikas: nuo 11:00 iki 22:00 ',
    attention: '1 sushi komplektą kartu klientas gauna nemokamai 1 porcija imbirio, 1 porcija vasabi, 1 porcija sojos i 1 pora kiniškų lazdelių. <br/> Čia klientas viska gauna nemokamai!'
};

var ru = {
    sushiDelivery: 'Доставка суши и напитков по Клайпеде.',
    cart: 'Корзина',
    thanks: 'Спасибо за Ваш заказ',
    yourCart: 'Ваша корзина',
    send: 'Открыть',
    orderInfo: 'Данные заказа',
    item: 'Блюдо',
    quantity: 'Количество',
    dishPrice: 'Цена',
    phone: 'Телефон',
    yourPhoneNumber: 'Номер Вашего телефона',
    selfDelivery: 'Самовывоз',
    wantToGetDiscount: '10% скидка',
    total: 'Итого',
    cancelOrder: 'Отменить заказ',
    bookNow: 'Отправить заказ',
    advMain: 'Время обработки заказа диспетчером-до 30 минут. Диспетчер обязательно Вам перезвонит для подтверждения Вашего заказа. Ориентировочное время доставки с момента подтверждения заказа диспетчером-45 минут. Время доставки зависит от загруженности поваров, автомобильного трафика и погодных условий. Доставка по некоторым адресам не осуществляется.',
    advPrice: '',
    advPhone: 'Телефон диспетчера:',
    specifyPhoneNumber: 'Пожалуйста, укажите номер своего телефона',
    specifyAddress: 'Пожалуйста, укажите свой адрес',
    address: 'Адрес доставки',
    entranceCode: 'Код подъезда',
    addressLine: 'Jūros,5, BarIn, Клайпеда',
    orderRegistered: 'Ваш заказ принят на обработку. Ожидайте звонка диспетчера. Спасибо :)',
    minOrder: 'Минимальный заказ <b>7</b> евро. <br/> Стоимость доставки по Клайпеде 4 евро. <br/> Бесплатная доставка по Клайпеде от 15 евро. <br/> Подарок- при заказе от 25 евро- Jasai Maki. <br/> Подарок- при заказе от 45 евро- Eko Fila',
    timeDelivery: 'Прием заказов с 11 до 22',
    attention: 'В стоимость одного набора суши включены 1 палочки,1 порция имбиря,1 порция высаби, 1 порция соевого соуса. <br/> Это НЕ ОПЛАЧИВАЕТСЯ!'
};
